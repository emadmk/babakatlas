"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  HelpCircle,
  GripVertical,
} from "lucide-react";

interface LocalizedText {
  en: string;
  tl: string;
}

interface FAQItem {
  id?: string;
  question: LocalizedText;
  answer: LocalizedText;
  active: boolean;
  order: number;
}

export default function FAQContentPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content/faq");
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (res.ok) showToast("success", "FAQ content saved successfully");
      else showToast("error", "Failed to save FAQ content");
    } catch {
      showToast("error", "Failed to save FAQ content");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem: FAQItem = {
      question: { en: "", tl: "" },
      answer: { en: "", tl: "" },
      active: true,
      order: items.length + 1,
    };
    setItems((prev) => [...prev, newItem]);
    setExpandedIdx(items.length);
  };

  const removeItem = (idx: number) => {
    setItems((prev) =>
      prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, order: i + 1 }))
    );
    if (expandedIdx === idx) setExpandedIdx(null);
    else if (expandedIdx !== null && expandedIdx > idx)
      setExpandedIdx(expandedIdx - 1);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr.map((item, i) => ({ ...item, order: i + 1 }));
    });
    if (expandedIdx === idx) setExpandedIdx(idx + dir);
    else if (expandedIdx === idx + dir) setExpandedIdx(idx);
  };

  const updateItem = (idx: number, updates: Partial<FAQItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...updates } : item))
    );
  };

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
            <HelpCircle size={24} className="text-[#0071E3]" />
            FAQ Content
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage frequently asked questions and translations
          </p>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white rounded-xl text-sm font-medium hover:bg-[#0071E3]/90 transition-colors"
        >
          <Plus size={16} />
          Add New FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Item header row */}
              <div className="flex items-center gap-3 px-5 py-4">
                <GripVertical size={16} className="text-white/20 flex-shrink-0" />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <button
                  onClick={() =>
                    setExpandedIdx(expandedIdx === idx ? null : idx)
                  }
                  className="flex-1 text-left flex items-center gap-3 min-w-0"
                >
                  <span className="text-white text-sm font-medium truncate">
                    {item.question.en || "Untitled Question"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-white/40 flex-shrink-0 transition-transform duration-200 ${
                      expandedIdx === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    item.active
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-white/5 text-white/40 border border-white/10"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded editor */}
              <AnimatePresence initial={false}>
                {expandedIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                      {/* Active toggle */}
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-white/70">Active</label>
                        <button
                          onClick={() =>
                            updateItem(idx, { active: !item.active })
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            item.active ? "bg-[#0071E3]" : "bg-white/10"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                              item.active ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Question */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">
                          Question
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-white/40 mb-1 block">
                              English
                            </span>
                            <input
                              value={item.question.en}
                              onChange={(e) =>
                                updateItem(idx, {
                                  question: {
                                    ...item.question,
                                    en: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                            />
                          </div>
                          <div>
                            <span className="text-xs text-white/40 mb-1 block">
                              Tagalog
                            </span>
                            <input
                              value={item.question.tl}
                              onChange={(e) =>
                                updateItem(idx, {
                                  question: {
                                    ...item.question,
                                    tl: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">
                          Answer
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-white/40 mb-1 block">
                              English
                            </span>
                            <textarea
                              value={item.answer.en}
                              onChange={(e) =>
                                updateItem(idx, {
                                  answer: {
                                    ...item.answer,
                                    en: e.target.value,
                                  },
                                })
                              }
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50 resize-y"
                            />
                          </div>
                          <div>
                            <span className="text-xs text-white/40 mb-1 block">
                              Tagalog
                            </span>
                            <textarea
                              value={item.answer.tl}
                              onChange={(e) =>
                                updateItem(idx, {
                                  answer: {
                                    ...item.answer,
                                    tl: e.target.value,
                                  },
                                })
                              }
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3]/50 resize-y"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <HelpCircle size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No FAQ items yet. Click &quot;Add New FAQ&quot; to get started.</p>
          </div>
        )}
      </div>

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
