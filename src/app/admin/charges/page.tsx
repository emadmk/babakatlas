"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Plus,
  X,
  ChevronDown,
  Loader2,
  Search,
  Wrench,
  Calendar,
  Car,
} from "lucide-react";
import { formatCurrency } from "@/lib/pricing";

interface Charge {
  id: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  orderId: string | null;
  appointmentId: string | null;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  paidAt: string | null;
}

interface InstallationOrder {
  id: string;
  orderNumber: string;
  contact: { name: string; email: string; phone: string };
  shippingAddress: { country: string; city: string };
  items: { carType: string; tintName: string };
  serviceType: string;
  pricing: { total: number };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminChargesPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [installationOrders, setInstallationOrders] = useState<InstallationOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create charge form
  const [form, setForm] = useState({
    customerEmail: "",
    customerName: "",
    description: "",
    amount: "",
    currency: "PHP",
    orderId: null as string | null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/charges");
      const data = await res.json();
      if (data.success) {
        setCharges(data.data.charges || []);
        setInstallationOrders(data.data.installationOrders || []);
      }
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createCharge = async () => {
    if (!form.customerEmail || !form.customerName || !form.description || !form.amount) return;
    try {
      const res = await fetch("/api/admin/charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setCharges((prev) => [data.data, ...prev]);
        setShowCreate(false);
        setForm({ customerEmail: "", customerName: "", description: "", amount: "", currency: "PHP", orderId: null });
      }
    } catch {
      // handle
    }
  };

  const createChargeFromOrder = (order: InstallationOrder) => {
    setForm({
      customerEmail: order.contact.email,
      customerName: order.contact.name,
      description: `Installation service - ${order.items?.carType || "Vehicle"}, ${order.shippingAddress?.city || ""}`,
      amount: "",
      currency: order.shippingAddress?.country === "AU" ? "AUD" : "PHP",
      orderId: order.id,
    });
    setShowCreate(true);
  };

  const updateChargeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/charges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setCharges((prev) =>
          prev.map((c) => (c.id === id ? data.data : c))
        );
      }
    } catch {
      // handle
    }
  };

  // Pending installation orders = orders that don't have a charge yet
  const chargedOrderIds = new Set(charges.map((c) => c.orderId).filter(Boolean));
  const pendingInstallOrders = installationOrders.filter(
    (o) => !chargedOrderIds.has(o.id)
  );

  // Filter charges
  const filteredCharges = charges.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.customerName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Charges</h1>
          <p className="text-white/50 text-sm mt-1">
            Create and manage customer charges for installation services
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ customerEmail: "", customerName: "", description: "", amount: "", currency: "PHP", orderId: null });
            setShowCreate(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0071E3] text-white text-sm font-medium hover:bg-[#0071E3]/90 transition-colors"
        >
          <Plus size={16} />
          Create Charge
        </button>
      </div>

      {/* Section 1: Pending Installation Orders */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-white">
            Pending Installation Orders
          </h2>
          <span className="text-xs text-white/30 ml-2">
            ({pendingInstallOrders.length} orders need charging)
          </span>
        </div>

        {pendingInstallOrders.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8 text-center">
            <Wrench className="w-10 h-10 text-white/15 mx-auto mb-2" />
            <p className="text-white/30 text-sm">
              No pending installation orders without charges
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingInstallOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">
                      {order.contact?.name || "N/A"}
                    </p>
                    <p className="text-white/40 text-xs">{order.contact?.email}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {order.items?.carType || "Vehicle"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-1">
                      Order Total (film): {formatCurrency(order.pricing?.total || 0, order.shippingAddress?.country)}
                    </p>
                  </div>
                  <button
                    onClick={() => createChargeFromOrder(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-colors shrink-0 ml-3"
                  >
                    <Plus size={12} />
                    Create Charge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: All Charges */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">All Charges</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-white/30"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none pr-8"
            >
              <option value="all" className="bg-neutral-900">All Status</option>
              <option value="pending" className="bg-neutral-900">Pending</option>
              <option value="paid" className="bg-neutral-900">Paid</option>
              <option value="cancelled" className="bg-neutral-900">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Charges list */}
        {filteredCharges.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No charges found</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase">Description</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase">Date</th>
                  <th className="text-right px-5 py-3 text-xs text-white/40 font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCharges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm">{charge.customerName}</p>
                      <p className="text-white/40 text-xs">{charge.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-white/70 text-sm max-w-xs truncate">{charge.description}</td>
                    <td className="px-5 py-4 text-white font-medium text-sm">
                      {formatCurrency(charge.amount, charge.currency === "AUD" ? "AU" : "PH")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[charge.status]}`}>
                        {charge.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-sm">
                      {new Date(charge.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {charge.status === "pending" && (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => updateChargeStatus(charge.id, "paid")}
                            className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => updateChargeStatus(charge.id, "cancelled")}
                            className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create charge modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create Charge</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Customer Email</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                  placeholder="Installation service - Toyota Fortuner, Manila"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                  >
                    <option value="PHP" className="bg-neutral-900">PHP</option>
                    <option value="AUD" className="bg-neutral-900">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={createCharge}
              disabled={!form.customerEmail || !form.customerName || !form.description || !form.amount}
              className="w-full mt-6 py-2.5 rounded-lg bg-[#0071E3] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0071E3]/90 transition-colors"
            >
              Create Charge
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
