"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TintProduct {
  id: string;
  name: { en: string; tl: string };
  tintType: string;
  pricePerSqft: number;
}

export default function AdminPricingPage() {
  const [products, setProducts] = useState<TintProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          setProducts(
            (data.data || []).map((p: TintProduct) => ({
              id: p.id,
              name: p.name,
              tintType: p.tintType,
              pricePerSqft: p.pricePerSqft,
            }))
          );
        }
      } catch {
        showToast("error", "Failed to load pricing data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePrice = (id: string, price: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pricePerSqft: price } : p))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const results = await Promise.all(
        products.map((p) =>
          fetch(`/api/admin/products/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pricePerSqft: p.pricePerSqft }),
          })
        )
      );
      const allOk = results.every((r) => r.ok);
      if (allOk) {
        showToast("success", "All prices saved");
      } else {
        showToast("error", "Some prices failed to save");
      }
    } catch {
      showToast("error", "Failed to save prices");
    } finally {
      setSaving(false);
    }
  };

  // Compute quick price estimates
  const exampleSqft = 25; // typical sedan total sqft

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tint Pricing</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage tint product pricing
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 bg-white/10 rounded flex-1" />
                <div className="h-8 bg-white/10 rounded w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
          <h1 className="text-2xl font-bold text-white">Tint Pricing</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure per-sqft pricing for each tint product
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Tint Pricing Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Price per Square Foot
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Tint Product</th>
                <th className="text-left pb-3 font-medium">Type</th>
                <th className="text-left pb-3 font-medium">Price/sqft ($)</th>
                <th className="text-left pb-3 font-medium hidden md:table-cell">
                  Est. Sedan ({exampleSqft} sqft)
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white font-medium">
                    {product.name.en}
                  </td>
                  <td className="py-3 text-white/50 capitalize">
                    {product.tintType}
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={product.pricePerSqft}
                      onChange={(e) =>
                        updatePrice(
                          product.id,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                    />
                  </td>
                  <td className="py-3 text-white/40 hidden md:table-cell">
                    {`\u20B1${(product.pricePerSqft * exampleSqft).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-white/30 py-8 text-sm">
              No tint products found. Add products first.
            </p>
          )}
        </div>
      </motion.div>

      {/* Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.02] border border-white/5 rounded-xl p-5"
      >
        <p className="text-white/30 text-xs">
          Shipping and installation rates are now managed in the{" "}
          <a
            href="/admin/shipping"
            className="text-[#0071E3] hover:text-[#2997ff] transition-colors"
          >
            Shipping & Installation
          </a>{" "}
          section.
        </p>
      </motion.div>
    </div>
  );
}
