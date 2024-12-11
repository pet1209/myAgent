import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AGENT_API_URL}/api/generate`,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ result: response.data.result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}


