"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Sun,
  Eye,
  Zap,
  Palette,
  Thermometer,
  Car,
  MousePointer2,
  Layers,
  Package,
  ChevronRight,
  Star,
  Truck,
  Award,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,113,227,0.12),transparent)]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Car silhouette / abstract shape */}
        <motion.div
          style={{ y }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-white/[0.02] to-transparent rounded-t-[50%] blur-sm" />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[120px] border border-white/[0.04] rounded-[40%] bg-gradient-to-b from-white/[0.02] to-transparent" />
          {/* Window tint visual */}
          <div className="absolute bottom-28 left-1/2 -translate-x-[45%] w-[180px] h-[70px] bg-gradient-to-br from-accent/10 to-accent/[0.03] rounded-tl-[60%] rounded-tr-[30%] rounded-br-[10%] rounded-bl-[20%] border border-accent/10" />
          <div className="absolute bottom-28 left-1/2 translate-x-[5%] w-[150px] h-[65px] bg-gradient-to-bl from-accent/8 to-accent/[0.02] rounded-tl-[30%] rounded-tr-[60%] rounded-br-[20%] rounded-bl-[10%] border border-accent/8" />
        </motion.div>
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-medium bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Professional Grade Films
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="heading-hero gradient-text mb-6"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="subheading max-w-2xl mx-auto mb-10"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/configurator" className="btn-glow flex items-center gap-2">
            {t("hero.cta")}
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#products"
            className="text-zinc-400 hover:text-white border border-white/10 hover:border-white/25 px-8 py-3.5 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/5"
          >
            {t("hero.cta2")}
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2.5 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   BENEFITS SECTION
   ============================================================ */
const benefits = [
  { icon: Shield, titleKey: "benefits.uv.title", descKey: "benefits.uv.desc", color: "#0071E3" },
  { icon: Thermometer, titleKey: "benefits.heat.title", descKey: "benefits.heat.desc", color: "#FF6B35" },
  { icon: Eye, titleKey: "benefits.privacy.title", descKey: "benefits.privacy.desc", color: "#8B5CF6" },
  { icon: Zap, titleKey: "benefits.glare.title", descKey: "benefits.glare.desc", color: "#F59E0B" },
  { icon: Palette, titleKey: "benefits.interior.title", descKey: "benefits.interior.desc", color: "#30D158" },
  { icon: Sun, titleKey: "benefits.energy.title", descKey: "benefits.energy.desc", color: "#06B6D4" },
];

function BenefitsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-white mb-4">
            {t("benefits.title")}
          </h2>
          <p className="subheading max-w-xl mx-auto">
            {t("benefits.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.titleKey}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card p-8 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${b.color}15`,
                  border: `1px solid ${b.color}30`,
                }}
              >
                <b.icon size={24} style={{ color: b.color }} />
              </div>
              <h3 className="heading-card text-white mb-3">{t(b.titleKey)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t(b.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PRODUCT SHOWCASE SECTION
   ============================================================ */
const tintProducts = [
  {
    name: "Standard",
    vlt: "20-70%",
    features: ["Basic UV protection", "Affordable option", "Multiple shades"],
    priceRange: "$49 - $89",
    color: "#737373",
  },
  {
    name: "Ceramic",
    vlt: "15-70%",
    features: ["99% UV block", "Superior heat rejection", "No signal interference"],
    priceRange: "$149 - $299",
    color: "#0071E3",
    popular: true,
  },
  {
    name: "Carbon",
    vlt: "5-50%",
    features: ["Matte finish", "No fading", "Good heat rejection"],
    priceRange: "$99 - $199",
    color: "#525252",
  },
  {
    name: "Adaptive",
    vlt: "Variable",
    features: ["Auto-adjusting tint", "Smart technology", "Premium finish"],
    priceRange: "$299 - $499",
    color: "#8B5CF6",
  },
  {
    name: "Crystalline",
    vlt: "40-90%",
    features: ["Near-clear look", "Max UV block", "Premium clarity"],
    priceRange: "$199 - $399",
    color: "#06B6D4",
  },
  {
    name: "Metallic",
    vlt: "15-50%",
    features: ["Reflective finish", "High heat rejection", "Durable"],
    priceRange: "$79 - $159",
    color: "#C4A35A",
  },
];

function ProductShowcaseSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-white mb-4">
            {t("products.title")}
          </h2>
          <p className="subheading max-w-xl mx-auto">
            {t("products.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide md:max-w-7xl md:mx-auto md:grid md:grid-cols-3 md:overflow-visible md:px-6">
          {tintProducts.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="snap-center min-w-[280px] md:min-w-0 group"
            >
              <div className="relative glass-card p-6 h-full flex flex-col">
                {product.popular && (
                  <div className="absolute -top-3 left-6 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                {/* Color accent bar */}
                <div
                  className="w-full h-1 rounded-full mb-6"
                  style={{
                    background: `linear-gradient(90deg, ${product.color}, transparent)`,
                  }}
                />
                <h3 className="text-xl font-semibold text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-500 mb-4">
                  VLT: {product.vlt}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <BadgeCheck
                        size={14}
                        style={{ color: product.color }}
                        className="flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    {product.priceRange}
                  </span>
                  <button
                    className="text-sm font-medium flex items-center gap-1 transition-colors"
                    style={{ color: product.color }}
                  >
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS SECTION
   ============================================================ */
const steps = [
  { icon: Car, titleKey: "howItWorks.step1", descKey: "howItWorks.step1.desc" },
  { icon: MousePointer2, titleKey: "howItWorks.step2", descKey: "howItWorks.step2.desc" },
  { icon: Layers, titleKey: "howItWorks.step3", descKey: "howItWorks.step3.desc" },
  { icon: Package, titleKey: "howItWorks.step4", descKey: "howItWorks.step4.desc" },
];

function HowItWorksSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-white mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="subheading max-w-xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-accent/50 via-accent/20 to-accent/50" />

          {steps.map((step, i) => (
            <motion.div
              key={step.titleKey}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Step number with glow */}
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
                <div className="relative w-16 h-16 bg-black border-2 border-accent/50 rounded-full flex items-center justify-center">
                  <span className="text-accent font-bold text-lg">
                    {i + 1}
                  </span>
                </div>
              </div>

              <div className="glass-card p-6">
                <step.icon
                  size={28}
                  className="text-accent mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STATS SECTION
   ============================================================ */
function AnimatedCounter({
  target,
  suffix,
  prefix,
  inView,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 10000, suffix: "+", label: "stats.cars" },
  { value: 99, suffix: "%", label: "stats.uv" },
  { value: 50, suffix: "+", label: "stats.models" },
  { value: 2, suffix: "", label: "stats.countries" },
];

function StatsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-sm text-zinc-500">{t(stat.label)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION
   ============================================================ */
function CTASection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const badges = [
    { icon: Truck, text: t("cta.badge1") },
    { icon: Award, text: t("cta.badge2") },
    { icon: Shield, text: t("cta.badge3") },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto px-6 text-center relative z-10"
      >
        <h2 className="heading-section text-white mb-6">{t("cta.title")}</h2>
        <p className="subheading max-w-xl mx-auto mb-10">{t("cta.subtitle")}</p>

        <Link href="/configurator" className="btn-glow inline-flex items-center gap-2 text-lg">
          {t("cta.button")}
          <ArrowRight size={20} />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {badges.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 text-sm text-zinc-400"
            >
              <badge.icon size={16} className="text-accent" />
              {badge.text}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS SECTION
   ============================================================ */
const testimonials = [
  {
    name: "Miguel Santos",
    car: "Toyota Fortuner 2024",
    quote:
      "The ceramic tint completely transformed my driving experience. My cabin stays cool even in Manila traffic. Absolutely worth every peso.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    car: "Tesla Model 3 2023",
    quote:
      "Crystal clear visibility with incredible heat rejection. The installation was flawless and the pre-cut fit was perfect.",
    rating: 5,
  },
  {
    name: "James Rivera",
    car: "Ford Ranger 2024",
    quote:
      "Best investment for my truck. The UV protection is noticeable immediately. My leather seats look brand new after 6 months.",
    rating: 5,
  },
];

function TestimonialsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-white mb-4">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.car}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE COMPOSITION
   ============================================================ */
export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ProductShowcaseSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
