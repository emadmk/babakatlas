"use client";

import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us, including: name, email address, shipping address, phone number, and payment information when you create an account or place an order. We also automatically collect certain information when you visit our site, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to: process and fulfill your orders, communicate with you about products, services, and promotions, improve and personalize your experience on our website, analyze usage trends and preferences, prevent fraud and enhance the security of our site, and comply with legal obligations. We will never sell your personal information to third parties.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We may share your information with: shipping carriers to deliver your orders, payment processors to complete transactions, installation partners when you select installation services, analytics providers to help us understand website usage, and law enforcement when required by law. All third-party service providers are contractually obligated to protect your information.",
  },
  {
    title: "4. Cookies and Tracking",
    content:
      "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings. Essential cookies are required for the site to function properly. Analytics and marketing cookies are optional and can be disabled without affecting core functionality.",
  },
  {
    title: "5. Data Security",
    content:
      "We implement industry-standard security measures to protect your personal information, including SSL encryption for all data transmission, secure payment processing through PCI-compliant providers, regular security audits, and restricted access to personal data. While we strive to protect your information, no method of electronic transmission or storage is 100% secure.",
  },
  {
    title: "6. Data Retention",
    content:
      "We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time by contacting us.",
  },
  {
    title: "7. Your Rights",
    content:
      "Depending on your location, you may have the right to: access the personal information we hold about you, correct inaccurate information, request deletion of your information, object to or restrict processing of your information, data portability, and withdraw consent. To exercise these rights, please contact us at hello@atlasadaptive.com.",
  },
  {
    title: "8. International Data Transfers",
    content:
      "As we operate in the Philippines and Australia, your information may be transferred to and processed in either country. We ensure that appropriate safeguards are in place to protect your information in accordance with applicable data protection laws, including the Philippine Data Privacy Act of 2012 and the Australian Privacy Act 1988.",
  },
  {
    title: "9. Children's Privacy",
    content:
      "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will take steps to delete that information promptly.",
  },
  {
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.",
  },
  {
    title: "11. Contact Us",
    content:
      "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at hello@atlasadaptive.com or visit our Contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-section gradient-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500">
            Last updated: April 1, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card !rounded-2xl p-8 md:p-10"
        >
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-white font-semibold mb-3">
                  {section.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
