"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Globe,
  Building2,
  Truck,
  CreditCard,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Package,
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
  audExchangeRate: number;
}

interface ShippingSettings {
  enablePH: boolean;
  enableAU: boolean;
  shippingMarkup: number;
  shippingMarkupType: "flat" | "percentage";
  shippoFromAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface PaymentSettings {
  stripeConfigured: boolean;
  stripeMode: "test" | "live";
}

interface IntegrationStatus {
  stripe: boolean;
  shippo: boolean;
  smtp: boolean;
}

interface AllSettings {
  site: SiteSettings;
  business: BusinessSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
  integrationStatus?: IntegrationStatus;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  const [site, setSite] = useState<SiteSettings>({
    siteName: "Atlas Adaptive Tint",
    description:
      "Professional-grade ceramic and carbon window tint films. UV protection, heat reduction, and style for your vehicle.",
    contactEmail: "support@atlasadaptivetint.com",
    phone: "+63 917 000 0000",
  });

  const [business, setBusiness] = useState<BusinessSettings>({
    phVatRate: 12,
    auGstRate: 10,
    defaultCurrency: "PHP",
    audExchangeRate: 0.025,
  });

  const [shipping, setShipping] = useState<ShippingSettings>({
    enablePH: true,
    enableAU: true,
    shippingMarkup: 0,
    shippingMarkupType: "flat",
    shippoFromAddress: {
      name: "Atlas Adaptive Tint",
      street1: "123 Main Street",
      city: "Manila",
      state: "Metro Manila",
      zip: "1000",
      country: "PH",
    },
  });

  const [payment, setPayment] = useState<PaymentSettings>({
    stripeConfigured: true,
    stripeMode: "test",
  });

  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    stripe: false,
    shippo: false,
    smtp: false,
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
        if (s.shipping) setShipping((prev) => ({ ...prev, ...s.shipping }));
        if (s.payment) setPayment(s.payment);
        if (s.integrationStatus) setIntegrationStatus(s.integrationStatus);
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

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Test email sent!");
      } else {
        showToast("error", data.error || "Failed to send test email");
      }
    } catch {
      showToast("error", "Failed to send test email");
    } finally {
      setTestingEmail(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors";
  const labelClass = "block text-sm text-white/60 mb-1.5";

  function StatusBadge({ connected, label }: { connected: boolean; label?: string }) {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          connected
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {label || (connected ? "Connected" : "Not Connected")}
      </span>
    );
  }

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
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
            <label className={labelClass}>Site Name</label>
            <input
              type="text"
              value={site.siteName}
              onChange={(e) => setSite({ ...site, siteName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={site.description}
              onChange={(e) =>
                setSite({ ...site, description: e.target.value })
              }
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                value={site.contactEmail}
                onChange={(e) =>
                  setSite({ ...site, contactEmail: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                value={site.phone}
                onChange={(e) => setSite({ ...site, phone: e.target.value })}
                className={inputClass}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>PH VAT Rate (%)</label>
              <input
                type="number"
                value={business.phVatRate}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    phVatRate: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>AU GST Rate (%)</label>
              <input
                type="number"
                value={business.auGstRate}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    auGstRate: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Default Currency</label>
              <select
                value={business.defaultCurrency}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    defaultCurrency: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="PHP" className="bg-[#1a1a1a]">PHP</option>
                <option value="AUD" className="bg-[#1a1a1a]">AUD</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>AUD Exchange Rate</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={business.audExchangeRate}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    audExchangeRate: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
              <p className="text-white/30 text-xs mt-1">
                1 PHP = {business.audExchangeRate} AUD
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment (Stripe) Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">
              Payment (Stripe)
            </h2>
          </div>
          <StatusBadge connected={integrationStatus.stripe} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">
                Stripe Integration
              </p>
              <p className="text-white/40 text-xs">
                Payment processing via Stripe Checkout
              </p>
            </div>
            <div className="flex items-center gap-2">
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

          <div className="space-y-2 p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">STRIPE_SECRET_KEY</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.stripe ? "sk_****...configured" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">STRIPE_PUBLISHABLE_KEY</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.stripe ? "pk_****...configured" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">STRIPE_WEBHOOK_SECRET</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.stripe ? "whsec_****...configured" : "Not set"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-white/30 text-xs">
              Set these values in your server&apos;s .env file
            </p>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#0071E3] hover:underline"
            >
              Stripe Dashboard
              <ExternalLink size={12} />
            </a>
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

      {/* Shippo Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">
              Shipping Provider (Shippo)
            </h2>
          </div>
          <StatusBadge connected={integrationStatus.shippo} />
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SHIPPO_API_KEY</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.shippo ? "shippo_****...configured" : "Not set"}
              </span>
            </div>
          </div>

          <p className="text-white/30 text-xs">
            Set SHIPPO_API_KEY in your server&apos;s .env file
          </p>

          {/* From Address */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              Ship From Address
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.name}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, name: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Street</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.street1}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, street1: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.city}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, city: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.state}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, state: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>ZIP</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.zip}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, zip: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={shipping.shippoFromAddress.country}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippoFromAddress: { ...shipping.shippoFromAddress, country: e.target.value },
                      })
                    }
                    className={inputClass}
                    placeholder="PH"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Markup */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              Shipping Markup
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Markup Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shipping.shippingMarkup}
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      shippingMarkup: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Markup Type</label>
                <select
                  value={shipping.shippingMarkupType}
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      shippingMarkupType: e.target.value as "flat" | "percentage",
                    })
                  }
                  className={inputClass}
                >
                  <option value="flat" className="bg-[#1a1a1a]">
                    Flat Amount ({'\u20B1'})
                  </option>
                  <option value="percentage" className="bg-[#1a1a1a]">
                    Percentage (%)
                  </option>
                </select>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-2">
              This amount is added to Shippo rates but hidden from customers.
              {shipping.shippingMarkupType === "flat"
                ? ` Currently adding \u20B1${shipping.shippingMarkup.toFixed(2)} to each rate.`
                : ` Currently adding ${shipping.shippingMarkup}% to each rate.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Email (SMTP) Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#0071E3]" />
            <h2 className="text-lg font-semibold text-white">
              Email (SMTP)
            </h2>
          </div>
          <StatusBadge connected={integrationStatus.smtp} />
        </div>
        <div className="space-y-4">
          <div className="space-y-2 p-3 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SMTP_HOST</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.smtp ? "configured" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SMTP_PORT</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.smtp ? "587" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SMTP_USER</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.smtp ? "****...configured" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SMTP_PASS</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.smtp ? "****...configured" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">SMTP_FROM</span>
              <span className="text-white/30 text-xs font-mono">
                {integrationStatus.smtp ? "configured" : "Not set"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-white/30 text-xs">
              Set these values in your server&apos;s .env file
            </p>
            <button
              onClick={handleTestEmail}
              disabled={testingEmail || !integrationStatus.smtp}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all"
            >
              {testingEmail ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Mail size={14} />
              )}
              {testingEmail ? "Sending..." : "Send Test Email"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
