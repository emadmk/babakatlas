"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Truck,
  Wrench,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ServiceConfig {
  id: string;
  key: "shipping_only" | "installation";
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  features: { en: string[]; tl: string[] };
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceConfig[]>([]);
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

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch {
      showToast("error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateService = (
    id: string,
    update: Partial<ServiceConfig>
  ) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...update } : s))
    );
  };

  const updateFeature = (
    id: string,
    lang: "en" | "tl",
    index: number,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newFeatures = { ...s.features };
        newFeatures[lang] = [...newFeatures[lang]];
        newFeatures[lang][index] = value;
        return { ...s, features: newFeatures };
      })
    );
  };

  const addFeature = (id: string, lang: "en" | "tl") => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newFeatures = { ...s.features };
        newFeatures[lang] = [...newFeatures[lang], ""];
        return { ...s, features: newFeatures };
      })
    );
  };

  const removeFeature = (id: string, lang: "en" | "tl", index: number) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newFeatures = { ...s.features };
        newFeatures[lang] = newFeatures[lang].filter((_, i) => i !== index);
        return { ...s, features: newFeatures };
      })
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });
      if (res.ok) {
        showToast("success", "Services saved successfully");
      } else {
        showToast("error", "Failed to save services");
      }
    } catch {
      showToast("error", "Failed to save services");
    } finally {
      setSaving(false);
    }
  };

  const serviceIcon = (key: string) => {
    return key === "shipping_only" ? (
      <Truck size={20} className="text-[#0071E3]" />
    ) : (
      <Wrench size={20} className="text-[#0071E3]" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure available service options
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure available service options for customers
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {serviceIcon(service.key)}
                <h3 className="text-white font-semibold text-sm">
                  {service.key === "shipping_only"
                    ? "Shipping Only"
                    : "Installation"}
                </h3>
              </div>
              <button
                onClick={() =>
                  updateService(service.id, { active: !service.active })
                }
                className="flex items-center gap-1.5"
              >
                {service.active ? (
                  <>
                    <ToggleRight size={22} className="text-green-400" />
                    <span className="text-xs text-green-400">Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={22} className="text-white/30" />
                    <span className="text-xs text-white/30">Inactive</span>
                  </>
                )}
              </button>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Name (EN)
                </label>
                <input
                  type="text"
                  value={service.name.en}
                  onChange={(e) =>
                    updateService(service.id, {
                      name: { ...service.name, en: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Name (TL)
                </label>
                <input
                  type="text"
                  value={service.name.tl}
                  onChange={(e) =>
                    updateService(service.id, {
                      name: { ...service.name, tl: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Description (EN)
                </label>
                <textarea
                  value={service.description.en}
                  onChange={(e) =>
                    updateService(service.id, {
                      description: {
                        ...service.description,
                        en: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Description (TL)
                </label>
                <textarea
                  value={service.description.tl}
                  onChange={(e) =>
                    updateService(service.id, {
                      description: {
                        ...service.description,
                        tl: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Features EN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-white/40">Features (EN)</label>
                <button
                  onClick={() => addFeature(service.id, "en")}
                  className="flex items-center gap-1 text-[#0071E3] hover:text-[#2997ff] text-xs transition-colors"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {service.features.en.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) =>
                        updateFeature(service.id, "en", i, e.target.value)
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                      placeholder="Feature description..."
                    />
                    <button
                      onClick={() => removeFeature(service.id, "en", i)}
                      className="text-white/20 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features TL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-white/40">Features (TL)</label>
                <button
                  onClick={() => addFeature(service.id, "tl")}
                  className="flex items-center gap-1 text-[#0071E3] hover:text-[#2997ff] text-xs transition-colors"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {service.features.tl.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) =>
                        updateFeature(service.id, "tl", i, e.target.value)
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                      placeholder="Paglalarawan ng feature..."
                    />
                    <button
                      onClick={() => removeFeature(service.id, "tl", i)}
                      className="text-white/20 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <div className="text-center py-16">
          <Wrench size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-sm">No services configured.</p>
        </div>
      )}
    </div>
  );
}
