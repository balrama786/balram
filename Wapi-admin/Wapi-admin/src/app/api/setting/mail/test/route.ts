/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${API_URL}/settings/mail/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error response:", data);
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to send test email", 
          details: data.error 
        }, 
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error sending test mail:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error while sending test email", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
