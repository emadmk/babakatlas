"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatedText {
  en: string;
  tl: string;
  [key: string]: string;
}

interface FAQItem {
  id: number;
  question: TranslatedText | string;
  answer: TranslatedText | string;
}

function txt(field: TranslatedText | string | undefined, lang: string): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}

function FAQItemCard({
  faq,
  isOpen,
  onToggle,
  language,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  language: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden !rounded-xl"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-white font-medium pr-4">{txt(faq.question, language)}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} className="text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="h-px bg-white/10 mb-4" />
              <p className="text-zinc-400 text-sm leading-relaxed">
                {txt(faq.answer, language)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <div className="w-80 h-8 bg-white/10 rounded-lg mx-auto animate-pulse" />
          <div className="w-64 h-4 bg-white/5 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="mb-8">
          <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function FAQPage() {
  const { language } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchFaqs() {
      try {
        const res = await fetch("/api/content/faq");
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        if (!cancelled) {
          const items = data.data || data;
          setFaqs(Array.isArray(items) ? items : []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch FAQ data:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchFaqs();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <main className="min-h-screen bg-black pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-zinc-400 text-lg mb-4">Unable to load FAQ content.</p>
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

  const filteredFaqs = faqs.filter(
    (faq) =>
      txt(faq.question, language).toLowerCase().includes(search.toLowerCase()) ||
      txt(faq.answer, language).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-section gradient-text mb-4">
            Frequently Asked Questions
          </h1>
          <p className="subheading max-w-xl mx-auto">
            Everything you need to know about our window tint films, shipping,
            and installation.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all"
            />
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <FAQItemCard
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId(openId === faq.id ? null : faq.id)
                }
                language={language}
              />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-zinc-500 py-12"
            >
              No questions match your search. Try different keywords.
            </motion.p>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center glass-card !rounded-2xl p-10"
        >
          <MessageCircle size={40} className="text-[#0071E3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Our team is ready to help you find the perfect tint solution.
          </p>
          <Link
            href="/contact"
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
