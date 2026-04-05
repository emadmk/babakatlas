"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Loader2,
  Check,
  Camera,
  AlertCircle,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "PH",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setForm({
            name: data.data.name || session?.user?.name || "",
            email: data.data.email || session?.user?.email || "",
            phone: data.data.phone || "",
            city: data.data.city || "",
            country: data.data.country || "PH",
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, [session]);

  const update = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          city: form.city,
          country: form.country,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "Failed to save profile.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-primary-600 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";

  const fields: {
    key: keyof ProfileData;
    label: string;
    icon: React.ElementType;
    type?: string;
    placeholder: string;
    disabled?: boolean;
  }[] = [
    { key: "name", label: "Full Name", icon: User, placeholder: "Your full name" },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      type: "email",
      placeholder: "you@example.com",
      disabled: true,
    },
    { key: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+63 9XX XXX XXXX" },
    { key: "city", label: "City", icon: Building2, placeholder: "City" },
  ];

  if (isFetching) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        My Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass-medium backdrop-blur-xl border border-glass-border rounded-2xl p-6 lg:p-8"
      >
        {/* Avatar section */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-glass-border">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-primary-900 font-bold text-2xl">
              {form.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {form.name || "Your Name"}
            </p>
            <p className="text-primary-500 text-sm">{form.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-sm text-primary-300 font-medium">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                  <input
                    type={field.type || "text"}
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className={`${inputClass} ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>
            ))}

            {/* Country select */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <select
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="PH" className="bg-primary-800">
                    Philippines
                  </option>
                  <option value="AU" className="bg-primary-800">
                    Australia
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-gradient-to-r from-gold-dark to-gold text-primary-900 font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
            {saved && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-success text-sm"
              >
                Profile updated successfully.
              </motion.p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
