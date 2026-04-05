export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getProducts,
  getCarTypes,
  getShippingRates,
  getAdminOrders,
  getAdminUsers,
} from "@/lib/adminData";

export async function GET() {
  const products = getProducts();
  const carTypes = getCarTypes();
  const shippingRates = getShippingRates();
  const orders = getAdminOrders();
  const users = getAdminUsers();

  const totalOrders = orders.length;
  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // Build revenue by month from actual orders
  const monthlyRevenue: Record<string, number> = {};
  orders
    .filter((o) => o.paymentStatus === "paid")
    .forEach((o) => {
      const date = new Date(o.createdAt);
      const key = date.toLocaleString("en", { month: "short" });
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (o.pricing?.total || 0);
    });

  const revenueByMonth = Object.entries(monthlyRevenue).map(([month, rev]) => ({
    month,
    revenue: Math.round(rev * 100) / 100,
  }));

  const stats = {
    totalOrders,
    revenue: Math.round(revenue * 100) / 100,
    activeUsers,
    pendingOrders,
    productCount: products.filter((p) => p.active).length,
    carTypeCount: carTypes.filter((c) => c.active).length,
    shippingCountries: shippingRates.filter((r) => r.active).length,
    revenueByMonth,
  };

  return NextResponse.json({ success: true, data: stats });
}
