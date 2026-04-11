/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/settings/razorpay`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      return NextResponse.json({ error: "Failed to fetch Razorpay settings", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching Razorpay settings:", error);
    return NextResponse.json({ error: "Failed to fetch Razorpay settings", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/settings/razorpay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      return NextResponse.json({ error: "Failed to update Razorpay settings", details: errorText }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating Razorpay settings:", error);
    return NextResponse.json({ error: "Failed to update Razorpay settings", details: error.message }, { status: 500 });
  }
}
