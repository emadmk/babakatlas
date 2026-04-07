"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Check if admin by email
        if (email === "admin@atlasadaptive.com") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border-light to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
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
            Welcome back. Sign in to your account.
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-glass-medium backdrop-blur-2xl border border-glass-border rounded-2xl p-8 shadow-2xl shadow-black/20"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm text-primary-300 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-primary-600 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
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

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border transition-all ${
                      rememberMe
                        ? "bg-gold border-gold"
                        : "border-primary-600 group-hover:border-primary-400"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-4 h-4 text-primary-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-primary-400 group-hover:text-primary-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-gold-dark to-gold text-primary-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-primary-900 text-primary-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-glass-light border border-glass-border rounded-xl py-3 flex items-center justify-center gap-3 text-white text-sm hover:bg-glass-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </motion.div>

        {/* Register link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-primary-400"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-gold hover:text-gold-light transition-colors font-medium"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
