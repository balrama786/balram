import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    const response = await fetch(`${API_URL}/subscription/payment/${id}/invoice`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    headers.set("Content-Disposition", response.headers.get("Content-Disposition") || `attachment; filename=invoice-${id}.pdf`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Failed to download invoice" }, { status: 500 });
  }
}
