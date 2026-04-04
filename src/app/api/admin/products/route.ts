import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const all = Array.from(products.values());
  const total = all.length;
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const product = {
      id,
      slug: body.slug || id,
      name: body.name || { en: "", tl: "" },
      description: body.description || { en: "", tl: "" },
      tintType: body.tintType || "custom",
      vlt: body.vlt || "0%",
      uvBlock: body.uvBlock || 0,
      heatRejection: body.heatRejection || 0,
      pricePerSqft: body.pricePerSqft || 0,
      imageUrl: body.imageUrl || "",
      badge: body.badge || null,
      active: body.active !== false,
      createdAt: now,
      updatedAt: now,
    };

    products.set(id, product);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
