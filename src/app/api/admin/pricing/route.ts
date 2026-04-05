import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  getShippingRates,
  getInstallationRates,
  updateProduct,
  updateShippingRate,
  updateInstallationRate,
} from "@/lib/adminData";

export async function GET() {
  const products = getProducts();
  const tintPricing = products.map((p) => ({
    id: p.id,
    name: p.name.en,
    pricePerSqft: p.pricePerSqft,
  }));

  const shippingRates = getShippingRates().map((r) => ({
    country: r.countryName.en,
    countryCode: r.country,
    baseRate: r.baseRate,
    perSqftRate: r.perSqftRate,
    freeShippingThreshold: r.freeAbove,
  }));

  const installationRates = getInstallationRates().map((r) => ({
    id: r.id,
    carType: r.carType,
    country: r.country,
    baseRate: r.baseRate,
    perWindowRate: r.perWindowRate,
  }));

  return NextResponse.json({
    success: true,
    data: { tintPricing, shippingRates, installationRates },
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.tintPricing && Array.isArray(body.tintPricing)) {
      for (const tp of body.tintPricing) {
        if (tp.id) {
          updateProduct(tp.id, { pricePerSqft: tp.pricePerSqft });
        }
      }
    }

    if (body.shippingRates && Array.isArray(body.shippingRates)) {
      const rates = getShippingRates();
      for (const sr of body.shippingRates) {
        const match = rates.find((r) => r.country === sr.countryCode);
        if (match) {
          updateShippingRate(match.id, {
            baseRate: sr.baseRate,
            perSqftRate: sr.perSqftRate,
            freeAbove: sr.freeShippingThreshold,
          });
        }
      }
    }

    if (body.installationRates && Array.isArray(body.installationRates)) {
      for (const ir of body.installationRates) {
        if (ir.id) {
          updateInstallationRate(ir.id, {
            baseRate: ir.baseRate,
            perWindowRate: ir.perWindowRate,
          });
        }
      }
    }

    // Return updated data
    const products = getProducts();
    const tintPricing = products.map((p) => ({
      id: p.id,
      name: p.name.en,
      pricePerSqft: p.pricePerSqft,
    }));
    const shippingRates = getShippingRates().map((r) => ({
      country: r.countryName.en,
      countryCode: r.country,
      baseRate: r.baseRate,
      perSqftRate: r.perSqftRate,
      freeShippingThreshold: r.freeAbove,
    }));
    const installationRates = getInstallationRates().map((r) => ({
      id: r.id,
      carType: r.carType,
      country: r.country,
      baseRate: r.baseRate,
      perWindowRate: r.perWindowRate,
    }));

    return NextResponse.json({
      success: true,
      data: { tintPricing, shippingRates, installationRates },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
