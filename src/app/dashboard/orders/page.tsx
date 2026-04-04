"use client";

import { useState } from "react";
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
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusConfig: Record<
  Order["status"],
  { color: string; bg: string; icon: React.ElementType }
> = {
  Pending: { color: "text-yellow-400", bg: "bg-yellow-500/15", icon: Clock },
  Confirmed: { color: "text-blue-400", bg: "bg-blue-500/15", icon: CheckCircle2 },
  Processing: { color: "text-purple-400", bg: "bg-purple-500/15", icon: Cog },
  Shipped: { color: "text-orange-400", bg: "bg-orange-500/15", icon: Truck },
  Delivered: { color: "text-success", bg: "bg-success/15", icon: Package },
  Cancelled: { color: "text-red-400", bg: "bg-red-500/15", icon: XCircle },
};

const demoOrders: Order[] = [
  {
    id: "ORD-2026-0812",
    date: "March 28, 2026",
    status: "Shipped",
    total: 189.0,
    trackingNumber: "PH2026038291",
    estimatedDelivery: "April 5, 2026",
    items: [
      { name: "Aviator Classic - Rose Gold", quantity: 1, price: 129.0, variant: "Pink Tint" },
      { name: "Lens Cleaning Kit", quantity: 2, price: 30.0 },
    ],
  },
  {
    id: "ORD-2026-0798",
    date: "March 15, 2026",
    status: "Delivered",
    total: 245.0,
    items: [
      { name: "Aviator Frame - Gold Edition", quantity: 1, price: 245.0, variant: "Amber Tint" },
    ],
  },
  {
    id: "ORD-2026-0785",
    date: "March 5, 2026",
    status: "Processing",
    total: 310.0,
    estimatedDelivery: "April 10, 2026",
    items: [
      { name: "Titanium Rimless Frame", quantity: 1, price: 210.0, variant: "Blue Light Filter" },
      { name: "Premium Case - Leather", quantity: 1, price: 65.0 },
      { name: "Microfiber Cloth Set", quantity: 1, price: 35.0 },
    ],
  },
  {
    id: "ORD-2026-0760",
    date: "February 18, 2026",
    status: "Delivered",
    total: 127.0,
    items: [
      { name: "Classic Round Frame", quantity: 1, price: 127.0, variant: "Clear" },
    ],
  },
  {
    id: "ORD-2026-0741",
    date: "February 2, 2026",
    status: "Cancelled",
    total: 89.0,
    items: [
      { name: "Sport Wrap Frame", quantity: 1, price: 89.0, variant: "Gray Tint" },
    ],
  },
];

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const orders = demoOrders;

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            When you place your first order, it will appear here. Start browsing
            our collection of premium tinted eyewear.
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
          const config = statusConfig[order.status];
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
                        {order.id}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-primary-500 text-xs mt-0.5">
                      {order.date} &middot; {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-white font-semibold text-sm">
                    ${order.total.toFixed(2)}
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
                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="min-w-0">
                              <p className="text-primary-200">{item.name}</p>
                              {item.variant && (
                                <p className="text-primary-600 text-xs">
                                  {item.variant}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="text-primary-300">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-primary-600 text-xs">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="border-t border-glass-border pt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                        {order.trackingNumber && (
                          <div>
                            <p className="text-primary-600">Tracking</p>
                            <p className="text-primary-300">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div>
                            <p className="text-primary-600">Est. Delivery</p>
                            <p className="text-primary-300">
                              {order.estimatedDelivery}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-primary-600">Total</p>
                          <p className="text-white font-semibold">
                            ${order.total.toFixed(2)}
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
