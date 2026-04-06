export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const all = getProducts();
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

    const product = createProduct({
      slug: body.slug || crypto.randomUUID(),
      name: body.name || { en: "", tl: "" },
      description: body.description || { en: "", tl: "" },
      tintType: body.tintType || "custom",
      category: body.category || "nano-ceramic",
      vlt: body.vlt || "0%",
      uvBlock: body.uvBlock || 0,
      heatRejection: body.heatRejection || 0,
      irrRejection: body.irrRejection || 0,
      pricePerSqft: body.pricePerSqft || 0,
      rollWidth: body.rollWidth || 1.52,
      rollLength: body.rollLength || 30,
      rollPrice: body.rollPrice || 50000,
      pricePerMeter: body.pricePerMeter || (body.rollPrice || 50000) / (body.rollLength || 30),
      currency: body.currency || "PHP",
      imageUrl: body.imageUrl || "",
      badge: body.badge || null,
      shades: body.shades || [
        { id: "default", name: "Default", vlt: 0, priceMultiplier: 1.0 },
      ],
      active: body.active !== false,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
