import { NextRequest, NextResponse } from "next/server";

const mockUsers = [
  { id: "usr-001", name: "Juan Dela Cruz", email: "juan@example.com", country: "PH", ordersCount: 3, totalSpent: 456.72, joinedAt: "2025-11-15T08:00:00Z", status: "active" as const },
  { id: "usr-002", name: "Sarah Thompson", email: "sarah@example.com", country: "AU", ordersCount: 5, totalSpent: 1240.00, joinedAt: "2025-10-20T14:30:00Z", status: "active" as const },
  { id: "usr-003", name: "Maria Santos", email: "maria@example.com", country: "PH", ordersCount: 2, totalSpent: 618.24, joinedAt: "2026-01-05T10:00:00Z", status: "active" as const },
  { id: "usr-004", name: "James Wilson", email: "james@example.com", country: "AU", ordersCount: 7, totalSpent: 2890.50, joinedAt: "2025-09-10T12:00:00Z", status: "active" as const },
  { id: "usr-005", name: "David Chen", email: "david@example.com", country: "AU", ordersCount: 1, totalSpent: 0, joinedAt: "2026-03-25T16:45:00Z", status: "active" as const },
  { id: "usr-006", name: "Pedro Garcia", email: "pedro@example.com", country: "PH", ordersCount: 0, totalSpent: 0, joinedAt: "2026-04-01T09:00:00Z", status: "banned" as const },
  { id: "usr-007", name: "Emma Brown", email: "emma@example.com", country: "AU", ordersCount: 4, totalSpent: 1560.00, joinedAt: "2025-12-18T11:30:00Z", status: "active" as const },
  { id: "usr-008", name: "Rico Magsaysay", email: "rico@example.com", country: "PH", ordersCount: 6, totalSpent: 890.40, joinedAt: "2025-08-22T07:15:00Z", status: "active" as const },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let filtered = [...mockUsers];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, data: filtered, count: filtered.length });
}
