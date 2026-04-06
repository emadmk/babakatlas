"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,

  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  tintType: string;
  vlt: string;
  uvBlock: number;
  heatRejection: number;
  pricePerSqft: number;
  imageUrl: string;
  badge: string | null;
  active: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch {
      showToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
        );
        showToast(
          "success",
          `Product ${!currentActive ? "activated" : "deactivated"}`
        );
      }
    } catch {
      showToast("error", "Failed to update status");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast("success", "Product deleted");
      }
    } catch {
      showToast("error", "Failed to delete product");
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
          <h1 className="text-2xl font-bold text-white">Tint Products</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage tint types and products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="flex-1 h-4 bg-white/10 rounded" />
                <div className="w-20 h-4 bg-white/10 rounded" />
                <div className="w-16 h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left p-4 font-medium">VLT</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">
                    UV Block
                  </th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">
                    Heat Rej.
                  </th>
                  <th className="text-left p-4 font-medium">Price/sqft</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/60 font-bold">
                          {product.name.en.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {product.name.en}
                          </p>
                          {product.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0071E3]/20 text-[#0071E3]">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/60 capitalize hidden md:table-cell">
                      {product.tintType}
                    </td>
                    <td className="p-4 text-white/60">{product.vlt}</td>
                    <td className="p-4 text-white/60 hidden sm:table-cell">
                      {product.uvBlock}%
                    </td>
                    <td className="p-4 text-white/60 hidden sm:table-cell">
                      {product.heatRejection}%
                    </td>
                    <td className="p-4 text-white font-medium">
                      {`\u20B1${product.pricePerSqft}`}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          toggleActive(product.id, product.active)
                        }
                        className="flex items-center gap-1.5"
                      >
                        {product.active ? (
                          <>
                            <ToggleRight
                              size={22}
                              className="text-green-400"
                            />
                            <span className="text-xs text-green-400">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={22} className="text-white/30" />
                            <span className="text-xs text-white/30">
                              Inactive
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex items-center gap-1 text-[#0071E3] hover:text-[#2997ff] text-xs font-medium transition-colors"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex items-center gap-1 text-white/20 hover:text-red-400 text-xs transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-white/30 py-12 text-sm">
                No products found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
