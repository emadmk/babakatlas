"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, DollarSign, Truck, Wrench } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

export default function AdminPricingPage() {
  const {
    pricing,
    setPricing,
    updateTintPrice,
    updateShippingRate,
    updateInstallationRate,
  } = useAdminStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPricing(res.data);
      })
      .catch(() => {});
  }, [setPricing]);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pricing Management</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure tint, shipping, and installation pricing
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Save size={16} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>

      {/* Tint Pricing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Tint Pricing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Tint Type</th>
                <th className="text-left pb-3 font-medium">Price per sqft ($)</th>
              </tr>
            </thead>
            <tbody>
              {pricing.tintPricing.map((tint) => (
                <tr
                  key={tint.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white font-medium">{tint.name}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={tint.pricePerSqft}
                      onChange={(e) =>
                        updateTintPrice(
                          tint.id,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Shipping Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Shipping Rates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Country</th>
                <th className="text-left pb-3 font-medium">Base Rate ($)</th>
                <th className="text-left pb-3 font-medium">Per Kg ($)</th>
                <th className="text-left pb-3 font-medium">
                  Free Shipping Threshold ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.shippingRates.map((rate) => (
                <tr
                  key={rate.countryCode}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white font-medium">
                    {rate.country}
                    <span className="text-white/40 ml-1 text-xs">
                      ({rate.countryCode})
                    </span>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={rate.baseRate}
                      onChange={(e) =>
                        updateShippingRate(rate.countryCode, {
                          baseRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={rate.perKgRate}
                      onChange={(e) =>
                        updateShippingRate(rate.countryCode, {
                          perKgRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="1"
                      value={rate.freeShippingThreshold}
                      onChange={(e) =>
                        updateShippingRate(rate.countryCode, {
                          freeShippingThreshold:
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
        </div>
      </motion.div>

      {/* Installation Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Installation Rates
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Car Type</th>
                <th className="text-left pb-3 font-medium">Country</th>
                <th className="text-left pb-3 font-medium">Base Rate ($)</th>
                <th className="text-left pb-3 font-medium">
                  Per Window ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.installationRates.map((rate) => (
                <tr
                  key={`${rate.carType}-${rate.country}`}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white font-medium">
                    {rate.carType}
                  </td>
                  <td className="py-3 text-white/60">{rate.country}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="1"
                      value={rate.baseRate}
                      onChange={(e) =>
                        updateInstallationRate(rate.carType, rate.country, {
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
                        updateInstallationRate(rate.carType, rate.country, {
                          perWindowRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
