/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/plan?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/plan/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response from API:', text.substring(0, 200));
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid response from server',
          message: 'The server returned an error. Please check the backend API endpoint.'
        },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating plan:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid response format',
          message: 'The server returned an HTML error page instead of JSON. Please check if the backend API is running and the endpoint is correct.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create plan',
        message: error?.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/plan`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting plans:', error);
    return NextResponse.json(
      { error: 'Failed to delete plans' },
      { status: 500 }
    );
  }
}

