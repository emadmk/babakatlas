"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Product Question",
  "Order Support",
  "Installation Help",
  "Shipping Question",
  "Returns & Refunds",
  "Partnership Opportunity",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

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
          <h1 className="heading-section gradient-text mb-4">Get in Touch</h1>
          <p className="subheading max-w-xl mx-auto">
            Have a question or need help? We&apos;d love to hear from you.
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
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Subject
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
                      Select a subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/20 transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
                >
                  <Send size={16} />
                  Send Message
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
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#0071E3] mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-300">Email</p>
                    <a
                      href="mailto:hello@atlasadaptive.com"
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      hello@atlasadaptive.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#0071E3] mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-300">Phone</p>
                    <p className="text-sm text-zinc-500">+63 2 8123 4567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="glass-card !rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[#0071E3]" />
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mon - Fri</span>
                  <span className="text-zinc-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Saturday</span>
                  <span className="text-zinc-300">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sunday</span>
                  <span className="text-zinc-300">Closed</span>
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  All times in Philippine Standard Time (PST/GMT+8)
                </p>
              </div>
            </div>

            {/* Regions */}
            <div className="glass-card !rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-[#0071E3]" />
                Serving
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">&#x1F1F5;&#x1F1ED;</span>
                  <div>
                    <p className="text-sm text-zinc-300">Philippines</p>
                    <p className="text-xs text-zinc-600">
                      Metro Manila &amp; nationwide
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">&#x1F1E6;&#x1F1FA;</span>
                  <div>
                    <p className="text-sm text-zinc-300">Australia</p>
                    <p className="text-xs text-zinc-600">
                      All states &amp; territories
                    </p>
                  </div>
                </div>
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
            <p className="text-sm font-medium text-white">Message sent!</p>
            <p className="text-xs text-zinc-400">
              We&apos;ll get back to you soon.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
