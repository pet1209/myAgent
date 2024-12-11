import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Copy, Upload, Download } from 'lucide-react'
import { Property, DescriptionStyle, EmailTone, PhotoUpload, Tool } from '@/types'
import { tools } from '@/components/sidebar'
import { exportToPDF } from '@/utils/exportUtils';
import axios, {AxiosError} from 'axios';
import { ValuationForm } from '@/components/property-valuation/valuation-form'

interface PropertyDetailsProps {
  property: Property
  selectedTool: Tool
  handleToolAction: () => void
  output: string
  input: string
  setInput: (value: string) => void
  descriptionStyle: DescriptionStyle
  setDescriptionStyle: (value: DescriptionStyle) => void
  emailTone: EmailTone
  setEmailTone: (value: EmailTone) => void
  photos: PhotoUpload[]
  setPhotos: (photos: PhotoUpload[]) => void
  address: string
  setAddress: (value: string) => void
  squareMeters: string
  setSquareMeters: (value: string) => void
  loading: boolean
  setOutput: (value: string) => void  
  setLoading: (value: boolean) => void
}

export default function PropertyDetails({
  property,
  selectedTool,
  handleToolAction,
  output,
  input,
  setInput,
  descriptionStyle,
  setDescriptionStyle,
  emailTone,
  setEmailTone,
  photos,
  setPhotos,
  address,
  setAddress,
  squareMeters,
  setSquareMeters,
  loading,
  setOutput, 
  setLoading 
}: PropertyDetailsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const tag = prompt("Enter a tag for this photo (e.g., 'kitchen'):")
      if (tag) {
        setPhotos([...photos, { file, tag }])
      }
    }
  }

  const getFormattedContent = (toolType: string, content: string) => {
    switch (toolType) {
      case 'property-description':
        return `Property Description\n${property.address}\n\n${content}`
      
      case 'generate-marketing-email':
        return `Marketing Email\nProperty: ${property.address}\n\n${content}`
      
      case 'property-valuation':
        return content 
      
      default:
        return content
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] space-y-4 overflow-y-auto p-6">
      <div className="border-y border-gray-700 py-4">
        <h2 className="text-3xl font-semibold">
          {tools[selectedTool].name}
        </h2>
      </div>
      <p className="mb-4 text-gray-400">
        {tools[selectedTool].description}
      </p>

      {selectedTool === 'general-assistant' && (
        <Textarea
          placeholder="Enter your query"
          className="min-h-[150px] w-full border-gray-700 bg-gray-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {selectedTool === 'property-valuation' && (
        <div className="space-y-6">
          <ValuationForm
            address={address}
            setAddress={setAddress}
            squareMeters={squareMeters}
            setSquareMeters={setSquareMeters}
            setOutput={setOutput}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}

      {(selectedTool === 'property-description' || selectedTool === 'generate-marketing-email') && (
        <div className="space-y-4">
          <Textarea
            placeholder={selectedTool === 'property-description' ? "Enter property details" : "Enter key selling points"}
            className="min-h-[150px] w-full border-gray-700 bg-gray-800 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex space-x-2">
            {selectedTool === 'property-description' ? (
              (['Upmarket', 'Verbose', 'Concise', 'Lifestyle'] as const).map((style) => (
                <Button
                  key={style}
                  onClick={() => setDescriptionStyle(style)}
                  className={`${descriptionStyle === style ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
                >
                  {style}
                </Button>
              ))
            ) : (
              (['Professional', 'Friendly', 'Urgent', 'Luxurious'] as const).map((tone) => (
                <Button
                  key={tone}
                  onClick={() => setEmailTone(tone)}
                  className={`${emailTone === tone ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
                >
                  {tone}
                </Button>
              ))
            )}
          </div>

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-400">
                <Upload className="size-5" />
                <span>Upload Photo</span>
              </div>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Uploaded Photos:</h3>
              <ul className="list-inside list-disc">
                {photos.map((photo, index) => (
                  <li key={index} className="text-gray-300">{photo.file.name} - {photo.tag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button 
        className="bg-blue-600 text-white hover:bg-blue-700" 
        onClick={handleToolAction}
        disabled={loading}
      >
        {loading ? 'Processing...' : selectedTool === 'general-assistant' ? 'Submit' : 
         selectedTool === 'property-valuation' ? 'Get Valuation' : 
         selectedTool === 'property-description' ? 'Generate Description' :
         'Generate Email'}
      </Button>

      {output && (
        <>
          <div className="relative rounded-md bg-gray-800 p-4">
            <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              onClick={copyToClipboard}
            >
              <Copy className="size-4" />
            </Button>
          </div>

          {(selectedTool === 'property-description' || 
            selectedTool === 'generate-marketing-email' || 
            selectedTool === 'property-valuation') && (
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={() => exportToPDF(getFormattedContent(selectedTool, output), property.address)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Download className="mr-2 size-4" />
                Export as PDF
              </Button>
              
              <Button
                onClick={async () => {
                  try {
                    const { data } = await axios.post('/api/export-gdoc', {
                      content: getFormattedContent(selectedTool, output),
                      propertyAddress: property.address,
                    });
                    window.open(data.url, '_blank');
                  } catch (err) {
                    const error = err as AxiosError<{ error: string }>;
                    console.error('Failed to export to Google Docs:', error);
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 size-4" />
                Export to Google Doc
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
