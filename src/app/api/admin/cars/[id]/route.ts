import { NextRequest, NextResponse } from "next/server";
import { getCarType, updateCarType, deleteCarType } from "@/lib/adminData";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const carType = getCarType(params.id);
  if (!carType) {
    return NextResponse.json({ success: false, error: "Car type not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: carType });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = updateCarType(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Car type not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteCarType(params.id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Car type not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Car type deleted" });
}
