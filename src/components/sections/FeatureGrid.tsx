"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FEATURES } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";

function FeatureCard({
  icon,
  title,
  description,
  accentColor,
  highlight,
}: {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  mockupType?: string;
  highlight?: boolean;
}) {
  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       220,
    borderWidth:  highlight ? 1 : 1,
    borderRadius: "16px",
    brightness:   highlight ? 2.8 : 2.4,
  });

  return (
    <motion.div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      variants={fadeUp}
      className="group relative rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{
        background:           highlight
          ? "linear-gradient(135deg, rgba(30,18,60,0.90) 0%, rgba(18,26,55,0.90) 100%)"
          : "rgba(20, 30, 48, 0.72)",
        backdropFilter:       "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:               highlight
          ? "1px solid rgba(167,139,250,0.30)"
          : "1px solid rgba(255,255,255,0.07)",
        borderTop:            highlight
          ? "1px solid rgba(167,139,250,0.50)"
          : `1px solid ${accentColor}35`,
        boxShadow:            highlight
          ? "0 8px 40px rgba(167,139,250,0.12), 0 0 0 0 transparent"
          : "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Apple Intelligence spotlight border */}
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}${highlight ? "14" : "08"} 0%, transparent 60%)`,
          zIndex: 0,
        }}
      />

      {/* Icon row + AI badge */}
      <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: highlight ? "rgba(167,139,250,0.15)" : `${accentColor}18`,
            border:     highlight ? "1px solid rgba(167,139,250,0.35)" : `1px solid ${accentColor}30`,
          }}
        >
          {icon}
        </div>

        {highlight && (
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
            style={{
              background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
              color: "#fff",
              boxShadow: "0 0 12px rgba(109,40,217,0.5)",
            }}
          >
            AI
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative flex flex-col gap-2" style={{ zIndex: 1 }}>
        <h3
          className="text-base font-semibold transition-colors"
          style={{ color: highlight ? "#c4b5fd" : undefined }}
        >
          {!highlight && <span className="text-text-primary group-hover:text-white">{title}</span>}
          {highlight && title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}50, transparent)`,
          zIndex: 1,
        }}
      />
    </motion.div>
  );
}

export default function FeatureGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#4d9fff", background: "rgba(77,159,255,0.1)", border: "1px solid rgba(77,159,255,0.2)" }}
          >
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            One app. Everything you need.
          </h2>
          <p className="text-lg text-text-muted max-w-xl mx-auto">
            Tasks, KPIs, streaks, mood, hydration, meetings, and AI — all in one glassy window. Built for focus, not friction.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
