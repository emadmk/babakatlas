import { NextRequest, NextResponse } from "next/server";

// Simplified mock - in production this would query the database
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return a mock order detail
  return NextResponse.json({
    success: true,
    data: {
      id: params.id,
      message: "Order detail endpoint - connect to database for real data",
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, note } = body;

    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        status: status || "pending",
        note: note || null,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
