"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Truck,
  Wrench,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

interface ShippingCountry {
  id: string;
  country: string;
  countryName: { en: string; tl: string };
  flag: string;
  baseRate: number;
  perSqftRate: number;
  freeAbove: number;
  deliveryDays: { min: number; max: number };
  active: boolean;
}

interface InstallationRate {
  id: string;
  carType: string;
  country: string;
  countryCode?: string;
  baseRate: number;
  perWindowRate: number;
}

export default function AdminShippingPage() {
  const [countries, setCountries] = useState<ShippingCountry[]>([]);
  const [installationRates, setInstallationRates] = useState<
    InstallationRate[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shippoActive, setShippoActive] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [shippingRes, installRes, settingsRes] = await Promise.all([
        fetch("/api/admin/shipping"),
        fetch("/api/admin/installation"),
        fetch("/api/admin/settings"),
      ]);
      const shippingData = await shippingRes.json();
      const installData = await installRes.json();
      const settingsData = await settingsRes.json();

      if (shippingData.success) setCountries(shippingData.data || []);
      if (installData.success) setInstallationRates(installData.data || []);
      if (settingsData.success) {
        setShippoActive(settingsData.data?.integrationStatus?.shippo === true);
      }
    } catch {
      showToast("error", "Failed to load shipping data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateCountry = (id: string, update: Partial<ShippingCountry>) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...update } : c))
    );
  };

  const updateInstallRate = (
    id: string,
    update: Partial<InstallationRate>
  ) => {
    setInstallationRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...update } : r))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const [shippingRes, installRes] = await Promise.all([
        fetch("/api/admin/shipping", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(countries),
        }),
        fetch("/api/admin/installation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(installationRates),
        }),
      ]);

      if (shippingRes.ok && installRes.ok) {
        showToast("success", "All shipping & installation rates saved");
      } else {
        showToast("error", "Some changes failed to save");
      }
    } catch {
      showToast("error", "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Group installation rates by country
  const installByCountry: Record<string, InstallationRate[]> = {};
  for (const rate of installationRates) {
    const key = rate.country || rate.countryCode || "";
    if (!installByCountry[key])
      installByCountry[key] = [];
    installByCountry[key].push(rate);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Shipping & Installation
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Configure shipping and installation rates
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-8 bg-white/10 rounded w-1/3 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            </div>
          ))}
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
          <h1 className="text-2xl font-bold text-white">
            Shipping & Installation
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Configure shipping rates and installation pricing by country
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
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Shippo Status Banner */}
      {shippoActive !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            shippoActive
              ? 'bg-green-500/5 border-green-500/20'
              : 'bg-amber-500/5 border-amber-500/20'
          }`}
        >
          <Info size={18} className={shippoActive ? 'text-green-400 mt-0.5' : 'text-amber-400 mt-0.5'} />
          <div>
            {shippoActive ? (
              <>
                <p className="text-sm font-medium text-green-400">
                  Shippo active
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Real-time rates from Shippo plus your markup will be used for shipping calculations. The manual rates below are used as fallback only.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-amber-400">
                  Shippo not configured
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Manual rates below will be used for shipping calculations. Configure Shippo in Settings to enable real-time carrier rates.
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Country Shipping Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Shipping Rates</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {countries.map((country, idx) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {country.countryName?.en || country.country || ""}
                    </h3>
                    {country.countryName?.tl && country.countryName.tl !== country.countryName.en && (
                      <p className="text-white/30 text-xs">
                        {country.countryName.tl}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateCountry(country.id, { active: !country.active })
                  }
                  className="flex items-center gap-1.5"
                >
                  {country.active ? (
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
                    value={country.countryName?.en || ""}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        countryName: { ...(country.countryName || { en: "", tl: "" }), en: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Flag Emoji
                  </label>
                  <input
                    type="text"
                    value={country.flag}
                    onChange={(e) =>
                      updateCountry(country.id, { flag: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Base Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={country.baseRate}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        baseRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Per Sqft Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={country.perSqftRate}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        perSqftRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Free Threshold ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={country.freeAbove}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        freeAbove:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Min Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={country.deliveryDays?.min || 1}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        deliveryDays: { ...(country.deliveryDays || { min: 1, max: 1 }), min: parseInt(e.target.value) || 1 },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Max Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={country.deliveryDays?.max || 1}
                    onChange={(e) =>
                      updateCountry(country.id, {
                        deliveryDays: { ...(country.deliveryDays || { min: 1, max: 1 }), max: parseInt(e.target.value) || 1 },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Installation Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Installation Rates
          </h2>
        </div>
        <p className="text-white/40 text-xs mb-4">
          Base rate + per-window rate by car type and country
        </p>

        {Object.entries(installByCountry).map(([countryCode, rates]) => {
          const matchedCountry = countries.find(
            (c) => c.country === countryCode
          );
          return (
            <div
              key={countryCode}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-4"
            >
              <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
                {matchedCountry?.flag}{" "}
                {matchedCountry?.countryName?.en || countryCode}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 border-b border-white/10">
                      <th className="text-left pb-3 font-medium">Car Type</th>
                      <th className="text-left pb-3 font-medium">
                        Base Rate ($)
                      </th>
                      <th className="text-left pb-3 font-medium">
                        Per Window ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate) => (
                      <tr
                        key={rate.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 text-white/80">{rate.carType}</td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="1"
                            value={rate.baseRate}
                            onChange={(e) =>
                              updateInstallRate(rate.id, {
                                baseRate: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="1"
                            value={rate.perWindowRate}
                            onChange={(e) =>
                              updateInstallRate(rate.id, {
                                perWindowRate:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rates.length === 0 && (
                  <p className="text-center text-white/30 py-6 text-sm">
                    No installation rates for this country.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {installationRates.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <Wrench size={32} className="mx-auto text-white/10 mb-3" />
            <p className="text-white/30 text-sm">
              No installation rates configured.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
