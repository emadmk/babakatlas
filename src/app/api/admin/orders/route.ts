import { NextRequest, NextResponse } from "next/server";

// Mock orders for admin panel
const mockOrders = [
  {
    id: "ord-001",
    orderNumber: "TG-20260401-A1B2",
    userId: "usr-001",
    status: "pending" as const,
    contact: { name: "Juan Dela Cruz", email: "juan@example.com", phone: "+63 917 123 4567" },
    shippingAddress: { address: "123 Rizal Ave", city: "Manila", postalCode: "1000", country: "PH" },
    items: { carType: "sedan", carModel: "Toyota Corolla", tintType: "ceramic", tintName: "Ceramic", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 16, unitPrice: 8, subtotal: 128 },
    serviceType: "shipping" as const,
    pricing: { subtotal: 128, shipping: 0, installation: 0, taxLabel: "VAT 12%", tax: 15.36, total: 143.36 },
    paymentStatus: "paid" as const,
    notes: [],
    createdAt: "2026-04-01T10:30:00Z",
    updatedAt: "2026-04-01T10:30:00Z",
  },
  {
    id: "ord-002",
    orderNumber: "TG-20260402-C3D4",
    userId: "usr-002",
    status: "processing" as const,
    contact: { name: "Sarah Thompson", email: "sarah@example.com", phone: "+61 412 345 678" },
    shippingAddress: { address: "45 George St", city: "Sydney", postalCode: "2000", country: "AU" },
    items: { carType: "suv", carModel: "Toyota RAV4", tintType: "carbon", tintName: "Carbon", selectedWindows: ["front_windshield", "rear_windshield", "front_left", "front_right", "rear_left", "rear_right"], totalSqft: 46, unitPrice: 6, subtotal: 276 },
    serviceType: "installation" as const,
    pricing: { subtotal: 276, shipping: 0, installation: 184, taxLabel: "GST 10%", tax: 46, total: 506 },
    paymentStatus: "paid" as const,
    notes: ["Customer requested morning installation"],
    createdAt: "2026-04-02T14:15:00Z",
    updatedAt: "2026-04-03T09:00:00Z",
  },
  {
    id: "ord-003",
    orderNumber: "TG-20260403-E5F6",
    userId: "usr-003",
    status: "shipped" as const,
    contact: { name: "Maria Santos", email: "maria@example.com", phone: "+63 918 987 6543" },
    shippingAddress: { address: "789 EDSA", city: "Quezon City", postalCode: "1100", country: "PH" },
    items: { carType: "hatchback", carModel: "Honda Jazz", tintType: "adaptive", tintName: "Adaptive", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right", "rear_windshield"], totalSqft: 23, unitPrice: 12, subtotal: 276 },
    serviceType: "shipping" as const,
    pricing: { subtotal: 276, shipping: 0, installation: 0, taxLabel: "VAT 12%", tax: 33.12, total: 309.12 },
    paymentStatus: "paid" as const,
    notes: [],
    createdAt: "2026-04-03T08:45:00Z",
    updatedAt: "2026-04-03T16:00:00Z",
  },
  {
    id: "ord-004",
    orderNumber: "TG-20260403-G7H8",
    userId: "usr-004",
    status: "delivered" as const,
    contact: { name: "James Wilson", email: "james@example.com", phone: "+61 423 456 789" },
    shippingAddress: { address: "12 Collins St", city: "Melbourne", postalCode: "3000", country: "AU" },
    items: { carType: "sedan", carModel: "BMW 3 Series", tintType: "crystalline", tintName: "Crystalline", selectedWindows: ["front_windshield", "rear_windshield", "front_left", "front_right", "rear_left", "rear_right"], totalSqft: 38, unitPrice: 10, subtotal: 380 },
    serviceType: "shipping" as const,
    pricing: { subtotal: 380, shipping: 0, installation: 0, taxLabel: "GST 10%", tax: 38, total: 418 },
    paymentStatus: "paid" as const,
    notes: ["Delivered to reception"],
    createdAt: "2026-03-28T11:20:00Z",
    updatedAt: "2026-04-02T14:30:00Z",
  },
  {
    id: "ord-005",
    orderNumber: "TG-20260404-I9J0",
    userId: null,
    status: "pending" as const,
    contact: { name: "Ana Reyes", email: "ana@example.com", phone: "+63 919 111 2222" },
    shippingAddress: { address: "456 Ayala Ave", city: "Makati", postalCode: "1226", country: "PH" },
    items: { carType: "coupe", carModel: "Mazda MX-5", tintType: "metallic", tintName: "Metallic", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 14, unitPrice: 5, subtotal: 70 },
    serviceType: "installation" as const,
    pricing: { subtotal: 70, shipping: 0, installation: 56, taxLabel: "VAT 12%", tax: 15.12, total: 141.12 },
    paymentStatus: "unpaid" as const,
    notes: [],
    createdAt: "2026-04-04T06:00:00Z",
    updatedAt: "2026-04-04T06:00:00Z",
  },
  {
    id: "ord-006",
    orderNumber: "TG-20260330-K1L2",
    userId: "usr-005",
    status: "cancelled" as const,
    contact: { name: "David Chen", email: "david@example.com", phone: "+61 434 567 890" },
    shippingAddress: { address: "88 Pitt St", city: "Sydney", postalCode: "2000", country: "AU" },
    items: { carType: "truck", carModel: "Ford Ranger", tintType: "standard", tintName: "Standard", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 16, unitPrice: 3, subtotal: 48 },
    serviceType: "shipping" as const,
    pricing: { subtotal: 48, shipping: 25, installation: 0, taxLabel: "GST 10%", tax: 4.8, total: 77.8 },
    paymentStatus: "refunded" as const,
    notes: ["Customer cancelled - wrong vehicle selected"],
    createdAt: "2026-03-30T09:10:00Z",
    updatedAt: "2026-03-31T10:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let filtered = [...mockOrders];

  if (status && status !== "all") {
    filtered = filtered.filter((o) => o.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.contact.name.toLowerCase().includes(q) ||
        o.contact.email.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
