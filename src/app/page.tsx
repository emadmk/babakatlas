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
  Star,
  Truck,
  Award,
  BadgeCheck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ============================================================
   ICON HELPER
   ============================================================ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Shield, Thermometer, Eye, Zap, Palette, Sun, Car, Layers, CheckCircle, Package,
  MousePointer2, Truck, Award, BadgeCheck, ArrowRight, Star,
};
const getIcon = (name: string) => iconMap[name] || Shield;

/* ============================================================
   TYPES
   ============================================================ */
interface TranslatedText {
  en: string;
  tl: string;
  [key: string]: string;
}

interface HomepageData {
  hero: {
    title: TranslatedText;
    subtitle: TranslatedText;
    cta: TranslatedText;
    backgroundImage: string;
  };
  benefits: Array<{
    icon: string;
    title: TranslatedText;
    description: TranslatedText;
    stat?: string;
    color?: string;
  }>;
  howItWorks: Array<{
    step: number;
    title: TranslatedText;
    description: TranslatedText;
    icon: string;
  }>;
  stats: Array<{
    value: number | string;
    label: TranslatedText;
    suffix: string;
  }>;
  testimonials: Array<{
    name: string;
    car: string;
    quote: TranslatedText;
    rating: number;
    avatar: string;
  }>;
  cta: {
    title: TranslatedText;
    subtitle: TranslatedText;
    button: TranslatedText;
    badges: TranslatedText[];
  };
}

/* ============================================================
   LOADING SKELETON
   ============================================================ */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-xl mx-auto px-6">
        <div className="w-48 h-4 bg-white/10 rounded-full mx-auto animate-pulse" />
        <div className="w-96 h-10 bg-white/10 rounded-lg mx-auto animate-pulse" />
        <div className="w-72 h-5 bg-white/5 rounded-lg mx-auto animate-pulse" />
        <div className="flex gap-4 justify-center mt-8">
          <div className="w-40 h-12 bg-white/10 rounded-full animate-pulse" />
          <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TEXT HELPER
   ============================================================ */
function txt(field: TranslatedText | undefined, lang: string): string {
  if (!field) return "";
  return field[lang] || field.en || "";
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection({ data, language }: { data: HomepageData["hero"]; language: string }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Hero background image */}
        <img
          src={data.backgroundImage || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&h=1080&fit=crop"}
          alt="Car with tinted windows"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />
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
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6"
        >
          <img
            src="/images/logo/logo-dark.png"
            alt="Atlas Adaptive Tint"
            className="h-16 w-auto mx-auto mb-4"
          />
        </motion.div>

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
          {txt(data.title, language) || t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="subheading max-w-2xl mx-auto mb-10"
        >
          {txt(data.subtitle, language) || t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/configurator" className="btn-glow flex items-center gap-2">
            {txt(data.cta, language) || t("hero.cta")}
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#how-it-works"
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
const defaultBenefitColors = ["#0071E3", "#FF6B35", "#8B5CF6", "#F59E0B", "#30D158", "#06B6D4"];

function BenefitsSection({ data, language }: { data: HomepageData["benefits"]; language: string }) {
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
          {(data || []).map((b, i) => {
            const IconComp = getIcon(b.icon);
            const color = b.color || defaultBenefitColors[i % defaultBenefitColors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-8 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <IconComp size={24} style={{ color }} />
                </div>
                <h3 className="heading-card text-white mb-3">{txt(b.title, language)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {txt(b.description, language)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS SECTION
   ============================================================ */
function HowItWorksSection({ data, language }: { data: HomepageData["howItWorks"]; language: string }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="section-padding relative">
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

          {(data || []).map((step, i) => {
            const IconComp = getIcon(step.icon);
            return (
              <motion.div
                key={i}
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
                      {step.step ?? i + 1}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <IconComp
                    size={28}
                    className="text-accent mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {txt(step.title, language)}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {txt(step.description, language)}
                  </p>
                </div>
              </motion.div>
            );
          })}
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
  inView,
}: {
  target: number;
  suffix?: string;
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
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatsSection({ data, language }: { data: HomepageData["stats"]; language: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" className="relative py-24 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(data || []).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter
                  target={typeof stat.value === "string" ? parseInt(stat.value, 10) || 0 : stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-sm text-zinc-500">{txt(stat.label, language)}</p>
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
function CTASection({ data, language }: { data: HomepageData["cta"]; language: string }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const badgeIcons = [Truck, Award, Shield];

  return (
    <section id="cta" className="section-padding relative overflow-hidden">
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
        <h2 className="heading-section text-white mb-6">{txt(data.title, language) || t("cta.title")}</h2>
        <p className="subheading max-w-xl mx-auto mb-10">{txt(data.subtitle, language) || t("cta.subtitle")}</p>

        <Link href="/configurator" className="btn-glow inline-flex items-center gap-2 text-lg">
          {txt(data.button, language) || t("cta.button")}
          <ArrowRight size={20} />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {(data.badges || []).map((badge, i) => {
            const BadgeIcon = badgeIcons[i % badgeIcons.length];
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-zinc-400"
              >
                <BadgeIcon size={16} className="text-accent" />
                {txt(badge, language)}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS SECTION
   ============================================================ */
function TestimonialsSection({ data, language }: { data: HomepageData["testimonials"]; language: string }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="section-padding relative">
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
          {(data || []).map((item, i) => (
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
                &ldquo;{txt(item.quote, language)}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <img
                  src={item.avatar}
                  alt={`${item.name} avatar`}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover border border-accent/20"
                />
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
  const { language } = useLanguage();
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const homepageRes = await fetch("/api/content/homepage");

        if (!homepageRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const homepageJson = await homepageRes.json();

        // APIs return { success, data } wrapper
        const homepage = homepageJson.data || homepageJson;

        if (!cancelled) {
          setHomepageData(homepage);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-400 text-lg">Unable to load page content.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {homepageData.hero && <HeroSection data={homepageData.hero} language={language} />}
      {homepageData.benefits && <BenefitsSection data={homepageData.benefits} language={language} />}
      {homepageData.howItWorks && <HowItWorksSection data={homepageData.howItWorks} language={language} />}
      {homepageData.stats && <StatsSection data={homepageData.stats} language={language} />}
      {homepageData.testimonials && <TestimonialsSection data={homepageData.testimonials} language={language} />}
      {homepageData.cta && <CTASection data={homepageData.cta} language={language} />}
    </>
  );
}
