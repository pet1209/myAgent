import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  try {
    const documentId = 'mock-doc';
    return NextResponse.json({
      documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`,
      success: true
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to create Google Doc' },
      { status: 500 }
    );
  }
}
