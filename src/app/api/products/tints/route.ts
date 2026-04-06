export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/adminData";

export async function GET() {
  const products = getProducts().filter((p) => p.active);

  const tints = products.map((p) => ({
    id: p.id,
    name: p.name.en,
    slug: p.slug,
    tintType: p.tintType,
    category: p.category,
    description: p.description.en,
    pricePerSqft: p.pricePerSqft,
    rollWidth: p.rollWidth,
    rollLength: p.rollLength,
    rollPrice: p.rollPrice,
    pricePerMeter: p.pricePerMeter,
    currency: p.currency,
    specs: {
      vlt: p.vlt,
      uvBlock: `${p.uvBlock}%`,
      heatRejection: `${p.heatRejection}%`,
      irrRejection: `${p.irrRejection}%`,
    },
    badge: p.badge,
    shades: p.shades || [],
  }));

  return NextResponse.json({
    success: true,
    data: tints,
    count: tints.length,
  });
}
