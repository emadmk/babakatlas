"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Home,
  Star,
  Image as ImageIcon,
} from "lucide-react";

interface LocalizedText {
  en: string;
  tl: string;
}

interface HeroSection {
  title: LocalizedText;
  subtitle: LocalizedText;
  ctaText: LocalizedText;
  backgroundImageUrl: string;
}

interface Benefit {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  statValue: string;
}

interface HowItWorksStep {
  step: number;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
}

interface Stat {
  value: string;
  label: LocalizedText;
  suffix: string;
}

interface Testimonial {
  name: string;
  carModel: string;
  quote: LocalizedText;
  rating: number;
  avatarUrl: string;
}

interface CTASection {
  title: LocalizedText;
  subtitle: LocalizedText;
  buttonText: LocalizedText;
  trustBadges: LocalizedText[];
}

interface HomepageContent {
  hero: HeroSection;
  benefits: Benefit[];
  howItWorks: HowItWorksStep[];
  stats: Stat[];
  testimonials: Testimonial[];
  cta: CTASection;
}

const defaultContent: HomepageContent = {
  hero: {
    title: { en: "", tl: "" },
    subtitle: { en: "", tl: "" },
    ctaText: { en: "", tl: "" },
    backgroundImageUrl: "",
  },
  benefits: [],
  howItWorks: [],
  stats: [],
  testimonials: [],
  cta: {
    title: { en: "", tl: "" },
    subtitle: { en: "", tl: "" },
    buttonText: { en: "", tl: "" },
    trustBadges: [],
  },
};

function LocalizedInput({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  textarea?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-white/40 mb-1 block">English</span>
          <Tag
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50 resize-y"
            rows={textarea ? 3 : undefined}
          />
        </div>
        <div>
          <span className="text-xs text-white/40 mb-1 block">Tagalog</span>
          <Tag
            value={value.tl}
            onChange={(e) => onChange({ ...value, tl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50 resize-y"
            rows={textarea ? 3 : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[#0071E3]">{icon}</span>
        <span className="text-white font-semibold flex-1">{title}</span>
        <ChevronDown
          size={18}
          className={`text-white/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HomepageContentPage() {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content/homepage");
      const data = await res.json();
      if (data.success && data.data) {
        setContent({ ...defaultContent, ...data.data });
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) showToast("success", "Homepage content saved successfully");
      else showToast("error", "Failed to save homepage content");
    } catch {
      showToast("error", "Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (updates: Partial<HeroSection>) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, ...updates } }));

  const updateBenefit = (idx: number, updates: Partial<Benefit>) =>
    setContent((c) => ({
      ...c,
      benefits: c.benefits.map((b, i) => (i === idx ? { ...b, ...updates } : b)),
    }));

  const addBenefit = () =>
    setContent((c) => ({
      ...c,
      benefits: [
        ...c.benefits,
        {
          icon: "Shield",
          title: { en: "", tl: "" },
          description: { en: "", tl: "" },
          statValue: "",
        },
      ],
    }));

  const removeBenefit = (idx: number) =>
    setContent((c) => ({
      ...c,
      benefits: c.benefits.filter((_, i) => i !== idx),
    }));

  const moveStep = (idx: number, dir: -1 | 1) => {
    setContent((c) => {
      const steps = [...c.howItWorks];
      const target = idx + dir;
      if (target < 0 || target >= steps.length) return c;
      [steps[idx], steps[target]] = [steps[target], steps[idx]];
      return { ...c, howItWorks: steps.map((s, i) => ({ ...s, step: i + 1 })) };
    });
  };

  const updateStep = (idx: number, updates: Partial<HowItWorksStep>) =>
    setContent((c) => ({
      ...c,
      howItWorks: c.howItWorks.map((s, i) =>
        i === idx ? { ...s, ...updates } : s
      ),
    }));

  const addStep = () =>
    setContent((c) => ({
      ...c,
      howItWorks: [
        ...c.howItWorks,
        {
          step: c.howItWorks.length + 1,
          title: { en: "", tl: "" },
          description: { en: "", tl: "" },
          icon: "CircleDot",
        },
      ],
    }));

  const removeStep = (idx: number) =>
    setContent((c) => ({
      ...c,
      howItWorks: c.howItWorks
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, step: i + 1 })),
    }));

  const updateStat = (idx: number, updates: Partial<Stat>) =>
    setContent((c) => ({
      ...c,
      stats: c.stats.map((s, i) => (i === idx ? { ...s, ...updates } : s)),
    }));

  const addStat = () =>
    setContent((c) => ({
      ...c,
      stats: [...c.stats, { value: "", label: { en: "", tl: "" }, suffix: "" }],
    }));

  const removeStat = (idx: number) =>
    setContent((c) => ({ ...c, stats: c.stats.filter((_, i) => i !== idx) }));

  const updateTestimonial = (idx: number, updates: Partial<Testimonial>) =>
    setContent((c) => ({
      ...c,
      testimonials: c.testimonials.map((t, i) =>
        i === idx ? { ...t, ...updates } : t
      ),
    }));

  const addTestimonial = () =>
    setContent((c) => ({
      ...c,
      testimonials: [
        ...c.testimonials,
        {
          name: "",
          carModel: "",
          quote: { en: "", tl: "" },
          rating: 5,
          avatarUrl: "",
        },
      ],
    }));

  const removeTestimonial = (idx: number) =>
    setContent((c) => ({
      ...c,
      testimonials: c.testimonials.filter((_, i) => i !== idx),
    }));

  const updateCta = (updates: Partial<CTASection>) =>
    setContent((c) => ({ ...c, cta: { ...c.cta, ...updates } }));

  const addTrustBadge = () =>
    setContent((c) => ({
      ...c,
      cta: {
        ...c.cta,
        trustBadges: [...c.cta.trustBadges, { en: "", tl: "" }],
      },
    }));

  const updateTrustBadge = (idx: number, val: LocalizedText) =>
    setContent((c) => ({
      ...c,
      cta: {
        ...c.cta,
        trustBadges: c.cta.trustBadges.map((b, i) => (i === idx ? val : b)),
      },
    }));

  const removeTrustBadge = (idx: number) =>
    setContent((c) => ({
      ...c,
      cta: {
        ...c.cta,
        trustBadges: c.cta.trustBadges.filter((_, i) => i !== idx),
      },
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-xl border ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Home size={24} className="text-[#0071E3]" />
            Homepage Content
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage all homepage sections and translations
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <CollapsibleSection
        title="Hero Section"
        icon={<ImageIcon size={20} />}
        defaultOpen
      >
        <LocalizedInput
          label="Title"
          value={content.hero.title}
          onChange={(v) => updateHero({ title: v })}
        />
        <LocalizedInput
          label="Subtitle"
          value={content.hero.subtitle}
          onChange={(v) => updateHero({ subtitle: v })}
          textarea
        />
        <LocalizedInput
          label="CTA Button Text"
          value={content.hero.ctaText}
          onChange={(v) => updateHero({ ctaText: v })}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            Background Image URL
          </label>
          <input
            value={content.hero.backgroundImageUrl}
            onChange={(e) =>
              updateHero({ backgroundImageUrl: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
            placeholder="https://..."
          />
          {content.hero.backgroundImageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-sm">
              <img
                src={content.hero.backgroundImageUrl}
                alt="Hero background preview"
                className="w-full h-32 object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Benefits Section */}
      <CollapsibleSection title="Benefits" icon={<Star size={20} />}>
        {content.benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Benefit #{idx + 1}
              </span>
              <button
                onClick={() => removeBenefit(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Icon Name
                </label>
                <input
                  value={benefit.icon}
                  onChange={(e) =>
                    updateBenefit(idx, { icon: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Shield, Zap"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Stat Value
                </label>
                <input
                  value={benefit.statValue}
                  onChange={(e) =>
                    updateBenefit(idx, { statValue: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. 99%"
                />
              </div>
            </div>
            <LocalizedInput
              label="Title"
              value={benefit.title}
              onChange={(v) => updateBenefit(idx, { title: v })}
            />
            <LocalizedInput
              label="Description"
              value={benefit.description}
              onChange={(v) => updateBenefit(idx, { description: v })}
              textarea
            />
          </motion.div>
        ))}
        <button
          onClick={addBenefit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Benefit
        </button>
      </CollapsibleSection>

      {/* How It Works Section */}
      <CollapsibleSection title="How It Works" icon={<Star size={20} />}>
        {content.howItWorks.map((step, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Step {step.step}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === content.howItWorks.length - 1}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => removeStep(idx)}
                  className="p-1 text-red-400/60 hover:text-red-400 transition-colors ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">
                Icon Name
              </label>
              <input
                value={step.icon}
                onChange={(e) =>
                  updateStep(idx, { icon: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                placeholder="e.g. Search, ShoppingCart"
              />
            </div>
            <LocalizedInput
              label="Title"
              value={step.title}
              onChange={(v) => updateStep(idx, { title: v })}
            />
            <LocalizedInput
              label="Description"
              value={step.description}
              onChange={(v) => updateStep(idx, { description: v })}
              textarea
            />
          </motion.div>
        ))}
        <button
          onClick={addStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Step
        </button>
      </CollapsibleSection>

      {/* Stats Section */}
      <CollapsibleSection title="Stats" icon={<Star size={20} />}>
        {content.stats.map((stat, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Stat #{idx + 1}
              </span>
              <button
                onClick={() => removeStat(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Value
                </label>
                <input
                  value={stat.value}
                  onChange={(e) =>
                    updateStat(idx, { value: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. 10000"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Suffix
                </label>
                <input
                  value={stat.suffix}
                  onChange={(e) =>
                    updateStat(idx, { suffix: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. +, %"
                />
              </div>
            </div>
            <LocalizedInput
              label="Label"
              value={stat.label}
              onChange={(v) => updateStat(idx, { label: v })}
            />
          </motion.div>
        ))}
        <button
          onClick={addStat}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Stat
        </button>
      </CollapsibleSection>

      {/* Testimonials Section */}
      <CollapsibleSection title="Testimonials" icon={<Star size={20} />}>
        {content.testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Testimonial #{idx + 1}
              </span>
              <button
                onClick={() => removeTestimonial(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Name
                </label>
                <input
                  value={t.name}
                  onChange={(e) =>
                    updateTestimonial(idx, { name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Car Model
                </label>
                <input
                  value={t.carModel}
                  onChange={(e) =>
                    updateTestimonial(idx, { carModel: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                />
              </div>
            </div>
            <LocalizedInput
              label="Quote"
              value={t.quote}
              onChange={(v) => updateTestimonial(idx, { quote: v })}
              textarea
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Rating (1-5)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        updateTestimonial(idx, { rating: star })
                      }
                      className={`transition-colors ${
                        star <= t.rating
                          ? "text-yellow-400"
                          : "text-white/20"
                      }`}
                    >
                      <Star size={20} fill={star <= t.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Avatar URL
                </label>
                <input
                  value={t.avatarUrl}
                  onChange={(e) =>
                    updateTestimonial(idx, { avatarUrl: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="https://..."
                />
              </div>
            </div>
            {t.avatarUrl && (
              <div className="flex items-center gap-3">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
                <span className="text-white/40 text-xs">Avatar preview</span>
              </div>
            )}
          </motion.div>
        ))}
        <button
          onClick={addTestimonial}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </CollapsibleSection>

      {/* CTA Section */}
      <CollapsibleSection title="CTA Section" icon={<Star size={20} />}>
        <LocalizedInput
          label="Title"
          value={content.cta.title}
          onChange={(v) => updateCta({ title: v })}
        />
        <LocalizedInput
          label="Subtitle"
          value={content.cta.subtitle}
          onChange={(v) => updateCta({ subtitle: v })}
          textarea
        />
        <LocalizedInput
          label="Button Text"
          value={content.cta.buttonText}
          onChange={(v) => updateCta({ buttonText: v })}
        />
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">
            Trust Badges
          </label>
          {content.cta.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex-1">
                <LocalizedInput
                  label={`Badge #${idx + 1}`}
                  value={badge}
                  onChange={(v) => updateTrustBadge(idx, v)}
                />
              </div>
              <button
                onClick={() => removeTrustBadge(idx)}
                className="mt-7 text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={addTrustBadge}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
          >
            <Plus size={16} />
            Add Trust Badge
          </button>
        </div>
      </CollapsibleSection>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky bottom-6 flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#0071E3] text-white rounded-xl font-medium text-sm hover:bg-[#0071E3]/90 disabled:opacity-50 transition-all shadow-lg shadow-[#0071E3]/20"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save All Changes
        </button>
      </motion.div>
    </div>
  );
}
