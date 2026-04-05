export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/adminData";

export async function GET() {
  const settings = getSiteSettings();

  // Build integration status from env vars
  const integrationStatus = {
    stripe: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    shippo: !!process.env.SHIPPO_API_KEY,
    smtp: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  };

  // Map settings to the shape expected by the admin page
  const data = {
    site: {
      siteName: settings.siteName,
      description: settings.description,
      contactEmail: settings.contactEmail,
      phone: settings.contactPhone,
    },
    business: {
      phVatRate: (settings.taxRates?.PH ?? 0.12) * 100,
      auGstRate: (settings.taxRates?.AU ?? 0.10) * 100,
      defaultCurrency: settings.currencies?.PH === "PHP" ? "PHP" : settings.currencies?.AU === "AUD" ? "AUD" : "USD",
    },
    shipping: {
      enablePH: true,
      enableAU: true,
      shippingMarkup: settings.shippingMarkup ?? 0,
      shippingMarkupType: settings.shippingMarkupType ?? 'flat',
      shippoFromAddress: settings.shippoFromAddress ?? {
        name: 'AtlasAdaptive',
        street1: '123 Main Street',
        city: 'Manila',
        state: 'Metro Manila',
        zip: '1000',
        country: 'PH',
      },
    },
    payment: {
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      stripeMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" as const : "test" as const,
    },
    integrationStatus,
  };

  return NextResponse.json({ success: true, data });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Map admin page shape back to SiteSettings
    const updateData: Record<string, unknown> = {};

    if (body.site) {
      updateData.siteName = body.site.siteName;
      updateData.description = body.site.description;
      updateData.contactEmail = body.site.contactEmail;
      updateData.contactPhone = body.site.phone;
    }

    if (body.business) {
      updateData.taxRates = {
        PH: (body.business.phVatRate ?? 12) / 100,
        AU: (body.business.auGstRate ?? 10) / 100,
      };
    }

    if (body.shipping) {
      if (typeof body.shipping.shippingMarkup === "number") {
        updateData.shippingMarkup = body.shipping.shippingMarkup;
      }
      if (body.shipping.shippingMarkupType) {
        updateData.shippingMarkupType = body.shipping.shippingMarkupType;
      }
      if (body.shipping.shippoFromAddress) {
        updateData.shippoFromAddress = body.shipping.shippoFromAddress;
      }
    }

    const updated = updateSiteSettings(updateData);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
