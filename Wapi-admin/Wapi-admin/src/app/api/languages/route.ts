/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);

    const response = await fetch(`${API_URL}/languages?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend returned error ${response.status}:`, errorText);
      return NextResponse.json(
        {
          error: "Failed to fetch languages",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching languages proxy:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    console.log(token);
    const formData = await request.formData();

    const response = await fetch(`${API_URL}/languages/create`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: token }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to create language", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error creating language proxy:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${API_URL}/languages/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to delete languages", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting languages proxy:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
