import { ReactNode } from 'react'

export type Tool = 'general-assistant' | 'property-valuation' | 'property-description' | 'generate-marketing-email'

export interface ToolDetails {
  name: string
  icon: ReactNode
  description: string
}

export type DescriptionStyle = 'Upmarket' | 'Verbose' | 'Concise' | 'Lifestyle'

export type EmailTone = 'Professional' | 'Friendly' | 'Urgent' | 'Luxurious'

export interface PhotoUpload {
  file: File
  tag: string
  url?: string 
  description?: string 
}

export interface Property {
  id: string;
  address: string;
  content: string;
  createdAt: string; 
  modifiedAt: string; 
}

export interface ProfileData {
  username: string
  firstName: string
  lastName: string
  companyName: string
  email: string
  website: string
}

export interface ImageAnalysis {
  tag: string
  description: string
  url: string
}

export interface PropertyDescriptionRequest {
  propertyDetails: string
  images: ImageAnalysis[]
  style: DescriptionStyle
  location: string
}

export interface ImageAnalysisResponse {
  url: string
  description: string
}

export interface PropertyDescriptionResponse {
  description: string
  areaInfo: string
}

export interface ValuationData {
  priceRange: {
    low: number
    high: number
  }
  recentSales: Array<{
    address: string
    price: number
    date: string
  }>
  marketReport: string
  insights?: string
}

export interface ValuationResponse {
  success: boolean;
  data: ValuationData;
  error?: string;
}