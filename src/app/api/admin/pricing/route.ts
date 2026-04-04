import { NextRequest, NextResponse } from "next/server";

let pricingData = {
  tintPricing: [
    { id: "standard", name: "Standard", pricePerSqft: 3 },
    { id: "metallic", name: "Metallic", pricePerSqft: 5 },
    { id: "carbon", name: "Carbon", pricePerSqft: 6 },
    { id: "ceramic", name: "Ceramic", pricePerSqft: 8 },
    { id: "crystalline", name: "Crystalline", pricePerSqft: 10 },
    { id: "adaptive", name: "Adaptive", pricePerSqft: 12 },
  ],
  shippingRates: [
    { country: "Philippines", countryCode: "PH", baseRate: 15, perKgRate: 2.5, freeShippingThreshold: 200 },
    { country: "Australia", countryCode: "AU", baseRate: 25, perKgRate: 4, freeShippingThreshold: 300 },
  ],
  installationRates: [
    { carType: "Sedan", country: "PH", baseRate: 50, perWindowRate: 8 },
    { carType: "SUV", country: "PH", baseRate: 65, perWindowRate: 10 },
    { carType: "Van", country: "PH", baseRate: 70, perWindowRate: 10 },
    { carType: "Truck", country: "PH", baseRate: 60, perWindowRate: 9 },
    { carType: "Sedan", country: "AU", baseRate: 80, perWindowRate: 15 },
    { carType: "SUV", country: "AU", baseRate: 100, perWindowRate: 18 },
    { carType: "Van", country: "AU", baseRate: 110, perWindowRate: 18 },
    { carType: "Truck", country: "AU", baseRate: 90, perWindowRate: 16 },
  ],
};

export async function GET() {
  return NextResponse.json({ success: true, data: pricingData });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    pricingData = { ...pricingData, ...body };
    return NextResponse.json({ success: true, data: pricingData });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
