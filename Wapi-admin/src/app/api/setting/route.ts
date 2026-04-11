/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/settings`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      return NextResponse.json({ error: "Failed to fetch settings", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const contentType = request.headers.get("content-type") ?? "";
    const isFormData = contentType.includes("multipart/form-data");

    let fetchBody: BodyInit;
    const fetchHeaders: Record<string, string> = {
      ...(token && { Authorization: token }),
    };

    if (isFormData) {
      // Forward FormData as-is (binary files + text fields)
      fetchBody = await request.formData();
      // Do NOT set Content-Type — fetch will set it with the correct boundary
    } else {
      const body = await request.json();
      fetchBody = JSON.stringify(body);
      fetchHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}/settings`, {
      method: "PUT",
      headers: fetchHeaders,
      body: fetchBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      return NextResponse.json({ error: "Failed to update settings", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
  }
}
