"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

export default function AdminProductsPage() {
  const { products, setProducts, toggleProductActive } = useAdminStore();

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProducts(res.data);
      })
      .catch(() => {});
  }, [setProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
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

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Type</th>
                <th className="text-left p-4 font-medium">VLT</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">UV Block</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Heat Rej.</th>
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
                    ${product.pricePerSqft}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className="flex items-center gap-1.5"
                    >
                      {product.active ? (
                        <>
                          <ToggleRight
                            size={22}
                            className="text-green-400"
                          />
                          <span className="text-xs text-green-400">Active</span>
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
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-1 text-[#0071E3] hover:text-[#2997ff] text-xs font-medium transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
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
    </div>
  );
}
