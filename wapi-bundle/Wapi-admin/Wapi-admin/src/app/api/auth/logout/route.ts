import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");

    if (token) {
      await fetch(`${BACKEND_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    response.cookies.delete("authToken");
    return response;
  } catch  {
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    response.cookies.delete("authToken");
    return response;
  }
}
