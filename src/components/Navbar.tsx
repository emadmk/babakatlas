"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Globe, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import { useConfiguratorStore } from "@/store/configuratorStore";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/configurator", labelKey: "nav.configurator" },
  { href: "/shop", labelKey: "nav.shop" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/faq", labelKey: "nav.faq" },
  { href: "/contact", labelKey: "nav.contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
  const hasConfiguration = useConfiguratorStore((s) => s.selectedProduct && s.selectedPackage ? 1 : 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userRole = (session?.user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-black/70 backdrop-blur-2xl border-b border-white/[0.08]"
          : "py-4 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/images/logo/logo-dark.png"
            alt="Atlas Adaptive Tint"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 relative group"
            >
              {t(link.labelKey)}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "tl" : "en")}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/5"
          >
            <Globe size={16} />
            <span className="uppercase text-xs font-medium">{language}</span>
          </button>

          {/* Cart */}
          <Link
            href="/checkout"
            className="relative text-zinc-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
          >
            <ShoppingCart size={20} />
            {hasConfiguration > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {hasConfiguration}
              </span>
            )}
          </Link>

          {/* User / Login */}
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-3 py-2 rounded-full transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#0071E3] flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">{session.user.name || "Account"}</span>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Shield size={15} />
                        Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-white/10" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-full transition-all duration-200"
            >
              <User size={16} />
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.08]"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg text-zinc-300 hover:text-white py-2 transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setLanguage(language === "en" ? "tl" : "en")
                  }
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <Globe size={16} />
                  <span className="uppercase font-medium">{language}</span>
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setMobileOpen(false)}
                  className="relative text-zinc-400 hover:text-white transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
                {session?.user ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 text-red-400 px-4 py-2 rounded-full"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full"
                  >
                    <User size={16} />
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
