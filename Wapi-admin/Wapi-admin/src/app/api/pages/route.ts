import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/pages?${queryString}`, {
      headers: {
        ...(token ? { "Authorization": token } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/pages/create`, {
      method: "POST",
      headers: {
        ...(token ? { "Authorization": token } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
