import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    const { id } = await params;
    
    const response = await fetch(`${API_URL}/manage_testimonials/${id}/update/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial status' },
      { status: 500 }
    );
  }
}


