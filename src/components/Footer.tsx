"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Mail,
  MapPin,
  Send,
  Globe,
  ExternalLink,
  MessageCircle,
  Play,
} from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const footerColumns = [
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), href: "/about" },
        { label: t("footer.careers"), href: "/careers" },
        { label: t("footer.press"), href: "/press" },
      ],
    },
    {
      title: t("footer.products"),
      links: [
        { label: t("footer.ceramic"), href: "/products/ceramic" },
        { label: t("footer.carbon"), href: "/products/carbon" },
        { label: t("footer.standard"), href: "/products/standard" },
        { label: t("footer.specialty"), href: "/products/specialty" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.faq"), href: "/faq" },
        { label: t("footer.installation"), href: "/installation" },
        { label: t("footer.warranty"), href: "/warranty" },
        { label: t("footer.returns"), href: "/returns" },
      ],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Atlas</span>
                <span className="text-[#0071E3]">Adaptive</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm mb-6 max-w-xs">
              Premium window tint films engineered for perfection. Professional
              grade protection for your vehicle.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm text-zinc-400 mb-3">
                {t("footer.newsletter")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletterPlaceholder")}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <button className="bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium">
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Shipping badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2">
              <MapPin size={14} className="text-accent" />
              <span className="text-xs text-zinc-400">
                {t("footer.shipping")}
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} AtlasAdaptive. {t("footer.copyright")}
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[Globe, ExternalLink, MessageCircle, Play].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Contact */}
          <a
            href="mailto:hello@atlasadaptive.com"
            className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <Mail size={14} />
            {t("footer.email")}
          </a>
        </div>
      </div>
    </footer>
  );
}
