/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/plan/statistics`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch plan statistics', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error fetching plan statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan statistics', details: error.message },
      { status: 500 }
    );
  }
}

