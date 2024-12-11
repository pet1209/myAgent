import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { propertyDetails, images, style, location } = await request.json();

    const axiosInstance = axios.create({
      timeout: 290000,
    });

    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_AGENT_API_URL}/api/generate-property-description`,
      {
        propertyDetails,
        images,
        style,
        location,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data || axiosError.message;
    console.error('Property description error:', {
      message: errorMessage,
      status: axiosError.response?.status,
      url: axiosError.config?.url
    });

    return NextResponse.json(
      { error: `Failed to generate property description: ${errorMessage}` },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
