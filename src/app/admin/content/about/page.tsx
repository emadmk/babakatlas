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
  Info,
  BookOpen,
  Target,
  Heart,
  BarChart3,
  Users,
} from "lucide-react";

interface LocalizedText {
  en: string;
  tl: string;
}

interface ValueItem {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
}

interface StatItem {
  value: string;
  label: LocalizedText;
  icon: string;
}

interface TeamMember {
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  imageUrl: string;
}

interface AboutContent {
  story: LocalizedText;
  mission: LocalizedText;
  values: ValueItem[];
  stats: StatItem[];
  team: TeamMember[];
}

const defaultContent: AboutContent = {
  story: { en: "", tl: "" },
  mission: { en: "", tl: "" },
  values: [],
  stats: [],
  team: [],
};

function LocalizedInput({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  textarea?: boolean;
  rows?: number;
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
            rows={textarea ? rows : undefined}
          />
        </div>
        <div>
          <span className="text-xs text-white/40 mb-1 block">Tagalog</span>
          <Tag
            value={value.tl}
            onChange={(e) => onChange({ ...value, tl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50 resize-y"
            rows={textarea ? rows : undefined}
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

export default function AboutContentPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
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
      const res = await fetch("/api/admin/content/about");
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
      const res = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) showToast("success", "About content saved successfully");
      else showToast("error", "Failed to save about content");
    } catch {
      showToast("error", "Failed to save about content");
    } finally {
      setSaving(false);
    }
  };

  // Values helpers
  const addValue = () =>
    setContent((c) => ({
      ...c,
      values: [
        ...c.values,
        { icon: "Heart", title: { en: "", tl: "" }, description: { en: "", tl: "" } },
      ],
    }));

  const updateValue = (idx: number, updates: Partial<ValueItem>) =>
    setContent((c) => ({
      ...c,
      values: c.values.map((v, i) => (i === idx ? { ...v, ...updates } : v)),
    }));

  const removeValue = (idx: number) =>
    setContent((c) => ({ ...c, values: c.values.filter((_, i) => i !== idx) }));

  // Stats helpers
  const addStat = () =>
    setContent((c) => ({
      ...c,
      stats: [
        ...c.stats,
        { value: "", label: { en: "", tl: "" }, icon: "BarChart3" },
      ],
    }));

  const updateStat = (idx: number, updates: Partial<StatItem>) =>
    setContent((c) => ({
      ...c,
      stats: c.stats.map((s, i) => (i === idx ? { ...s, ...updates } : s)),
    }));

  const removeStat = (idx: number) =>
    setContent((c) => ({ ...c, stats: c.stats.filter((_, i) => i !== idx) }));

  // Team helpers
  const addTeamMember = () =>
    setContent((c) => ({
      ...c,
      team: [
        ...c.team,
        {
          name: "",
          role: { en: "", tl: "" },
          bio: { en: "", tl: "" },
          imageUrl: "",
        },
      ],
    }));

  const updateTeamMember = (idx: number, updates: Partial<TeamMember>) =>
    setContent((c) => ({
      ...c,
      team: c.team.map((t, i) => (i === idx ? { ...t, ...updates } : t)),
    }));

  const removeTeamMember = (idx: number) =>
    setContent((c) => ({ ...c, team: c.team.filter((_, i) => i !== idx) }));

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
          <Info size={24} className="text-[#0071E3]" />
          About Page Content
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Manage about page sections and translations
        </p>
      </div>

      {/* Story */}
      <CollapsibleSection
        title="Our Story"
        icon={<BookOpen size={20} />}
        defaultOpen
      >
        <LocalizedInput
          label="Story Content (Markdown supported)"
          value={content.story}
          onChange={(v) => setContent((c) => ({ ...c, story: v }))}
          textarea
          rows={6}
        />
      </CollapsibleSection>

      {/* Mission */}
      <CollapsibleSection title="Mission" icon={<Target size={20} />}>
        <LocalizedInput
          label="Mission Statement (Markdown supported)"
          value={content.mission}
          onChange={(v) => setContent((c) => ({ ...c, mission: v }))}
          textarea
          rows={4}
        />
      </CollapsibleSection>

      {/* Values */}
      <CollapsibleSection title="Values" icon={<Heart size={20} />}>
        {content.values.map((val, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Value #{idx + 1}
              </span>
              <button
                onClick={() => removeValue(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">
                Icon Name
              </label>
              <input
                value={val.icon}
                onChange={(e) => updateValue(idx, { icon: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                placeholder="e.g. Heart, Shield, Zap"
              />
            </div>
            <LocalizedInput
              label="Title"
              value={val.title}
              onChange={(v) => updateValue(idx, { title: v })}
            />
            <LocalizedInput
              label="Description"
              value={val.description}
              onChange={(v) => updateValue(idx, { description: v })}
              textarea
            />
          </motion.div>
        ))}
        <button
          onClick={addValue}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Value
        </button>
      </CollapsibleSection>

      {/* Stats */}
      <CollapsibleSection title="Stats" icon={<BarChart3 size={20} />}>
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
                  onChange={(e) => updateStat(idx, { value: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. 50000+"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Icon Name
                </label>
                <input
                  value={stat.icon}
                  onChange={(e) => updateStat(idx, { icon: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                  placeholder="e.g. Users, Car"
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

      {/* Team */}
      <CollapsibleSection title="Team" icon={<Users size={20} />}>
        {content.team.map((member, idx) => (
          <motion.div
            key={idx}
            layout
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs font-medium">
                Team Member #{idx + 1}
              </span>
              <button
                onClick={() => removeTeamMember(idx)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Name</label>
              <input
                value={member.name}
                onChange={(e) =>
                  updateTeamMember(idx, { name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
              />
            </div>
            <LocalizedInput
              label="Role"
              value={member.role}
              onChange={(v) => updateTeamMember(idx, { role: v })}
            />
            <LocalizedInput
              label="Bio"
              value={member.bio}
              onChange={(v) => updateTeamMember(idx, { bio: v })}
              textarea
            />
            <div className="space-y-2">
              <label className="text-xs text-white/40 mb-1 block">
                Image URL
              </label>
              <input
                value={member.imageUrl}
                onChange={(e) =>
                  updateTeamMember(idx, { imageUrl: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                placeholder="https://..."
              />
              {member.imageUrl && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                  <span className="text-white/40 text-xs">Image preview</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <button
          onClick={addTeamMember}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Team Member
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
          Save All Changes
        </button>
      </motion.div>
    </div>
  );
}
