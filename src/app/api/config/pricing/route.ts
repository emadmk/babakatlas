export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getShippingRates,
  getInstallationRates,
  getSiteSettings,
} from "@/lib/adminData";

export async function GET() {
  try {
    const shippingRates = getShippingRates();
    const installationRates = getInstallationRates();
    const settings = getSiteSettings();

    return NextResponse.json({
      success: true,
      data: {
        shipping: shippingRates.map((r) => ({
          country: r.country,
          countryName: r.countryName,
          flag: r.flag,
          baseRate: r.baseRate,
          perSqftRate: r.perSqftRate,
          freeAbove: r.freeAbove,
          deliveryDays: r.deliveryDays,
          active: r.active,
        })),
        installation: installationRates.map((r) => ({
          country: r.country,
          carType: r.carType,
          baseRate: r.baseRate,
          perWindowRate: r.perWindowRate,
          active: r.active,
        })),
        tax: {
          PH: settings.taxRates?.PH ?? 0.12,
          AU: settings.taxRates?.AU ?? 0.10,
        },
        shippingMarkup: settings.shippingMarkup ?? 0,
        shippingMarkupType: settings.shippingMarkupType ?? "flat",
      },
    });
  } catch (error) {
    console.error("Failed to load pricing config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load pricing configuration" },
      { status: 500 }
    );
  }
}
