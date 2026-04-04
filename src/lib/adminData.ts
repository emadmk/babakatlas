import { TINT_TYPES } from "@/store/configuratorStore";

// In-memory product store seeded from TINT_TYPES
export const products = new Map(
  Object.entries(TINT_TYPES).map(([slug, tint]) => [
    slug,
    {
      id: slug,
      slug,
      name: { en: tint.name, tl: tint.name },
      description: { en: tint.description, tl: tint.description },
      tintType: slug,
      vlt: tint.vlt,
      uvBlock: tint.uvBlock,
      heatRejection: tint.heatRejection,
      pricePerSqft: tint.pricePerSqft,
      imageUrl: `/images/tints/${slug}.jpg`,
      badge: tint.badge ?? null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])
);
