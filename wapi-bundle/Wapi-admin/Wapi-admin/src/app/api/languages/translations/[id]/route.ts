/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/languages/translations/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to fetch translations", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching translations proxy:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const token = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${API_URL}/languages/translations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to update translations", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating translations proxy:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
