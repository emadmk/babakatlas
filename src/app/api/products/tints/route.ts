import { NextResponse } from 'next/server';
import { TINT_TYPES } from '@/store/configuratorStore';

export async function GET() {
  // Transform the store data into a clean API response
  const tints = Object.entries(TINT_TYPES).map(([slug, tint]) => ({
    id: slug,
    name: tint.name,
    slug,
    description: tint.description,
    pricePerSqft: tint.pricePerSqft,
    specs: {
      vlt: tint.vlt,
      uvBlock: `${tint.uvBlock}%`,
      heatRejection: `${tint.heatRejection}%`,
    },
    badge: tint.badge ?? null,
  }));

  return NextResponse.json({
    success: true,
    data: tints,
    count: tints.length,
  });
}
