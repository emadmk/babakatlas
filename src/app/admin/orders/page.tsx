"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  contact: { name: string; email: string; phone: string };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    carType: string;
    carModel: string | null;
    tintType: string;
    tintName: string;
    selectedWindows: string[];
    totalSqft: number;
    unitPrice: number;
    subtotal: number;
  };
  serviceType: "shipping" | "installation";
  pricing: {
    subtotal: number;
    shipping: number;
    installation: number;
    taxLabel: string;
    tax: number;
    total: number;
  };
  paymentStatus: "unpaid" | "paid" | "refunded";
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

type OrderStatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusOptions: OrderStatusFilter[] = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const allStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<OrderStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {
      showToast("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (
    id: string,
    status: AdminOrder["status"]
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o
          )
        );
        showToast("success", `Order status updated to ${status}`);
      } else {
        showToast("error", "Failed to update order status");
      }
    } catch {
      showToast("error", "Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-lg border border-white/10 transition-all">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer name..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-white/30"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatusFilter)
            }
            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors appearance-none cursor-pointer min-w-[160px]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s} className="bg-[#1a1a1a]">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 size={20} className="animate-spin text-white/30" />
            <span className="text-white/30 text-sm">Loading orders...</span>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="text-left p-4 font-medium w-8"></th>
                  <th className="text-left p-4 font-medium">Order #</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">
                    Items
                  </th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">
                    Country
                  </th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tbody
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <tr
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                    >
                      <td className="p-4">
                        {expandedOrder === order.id ? (
                          <ChevronUp size={14} className="text-white/30" />
                        ) : (
                          <ChevronDown size={14} className="text-white/30" />
                        )}
                      </td>
                      <td className="p-4 text-white/80 font-mono text-xs">
                        {order.orderNumber}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white/80">
                            {order.contact.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {order.contact.email}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-white/60 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-white/60 hidden lg:table-cell">
                        {order.items.tintName} - {order.items.carType}
                      </td>
                      <td className="p-4 text-white font-medium">
                        ${order.pricing.total.toFixed(2)}
                      </td>
                      <td className="p-4 text-white/60 hidden sm:table-cell">
                        {order.shippingAddress.country}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            statusColors[order.status] ||
                            "bg-white/10 text-white/60"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td
                        className="p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as AdminOrder["status"]
                            )
                          }
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#0071E3] transition-colors"
                        >
                          {allStatuses.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-[#1a1a1a]"
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={9}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 py-4 bg-white/[0.02] border-b border-white/10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                  <div>
                                    <h4 className="text-white/40 mb-1 font-medium uppercase tracking-wider">
                                      Shipping
                                    </h4>
                                    <p className="text-white/70">
                                      {order.shippingAddress.address}
                                    </p>
                                    <p className="text-white/70">
                                      {order.shippingAddress.city},{" "}
                                      {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-white/70">
                                      {order.shippingAddress.country}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-white/40 mb-1 font-medium uppercase tracking-wider">
                                      Order Details
                                    </h4>
                                    <p className="text-white/70">
                                      Car: {order.items.carType}
                                      {order.items.carModel &&
                                        ` (${order.items.carModel})`}
                                    </p>
                                    <p className="text-white/70">
                                      Tint: {order.items.tintName}
                                    </p>
                                    <p className="text-white/70">
                                      Windows:{" "}
                                      {order.items.selectedWindows.length} (
                                      {order.items.totalSqft} sqft)
                                    </p>
                                    <p className="text-white/70">
                                      Service: {order.serviceType}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-white/40 mb-1 font-medium uppercase tracking-wider">
                                      Pricing
                                    </h4>
                                    <p className="text-white/70">
                                      Subtotal: $
                                      {order.pricing.subtotal.toFixed(2)}
                                    </p>
                                    {order.pricing.shipping > 0 && (
                                      <p className="text-white/70">
                                        Shipping: $
                                        {order.pricing.shipping.toFixed(2)}
                                      </p>
                                    )}
                                    {order.pricing.installation > 0 && (
                                      <p className="text-white/70">
                                        Installation: $
                                        {order.pricing.installation.toFixed(2)}
                                      </p>
                                    )}
                                    <p className="text-white/70">
                                      {order.pricing.taxLabel}: $
                                      {order.pricing.tax.toFixed(2)}
                                    </p>
                                    <p className="text-white font-medium mt-1">
                                      Total: $
                                      {order.pricing.total.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-[#0071E3] hover:text-[#2997ff] text-xs font-medium transition-colors"
                                  >
                                    View Full Details
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </motion.tbody>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && !loading && (
              <p className="text-center text-white/30 py-12 text-sm">
                No orders found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
