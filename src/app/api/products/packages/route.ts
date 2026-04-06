export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTintPackages, createTintPackage, updateTintPackage, deleteTintPackage } from "@/lib/adminData";

export async function GET() {
  const packages = getTintPackages().filter((p) => p.active);

  return NextResponse.json({
    success: true,
    data: packages,
    count: packages.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pkg = createTintPackage(body);
    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create package" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing package id" }, { status: 400 });
    }
    const updated = updateTintPackage(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update package" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing package id" }, { status: 400 });
    }
    const deleted = deleteTintPackage(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete package" },
      { status: 400 }
    );
  }
}
