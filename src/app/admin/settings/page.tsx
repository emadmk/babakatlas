"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Globe,
  Building2,
  Truck,
  CreditCard,
  Check,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  phone: string;
}

interface BusinessSettings {
  phVatRate: number;
  auGstRate: number;
  defaultCurrency: string;
}

interface ShippingSettings {
  enablePH: boolean;
  enableAU: boolean;
}

interface PaymentSettings {
  stripeConfigured: boolean;
  stripeMode: "test" | "live";
}

interface AllSettings {
  site: SiteSettings;
  business: BusinessSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [site, setSite] = useState<SiteSettings>({
    siteName: "AtlasAdaptive",
    description:
      "Professional-grade ceramic and carbon window tint films. UV protection, heat reduction, and style for your vehicle.",
    contactEmail: "support@atlasadaptive.com",
    phone: "+63 917 000 0000",
  });

  const [business, setBusiness] = useState<BusinessSettings>({
    phVatRate: 12,
    auGstRate: 10,
    defaultCurrency: "USD",
  });

  const [shipping, setShipping] = useState<ShippingSettings>({
    enablePH: true,
    enableAU: true,
  });

  const [payment, setPayment] = useState<PaymentSettings>({
    stripeConfigured: true,
    stripeMode: "test",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        const s = data.data as AllSettings;
        if (s.site) setSite(s.site);
        if (s.business) setBusiness(s.business);
        if (s.shipping) setShipping(s.shipping);
        if (s.payment) setPayment(s.payment);
      }
    } catch {
      // Use defaults if fetch fails
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, business, shipping, payment }),
      });
      if (res.ok) {
        showToast("success", "Settings saved successfully");
      } else {
        showToast("error", "Failed to save settings");
      }
    } catch {
      showToast("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/50 text-sm mt-1">
              Configure your store settings
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-6 bg-white/10 rounded w-1/4 mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded" />
                <div className="h-10 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
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
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure your store settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">Site Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Site Name
            </label>
            <input
              type="text"
              value={site.siteName}
              onChange={(e) => setSite({ ...site, siteName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Description
            </label>
            <textarea
              value={site.description}
              onChange={(e) =>
                setSite({ ...site, description: e.target.value })
              }
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={site.contactEmail}
                onChange={(e) =>
                  setSite({ ...site, contactEmail: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={site.phone}
                onChange={(e) => setSite({ ...site, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Business Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                PH VAT Rate (%)
              </label>
              <input
                type="number"
                value={business.phVatRate}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    phVatRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                AU GST Rate (%)
              </label>
              <input
                type="number"
                value={business.auGstRate}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    auGstRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Default Currency
              </label>
              <select
                value={business.defaultCurrency}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    defaultCurrency: e.target.value,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
              >
                <option value="USD" className="bg-[#1a1a1a]">
                  USD
                </option>
                <option value="PHP" className="bg-[#1a1a1a]">
                  PHP
                </option>
                <option value="AUD" className="bg-[#1a1a1a]">
                  AUD
                </option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shipping Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Truck size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Shipping Settings
          </h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
            <div>
              <p className="text-white text-sm font-medium">Philippines</p>
              <p className="text-white/40 text-xs">
                Enable shipping to Philippines
              </p>
            </div>
            <input
              type="checkbox"
              checked={shipping.enablePH}
              onChange={(e) =>
                setShipping({ ...shipping, enablePH: e.target.checked })
              }
              className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-[#0071E3]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
            <div>
              <p className="text-white text-sm font-medium">Australia</p>
              <p className="text-white/40 text-xs">
                Enable shipping to Australia
              </p>
            </div>
            <input
              type="checkbox"
              checked={shipping.enableAU}
              onChange={(e) =>
                setShipping({ ...shipping, enableAU: e.target.checked })
              }
              className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-[#0071E3]"
            />
          </label>
        </div>
      </motion.div>

      {/* Payment Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={18} className="text-[#0071E3]" />
          <h2 className="text-lg font-semibold text-white">
            Payment Settings
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">
                Stripe Integration
              </p>
              <p className="text-white/40 text-xs">
                Payment processing via Stripe
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  payment.stripeConfigured
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {payment.stripeConfigured ? "Connected" : "Not Connected"}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  payment.stripeMode === "live"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {payment.stripeMode === "live" ? "Live" : "Test Mode"}
              </span>
            </div>
          </div>
          <p className="text-white/30 text-xs px-1">
            Stripe API keys are configured via environment variables. Update
            STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your
            .env file.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
