'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import axios from 'axios'
import { type ValuationData } from '@/types'

interface ValuationFormProps {
  address: string
  setAddress: (value: string) => void
  squareMeters: string
  setSquareMeters: (value: string) => void
  setOutput: (value: string) => void
  loading: boolean
  setLoading: (value: boolean) => void
}

export function ValuationForm({
  address,
  setAddress,
  squareMeters,
  setSquareMeters,
  setOutput,
  loading,
  setLoading
}: ValuationFormProps) {
  const [logo, setLogo] = useState<File | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogo(file)
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
        if (typeof setLoading !== 'function') {
            console.warn('setLoading not available, continuing without loading state')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('address', address)
        formData.append('squareMeters', squareMeters)
        if (logo) {
            formData.append('logo', logo)
        }

        const { data } = await axios.post<{ data: ValuationData }>('/api/property-valuation', formData)
        
        const formattedOutput = `
    Property Valuation Report
    Address: ${address}
    Size: ${squareMeters} sq m
    Price Range: £${data.data.priceRange.low} - £${data.data.priceRange.high}

    Recent Sales:
    ${data.data.recentSales.map((sale) => 
    `- ${sale.address}: £${sale.price} (${sale.date})`
    ).join('\n')}

    Market Report:
    ${data.data.marketReport}
        `

        setOutput(formattedOutput)
        } catch (error) {
        console.log('Valuation error:', error)
        setOutput('Failed to generate valuation report')
        } finally {
        if (typeof setLoading === 'function') {
            setLoading(false)
        }
        }
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter UK property address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border-gray-700 bg-gray-800"
          required
        />
        <Input
          placeholder="Enter property size in square meters"
          value={squareMeters}
          onChange={(e) => setSquareMeters(e.target.value)}
          type="number"
          className="border-gray-700 bg-gray-800"
          required
        />
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="flex cursor-pointer items-center space-x-2 text-blue-500 hover:text-blue-400"
          >
            <Upload className="size-4" />
            <span>Upload Logo</span>
          </label>
          {logo && <span className="text-sm text-gray-400">{logo.name}</span>}
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Valuation Report'}
      </Button>
    </form>
  )
}
