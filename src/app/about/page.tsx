"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Lightbulb,
  Heart,
  Leaf,
  Users,
  Car,
  Star,
  Clock,
} from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Quality",
    description:
      "We source and develop only the highest grade materials, ensuring every film meets rigorous performance standards.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "From adaptive nano-ceramic technology to our online configurator, we push boundaries in the window tinting industry.",
  },
  {
    icon: Heart,
    title: "Customer Service",
    description:
      "Every customer interaction matters. We provide expert guidance from selection through installation and beyond.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Our films reduce vehicle energy consumption and we are committed to eco-friendly manufacturing and packaging.",
  },
];

const stats = [
  { value: "8+", label: "Years in Business", icon: Clock },
  { value: "50K+", label: "Cars Tinted", icon: Car },
  { value: "99%", label: "Customer Satisfaction", icon: Star },
  { value: "2", label: "Countries Served", icon: Users },
];

const team = [
  {
    name: "Marco Reyes",
    role: "Founder & CEO",
    bio: "Automotive enthusiast with 15 years in the tinting industry.",
  },
  {
    name: "Sarah Chen",
    role: "Head of Product",
    bio: "Materials engineer driving our next-gen film technology.",
  },
  {
    name: "James Villanueva",
    role: "Operations Director",
    bio: "Logistics expert ensuring fast delivery across the region.",
  },
  {
    name: "Ava Thompson",
    role: "Customer Experience",
    bio: "Dedicated to making every customer journey exceptional.",
  },
];

export default function AboutPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      {/* Hero / Story */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="heading-section gradient-text mb-6">Our Story</h1>
          <p className="subheading max-w-2xl mx-auto mb-8">
            Born from a passion for automotive excellence and a vision to make
            premium window tinting accessible across Southeast Asia and Oceania.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card !rounded-2xl p-8 md:p-10 text-zinc-400 text-sm leading-relaxed space-y-4"
        >
          <p>
            AtlasAdaptive was founded with a simple belief: everyone deserves
            access to professional-grade window tinting, regardless of where they
            are. Starting from a small workshop in Metro Manila, we spent years
            perfecting our craft and sourcing the finest materials from around
            the world.
          </p>
          <p>
            Today, we serve thousands of customers across the Philippines and
            Australia, offering cutting-edge ceramic, carbon, and adaptive tint
            films through our innovative online platform. Our proprietary
            configurator lets you visualize exactly how your vehicle will look
            before you buy, taking the guesswork out of window tinting.
          </p>
          <p>
            We are not just a tint company. We are a technology-driven brand
            committed to transforming the way people protect and personalize
            their vehicles. From our nano-ceramic formulations to our seamless
            e-commerce experience, every detail is engineered for perfection.
          </p>
        </motion.div>
      </section>

      {/* Mission Parallax */}
      <section
        ref={parallaxRef}
        className="relative overflow-hidden py-24 mb-24"
      >
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/10 via-transparent to-[#30d158]/5"
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-[#0071E3] mb-4">
              Our Mission
            </p>
            <h2 className="heading-section gradient-text-accent mb-6">
              Making premium window tinting accessible across Southeast Asia and
              Oceania
            </h2>
            <p className="subheading max-w-xl mx-auto">
              We combine world-class materials with innovative technology to
              deliver the ultimate window tinting experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-section gradient-text text-center mb-12"
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0071E3]/10 flex items-center justify-center mx-auto mb-4">
                <v.icon size={24} className="text-[#0071E3]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-zinc-500 text-sm">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !rounded-2xl p-6 text-center"
            >
              <s.icon
                size={24}
                className="text-[#0071E3] mx-auto mb-3"
              />
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-section gradient-text text-center mb-12"
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0071E3]/20 to-[#30d158]/10 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-zinc-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {member.name}
              </h3>
              <p className="text-[#0071E3] text-xs mb-2">{member.role}</p>
              <p className="text-zinc-500 text-xs">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card !rounded-2xl p-10"
        >
          <h2 className="text-xl font-semibold text-white mb-3">
            Ready to transform your ride?
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Explore our range of premium window tint films and find the perfect
            match for your vehicle.
          </p>
          <Link
            href="/configurator"
            className="btn-glow inline-flex items-center gap-2 !text-sm !px-6 !py-3"
          >
            Try the Configurator
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
