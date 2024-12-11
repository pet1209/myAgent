import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { address, squareMeters, logo } = await request.json()

    // Call Property Deal Insights API
    const response = await axios.post(
      `${process.env.PROPERTY_DEALS_API_URL}/valuation`,
      {
        address,
        squareMeters,
        logo
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PROPERTY_DEALS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Property valuation error:', error)
    return NextResponse.json(
      { error: 'Failed to get property valuation' },
      { status: 500 }
    )
  }
}
