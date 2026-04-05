"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Globe, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/#benefits", labelKey: "nav.benefits" },
  { href: "/configurator", labelKey: "nav.configurator" },
  { href: "/#how-it-works", labelKey: "nav.about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white group-hover:text-accent transition-colors duration-300">
              Atlas
            </span>
            <span className="text-[#0071E3]">Adaptive</span>
          </span>
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
            href="/cart"
            className="relative text-zinc-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-full transition-all duration-200"
          >
            <User size={16} />
            {t("nav.login")}
          </Link>
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
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="relative text-zinc-400 hover:text-white transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full"
                >
                  <User size={16} />
                  {t("nav.login")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
