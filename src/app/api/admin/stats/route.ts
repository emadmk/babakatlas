export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getProducts, getCarTypes, getShippingRates } from "@/lib/adminData";

export async function GET() {
  const productCount = getProducts().filter((p) => p.active).length;
  const carTypeCount = getCarTypes().filter((c) => c.active).length;
  const shippingCountries = getShippingRates().filter((r) => r.active).length;

  const stats = {
    totalOrders: 156,
    revenue: 24850.0,
    activeUsers: 89,
    pendingOrders: 12,
    productCount,
    carTypeCount,
    shippingCountries,
    revenueByMonth: [
      { month: "Oct", revenue: 3200 },
      { month: "Nov", revenue: 4100 },
      { month: "Dec", revenue: 5800 },
      { month: "Jan", revenue: 3900 },
      { month: "Feb", revenue: 4200 },
      { month: "Mar", revenue: 3650 },
    ],
  };

  return NextResponse.json({ success: true, data: stats });
}
