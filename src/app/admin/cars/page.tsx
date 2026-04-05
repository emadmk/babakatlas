"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
// Using <img> for user-uploaded images (next/image requires explicit domains)
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Car,

  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CarType {
  id: string;
  name: { en: string; tl: string };
  type: string;
  windowCount: number;
  imageUrl: string;
  active: boolean;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCars = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cars");
      const data = await res.json();
      if (data.success) setCars(data.data || []);
    } catch {
      showToast("error", "Failed to load car types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res.ok) {
        setCars((prev) =>
          prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
        );
        showToast("success", `Car type ${!currentActive ? "activated" : "deactivated"}`);
      }
    } catch {
      showToast("error", "Failed to update status");
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
          <h1 className="text-2xl font-bold text-white">Car Types</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage vehicle types and their configurations
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={16} />
          Add Car Type
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse"
            >
              <div className="w-full h-40 bg-white/10 rounded-lg mb-4" />
              <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Car Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative w-full h-40 bg-white/[0.02] overflow-hidden">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={car.name?.en || "Car"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car size={48} className="text-white/10" />
                    </div>
                  )}
                  {/* Active Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${
                        car.active
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-white/10 text-white/40 border-white/10"
                      }`}
                    >
                      {car.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {car.name.en}
                    </h3>
                    {car.name.tl && car.name.tl !== car.name.en && (
                      <p className="text-white/30 text-xs">{car.name.tl}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {car.type}
                    </span>
                    <span>{car.windowCount} windows</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => toggleActive(car.id, car.active)}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                    >
                      {car.active ? (
                        <>
                          <ToggleRight size={18} className="text-green-400" />
                          <span className="text-green-400">On</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={18} className="text-white/30" />
                          <span className="text-white/30">Off</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={`/admin/cars/${car.id}`}
                      className="flex items-center gap-1 text-[#0071E3] hover:text-[#2997ff] text-xs font-medium transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && cars.length === 0 && (
        <div className="text-center py-16">
          <Car size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-sm">No car types found.</p>
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#0071E3] hover:bg-[#0077ed] text-white text-sm font-medium rounded-lg transition-all"
          >
            <Plus size={16} />
            Add your first car type
          </Link>
        </div>
      )}
    </div>
  );
}
