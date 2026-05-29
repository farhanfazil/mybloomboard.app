"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  CalendarClock,
  CalendarDays,
  CheckSquare2,
  ClipboardList,
  Cloud,
  Droplets,
  FileText,
  Flame,
  Mail,
  MessageCircle,
  Mic,
  MoonStar,
  Pin,
  ShieldCheck,
  Smile,
  Sparkles,
  Target,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "Smart Task Management": CheckSquare2,
  "Daily Milestone Tracker": Target,
  "KPI Goals & PDF Reports": BarChart3,
  "Streak & Reward System": Flame,
  "Bloom & AI Assistant": Bot,
  Boards: ClipboardList,
  Teams: Users,
  "Team Chat": MessageCircle,
  "Voice Messages": Mic,
  "Mood Avatars": Smile,
  "Cloud Data": Cloud,
  Security: ShieldCheck,
  "Quick Sticky Notes": Pin,
  "Unlimited Team Members": UserPlus,
  "Dark & Light Mode": MoonStar,
  "Notification Bell": Bell,
  "AI Email & Messages": Mail,
  "AI Meeting Notes to Tasks": FileText,
  "AI Plan My Day": CalendarClock,
  "Reminders & Meetings": CalendarDays,
  "Health & Hydration": Droplets,
};

function FeatureCard({
  title,
  description,
  accentColor,
  mockupType,
  highlight,
}: {
  title: string;
  description: string;
  accentColor: string;
  mockupType?: string;
  highlight?: boolean;
}) {
  const Icon = FEATURE_ICONS[title] ?? Sparkles;
  const glowColor = `${accentColor}24`;
  const softGlowColor = `${accentColor}12`;
  const isAIFeature = Boolean(
    highlight ||
      mockupType?.startsWith("ai") ||
      /\bai\b/i.test(title) ||
      title.toLowerCase().includes("bloom")
  );

  return (
    <div
      className="group relative flex min-h-[230px] w-full shrink-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-[26px] p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.012] sm:h-[230px] sm:w-[360px]"
      style={{
        background:           highlight
          ? `linear-gradient(145deg, rgba(16,13,24,0.96) 0%, rgba(9,9,12,0.9) 64%), radial-gradient(circle at 82% 12%, ${glowColor}, transparent 38%)`
          : `linear-gradient(145deg, rgba(12,12,14,0.94) 0%, rgba(6,6,8,0.86) 72%), radial-gradient(circle at 86% 10%, ${softGlowColor}, transparent 40%)`,
        border:               highlight
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.11)",
        borderTop:            highlight
          ? "1px solid rgba(255,255,255,0.28)"
          : "1px solid rgba(255,255,255,0.2)",
        boxShadow:            "none",
        contain:              "layout paint style",
      }}
    >
      {/* Subtle glass shine */}
      <div
        className="pointer-events-none absolute inset-px rounded-[25px] opacity-80"
        style={{
          background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.035) 100%)",
          zIndex: 0,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 22% 12%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 82% 78%, ${glowColor}, transparent 42%)`,
          zIndex: 0,
        }}
      />

      <div
        className="pointer-events-none absolute left-6 right-6 top-0 h-px opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}80, rgba(255,255,255,0.45), transparent)` }}
      />

      {/* Icon row + AI badge */}
      <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
        <div
          className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 group-hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035)), radial-gradient(circle at 50% 0%, ${glowColor}, transparent 62%)`,
            border:     highlight ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.15)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 0 ${accentColor}00`,
          }}
        >
          <span
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 68%)` }}
          />
          <Icon
            aria-hidden="true"
            className="relative h-5 w-5 text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
            strokeWidth={1.9}
          />
        </div>

        {isAIFeature && (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
              color: "#fff",
              boxShadow: "0 10px 24px rgba(109,40,217,0.35)",
            }}
          >
            AI
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative flex flex-col gap-2.5" style={{ zIndex: 1 }}>
        <h3
          className="text-base font-semibold leading-tight transition-colors"
          style={{ color: highlight ? "#c4b5fd" : undefined }}
        >
          {!highlight && <span className="text-text-primary group-hover:text-white">{title}</span>}
          {highlight && title}
        </h3>
        <p className="text-sm leading-relaxed text-text-muted transition-colors duration-500 group-hover:text-white/58">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-7 right-7 h-px opacity-0 transition-opacity duration-500 rounded-full group-hover:opacity-100"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
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

  const topRowRange = isMobile ? [-220, 60] : [-1180, 340];
  const middleRowRange = isMobile ? [-90, -262] : [-260, -1000];
  const bottomRowRange = isMobile ? [-120, -340] : [-420, -1680];
  const springConfig = { stiffness: 90, damping: 28, mass: 0.7 };
  const topRowX = useSpring(useTransform(scrollYProgress, [0, 1], topRowRange), springConfig);
  const middleRowX = useSpring(useTransform(scrollYProgress, [0, 1], middleRowRange), springConfig);
  const bottomRowX = useSpring(useTransform(scrollYProgress, [0, 1], bottomRowRange), springConfig);

  const row1 = FEATURES.filter((_, index) => index % 3 === 0);
  const row2 = FEATURES.filter((_, index) => index % 3 === 1);
  const row3 = FEATURES.filter((_, index) => index % 3 === 2);
  const repeatedRow1 = Array.from({ length: 2 }, () => row1).flat();
  const repeatedRow2 = Array.from({ length: 2 }, () => row2).flat();
  const repeatedRow3 = Array.from({ length: 2 }, () => row3).flat();

  return (
    <section ref={sectionRef} id="features" className="relative overflow-hidden border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-24">
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
              className="flex transform-gpu gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
              style={{ x: topRowX }}
            >
              {repeatedRow1.map((feature, index) => (
                <FeatureCard key={`${feature.title}-top-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex transform-gpu gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
              style={{ x: middleRowX }}
            >
              {repeatedRow2.map((feature, index) => (
                <FeatureCard key={`${feature.title}-middle-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex transform-gpu gap-5 pl-[max(1rem,calc((100vw-72rem)/2))] will-change-transform sm:pl-[max(1.5rem,calc((100vw-72rem)/2))]"
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
