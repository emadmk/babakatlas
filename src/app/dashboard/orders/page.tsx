"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Cog,
  Loader2,
} from "lucide-react";

interface OrderData {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  pricing: { subtotal: number; shipping: number; installation: number; taxLabel: string; tax: number; total: number };
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
  serviceType: string;
  createdAt: string;
}

const statusConfig: Record<
  OrderData["status"],
  { color: string; bg: string; icon: React.ElementType }
> = {
  pending: { color: "text-yellow-400", bg: "bg-yellow-500/15", icon: Clock },
  confirmed: { color: "text-blue-400", bg: "bg-blue-500/15", icon: CheckCircle2 },
  processing: { color: "text-purple-400", bg: "bg-purple-500/15", icon: Cog },
  shipped: { color: "text-orange-400", bg: "bg-orange-500/15", icon: Truck },
  delivered: { color: "text-success", bg: "bg-success/15", icon: Package },
  cancelled: { color: "text-red-400", bg: "bg-red-500/15", icon: XCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-glass-light flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">
            No orders yet
          </h2>
          <p className="text-primary-400 text-sm max-w-sm mx-auto">
            When you place your first order, it will appear here. Start by
            configuring your tint in the configurator.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        My Orders
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {orders.map((order, index) => {
          const config = statusConfig[order.status] ?? statusConfig.pending;
          const StatusIcon = config.icon;
          const isExpanded = expandedId === order.id;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden hover:border-glass-border-light transition-colors"
            >
              {/* Order header */}
              <button
                onClick={() => toggle(order.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`p-2 rounded-xl ${config.bg} shrink-0`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">
                        {order.orderNumber}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${config.bg} ${config.color}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-primary-500 text-xs mt-0.5">
                      {formatDate(order.createdAt)} &middot;{" "}
                      {order.items?.selectedWindows?.length ?? 0} window
                      {(order.items?.selectedWindows?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-white font-semibold text-sm">
                    {`\u20B1${(order.pricing?.total ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-primary-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-primary-500" />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-glass-border px-5 py-4 space-y-4">
                      {/* Items info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="min-w-0">
                            <p className="text-primary-200">
                              {order.items?.tintName ?? order.items?.tintType ?? "Tint"} - {order.items?.carType ?? "Vehicle"}
                            </p>
                            <p className="text-primary-600 text-xs">
                              {order.items?.totalSqft ?? 0} sq ft &middot;{" "}
                              {order.items?.selectedWindows?.length ?? 0} windows
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className="text-primary-300">
                              {`\u20B1${(order.items?.subtotal ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing breakdown */}
                      <div className="border-t border-glass-border pt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                        <div>
                          <p className="text-primary-600">Subtotal</p>
                          <p className="text-primary-300">
                            {`\u20B1${(order.pricing?.subtotal ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-primary-600">Shipping</p>
                          <p className="text-primary-300">
                            {order.pricing?.shipping === 0
                              ? "Free"
                              : `\u20B1${(order.pricing?.shipping ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </p>
                        </div>
                        {order.pricing?.installation > 0 && (
                          <div>
                            <p className="text-primary-600">Installation</p>
                            <p className="text-primary-300">
                              {`\u20B1${order.pricing.installation.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-primary-600">
                            {order.pricing?.taxLabel ?? "Tax"}
                          </p>
                          <p className="text-primary-300">
                            {`\u20B1${(order.pricing?.tax ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-primary-600">Total</p>
                          <p className="text-white font-semibold">
                            {`\u20B1${(order.pricing?.total ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
