import { NextRequest, NextResponse } from "next/server";
import { products } from "../route";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = products.get(params.id);
  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = products.get(params.id);
  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...product,
      ...body,
      id: product.id,
      updatedAt: new Date().toISOString(),
    };
    products.set(params.id, updated);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!products.has(params.id)) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }
  products.delete(params.id);
  return NextResponse.json({ success: true, message: "Product deleted" });
}
