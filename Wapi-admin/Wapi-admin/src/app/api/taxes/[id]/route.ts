import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/taxes/${id}`, {
      headers: {
        ...(token && { Authorization: token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching tax:", error);
    return NextResponse.json({ error: "Failed to fetch tax" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/taxes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating tax:", error);
    return NextResponse.json({ error: "Failed to update tax" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/taxes/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting tax:", error);
    return NextResponse.json({ error: "Failed to delete tax" }, { status: 500 });
  }
}
