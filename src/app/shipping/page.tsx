"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  Package,
  Shield,
  MapPin,
} from "lucide-react";

const regions = [
  {
    flag: "\u{1F1F5}\u{1F1ED}",
    country: "Philippines",
    rates: [
      { method: "Standard Shipping", time: "5-7 business days", cost: "\u20B1250" },
      { method: "Express Shipping", time: "2-3 business days", cost: "\u20B1450" },
      { method: "Same-Day (Metro Manila)", time: "Same day", cost: "\u20B1650" },
    ],
    freeThreshold: "\u20B15,000",
    notes:
      "We ship to all provinces and regions across the Philippines. Remote areas may take 1-2 additional days.",
  },
  {
    flag: "\u{1F1E6}\u{1F1FA}",
    country: "Australia",
    rates: [
      { method: "Standard Shipping", time: "7-10 business days", cost: "A$25" },
      { method: "Express Shipping", time: "3-5 business days", cost: "A$45" },
      { method: "Priority Express", time: "1-2 business days", cost: "A$70" },
    ],
    freeThreshold: "A$300",
    notes:
      "We deliver to all states and territories including Tasmania. Rural and remote areas may experience additional transit time.",
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-section gradient-text mb-4">
            Shipping Information
          </h1>
          <p className="subheading max-w-xl mx-auto">
            Fast, reliable delivery to the Philippines and Australia.
          </p>
        </motion.div>

        {/* Regions */}
        <div className="space-y-8 mb-16">
          {regions.map((region, i) => (
            <motion.div
              key={region.country}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card !rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{region.flag}</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {region.country}
                  </h2>
                  <p className="text-xs text-[#0071E3]">
                    Free shipping on orders over {region.freeThreshold}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-zinc-400 font-medium py-3 pr-4">
                        Method
                      </th>
                      <th className="text-left text-zinc-400 font-medium py-3 pr-4">
                        Delivery Time
                      </th>
                      <th className="text-right text-zinc-400 font-medium py-3">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {region.rates.map((rate) => (
                      <tr
                        key={rate.method}
                        className="border-b border-white/5"
                      >
                        <td className="text-zinc-300 py-3 pr-4">
                          {rate.method}
                        </td>
                        <td className="text-zinc-500 py-3 pr-4">
                          {rate.time}
                        </td>
                        <td className="text-white font-medium py-3 text-right">
                          {rate.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-zinc-600 mt-4">{region.notes}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: Package,
              title: "Packaging & Handling",
              text: "All tint films are carefully rolled and packaged in rigid tubes to prevent creasing or damage during transit. Each order includes installation squeegees and detailed instructions.",
            },
            {
              icon: Shield,
              title: "Shipping Insurance",
              text: "Every order is fully insured during transit at no extra cost. If your package arrives damaged, we will replace it immediately, free of charge.",
            },
            {
              icon: MapPin,
              title: "Installation Partners",
              text: "Need professional installation? We partner with certified installers across the Philippines and Australia. Select the installation add-on at checkout and we will coordinate everything for you.",
            },
            {
              icon: Truck,
              title: "Order Tracking",
              text: "Track your order in real-time through your AtlasAdaptive dashboard. You will receive email notifications at every stage: order confirmed, shipped, out for delivery, and delivered.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0071E3]/10 flex items-center justify-center mb-4">
                <item.icon size={20} className="text-[#0071E3]" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card !rounded-2xl p-8 mb-16"
        >
          <h2 className="text-lg font-semibold text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              "Place your order through our configurator or product pages",
              "Receive order confirmation with estimated delivery date",
              "Your films are cut, quality-checked, and carefully packaged",
              "Tracking number sent via email once shipped",
              "Receive your order and enjoy professional-grade tint",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-[#0071E3] font-bold">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-zinc-400 text-sm mb-4">
            Have questions about shipping?
          </p>
          <Link
            href="/contact"
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
