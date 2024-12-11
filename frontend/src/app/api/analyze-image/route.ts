import axios from 'axios'
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = path.join(process.cwd(), 'public/temp', file.name)
    await writeFile(tempPath, buffer)

    const imageUrl = `${process.env.NEXT_PUBLIC_URL}/temp/${file.name}`

    const response = await axios.post(
      `${process.env.AGENT_AI_API_URL}/api/analyze-image`,
      { imageUrl },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
