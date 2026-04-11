import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/admin/templates?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const token = request.headers.get('authorization');
    let body;

    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      body = JSON.stringify(await request.json());
    }
    
    const response = await fetch(`${API_URL}/admin/templates`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: token }),
        ...(!contentType.includes("multipart/form-data") && { "Content-Type": "application/json" }),
      },
      body: body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating admin template:', error);
    return NextResponse.json(
      { error: 'Failed to create admin template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/admin/templates`, {
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
    console.error('Error bulk deleting admin templates:', error);
    return NextResponse.json(
      { error: 'Failed to bulk delete admin templates' },
      { status: 500 }
    );
  }
}
