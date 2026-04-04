"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";

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

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: { en: form.nameEn, tl: form.nameTl },
          description: { en: form.descEn, tl: form.descTl },
          slug: form.nameEn.toLowerCase().replace(/\s+/g, "-"),
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
        router.push("/admin/products");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Product</h1>
          <p className="text-white/50 text-sm mt-1">
            Create a new tint product
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
      >
        {/* Name */}
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
              placeholder="e.g. Ceramic Pro"
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
              placeholder="e.g. Ceramic Pro"
            />
          </div>
        </div>

        {/* Description */}
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
              placeholder="Product description..."
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
              placeholder="Paglalarawan ng produkto..."
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
              placeholder="e.g. Most Popular, New"
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
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
