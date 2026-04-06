"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  Plus,
  Eye,
  UserCog,
  TrendingUp,
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { formatCurrency } from "@/lib/pricing";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-cyan-500/20 text-cyan-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminDashboard() {
  const { stats, orders, setStats, setOrders } = useAdminStore();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStats(res.data || stats);
      })
      .catch(() => {});

    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOrders(res.data || []);
      })
      .catch(() => {});
  }, [setStats, setOrders]);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
    },
    {
      label: "Revenue",
      value: `\u20B1${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500/20 to-green-600/5",
      iconColor: "text-green-400",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "from-yellow-500/20 to-yellow-600/5",
      iconColor: "text-yellow-400",
    },
  ];

  const maxRevenue = Math.max(
    ...stats.revenueByMonth.map((m) => m.revenue),
    1
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            Welcome back. Here is your store overview.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-sm">{card.label}</span>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                >
                  <Icon size={18} className={card.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={16} />
          Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-all"
        >
          <Eye size={16} />
          View Orders
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-all"
        >
          <UserCog size={16} />
          Manage Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">Revenue</h2>
          </div>
          <div className="flex items-end gap-2 h-48">
            {stats.revenueByMonth.map((month) => (
              <div
                key={month.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] text-white/40">
                  {`\u20B1${(month.revenue / 1000).toFixed(1)}k`}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-[#0071E3] to-[#0071E3]/40 rounded-t-md transition-all duration-500"
                  style={{
                    height: `${(month.revenue / maxRevenue) * 100}%`,
                    minHeight: 4,
                  }}
                />
                <span className="text-xs text-white/50">{month.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[#0071E3] hover:text-[#2997ff] transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="text-left pb-3 font-medium">Order</th>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">
                    Total
                  </th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 text-white/80 font-mono text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-white/70">{order.contact.name}</td>
                    <td className="py-3 text-white/70 hidden sm:table-cell">
                      {formatCurrency(order.pricing.total, order.shippingAddress?.country)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status] || "bg-white/10 text-white/60"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-white/30 py-8 text-sm">
                No orders yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
