"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Trash2,
  Loader2,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ProductForm {
  nameEn: string;
  nameTl: string;
  descEn: string;
  descTl: string;
  tintType: string;
  vlt: string;
  uvBlock: number;
  heatRejection: number;
  pricePerSqft: number;
  imageUrl: string;
  badge: string;
  active: boolean;
}

const tintOptions = [
  "standard",
  "metallic",
  "carbon",
  "ceramic",
  "crystalline",
  "adaptive",
  "custom",
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [form, setForm] = useState<ProductForm>({
    nameEn: "",
    nameTl: "",
    descEn: "",
    descTl: "",
    tintType: "standard",
    vlt: "",
    uvBlock: 0,
    heatRejection: 0,
    pricePerSqft: 0,
    imageUrl: "",
    badge: "",
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const p = res.data;
          setForm({
            nameEn: p.name?.en || "",
            nameTl: p.name?.tl || "",
            descEn: p.description?.en || "",
            descTl: p.description?.tl || "",
            tintType: p.tintType || "standard",
            vlt: p.vlt || "",
            uvBlock: p.uvBlock || 0,
            heatRejection: p.heatRejection || 0,
            pricePerSqft: p.pricePerSqft || 0,
            imageUrl: p.imageUrl || "",
            badge: p.badge || "",
            active: p.active !== false,
          });
        }
      })
      .catch(() => showToast("error", "Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: { en: form.nameEn, tl: form.nameTl },
          description: { en: form.descEn, tl: form.descTl },
          tintType: form.tintType,
          vlt: form.vlt,
          uvBlock: form.uvBlock,
          heatRejection: form.heatRejection,
          pricePerSqft: form.pricePerSqft,
          imageUrl: form.imageUrl,
          badge: form.badge || null,
          active: form.active,
        }),
      });
      if (res.ok) {
        showToast("success", "Product saved");
        setTimeout(() => router.push("/admin/products"), 500);
      } else {
        showToast("error", "Failed to save product");
      }
    } catch {
      showToast("error", "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        showToast("error", "Failed to delete product");
      }
    } catch {
      showToast("error", "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-white/50 text-sm mt-1">
            Update product details and pricing
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Name (English)
            </label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Name (Tagalog)
            </label>
            <input
              type="text"
              value={form.nameTl}
              onChange={(e) => setForm({ ...form, nameTl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Description (English)
            </label>
            <textarea
              value={form.descEn}
              onChange={(e) => setForm({ ...form, descEn: e.target.value })}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Description (Tagalog)
            </label>
            <textarea
              value={form.descTl}
              onChange={(e) => setForm({ ...form, descTl: e.target.value })}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Tint Type */}
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            Tint Type
          </label>
          <select
            value={form.tintType}
            onChange={(e) => setForm({ ...form, tintType: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
          >
            {tintOptions.map((t) => (
              <option key={t} value={t} className="bg-[#1a1a1a]">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              VLT (%)
            </label>
            <input
              type="text"
              value={form.vlt}
              onChange={(e) => setForm({ ...form, vlt: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              placeholder="e.g. 35% or 20-70%"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              UV Block (%)
            </label>
            <input
              type="number"
              value={form.uvBlock}
              onChange={(e) =>
                setForm({ ...form, uvBlock: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Heat Rejection (%)
            </label>
            <input
              type="number"
              value={form.heatRejection}
              onChange={(e) =>
                setForm({
                  ...form,
                  heatRejection: parseInt(e.target.value) || 0,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
        </div>

        {/* Price & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Price per sqft ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.pricePerSqft}
              onChange={(e) =>
                setForm({
                  ...form,
                  pricePerSqft: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Image URL
            </label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              placeholder="/images/tints/..."
            />
          </div>
        </div>

        {/* Image Preview */}
        {form.imageUrl && (
          <div className="relative w-full h-48 bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <Image
              src={form.imageUrl}
              alt="Product preview"
              fill
              className="object-contain p-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        {!form.imageUrl && (
          <div className="w-full h-48 bg-white/[0.02] border border-white/10 rounded-lg flex items-center justify-center">
            <Package size={48} className="text-white/10" />
          </div>
        )}

        {/* Badge & Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Badge (optional)
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              placeholder="e.g. Most Popular, Premium"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer py-2.5">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
                className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-[#0071E3]"
              />
              <span className="text-sm text-white/80">Active</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-sm font-medium rounded-lg transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-white/50 mb-6">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg border border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-lg transition-all"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
