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
  Phone,
  Mail,
  Clock,
  Globe,
  MessageSquare,
} from "lucide-react";

interface LocalizedText {
  en: string;
  tl: string;
}

interface BusinessHour {
  day: LocalizedText | string;
  hours: string;
}

interface Region {
  country: string;
  flag: string;
  name: LocalizedText | string;
  detail: LocalizedText | string;
}

type ContactSubject = LocalizedText | { label: LocalizedText };

interface ContactContent {
  email: string;
  phone: string;
  businessHours: BusinessHour[];
  regions: Region[];
  subjects: ContactSubject[];
}

// Helper to safely get a localized string value
function getLocalizedValue(val: LocalizedText | string | undefined, lang: "en" | "tl"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || "";
}

// Helper to create a localized value update
function setLocalizedValue(current: LocalizedText | string | undefined, lang: "en" | "tl", newVal: string): LocalizedText {
  if (typeof current === "string" || !current) {
    const base = { en: typeof current === "string" ? current : "", tl: typeof current === "string" ? current : "" };
    return { ...base, [lang]: newVal };
  }
  return { ...current, [lang]: newVal };
}

// Helper to get subject label
function getSubjectLabel(subject: ContactSubject): LocalizedText {
  if ("label" in subject && subject.label) return subject.label;
  if ("en" in subject) return subject as LocalizedText;
  return { en: "", tl: "" };
}

const defaultContent: ContactContent = {
  email: "",
  phone: "",
  businessHours: [],
  regions: [],
  subjects: [],
};

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

export default function ContactContentPage() {
  const [content, setContent] = useState<ContactContent>(defaultContent);
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
      const res = await fetch("/api/admin/content/contact");
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
      const res = await fetch("/api/admin/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) showToast("success", "Contact content saved successfully");
      else showToast("error", "Failed to save contact content");
    } catch {
      showToast("error", "Failed to save contact content");
    } finally {
      setSaving(false);
    }
  };

  // Business hours helpers
  const addBusinessHour = () =>
    setContent((c) => ({
      ...c,
      businessHours: [...(c.businessHours || []), { day: { en: "", tl: "" }, hours: "" }],
    }));

  const updateBusinessHour = (idx: number, updates: Partial<BusinessHour>) =>
    setContent((c) => ({
      ...c,
      businessHours: c.businessHours.map((h, i) =>
        i === idx ? { ...h, ...updates } : h
      ),
    }));

  const removeBusinessHour = (idx: number) =>
    setContent((c) => ({
      ...c,
      businessHours: c.businessHours.filter((_, i) => i !== idx),
    }));

  // Regions helpers
  const addRegion = () =>
    setContent((c) => ({
      ...c,
      regions: [...(c.regions || []), { country: "", flag: "", name: { en: "", tl: "" }, detail: { en: "", tl: "" } }],
    }));

  const updateRegion = (idx: number, updates: Partial<Region>) =>
    setContent((c) => ({
      ...c,
      regions: c.regions.map((r, i) =>
        i === idx ? { ...r, ...updates } : r
      ),
    }));

  const removeRegion = (idx: number) =>
    setContent((c) => ({
      ...c,
      regions: c.regions.filter((_, i) => i !== idx),
    }));

  // Subjects helpers
  const addSubject = () =>
    setContent((c) => ({
      ...c,
      subjects: [...(c.subjects || []), { en: "", tl: "" }],
    }));

  const updateSubjectField = (idx: number, lang: "en" | "tl", value: string) =>
    setContent((c) => ({
      ...c,
      subjects: c.subjects.map((s, i) => {
        if (i !== idx) return s;
        const current = getSubjectLabel(s);
        return { ...current, [lang]: value };
      }),
    }));

  const removeSubject = (idx: number) =>
    setContent((c) => ({
      ...c,
      subjects: c.subjects.filter((_, i) => i !== idx),
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
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Phone size={24} className="text-[#0071E3]" />
          Contact Page Content
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Manage contact information, business hours, and regions
        </p>
      </div>

      {/* Contact Info */}
      <CollapsibleSection
        title="Contact Information"
        icon={<Mail size={20} />}
        defaultOpen
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Email</label>
            <input
              value={content.email}
              onChange={(e) =>
                setContent((c) => ({ ...c, email: e.target.value }))
              }
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
              placeholder="support@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Phone</label>
            <input
              value={content.phone}
              onChange={(e) =>
                setContent((c) => ({ ...c, phone: e.target.value }))
              }
              type="tel"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
              placeholder="+63 917 000 0000"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Business Hours */}
      <CollapsibleSection
        title="Business Hours"
        icon={<Clock size={20} />}
      >
        {(content.businessHours || []).map((bh, idx) => (
          <motion.div
            key={idx}
            layout
            className="flex items-center gap-3"
          >
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Day (EN)</label>
                <input
                  value={getLocalizedValue(bh.day, "en")}
                  onChange={(e) =>
                    updateBusinessHour(idx, { day: setLocalizedValue(bh.day, "en", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Monday - Friday"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Day (TL)</label>
                <input
                  value={getLocalizedValue(bh.day, "tl")}
                  onChange={(e) =>
                    updateBusinessHour(idx, { day: setLocalizedValue(bh.day, "tl", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Lun - Biy"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Hours
                </label>
                <input
                  value={bh.hours}
                  onChange={(e) =>
                    updateBusinessHour(idx, { hours: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. 9:00 AM - 6:00 PM"
                />
              </div>
            </div>
            <button
              onClick={() => removeBusinessHour(idx)}
              className="mt-5 text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
        <button
          onClick={addBusinessHour}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Business Hours
        </button>
      </CollapsibleSection>

      {/* Regions */}
      <CollapsibleSection title="Regions" icon={<Globe size={20} />}>
        {(content.regions || []).map((region, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Region #{idx + 1}
              </span>
              <button
                onClick={() => removeRegion(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Country
                </label>
                <input
                  value={region.country}
                  onChange={(e) =>
                    updateRegion(idx, { country: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. PH"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Flag (emoji)
                </label>
                <input
                  value={region.flag}
                  onChange={(e) =>
                    updateRegion(idx, { flag: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. flag emoji"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Name (EN)
                </label>
                <input
                  value={getLocalizedValue(region.name, "en")}
                  onChange={(e) =>
                    updateRegion(idx, { name: setLocalizedValue(region.name, "en", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Philippines"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Name (TL)
                </label>
                <input
                  value={getLocalizedValue(region.name, "tl")}
                  onChange={(e) =>
                    updateRegion(idx, { name: setLocalizedValue(region.name, "tl", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Pilipinas"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Detail (EN)
                </label>
                <input
                  value={getLocalizedValue(region.detail, "en")}
                  onChange={(e) =>
                    updateRegion(idx, { detail: setLocalizedValue(region.detail, "en", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Metro Manila & nearby"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Detail (TL)
                </label>
                <input
                  value={getLocalizedValue(region.detail, "tl")}
                  onChange={(e) =>
                    updateRegion(idx, { detail: setLocalizedValue(region.detail, "tl", e.target.value) })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Metro Manila at malapit"
                />
              </div>
            </div>
          </motion.div>
        ))}
        <button
          onClick={addRegion}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Region
        </button>
      </CollapsibleSection>

      {/* Contact Subjects */}
      <CollapsibleSection
        title="Contact Subjects"
        icon={<MessageSquare size={20} />}
      >
        {(content.subjects || []).map((subject, idx) => {
          const label = getSubjectLabel(subject);
          return (
          <motion.div
            key={idx}
            layout
            className="flex items-start gap-3"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  English
                </label>
                <input
                  value={label.en || ""}
                  onChange={(e) =>
                    updateSubjectField(idx, "en", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. General Inquiry"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Tagalog
                </label>
                <input
                  value={label.tl || ""}
                  onChange={(e) =>
                    updateSubjectField(idx, "tl", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Pangkalahatang Tanong"
                />
              </div>
            </div>
            <button
              onClick={() => removeSubject(idx)}
              className="mt-5 text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
          );
        })}
        <button
          onClick={addSubject}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Subject
        </button>
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
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}
