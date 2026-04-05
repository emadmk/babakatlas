"use client";

import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the AtlasAdaptive website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.",
  },
  {
    title: "2. Products and Services",
    content:
      "AtlasAdaptive offers premium window tint films and related products for vehicles. All product descriptions, images, and specifications are provided as accurately as possible. However, we do not warrant that product descriptions or other content are error-free. Colors may vary slightly due to monitor display settings. We reserve the right to discontinue any product at any time without notice.",
  },
  {
    title: "3. Orders and Payment",
    content:
      "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including suspected fraud. Prices are listed in the local currency of your shipping destination (PHP for Philippines, AUD for Australia) and are subject to change without notice. Payment is processed securely through our payment partners at the time of order.",
  },
  {
    title: "4. Shipping and Delivery",
    content:
      "We currently ship to the Philippines and Australia. Delivery times are estimates and are not guaranteed. AtlasAdaptive is not responsible for delays caused by customs, weather, or carrier issues. Risk of loss and title for items pass to you upon delivery to the carrier. Please refer to our Shipping Info page for detailed rates and timelines.",
  },
  {
    title: "5. Returns and Refunds",
    content:
      "We offer a 30-day satisfaction guarantee. Unused and unopened products may be returned within 30 days of delivery for a full refund. Products that have been installed are not eligible for return unless defective. Defective products will be replaced free of charge. Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.",
  },
  {
    title: "6. Warranty",
    content:
      "AtlasAdaptive window tint films come with a limited manufacturer warranty. Ceramic films carry a 10-year warranty, carbon films a 7-year warranty, and standard films a 5-year warranty. Warranty covers defects in materials including bubbling, peeling, discoloration, and delamination under normal use. The warranty does not cover damage from improper installation, accidents, or abuse.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content on the AtlasAdaptive website, including text, graphics, logos, images, and software, is the property of AtlasAdaptive and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, AtlasAdaptive shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services. Our total liability shall not exceed the amount paid by you for the product or service giving rise to the claim.",
  },
  {
    title: "9. Privacy",
    content:
      "Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.",
  },
  {
    title: "10. Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Metro Manila, Philippines.",
  },
  {
    title: "11. Contact",
    content:
      "If you have questions about these Terms of Service, please contact us at hello@atlasadaptive.com.",
  },
];

export default function TermsPage() {
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
            Terms of Service
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
