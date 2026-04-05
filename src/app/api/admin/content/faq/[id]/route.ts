import { NextRequest, NextResponse } from "next/server";
import { getFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/adminData";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getFaqItem(id);
  if (!item) {
    return NextResponse.json({ success: false, error: "FAQ item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: item });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateFaqItem(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "FAQ item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteFaqItem(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "FAQ item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
