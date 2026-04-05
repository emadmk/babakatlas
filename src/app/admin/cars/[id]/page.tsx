"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface CarForm {
  nameEn: string;
  nameTl: string;
  type: string;
  windowCount: number;
  imageUrl: string;
  active: boolean;
}

const carTypeOptions = [
  "SEDAN",
  "SUV",
  "VAN",
  "TRUCK",
  "HATCHBACK",
  "COUPE",
  "WAGON",
  "PICKUP",
];

export default function EditCarTypePage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const isNew = carId === "new";

  const [form, setForm] = useState<CarForm>({
    nameEn: "",
    nameTl: "",
    type: "SEDAN",
    windowCount: 6,
    imageUrl: "",
    active: true,
  });
  const [loading, setLoading] = useState(!isNew);
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
    if (isNew) return;
    fetch(`/api/admin/cars/${carId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const c = res.data;
          setForm({
            nameEn: c.name?.en || "",
            nameTl: c.name?.tl || "",
            type: c.type || "SEDAN",
            windowCount: c.windowCount || 6,
            imageUrl: c.imageUrl || "",
            active: c.active !== false,
          });
        }
      })
      .catch(() => showToast("error", "Failed to load car type"))
      .finally(() => setLoading(false));
  }, [carId, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/cars" : `/api/admin/cars/${carId}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: { en: form.nameEn, tl: form.nameTl },
          type: form.type,
          windowCount: form.windowCount,
          imageUrl: form.imageUrl,
          active: form.active,
        }),
      });
      if (res.ok) {
        showToast("success", isNew ? "Car type created" : "Car type updated");
        setTimeout(() => router.push("/admin/cars"), 500);
      } else {
        showToast("error", "Failed to save");
      }
    } catch {
      showToast("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/cars/${carId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/cars");
      } else {
        showToast("error", "Failed to delete");
      }
    } catch {
      showToast("error", "Failed to delete");
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
          onClick={() => router.push("/admin/cars")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? "New Car Type" : "Edit Car Type"}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {isNew
              ? "Add a new vehicle type"
              : "Update vehicle type configuration"}
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
              placeholder="e.g. Sedan"
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
              placeholder="e.g. Sedan"
            />
          </div>
        </div>

        {/* Type & Window Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Car Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            >
              {carTypeOptions.map((t) => (
                <option key={t} value={t} className="bg-[#1a1a1a]">
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Window Count
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.windowCount}
              onChange={(e) =>
                setForm({
                  ...form,
                  windowCount: parseInt(e.target.value) || 1,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            Car Image
          </label>
          <ImageUploader
            currentImage={form.imageUrl}
            onImageChange={(url) => setForm({ ...form, imageUrl: url })}
            category="cars"
          />
        </div>

        {/* Active Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer py-2.5">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-[#0071E3]"
            />
            <span className="text-sm text-white/80">Active</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {!isNew ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-sm font-medium rounded-lg transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/cars")}
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
              {saving
                ? "Saving..."
                : isNew
                ? "Create Car Type"
                : "Save Changes"}
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
              Delete Car Type?
            </h3>
            <p className="text-sm text-white/50 mb-6">
              This will permanently remove this car type and may affect existing
              orders.
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
