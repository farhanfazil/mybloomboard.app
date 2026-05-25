"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FEATURES } from "@/lib/constants";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";

function FeatureCard({
  icon,
  title,
  description,
  accentColor,
  mockupType,
  highlight,
}: {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  mockupType?: string;
  highlight?: boolean;
}) {
  const isAIFeature = Boolean(
    highlight ||
      mockupType?.startsWith("ai") ||
      /\bai\b/i.test(title) ||
      title.toLowerCase().includes("bloom")
  );

  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       220,
    borderWidth:  highlight ? 1 : 1,
    borderRadius: "16px",
    brightness:   highlight ? 2.8 : 2.4,
  });

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      className="group relative flex min-h-[220px] w-full shrink-0 cursor-pointer flex-col gap-3 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] sm:h-[220px] sm:w-[340px]"
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
        boxShadow:            "none",
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
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: highlight ? "rgba(167,139,250,0.15)" : `${accentColor}18`,
            border:     highlight ? "1px solid rgba(167,139,250,0.35)" : `1px solid ${accentColor}30`,
          }}
        >
          {icon}
        </div>

        {isAIFeature && (
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
          className="text-sm font-semibold transition-colors"
          style={{ color: highlight ? "#c4b5fd" : undefined }}
        >
          {!highlight && <span className="text-text-primary group-hover:text-white">{title}</span>}
          {highlight && title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}50, transparent)`,
          zIndex: 1,
        }}
      />
    </div>
  );
}

export default function FeatureGrid() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const topRowRange = isMobile ? [-170, 40] : [-720, 170];
  const middleRowRange = isMobile ? [35, -185] : [130, -760];
  const bottomRowRange = isMobile ? [-135, 55] : [-560, 240];
  const topRowX = useTransform(scrollYProgress, [0, 1], topRowRange);
  const middleRowX = useTransform(scrollYProgress, [0, 1], middleRowRange);
  const bottomRowX = useTransform(scrollYProgress, [0, 1], bottomRowRange);

  const row1 = FEATURES.filter((_, index) => index % 3 === 0);
  const row2 = FEATURES.filter((_, index) => index % 3 === 1);
  const row3 = FEATURES.filter((_, index) => index % 3 === 2);
  const repeatedRow1 = [...row1, ...row1, ...row1];
  const repeatedRow2 = [...row2, ...row2, ...row2];
  const repeatedRow3 = [...row3, ...row3, ...row3];

  return (
    <section ref={sectionRef} id="features" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="mb-8 text-center sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#4d9fff", background: "rgba(77,159,255,0.1)", border: "1px solid rgba(77,159,255,0.2)" }}
          >
            Features
          </span>
          <h2 className="mb-3 text-3xl font-bold text-text-primary sm:text-5xl">
            One app. Everything you need.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-muted sm:text-lg">
            Tasks, KPIs, streaks, mood, hydration, meetings, and AI — all in one glassy window. Built for focus, not friction.
          </p>
        </motion.div>

        {/* Mobile cards: no clipping, every feature readable */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {FEATURES.map((feature) => (
            <FeatureCard key={`${feature.title}-mobile`} {...feature} />
          ))}
        </div>

        {/* Sliding rows */}
        <div
          className="relative left-1/2 hidden w-screen -translate-x-1/2 overflow-hidden py-3 sm:block sm:py-4"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
          }}
        >
          <div className="flex flex-col gap-3">
            <motion.div
              className="flex gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
              style={{ x: topRowX }}
            >
              {repeatedRow1.map((feature, index) => (
                <FeatureCard key={`${feature.title}-top-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
              style={{ x: middleRowX }}
            >
              {repeatedRow2.map((feature, index) => (
                <FeatureCard key={`${feature.title}-middle-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
              style={{ x: bottomRowX }}
            >
              {repeatedRow3.map((feature, index) => (
                <FeatureCard key={`${feature.title}-bottom-${index}`} {...feature} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
