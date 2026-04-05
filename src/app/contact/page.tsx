"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatedText {
  en: string;
  tl: string;
  [key: string]: string;
}

interface ContactData {
  title: TranslatedText;
  subtitle: TranslatedText;
  formTitle: TranslatedText;
  subjects: Array<TranslatedText | string>;
  contactInfo: {
    email: string;
    phone: string;
  };
  businessHours: Array<{
    day: TranslatedText | string;
    hours: TranslatedText | string;
  }>;
  timezone: TranslatedText | string;
  regions: Array<{
    flag: string;
    name: TranslatedText | string;
    detail: TranslatedText | string;
  }>;
  labels: {
    name: TranslatedText;
    email: TranslatedText;
    subject: TranslatedText;
    message: TranslatedText;
    send: TranslatedText;
    selectSubject: TranslatedText;
    contactInfo: TranslatedText;
    businessHours: TranslatedText;
    serving: TranslatedText;
    messageSent: TranslatedText;
    messageSentDetail: TranslatedText;
    namePlaceholder: TranslatedText;
    emailPlaceholder: TranslatedText;
    messagePlaceholder: TranslatedText;
  };
}

function txt(field: TranslatedText | string | undefined, lang: string): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="w-48 h-8 bg-white/10 rounded-lg mx-auto animate-pulse" />
          <div className="w-72 h-4 bg-white/5 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="w-full h-96 bg-white/5 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="w-full h-40 bg-white/5 rounded-2xl animate-pulse" />
            <div className="w-full h-40 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  const { language } = useLanguage();
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchContact() {
      try {
        const res = await fetch("/api/content/contact");
        if (!res.ok) throw new Error("Failed to fetch contact data");
        const json = await res.json();
        if (!cancelled) {
          setContactData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchContact();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  if (loading) return <LoadingSkeleton />;

  if (error || !contactData) {
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

  const subjects = contactData.subjects || [];
  const labels = contactData.labels;

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-section gradient-text mb-4">
            {txt(contactData.title, language) || "Get in Touch"}
          </h1>
          <p className="subheading max-w-xl mx-auto">
            {txt(contactData.subtitle, language) || "Have a question or need help? We'd love to hear from you."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card !rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-white mb-6">
                {txt(labels?.formTitle || contactData.formTitle, language) || "Send us a message"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      {txt(labels?.name, language) || "Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all"
                      placeholder={txt(labels?.namePlaceholder, language) || "Your name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      {txt(labels?.email, language) || "Email"}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all"
                      placeholder={txt(labels?.emailPlaceholder, language) || "your@email.com"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    {txt(labels?.subject, language) || "Subject"}
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-zinc-900">
                      {txt(labels?.selectSubject, language) || "Select a subject"}
                    </option>
                    {subjects.map((s, i) => {
                      const label = txt(s, language);
                      return (
                        <option key={i} value={label} className="bg-zinc-900">
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    {txt(labels?.message, language) || "Message"}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all resize-none"
                    placeholder={txt(labels?.messagePlaceholder, language) || "Tell us how we can help..."}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
                >
                  <Send size={16} />
                  {txt(labels?.send, language) || "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Info */}
            <div className="glass-card !rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                {txt(labels?.contactInfo, language) || "Contact Information"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#0071E3] mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-300">Email</p>
                    <a
                      href={`mailto:${contactData.contactInfo?.email || "hello@atlasadaptive.com"}`}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {contactData.contactInfo?.email || "hello@atlasadaptive.com"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#0071E3] mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-300">Phone</p>
                    <p className="text-sm text-zinc-500">{contactData.contactInfo?.phone || "+63 2 8123 4567"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="glass-card !rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[#0071E3]" />
                {txt(labels?.businessHours, language) || "Business Hours"}
              </h3>
              <div className="space-y-2 text-sm">
                {(contactData.businessHours || []).map((bh, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-zinc-500">{txt(bh.day, language)}</span>
                    <span className="text-zinc-300">{txt(bh.hours, language)}</span>
                  </div>
                ))}
                {contactData.timezone && (
                  <p className="text-xs text-zinc-600 mt-2">
                    {txt(contactData.timezone, language)}
                  </p>
                )}
              </div>
            </div>

            {/* Regions */}
            <div className="glass-card !rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-[#0071E3]" />
                {txt(labels?.serving, language) || "Serving"}
              </h3>
              <div className="space-y-3">
                {(contactData.regions || []).map((region, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl" dangerouslySetInnerHTML={{ __html: region.flag }} />
                    <div>
                      <p className="text-sm text-zinc-300">{txt(region.name, language)}</p>
                      <p className="text-xs text-zinc-600">{txt(region.detail, language)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 glass-card !rounded-xl p-4 flex items-center gap-3 shadow-2xl"
        >
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="text-sm font-medium text-white">
              {txt(labels?.messageSent, language) || "Message sent!"}
            </p>
            <p className="text-xs text-zinc-400">
              {txt(labels?.messageSentDetail, language) || "We'll get back to you soon."}
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
