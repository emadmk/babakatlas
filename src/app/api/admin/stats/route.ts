import { NextResponse } from "next/server";

const mockStats = {
  totalOrders: 156,
  revenue: 24850.0,
  activeUsers: 89,
  pendingOrders: 12,
  revenueByMonth: [
    { month: "Oct", revenue: 3200 },
    { month: "Nov", revenue: 4100 },
    { month: "Dec", revenue: 5800 },
    { month: "Jan", revenue: 3900 },
    { month: "Feb", revenue: 4200 },
    { month: "Mar", revenue: 3650 },
  ],
};

export async function GET() {
  return NextResponse.json({ success: true, data: mockStats });
}
