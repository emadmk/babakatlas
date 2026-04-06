"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2, CreditCard } from "lucide-react";

interface Charge {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  paidAt: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function DashboardChargesPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/charges")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCharges(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "AUD") return `A$${amount.toFixed(2)}`;
    return `\u20B1${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  const pendingCharges = charges.filter((c) => c.status === "pending");
  const totalPending = pendingCharges.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Charges</h1>
        <p className="text-primary-400 text-sm mt-1">
          View and pay outstanding charges
        </p>
      </motion.div>

      {/* Pending balance summary */}
      {pendingCharges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/20">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-medium">
                {pendingCharges.length} pending charge{pendingCharges.length > 1 ? "s" : ""}
              </p>
              <p className="text-white text-lg font-bold">
                {formatCurrency(totalPending, pendingCharges[0]?.currency || "PHP")}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {charges.length === 0 ? (
        <div className="text-center py-16 bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl">
          <CreditCard className="w-10 h-10 text-primary-500 mx-auto mb-3" />
          <p className="text-primary-400 text-sm">No charges yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {charges.map((charge) => (
            <motion.div
              key={charge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-5 hover:border-glass-border-light transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[charge.status]}`}>
                      {charge.status}
                    </span>
                    <span className="text-xs text-primary-500">
                      {new Date(charge.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white text-sm">{charge.description}</p>
                  {charge.paidAt && (
                    <p className="text-xs text-primary-500 mt-1">
                      Paid on {new Date(charge.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-white font-bold">
                    {formatCurrency(charge.amount, charge.currency)}
                  </p>
                  {charge.status === "pending" && (
                    <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-[#0071E3] text-white font-medium hover:bg-[#0071E3]/90 transition-colors">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
