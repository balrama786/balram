import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization');
    const { id } = await params;
    
    const response = await fetch(`${API_URL}/admin/templates/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const token = request.headers.get('authorization');
    const { id } = await params;
    let body;

    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      body = JSON.stringify(await request.json());
    }
    
    const response = await fetch(`${API_URL}/admin/templates/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': token }),
        ...(!contentType.includes('multipart/form-data') && { 'Content-Type': 'application/json' }),
      },
      body: body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating admin template:', error);
    return NextResponse.json(
      { error: 'Failed to update admin template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization');
    const { id } = await params;
    
    const response = await fetch(`${API_URL}/admin/templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting admin template:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin template' },
      { status: 500 }
    );
  }
}
