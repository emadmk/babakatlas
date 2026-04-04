"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  DollarSign,
  Clock,
  Send,
} from "lucide-react";
import { useAdminStore, type AdminOrder } from "@/store/adminStore";



const statusTimeline = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const allStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { orders, updateOrderStatus, addOrderNote } = useAdminStore();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
  }, [orders, orderId]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">Order not found. Return to the orders list to view available orders.</p>
      </div>
    );
  }

  const currentStatusIdx = statusTimeline.indexOf(order.status);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addOrderNote(order.id, newNote.trim());
    setNewNote("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            Order {order.orderNumber}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <select
          value={order.status}
          onChange={(e) => {
            updateOrderStatus(order.id, e.target.value as typeof order.status);
            setOrder({ ...order, status: e.target.value as typeof order.status });
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
        >
          {allStatuses.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a]">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Status Timeline</h2>
        </div>
        <div className="flex items-center justify-between">
          {statusTimeline.map((status, i) => {
            const isCompleted = i <= currentStatusIdx;
            const isCurrent = i === currentStatusIdx;
            return (
              <div
                key={status}
                className="flex flex-col items-center flex-1 relative"
              >
                {i > 0 && (
                  <div
                    className={`absolute top-3 -left-1/2 w-full h-0.5 ${
                      isCompleted ? "bg-[#0071E3]" : "bg-white/10"
                    }`}
                  />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center z-10 text-xs font-bold ${
                    isCurrent
                      ? "bg-[#0071E3] text-white ring-4 ring-[#0071E3]/20"
                      : isCompleted
                      ? "bg-[#0071E3] text-white"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] mt-2 capitalize ${
                    isCurrent ? "text-[#0071E3]" : isCompleted ? "text-white/60" : "text-white/30"
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
        {order.status === "cancelled" && (
          <div className="mt-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">This order has been cancelled.</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">Customer</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white">{order.contact.name}</p>
            <p className="text-white/60">{order.contact.email}</p>
            <p className="text-white/60">{order.contact.phone}</p>
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">
              Shipping Address
            </h2>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-white/70">{order.shippingAddress.address}</p>
            <p className="text-white/70">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-white/70">{order.shippingAddress.country}</p>
          </div>
        </motion.div>
      </div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Order Items</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-white/40">
            <span>Item</span>
            <span>Details</span>
          </div>
          <div className="flex justify-between items-start py-2 border-t border-white/10">
            <div>
              <p className="text-white font-medium">{order.items.tintName} Tint</p>
              <p className="text-white/50 text-xs capitalize">
                {order.items.carType}
                {order.items.carModel && ` - ${order.items.carModel}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70">
                {order.items.totalSqft} sqft x ${order.items.unitPrice}/sqft
              </p>
              <p className="text-white font-medium">
                ${order.items.subtotal.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-xs text-white/40 pt-1">
            <p>
              Windows:{" "}
              {order.items.selectedWindows
                .map((w) => w.replace(/_/g, " "))
                .join(", ")}
            </p>
            <p className="capitalize">Service: {order.serviceType}</p>
          </div>
        </div>
      </motion.div>

      {/* Pricing Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Pricing Breakdown
          </h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-white/70">
            <span>Subtotal</span>
            <span>${order.pricing.subtotal.toFixed(2)}</span>
          </div>
          {order.pricing.shipping > 0 && (
            <div className="flex justify-between text-white/70">
              <span>Shipping</span>
              <span>${order.pricing.shipping.toFixed(2)}</span>
            </div>
          )}
          {order.pricing.installation > 0 && (
            <div className="flex justify-between text-white/70">
              <span>Installation</span>
              <span>${order.pricing.installation.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-white/70">
            <span>{order.pricing.taxLabel}</span>
            <span>${order.pricing.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/10">
            <span>Total</span>
            <span>${order.pricing.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/50 pt-1">
            <span>Payment Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                order.paymentStatus === "paid"
                  ? "bg-green-500/20 text-green-400"
                  : order.paymentStatus === "refunded"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
        {order.notes && order.notes.length > 0 ? (
          <div className="space-y-2 mb-4">
            {order.notes.map((note, i) => (
              <div
                key={i}
                className="text-sm text-white/70 bg-white/5 rounded-lg px-3 py-2"
              >
                {note}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm mb-4">No notes yet.</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            placeholder="Add a note..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-white/30"
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ed] text-white text-sm rounded-lg transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
