"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Orders",
    value: "12",
    icon: ShoppingBag,
    change: "+2 this month",
    color: "text-accent-light",
    bg: "bg-accent/10",
  },
  {
    label: "Total Spent",
    value: "$2,847",
    icon: DollarSign,
    change: "+$340 this month",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    label: "Active Orders",
    value: "3",
    icon: Package,
    change: "2 shipping",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Reward Points",
    value: "1,240",
    icon: TrendingUp,
    change: "Gold tier",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const recentOrders = [
  {
    id: "ORD-2024-0812",
    date: "Mar 28, 2026",
    status: "Shipped",
    statusColor: "bg-orange-500/20 text-orange-400",
    total: "$189.00",
    items: "Custom Tinted Sunglasses x2",
  },
  {
    id: "ORD-2024-0798",
    date: "Mar 15, 2026",
    status: "Delivered",
    statusColor: "bg-success/20 text-success",
    total: "$245.00",
    items: "Aviator Frame - Gold Tint",
  },
  {
    id: "ORD-2024-0776",
    date: "Feb 28, 2026",
    status: "Delivered",
    statusColor: "bg-success/20 text-success",
    total: "$127.00",
    items: "Classic Round Frame",
  },
];

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

export default function DashboardPage() {
  const { data: session } = useSession();

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
                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
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
            <h2 className="text-white font-semibold text-sm">Recent Orders</h2>
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
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-glass-light transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-white text-sm font-medium">{order.id}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-primary-500 text-xs mt-0.5">{order.items}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-white text-sm font-medium">{order.total}</p>
                <p className="text-primary-500 text-xs">{order.date}</p>
              </div>
            </div>
          ))}
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
              <p className="text-primary-500 text-xs">Member Since</p>
              <p className="text-white text-sm">January 2026</p>
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
    </div>
  );
}
