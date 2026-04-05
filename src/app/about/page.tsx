"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Lightbulb,
  Heart,
  Leaf,
  Users,
  Car,
  Star,
  Clock,
  Shield,
  Thermometer,
  Eye,
  Zap,
  Palette,
  Sun,
  Layers,
  Package,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ============================================================
   ICON HELPER
   ============================================================ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Award, Lightbulb, Heart, Leaf, Users, Car, Star, Clock,
  Shield, Thermometer, Eye, Zap, Palette, Sun, Layers, Package, CheckCircle,
};
const getIcon = (name: string) => iconMap[name] || Award;

/* ============================================================
   TYPES
   ============================================================ */
interface TranslatedText {
  en: string;
  tl: string;
  [key: string]: string;
}

interface AboutData {
  story: {
    title: TranslatedText;
    subtitle: TranslatedText;
    paragraphs: TranslatedText[];
  };
  mission: {
    label: TranslatedText;
    title: TranslatedText;
    subtitle: TranslatedText;
  };
  values: Array<{
    icon: string;
    title: TranslatedText;
    description: TranslatedText;
  }>;
  stats: Array<{
    value: string;
    label: TranslatedText;
    icon: string;
  }>;
  team: Array<{
    name: string;
    role: TranslatedText;
    bio: TranslatedText;
  }>;
  cta: {
    title: TranslatedText;
    subtitle: TranslatedText;
    button: TranslatedText;
  };
}

function txt(field: TranslatedText | string | undefined, lang: string): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}

/* ============================================================
   LOADING SKELETON
   ============================================================ */
function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="text-center space-y-4">
          <div className="w-48 h-8 bg-white/10 rounded-lg mx-auto animate-pulse" />
          <div className="w-96 h-5 bg-white/5 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="mt-8 space-y-4">
          <div className="w-full h-40 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="w-48 h-8 bg-white/10 rounded-lg mx-auto animate-pulse mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-40 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAbout() {
      try {
        const res = await fetch("/api/content/about");
        if (!res.ok) throw new Error("Failed to fetch about data");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchAbout();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-zinc-400 text-lg mb-4">Unable to load page content.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      {/* Hero / Story */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="heading-section gradient-text mb-6">
            {txt(data.story?.title, language) || "Our Story"}
          </h1>
          <p className="subheading max-w-2xl mx-auto mb-8">
            {txt(data.story?.subtitle, language) || "Born from a passion for automotive excellence and a vision to make premium window tinting accessible across Southeast Asia and Oceania."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card !rounded-2xl p-8 md:p-10 text-zinc-400 text-sm leading-relaxed space-y-4"
        >
          {(data.story?.paragraphs || []).map((p, i) => (
            <p key={i}>{txt(p, language)}</p>
          ))}
        </motion.div>
      </section>

      {/* Mission Parallax */}
      <section
        ref={parallaxRef}
        className="relative overflow-hidden py-24 mb-24"
      >
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/10 via-transparent to-[#30d158]/5"
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-[#0071E3] mb-4">
              {txt(data.mission?.label, language) || "Our Mission"}
            </p>
            <h2 className="heading-section gradient-text-accent mb-6">
              {txt(data.mission?.title, language) || "Making premium window tinting accessible across Southeast Asia and Oceania"}
            </h2>
            <p className="subheading max-w-xl mx-auto">
              {txt(data.mission?.subtitle, language) || "We combine world-class materials with innovative technology to deliver the ultimate window tinting experience."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-section gradient-text text-center mb-12"
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.values || []).map((v, i) => {
            const IconComp = getIcon(v.icon);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card !rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0071E3]/10 flex items-center justify-center mx-auto mb-4">
                  <IconComp size={24} className="text-[#0071E3]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{txt(v.title, language)}</h3>
                <p className="text-zinc-500 text-sm">{txt(v.description, language)}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(data.stats || []).map((s, i) => {
            const IconComp = getIcon(s.icon);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card !rounded-2xl p-6 text-center"
              >
                <IconComp
                  size={24}
                  className="text-[#0071E3] mx-auto mb-3"
                />
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs text-zinc-500">{txt(s.label, language)}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-section gradient-text text-center mb-12"
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.team || []).map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0071E3]/20 to-[#30d158]/10 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-zinc-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {member.name}
              </h3>
              <p className="text-[#0071E3] text-xs mb-2">{txt(member.role, language)}</p>
              <p className="text-zinc-500 text-xs">{txt(member.bio, language)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card !rounded-2xl p-10"
        >
          <h2 className="text-xl font-semibold text-white mb-3">
            {txt(data.cta?.title, language) || "Ready to transform your ride?"}
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            {txt(data.cta?.subtitle, language) || "Explore our range of premium window tint films and find the perfect match for your vehicle."}
          </p>
          <Link
            href="/configurator"
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            {txt(data.cta?.button, language) || "Try the Configurator"}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
