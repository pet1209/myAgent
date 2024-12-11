'use client'

import { useState, useEffect } from 'react'
import axios, {AxiosError} from 'axios';
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/sidebar'
import Profile from '@/components/profile'
import PropertyList from '@/components/home/property-list'
import PropertyDetails from '@/components/home/property-details'
import Billing from '@/components/home/billing'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tool, DescriptionStyle, EmailTone, PhotoUpload, Property, ProfileData } from '@/types'
import { Plus } from 'lucide-react'
import { UserNav } from '@/components/home/user-nav'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool>('general-assistant')
  const [output, setOutput] = useState('')
  const [input, setInput] = useState('')
  const [address, setAddress] = useState('')
  const [squareMeters, setSquareMeters] = useState('')
  const [photos, setPhotos] = useState<PhotoUpload[]>([])
  const [descriptionStyle, setDescriptionStyle] = useState<DescriptionStyle>('Upmarket')
  const [emailTone, setEmailTone] = useState<EmailTone>('Professional')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('properties')
  const [profile, setProfile] = useState<ProfileData>({
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Real Estate Co.',
    email: 'john.doe@example.com',
    website: 'www.johndoerealestate.com',
  })

  useEffect(() => {
    setProperties([
      { 
        id: '1', 
        address: '123 Main St', 
        content: 'A beautiful property on Main Street.', 
        createdAt: new Date(2023, 0, 1).toISOString(), 
        modifiedAt: new Date(2023, 0, 1).toISOString() 
      },
      { 
        id: '2', 
        address: '456 Elm St', 
        content: 'Charming house with a large backyard.', 
        createdAt: new Date(2023, 1, 15).toISOString(), 
        modifiedAt: new Date(2023, 2, 1).toISOString() 
      },
    ])
    setMounted(true)
  }, [])

  useEffect(() => {
    setOutput('')
    setInput('')
    setAddress('')
    setSquareMeters('')
    setPhotos([])
    setDescriptionStyle('Upmarket')
    setEmailTone('Professional')
  }, [selectedTool, activeTab])

  if (!mounted) {
    return null 
  }

  const updatePropertyContent = (content: string, timestamp: Date) => {
    if (address) {
      const existingPropertyIndex = properties.findIndex(p => p.address === address)
      if (existingPropertyIndex !== -1) {
        const updatedProperties = [...properties]
        updatedProperties[existingPropertyIndex] = {
          ...updatedProperties[existingPropertyIndex],
          content,
          modifiedAt: timestamp.toISOString(),
        }
        setProperties(updatedProperties)
      } else {
        const newProperty: Property = {
          id: Date.now().toString(),
          address,
          content,
          createdAt: timestamp.toISOString(),
          modifiedAt: timestamp.toISOString(),
        }
        setProperties([...properties, newProperty])
      }
    }
  }

  const handleToolAction = async () => {
    setLoading(true)
    let generatedOutput = ''
    const now = new Date()

    try {
      switch (selectedTool) {
        case 'general-assistant':
          const response = await axios.post('/api/general-assistant', {
            prompt: input
          });
          generatedOutput = response.data.result;    
          break

        case 'property-valuation':
          generatedOutput = `Estimated value for the property at ${address} (${squareMeters} sq m): $500,000 - $550,000`
          break

        case 'property-description':
          const { data: descriptionData } = await axios.post('/api/property-description', 
            {
              propertyDetails: input,
              images: photos,
              style: descriptionStyle,
              location: address,
            },
            {
              timeout: 300000, 
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
          generatedOutput = descriptionData.description;
          
          if (photos.length > 0) {
            generatedOutput += '\n\nRoom Details:\n' + 
              photos.map(photo => `${photo.tag}: ${photo.description}`).join('\n');
          }
          break;

        case 'generate-marketing-email':
          generatedOutput = `
Subject: Exclusive Opportunity: ${address} - Your Dream Home Awaits!

Dear Valued Client,

We are excited to present an exceptional property that we believe will pique your interest. Located at ${address}, this ${descriptionStyle.toLowerCase()} home offers:

${input}

Key features:
- Address: ${address}
- Size: ${squareMeters} sq m
${photos.map(p => `- ${p.tag.charAt(0).toUpperCase() + p.tag.slice(1)}`).join('\n')}

We would be delighted to arrange a private viewing for you to experience this remarkable property firsthand. Please don't hesitate to contact us with any questions or to schedule a visit.

Best regards,
Your Trusted Real Estate Team
`
          break
      }

      setOutput(generatedOutput)
      updatePropertyContent(generatedOutput, now)
      
      if (address) {
        const existingPropertyIndex = properties.findIndex(p => p.address === address);
        if (existingPropertyIndex !== -1) {
          const updatedProperties = [...properties];
          updatedProperties[existingPropertyIndex] = {
            ...updatedProperties[existingPropertyIndex],
            content: generatedOutput,
            modifiedAt: now.toISOString(),
          };
          setProperties(updatedProperties);
        } else {
          const newProperty: Property = {
            id: Date.now().toString(),
            address,
            content: generatedOutput,
            createdAt: now.toISOString(),
            modifiedAt: now.toISOString(),
          };
          setProperties([...properties, newProperty]);
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error('Error:', error);
      setOutput(error.response?.data?.error || 'An error occurred while generating the response.');
    } finally {
      setLoading(false)
    }
  }

  const addNewProperty = () => {
    const timestamp = new Date().toISOString()
    const newProperty = {
      id: Date.now().toString(),
      address: 'New Property',
      content: '',
      createdAt: timestamp,
      modifiedAt: timestamp,
    }
    setProperties([...properties, newProperty])
    setActiveTab(newProperty.id)
    setAddress(newProperty.address)
    setOutput('')
  }

  const deleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id))
    if (activeTab === id) {
      setActiveTab('properties')
    }
  }

  const openProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setActiveTab(propertyId)
      setAddress(property.address)
      setOutput(property.content)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <Sidebar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <main className="flex-1">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                {properties.map(property => (
                  <TabsTrigger key={property.id} value={property.id}>
                    {property.address}
                  </TabsTrigger>
                ))}
                <Button variant="ghost" size="sm" onClick={addNewProperty}>
                  <Plus className="size-4" />
                </Button>
              </TabsList>
              <UserNav profile={profile} setActiveTab={setActiveTab} />
            </div>

            <TabsContent value="properties">
              <PropertyList 
                properties={properties} 
                deleteProperty={deleteProperty} 
                openProperty={openProperty} 
              />
            </TabsContent>

            {properties.map(property => (
              <TabsContent key={property.id} value={property.id}>
                <PropertyDetails
                  property={property}
                  selectedTool={selectedTool}
                  handleToolAction={handleToolAction}
                  output={output}
                  input={input}
                  setInput={setInput}
                  descriptionStyle={descriptionStyle}
                  setDescriptionStyle={setDescriptionStyle}
                  emailTone={emailTone}
                  setEmailTone={setEmailTone}
                  photos={photos}
                  setPhotos={setPhotos}
                  address={address}
                  setAddress={setAddress}
                  squareMeters={squareMeters}
                  setSquareMeters={setSquareMeters}
                  loading={loading}
                  setOutput={setOutput}   
                  setLoading={setLoading}
                />
              </TabsContent>
            ))}

            <TabsContent value="profile">
              <Profile profile={profile} setProfile={setProfile} />
            </TabsContent>

            <TabsContent value="billing">
              <Billing />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
