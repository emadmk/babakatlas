"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Globe,
  CheckSquare,
  Square,
} from "lucide-react";

const countries = [
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "AU", name: "Australia", dial: "+61" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (!formData.country) return "Please select your country";
    if (!acceptedTerms) return "You must accept the terms and conditions";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }
      router.push("/auth/login?registered=true");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = countries.find((c) => c.code === formData.country);

  const inputClass =
    "w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-primary-600 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border-light to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <img
            src="/images/logo/logo-dark.png"
            alt="Atlas Adaptive Tint"
            className="h-16 w-auto mx-auto"
          />
          <p className="text-primary-400 mt-2 text-sm">
            Create your account to get started.
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-glass-medium backdrop-blur-2xl border border-glass-border rounded-2xl p-8 shadow-2xl shadow-black/20"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-primary-600 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-primary-600 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-300 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <select
                  value={formData.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-primary-800">
                    Select your country
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code} className="bg-primary-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone (optional) */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Phone{" "}
                <span className="text-primary-600 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder={selectedCountry ? `${selectedCountry.dial} ...` : "Phone number"}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <button
                type="button"
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className="mt-0.5 text-primary-500 hover:text-primary-300 transition-colors shrink-0"
              >
                {acceptedTerms ? (
                  <CheckSquare className="w-4 h-4 text-gold" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-xs text-primary-400 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-gold/80 hover:text-gold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gold/80 hover:text-gold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-gold-dark to-gold text-primary-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Login link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-primary-400"
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-gold hover:text-gold-light transition-colors font-medium"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
