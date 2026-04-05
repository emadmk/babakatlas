"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "What is window tinting?",
    answer:
      "Window tinting is the process of applying a thin film to the interior or exterior of glass surfaces in vehicles or buildings. The film is made from polyester and can contain layers of metals, dyes, ceramics, or carbon to reduce the amount of visible light, UV rays, and infrared heat that passes through the glass. It enhances privacy, reduces glare, protects your interior from sun damage, and keeps your vehicle cooler.",
  },
  {
    id: 2,
    question: "Is window tinting legal in the Philippines and Australia?",
    answer:
      "Yes, window tinting is legal in both countries, but there are specific regulations. In the Philippines, the Land Transportation Office (LTO) allows tinting with a minimum of 20% VLT (Visible Light Transmission) for side and rear windows. Windshields must allow at least 70% VLT. In Australia, laws vary by state. Generally, front side windows must allow at least 35% VLT, while rear windows can be darker. Always check your local regulations before installation to ensure compliance.",
  },
  {
    id: 3,
    question: "How long does window tint last?",
    answer:
      "High-quality window tint films, like the ceramic and carbon options we offer at AtlasAdaptive, typically last 5 to 10 years with proper care. The lifespan depends on the type of film, quality of installation, and how well you maintain it. Ceramic tints tend to last the longest due to their superior material composition. To maximize longevity, avoid rolling down freshly tinted windows for at least 3 days and clean with non-ammonia-based products.",
  },
  {
    id: 4,
    question: "Can I install the tint myself?",
    answer:
      "While DIY installation is possible with our films and we provide detailed instructions, we highly recommend professional installation for the best results. Professional installers have the tools, controlled environment, and experience to ensure a bubble-free, perfectly aligned application. Improper installation can lead to bubbling, peeling, and uneven coverage. If you are in the Philippines or Australia, we can connect you with certified installation partners in your area.",
  },
  {
    id: 5,
    question: "What's the difference between ceramic and carbon tint?",
    answer:
      "Ceramic tint uses nano-ceramic particles that are non-conductive and non-metallic, offering superior heat rejection (up to 80%), excellent UV protection (99.9%), and no signal interference. Carbon tint uses carbon fiber particles that provide good heat rejection (up to 60%), UV protection, and a distinctive matte finish. Ceramic is the premium option with better performance, while carbon offers excellent value at a lower price point. Both are far superior to traditional dyed films.",
  },
  {
    id: 6,
    question: "How long does installation take?",
    answer:
      "Professional installation typically takes 2 to 4 hours depending on the vehicle type and how many windows are being tinted. A standard sedan with all side windows and rear window takes about 2-3 hours. SUVs and larger vehicles may take 3-4 hours. Full vehicle wraps including the windshield can take up to 5 hours. We recommend scheduling an appointment and allowing enough time for the process.",
  },
  {
    id: 7,
    question: "Will window tint affect my visibility at night?",
    answer:
      "It depends on the VLT (Visible Light Transmission) percentage you choose. Higher VLT percentages like 50-70% will have minimal impact on night visibility, while darker tints (5-20%) will reduce visibility more noticeably. We recommend lighter tints for front side windows to maintain safe driving visibility at night, and you can go darker on rear windows. Our configurator tool helps you preview different VLT levels so you can make an informed choice.",
  },
  {
    id: 8,
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship to the Philippines and Australia. These are our primary markets, and we have optimized our logistics for fast, reliable delivery to both countries. We are working on expanding to other Southeast Asian and Oceanian markets in the near future. Sign up for our newsletter to be the first to know when we launch in new regions.",
  },
  {
    id: 9,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee on all our products. If you are not completely satisfied with your purchase, you can return unused and unopened films within 30 days of delivery for a full refund. For defective products, we offer free replacements. If the film has been installed and you experience issues due to manufacturing defects, please contact our support team with photos and we will arrange a replacement.",
  },
  {
    id: 10,
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking number via email. You can also track your order directly through your AtlasAdaptive dashboard. Simply log in and navigate to the Orders section to see real-time tracking information, estimated delivery dates, and order history.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
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
        <span className="text-white font-medium pr-4">{faq.question}</span>
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
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
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
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId(openId === faq.id ? null : faq.id)
                }
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
