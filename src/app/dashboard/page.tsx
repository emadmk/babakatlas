"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  pricing: { total: number };
  items: { tintType: string; selectedWindows: string[] };
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function statusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-success/20 text-success";
    case "shipped":
      return "bg-orange-500/20 text-orange-400";
    case "processing":
      return "bg-purple-500/20 text-purple-400";
    case "confirmed":
      return "bg-blue-500/20 text-blue-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrders(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      change: `${activeOrders.length} active`,
      color: "text-accent-light",
      bg: "bg-accent/10",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      change: "",
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "Active Orders",
      value: String(activeOrders.length),
      icon: Package,
      change: activeOrders.length > 0
        ? `${activeOrders.filter((o) => o.status === "shipped").length} shipping`
        : "None",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Reward Points",
      value: "0",
      icon: TrendingUp,
      change: "Coming soon",
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-gold">
            {session?.user?.name?.split(" ")[0] || "there"}
          </span>
        </h1>
        <p className="text-primary-400 text-sm mt-1">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-5 hover:border-glass-border-light transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p className={`text-xs mt-1 ${stat.color}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                <h2 className="text-white font-semibold text-sm">
                  Recent Orders
                </h2>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-glass-border">
              {recentOrders.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <ShoppingBag className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-primary-400 text-sm">
                    No orders yet. Configure your tint to get started!
                  </p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-glass-light transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-white text-sm font-medium">
                          {order.orderNumber}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-primary-500 text-xs mt-0.5">
                        {order.items?.selectedWindows?.length ?? 0} windows -{" "}
                        {order.items?.tintType ?? "tint"}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-white text-sm font-medium">
                        ${(order.pricing?.total ?? 0).toFixed(2)}
                      </p>
                      <p className="text-primary-500 text-xs">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Account Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-6"
          >
            <h2 className="text-white font-semibold text-sm mb-4">
              Account Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-primary-500 text-xs">Full Name</p>
                  <p className="text-white text-sm">
                    {session?.user?.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-primary-500 text-xs">Email</p>
                  <p className="text-white text-sm">
                    {session?.user?.email || "Not set"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-primary-500 text-xs">Total Orders</p>
                  <p className="text-white text-sm">{orders.length}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-xs">Account Status</p>
                  <p className="text-success text-sm">Active</p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light mt-4 transition-colors"
            >
              Edit Profile
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
}
