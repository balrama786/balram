import { BASE_URL } from "@/src/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/is-demo-mode`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If not JSON, it might be HTML (e.g. 404 or redirect)
      const text = await response.text();
      console.warn("Expected JSON but received:", text.substring(0, 100));
      return NextResponse.json({ success: false, message: "Invalid response from server" }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Demo mode check error:", error);
    return NextResponse.json({ success: false, message: "Failed to check demo mode" }, { status: 500 });
  }
}
