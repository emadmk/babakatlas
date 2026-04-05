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
    description: p.description.en,
    pricePerSqft: p.pricePerSqft,
    specs: {
      vlt: p.vlt,
      uvBlock: `${p.uvBlock}%`,
      heatRejection: `${p.heatRejection}%`,
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
