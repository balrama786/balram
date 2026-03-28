import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoption } from "../auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;

    const response = await fetch(`${BACKEND_API_URL}/user-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to fetch setup settings" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Setup API GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/user-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Setup update failed" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Setup API PUT error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
