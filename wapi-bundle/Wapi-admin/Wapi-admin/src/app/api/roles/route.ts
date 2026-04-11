/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/roles?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/roles/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error creating role:", error);
    return NextResponse.json({ success: false, error: "Failed to create role", message: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/roles/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting roles:", error);
    return NextResponse.json({ error: "Failed to delete roles" }, { status: 500 });
  }
}
