"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Mini animated previews ───────────────────────────────────────────────────
function BloomFeaturePreview({ title, color }: { title: string; color: string }) {
  const c30 = `${color}4d`;
  const c60 = `${color}99`;

  if (title === "Smart Task Management") return (
    <div className="flex flex-col gap-1.5" style={{ width: 38 }}>
      {[1, 0.6, 0.35].map((op, i) => (
        <div key={i} className="flex items-center gap-1">
          <motion.div className="rounded-sm flex-shrink-0" style={{ width: 6, height: 6, background: op === 1 ? color : c30, border: `1px solid ${c60}` }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity }} />
          <motion.div className="rounded-full h-[2px]" style={{ background: c30, flex: 1 }}
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity }} />
        </div>
      ))}
    </div>
  );

  if (title === "Daily Milestone Tracker") return (
    <div className="relative flex items-center justify-center" style={{ width: 30, height: 30 }}>
      <svg viewBox="0 0 30 30" fill="none" style={{ width: 30, height: 30 }}>
        <circle cx="15" cy="15" r="12" stroke={c30} strokeWidth="2.5" />
        <motion.circle cx="15" cy="15" r="12" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="75.4" strokeDashoffset="75.4"
          animate={{ strokeDashoffset: [75.4, 18, 75.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "15px 15px", rotate: "-90deg" }}
        />
      </svg>
      <motion.span className="absolute text-[7px] font-bold" style={{ color }}
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}>75%</motion.span>
    </div>
  );

  if (title === "KPI Goals & PDF Reports") return (
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {[40, 70, 55, 90, 65].map((h, i) => (
        <motion.div key={i} className="w-[5px] rounded-sm" style={{ background: i === 3 ? color : c30, originY: 1, height: `${h}%` }}
          animate={{ scaleY: [1, 1.2, 0.9, 1.1, 1] }}
          transition={{ duration: 2.2, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  if (title === "Streak & Reward System") return (
    <motion.div style={{ color, fontSize: 20 }}
      animate={{ scale: [1, 1.25, 1], filter: [`drop-shadow(0 0 2px ${color}00)`, `drop-shadow(0 0 6px ${color})`, `drop-shadow(0 0 2px ${color}00)`] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>🔥</motion.div>
  );

  if (title === "Bloom & AI Assistant") return (
    <div className="flex flex-col gap-1" style={{ width: 38 }}>
      {[100, 70, 45].map((w, i) => (
        <motion.div key={i} className="rounded-full" style={{ height: 2.5, background: i === 0 ? color : c30, width: `${w}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} />
      ))}
    </div>
  );

  if (title === "Boards") return (
    <div className="grid grid-cols-2 gap-1" style={{ width: 28 }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="rounded-sm" style={{ height: 10, background: i < 2 ? color : c30 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }} />
      ))}
    </div>
  );

  if (title === "Teams" || title === "Unlimited Team Members") return (
    <div className="flex -space-x-1.5">
      {["#4d9fff","#a78bfa","#34d399"].map((c, i) => (
        <motion.div key={i} className="rounded-full border" style={{ width: 12, height: 12, background: `${c}33`, borderColor: c }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }} />
      ))}
    </div>
  );

  if (title === "Team Chat") return (
    <div className="flex flex-col gap-1.5">
      {[1, 0].map(align => (
        <motion.div key={align} className="rounded-full" style={{ height: 7, width: align ? 28 : 20, background: align ? color : c30, alignSelf: align ? "flex-start" : "flex-end" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, delay: align * 0.4, repeat: Infinity }} />
      ))}
    </div>
  );

  if (title === "Voice Messages") return (
    <div className="flex items-end gap-0.5" style={{ height: 22 }}>
      {[30, 60, 100, 70, 45, 80, 35].map((h, i) => (
        <motion.div key={i} className="w-[3px] rounded-full" style={{ background: color, height: `${h}%` }}
          animate={{ scaleY: [1, 1.4, 0.6, 1.2, 1] }}
          transition={{ duration: 1.2, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );

  if (title === "Mood Avatars") return (
    <motion.div style={{ fontSize: 20 }}
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>😊</motion.div>
  );

  if (title === "Cloud Data") return (
    <motion.div style={{ color, fontSize: 18 }}
      animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}>☁</motion.div>
  );

  if (title === "Security") return (
    <motion.div style={{ color, fontSize: 18 }}
      animate={{ scale: [1, 1.15, 1], filter: [`drop-shadow(0 0 0px ${color}00)`, `drop-shadow(0 0 5px ${color})`, `drop-shadow(0 0 0px ${color}00)`] }}
      transition={{ duration: 2, repeat: Infinity }}>🔒</motion.div>
  );

  if (title === "Quick Sticky Notes") return (
    <div className="flex flex-col gap-1" style={{ width: 30 }}>
      {[80, 60, 40].map((w, i) => (
        <motion.div key={i} className="rounded-sm" style={{ height: 3, width: `${w}%`, background: color, opacity: 0.6 + i * 0.15 }}
          animate={{ opacity: [0.4 + i*0.1, 0.9, 0.4 + i*0.1] }}
          transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity }} />
      ))}
    </div>
  );

  if (title === "Dark & Light Mode") return (
    <motion.div className="rounded-full" style={{ width: 28, height: 14, background: c30, border: `1px solid ${c60}`, position: "relative" }}>
      <motion.div className="rounded-full absolute top-0.5" style={{ width: 11, height: 11, background: color }}
        animate={{ x: [2, 14, 2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
    </motion.div>
  );

  if (title === "Notification Bell") return (
    <motion.div style={{ color, fontSize: 18 }}
      animate={{ rotate: [-12, 12, -8, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}>🔔</motion.div>
  );

  if (title === "AI Email & Messages" || title === "AI Meeting Notes to Tasks" || title === "AI Plan My Day") return (
    <div className="flex flex-col gap-1" style={{ width: 36 }}>
      {[100, 75, 50].map((w, i) => (
        <motion.div key={i} className="rounded-full" style={{ height: 2.5, background: i === 0 ? color : c30, width: `${w}%` }}
          animate={{ scaleX: [1, 0.6, 1] }}
          transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );

  if (title === "Reminders & Meetings") return (
    <motion.div style={{ color, fontSize: 17 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}>📅</motion.div>
  );

  if (title === "Health & Hydration") return (
    <div className="flex items-end gap-1">
      {[60, 80, 100, 70].map((h, i) => (
        <motion.div key={i} className="w-[5px] rounded-t-sm" style={{ background: color, opacity: 0.4 + i * 0.15, height: `${h}%` }}
          animate={{ scaleY: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );

  // fallback
  return (
    <motion.div className="h-2 w-2 rounded-full" style={{ background: color }}
      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity }} />
  );
}
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

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

function FeatureCard({
  title,
  description,
  accentColor,
  mockupType,
  highlight,
  compact = false,
}: {
  title: string;
  description: string;
  accentColor: string;
  mockupType?: string;
  highlight?: boolean;
  compact?: boolean;
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
      className={compact
        ? "theme-card group relative flex w-full shrink-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-[16px] p-3 pb-4 transition-all duration-300 ease-out"
        : "theme-card group relative flex h-[180px] w-[220px] shrink-0 cursor-pointer flex-col gap-2.5 overflow-hidden rounded-[20px] p-4 pb-5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.012] sm:h-[180px] sm:w-[280px]"
      }
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
          className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl transition-all duration-500 group-hover:-translate-y-0.5"
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
            className="relative h-4 w-4 text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
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
          className="text-sm font-semibold leading-tight transition-colors"
          style={{ color: highlight ? "#c4b5fd" : undefined }}
        >
          {!highlight && <span className="text-text-primary group-hover:text-white">{title}</span>}
          {highlight && title}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-text-muted transition-colors duration-500 group-hover:text-white/58 sm:line-clamp-none">{description}</p>
      </div>

      {/* Mini animated preview — bottom-right on hover */}
      <div
        className="absolute bottom-5 right-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <BloomFeaturePreview title={title} color={accentColor} />
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

function MobileFeatureSwiper() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const pages = chunkArray(FEATURES, 6);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const page = Math.round(el.scrollLeft / el.clientWidth);
      setActivePage(page);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sm:hidden">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {pages.map((pageFeatures, pageIndex) => (
          <div
            key={pageIndex}
            className="w-[calc(100vw-2rem)] shrink-0 snap-center mx-4 py-1"
          >
            <div className="grid grid-cols-2 gap-3">
              {pageFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} compact />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Page dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => {
              scrollRef.current?.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: "smooth" });
            }}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: activePage === i ? "1.5rem" : "0.375rem",
              background: activePage === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function FeatureGrid() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const topRowRange = [-1180, 340];
  const middleRowRange = [-260, -1000];
  const bottomRowRange = [-420, -1680];
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
            One app.<br />Everything you need.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-muted sm:text-lg">
            Tasks, KPIs, streaks, mood, hydration, meetings, and AI — all in one glassy window. Built for focus, not friction.
          </p>
        </motion.div>

        {/* ── Mobile: swipe carousel — 2 cards per row, 3 rows per page ── */}
        <MobileFeatureSwiper />

        {/* ── Desktop: sliding rows (unchanged) ── */}
        <div
          className="relative left-1/2 hidden w-screen -translate-x-1/2 overflow-hidden py-3 sm:block sm:py-4"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
          }}
        >
          <div className="flex flex-col gap-3">
            <motion.div
              className="flex transform-gpu gap-5 pl-[max(1.5rem,calc((100vw-72rem)/2))] will-change-transform"
              style={{ x: topRowX }}
            >
              {repeatedRow1.map((feature, index) => (
                <FeatureCard key={`${feature.title}-top-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex transform-gpu gap-5 pl-[max(1.5rem,calc((100vw-72rem)/2))] will-change-transform"
              style={{ x: middleRowX }}
            >
              {repeatedRow2.map((feature, index) => (
                <FeatureCard key={`${feature.title}-middle-${index}`} {...feature} />
              ))}
            </motion.div>

            <motion.div
              className="flex transform-gpu gap-5 pl-[max(1.5rem,calc((100vw-72rem)/2))] will-change-transform"
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
