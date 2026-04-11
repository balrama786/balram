import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/pages/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting pages:", error);
    return NextResponse.json({ error: "Failed to delete pages" }, { status: 500 });
  }
}
