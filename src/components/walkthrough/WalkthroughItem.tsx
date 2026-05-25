"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface WalkthroughItemProps {
  id: string;
  label: string;
  headline: string;
  description: string;
  bullets?: string[];
  mockupType: string;
  screenshot?: string;
  accentColor: string;
  index: number;
  total: number;
}

// Per-feature config: maxWidth + which frame/mockup to render
const IMAGE_CONFIG: Record<string, { maxWidth: string; frame: string }> = {
  "greeting-stats":    { maxWidth: "340px", frame: "html-stats"      },
  "milestone-tracker": { maxWidth: "560px", frame: "html-milestone"  },
  "add-event":         { maxWidth: "400px", frame: "html-calendar"   },
  "streak":            { maxWidth: "360px", frame: "html-streak"     },
  "manage-projects":   { maxWidth: "560px", frame: "contain"         },
  "daily-quote":       { maxWidth: "560px", frame: "html-quote"      },
  "ai-hub":            { maxWidth: "520px", frame: "html-ai-hub"     },
  "bloom-ai":          { maxWidth: "400px", frame: "html-bloom-ai"   },
  "ai-all":            { maxWidth: "660px", frame: "html-ai-all"     },
};

// ─── Glow Wrapper — sits behind every visual ─────────────────────────────────
function GlowWrapper({
  accentColor,
  children,
}: {
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* Outer ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: "-60px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${accentColor}22 0%, ${accentColor}08 45%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Inner tight glow */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${accentColor}14 0%, transparent 60%)`,
          filter: "blur(18px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── macOS Window Frame ───────────────────────────────────────────────────────
function MacWindowFrame({
  src,
  alt,
  title,
  accentColor,
}: {
  src: string;
  alt: string;
  title?: string;
  accentColor: string;
}) {
  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1), 0 0 50px ${accentColor}20`,
      }}
    >
      <div
        style={{
          height: "36px",
          background: "rgba(22,32,48,0.99)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          gap: "7px",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57", flexShrink: 0 }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e", flexShrink: 0 }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840", flexShrink: 0 }} />
        {title && (
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "0 auto", letterSpacing: "0.5px", userSelect: "none" }}>
            {title}
          </span>
        )}
      </div>
      <Image src={src} alt={alt} width={800} height={600} className="w-full h-auto block" unoptimized />
    </div>
  );
}

// ─── Contain Frame ────────────────────────────────────────────────────────────
function ContainFrame({ src, alt, accentColor }: { src: string; alt: string; accentColor: string }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        background: "rgba(12,18,32,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "14px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), 0 0 50px ${accentColor}20`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={800}
        className="w-full h-auto block rounded-xl"
        style={{ objectFit: "contain" }}
        unoptimized
      />
    </div>
  );
}

// ─── Standard Screenshot Frame ────────────────────────────────────────────────
function ScreenshotFrame({ src, alt, accentColor }: { src: string; alt: string; accentColor: string }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07), 0 0 50px ${accentColor}20`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto rounded-2xl"
        style={{ display: "block" }}
        unoptimized
      />
    </div>
  );
}

// ─── HTML Mockup: Greeting Stats (Feature 01) ─────────────────────────────────
function GreetingStatsMockup({ accentColor }: { accentColor: string }) {
  const stats = [
    { value: "3", label: "ACTIVE",      color: "#4d9fff" },
    { value: "0", label: "DONE",        color: "#39FF14" },
    { value: "0", label: "IN PROGRESS", color: "#ff9f0a" },
    { value: "2", label: "OVERDUE",     color: "#ff453a" },
  ];
  return (
    <div
      style={{
        borderRadius: "24px",
        background: "rgba(8,13,25,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "26px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 50px ${accentColor}20`,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "2px" }}>12:55 AM</p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px" }}>Good morning,</p>
          <p style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, lineHeight: 1.15 }}>Farhan.</p>
        </div>
        <div
          style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "linear-gradient(135deg, #a78bfa 0%, #4d9fff 50%, #39FF14 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0,
          }}
        >
          👤
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "2px", marginBottom: "2px" }}>TUESDAY</p>
      <p style={{ color: "#ffffff", fontSize: "19px", fontWeight: 600, marginBottom: "22px" }}>May 19, 2026</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "2px" }}>OVERVIEW</span>
        <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px" }}>↺ RESET</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px", padding: "14px 16px",
              display: "flex", flexDirection: "column", gap: "6px", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "10px", right: "10px", width: "7px", height: "7px", borderRadius: "50%", background: s.color, opacity: 0.7 }} />
            <span style={{ color: s.color, fontSize: "28px", fontWeight: 700, lineHeight: 1 }}>{s.value}</span>
            <span style={{ color: "rgba(255,255,255,0.32)", fontSize: "10px", letterSpacing: "1px" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HTML Mockup: Milestone Timeline (Feature 04) ─────────────────────────────
function MilestoneProgressMockup({ accentColor }: { accentColor: string }) {
  const tasks = ["Social Media Ca...", "Google Marketing", "Day & Day Tasks"];
  return (
    <div
      style={{
        borderRadius: "20px",
        background: "rgba(8,13,25,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "24px 28px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 50px ${accentColor}20`,
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px" }}>
            TODAY&apos;S PROGRESS
          </p>
          <p style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700 }}>3 Milestones Today</p>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ color: accentColor, fontSize: "38px", fontWeight: 700, lineHeight: 1 }}>3</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>/ 3 tasks</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "6px", borderRadius: "3px",
          background: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`,
          marginBottom: "28px",
          boxShadow: `0 0 12px ${accentColor}60`,
        }}
      />

      {/* Timeline nodes */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", padding: "0 4px" }}>
        {tasks.map((task, i) => (
          <Fragment key={task}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  border: `2px solid ${accentColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: accentColor, fontSize: "18px", fontWeight: 700,
                  background: `${accentColor}10`,
                  boxShadow: `0 0 16px ${accentColor}40`,
                }}
              >
                ✓
              </div>
              <span
                style={{
                  color: accentColor, fontSize: "11px", textAlign: "center",
                  maxWidth: "80px", lineHeight: 1.3,
                }}
              >
                {task}
              </span>
            </div>
            {i < tasks.length - 1 && (
              <div
                style={{
                  flex: 1, height: "2px",
                  background: accentColor,
                  marginTop: "21px",
                  boxShadow: `0 0 8px ${accentColor}50`,
                  opacity: 0.7,
                }}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Completion message */}
      <div style={{ textAlign: "center", paddingTop: "4px" }}>
        <span style={{ color: accentColor, fontSize: "14px", fontWeight: 600 }}>
          🎉 All done for today — great work
        </span>
      </div>
    </div>
  );
}

// ─── HTML Mockup: Calendar Date Picker (Feature 07) ───────────────────────────
function CalendarPickerMockup({ accentColor }: { accentColor: string }) {
  const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  // May 2026: starts on Friday (index 5)
  const weeks = [
    [{ n: 26, dim: true }, { n: 27, dim: true }, { n: 28, dim: true }, { n: 29, dim: true }, { n: 30, dim: true }, { n: 1 }, { n: 2 }],
    [{ n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 9 }],
    [{ n: 10 }, { n: 11 }, { n: 12 }, { n: 13 }, { n: 14 }, { n: 15 }, { n: 16 }],
    [{ n: 17 }, { n: 18 }, { n: 19, today: true }, { n: 20 }, { n: 21 }, { n: 22 }, { n: 23 }],
    [{ n: 24 }, { n: 25 }, { n: 26 }, { n: 27 }, { n: 28 }, { n: 29 }, { n: 30 }],
    [{ n: 31 }, { n: 1, dim: true }, { n: 2, dim: true }, { n: 3, dim: true }, { n: 4, dim: true }, { n: 5, dim: true }, { n: 6, dim: true }],
  ] as Array<Array<{ n: number; dim?: boolean; today?: boolean }>>;

  const quickBtns = ["Today", "Tomorrow", "Next Week", "Next Month"];

  return (
    <div
      style={{
        borderRadius: "22px",
        background: "rgba(10,15,30,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "20px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 50px ${accentColor}20`,
        width: "100%",
      }}
    >
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div
          style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer",
          }}
        >
          ‹
        </div>
        <span style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600 }}>May 2026</span>
        <div
          style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer",
          }}
        >
          ›
        </div>
      </div>

      {/* Quick select */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", marginBottom: "16px" }}>
        {quickBtns.map((btn) => (
          <div
            key={btn}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", padding: "8px 4px",
              color: "rgba(255,255,255,0.55)", fontSize: "11px", textAlign: "center", cursor: "pointer",
              lineHeight: 1.3,
            }}
          >
            {btn}
          </div>
        ))}
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "6px" }}>
        {dayLabels.map((d) => (
          <div key={d} style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", textAlign: "center", fontWeight: 600, letterSpacing: "0.5px", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "16px" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {week.map((day, di) => (
              <div
                key={di}
                style={{
                  height: "34px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: day.today ? 600 : 400,
                  color: day.today ? accentColor : day.dim ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.7)",
                  background: day.today ? `${accentColor}10` : "transparent",
                  border: day.today ? `1.5px solid ${accentColor}60` : "1.5px solid transparent",
                  cursor: "pointer",
                }}
              >
                {day.n}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <div
        style={{
          height: "44px", borderRadius: "12px",
          background: "linear-gradient(to right, #3a7bd5, #4d9fff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(77,159,255,0.35)",
        }}
      >
        Confirm Date
      </div>
    </div>
  );
}

// ─── HTML Mockup: Daily Quote (Feature 11) ────────────────────────────────────
function DailyQuoteMockup({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(12,28,48,0.98) 0%, rgba(8,18,36,0.98) 100%)",
        border: "1px solid rgba(77,159,255,0.12)",
        padding: "26px 30px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(77,159,255,0.08), 0 0 50px ${accentColor}20`,
        width: "100%",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span
          style={{
            color: "#4d9fff", fontSize: "11px", fontWeight: 700,
            letterSpacing: "3px", textTransform: "uppercase",
          }}
        >
          ✦ DAILY REMINDER
        </span>
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "24px", fontFamily: "Georgia, serif", lineHeight: 1 }}>&ldquo;</span>
      </div>

      {/* Quote */}
      <p
        style={{
          color: "rgba(255,255,255,0.82)", fontSize: "15px", fontStyle: "italic",
          lineHeight: 1.7, marginBottom: "14px",
        }}
      >
        &ldquo;It does not matter how slowly you go as long as you do not stop.&rdquo;
      </p>

      {/* Attribution */}
      <p style={{ color: "#4d9fff", fontSize: "13px", marginBottom: "20px", opacity: 0.85 }}>— Confucius</p>

      {/* Refresh */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px", padding: "7px 14px",
            color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
          }}
        >
          <span style={{ fontSize: "11px" }}>↺</span> Refresh
        </div>
      </div>
    </div>
  );
}

// ─── HTML Mockup: Streak Badges (Feature 08) ──────────────────────────────────
function StreakBadgeMockup({ accentColor }: { accentColor: string }) {
  const badges = [
    { emoji: "🥉", label: "3 days",   earned: true  },
    { emoji: "🥈", label: "7 days",   earned: true  },
    { emoji: "🥇", label: "14 days",  earned: false },
    { emoji: "🏆", label: "30 days",  earned: false },
    { emoji: "⭐",  label: "60 days",  earned: false },
    { emoji: "👑",  label: "100 days", earned: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      {/* Streak counter */}
      <div
        style={{
          borderRadius: "20px", background: "rgba(8,13,25,0.97)",
          border: "1px solid rgba(255,159,10,0.2)", padding: "22px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.55), 0 0 50px ${accentColor}18`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px" }}>CURRENT STREAK</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ color: "#ff9f0a", fontSize: "42px", fontWeight: 700, lineHeight: 1 }}>7</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>days 🔥</span>
            </div>
          </div>
          <div
            style={{
              width: "54px", height: "54px", borderRadius: "16px",
              background: "rgba(255,159,10,0.12)", border: "1px solid rgba(255,159,10,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
            }}
          >🔥</div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "8px" }}>
          Next badge in <span style={{ color: "#febc2e" }}>7 more days</span> — keep going!
        </p>
        <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "50%", borderRadius: "3px", background: "linear-gradient(to right, #ff9f0a, #febc2e)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>🥈 7 days</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>🥇 14 days</span>
        </div>
      </div>

      {/* Badge milestones */}
      <div
        style={{
          borderRadius: "20px", background: "rgba(8,13,25,0.97)",
          border: "1px solid rgba(255,255,255,0.07)", padding: "18px 22px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "2px", marginBottom: "14px" }}>MILESTONE BADGES</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
          {badges.map((b) => (
            <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: b.earned ? 1 : 0.35 }}>
              <div
                style={{
                  width: "38px", height: "38px", borderRadius: "12px",
                  background: b.earned ? "rgba(255,159,10,0.15)" : "rgba(255,255,255,0.04)",
                  border: b.earned ? "1px solid rgba(255,159,10,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                }}
              >{b.emoji}</div>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", textAlign: "center", lineHeight: 1.2 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HTML Mockup: Combined AI (Bloom + Hub) ───────────────────────────────────
function CombinedAIMockup({ accentColor }: { accentColor: string }) {
  const tools = [
    { icon: "✉️", iconBg: "rgba(59,130,246,0.25)", title: "Email & Messages", desc: "Fix, rewrite or generate emails and messages." },
    { icon: "📋", iconBg: "rgba(34,197,94,0.22)",  title: "Meeting Notes → Tasks", desc: "Paste notes, AI extracts every action item." },
    { icon: "🗓️", iconBg: "rgba(109,40,217,0.28)", title: "Plan My Day", desc: "Smart time-blocked schedule from your tasks." },
    { icon: "🛟", iconBg: "rgba(139,92,246,0.25)", title: "I am Stuck", desc: "Personalised plan to break through any block." },
  ];

  return (
    <div style={{
      borderRadius: "20px",
      background: "rgba(10,13,24,0.98)",
      border: "1px solid rgba(255,255,255,0.09)",
      overflow: "hidden",
      boxShadow: `0 30px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.05), 0 0 70px ${accentColor}18`,
      width: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#4f1fb5,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", boxShadow: "0 0 10px rgba(109,40,217,0.5)" }}>🦋</div>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Bloom</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", margin: "0 4px" }}>·</span>
        <span style={{ fontSize: "13px" }}>✨</span>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>AI Assistant</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 6px #39FF1470" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>Always ready</span>
        </div>
      </div>

      {/* ── Split body ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>

        {/* LEFT — Bloom chat ──────────────────────────────────────── */}
        <div style={{ padding: "14px 16px 16px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "10px" }}>YOUR AI COWORKER</div>

          {/* Chat bubble */}
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "11px 13px", marginBottom: "12px" }}>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "11px", lineHeight: 1.6, margin: 0 }}>
              Good evening! 🌱 I&apos;m Bloom, your AI coworker. I can create tasks, schedule meetings, and help you plan your day — just ask.
            </p>
          </div>

          {/* Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {[
              { l: "📅 My day",     c: "#a0c8ff", bg: "rgba(77,159,255,0.12)",  b: "rgba(77,159,255,0.25)"  },
              { l: "⚠ Overdue",    c: "#ffa0a0", bg: "rgba(255,69,58,0.10)",   b: "rgba(255,69,58,0.22)"   },
              { l: "🎯 Prioritize", c: "#ffd080", bg: "rgba(255,159,10,0.10)",  b: "rgba(255,159,10,0.22)"  },
              { l: "+ Quick task",  c: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.05)", b: "rgba(255,255,255,0.12)" },
            ].map((c) => (
              <div key={c.l} style={{ background: c.bg, border: `1px solid ${c.b}`, borderRadius: "20px", padding: "4px 10px", color: c.c, fontSize: "10px", fontWeight: 500 }}>{c.l}</div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px 11px", color: "rgba(255,255,255,0.28)", fontSize: "10px" }}>
              Ask Bloom anything...
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#4f46e5,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>➤</div>
          </div>
        </div>

        {/* RIGHT — AI Hub tools ────────────────────────────────────── */}
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "10px" }}>AI ASSISTANT HUB</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
            {tools.map((t) => (
              <div key={t.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "11px", padding: "10px 10px 9px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginBottom: "7px" }}>{t.icon}</div>
                <div style={{ color: "#fff", fontSize: "10px", fontWeight: 700, marginBottom: "4px", lineHeight: 1.3 }}>{t.title}</div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", lineHeight: 1.4 }}>{t.desc}</div>
                <div style={{ color: accentColor, fontSize: "9px", marginTop: "7px", opacity: 0.8 }}>Open →</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={{ padding: "9px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "10px" }}>⚡</span>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "9.5px" }}>Powered by Claude AI · Runs locally · No API key needed</span>
      </div>
    </div>
  );
}

// ─── HTML Mockup: Bloom AI Coworker ──────────────────────────────────────────
function BloomAIMockup({ accentColor }: { accentColor: string }) {
  const chips = [
    { label: "📅 My day",     bg: "rgba(77,159,255,0.12)",    border: "rgba(77,159,255,0.25)",    color: "#a0c8ff" },
    { label: "⚠ Overdue",    bg: "rgba(255,69,58,0.10)",     border: "rgba(255,69,58,0.22)",     color: "#ffa0a0" },
    { label: "🎯 Prioritize", bg: "rgba(255,159,10,0.10)",    border: "rgba(255,159,10,0.22)",    color: "#ffd080" },
    { label: "+ Quick task",  bg: "rgba(255,255,255,0.06)",   border: "rgba(255,255,255,0.12)",   color: "rgba(255,255,255,0.6)" },
  ];

  return (
    <div
      style={{
        borderRadius: "24px",
        background: "rgba(10,13,24,0.98)",
        border: "1px solid rgba(255,255,255,0.09)",
        overflow: "hidden",
        boxShadow: `0 30px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${accentColor}18`,
        width: "100%",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Butterfly avatar */}
        <div
          style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "linear-gradient(135deg,#4f1fb5,#6d28d9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", flexShrink: 0,
            boxShadow: "0 0 20px rgba(109,40,217,0.55), 0 0 40px rgba(109,40,217,0.2)",
          }}
        >
          🦋
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700, lineHeight: 1.2 }}>Bloom</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 6px #39FF1480" }} />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>Your AI Coworker · Always ready</span>
          </div>
        </div>
      </div>

      {/* ── Chat message ─────────────────────────────────────────────── */}
      <div style={{ padding: "20px 22px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px", padding: "14px 16px", flex: 1,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "14px", lineHeight: 1.65, margin: 0 }}>
            Good evening, Farhan! 🌱 I&apos;m Bloom, your AI coworker. I can create tasks, schedule meetings, manage your boards, and help you plan your day — just ask, or use voice input. What can I help with?
          </p>
        </div>
        <div
          style={{
            width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg,rgba(79,70,229,0.4),rgba(109,40,217,0.4))",
            border: "1px solid rgba(167,139,250,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}
        >
          🌱
        </div>
      </div>

      {/* ── Quick action chips ───────────────────────────────────────── */}
      <div style={{ padding: "0 22px 18px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {chips.map((c) => (
          <div
            key={c.label}
            style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: "20px", padding: "7px 14px",
              color: c.color, fontSize: "12.5px", fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* ── Input bar ────────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px 18px", display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px", padding: "12px 16px",
            color: "rgba(255,255,255,0.3)", fontSize: "13px",
          }}
        >
          Ask Bloom to create tasks, schedule meetings, plan your day...
        </div>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
          🎙️
        </div>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg,#4f46e5,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, boxShadow: "0 0 14px rgba(79,70,229,0.5)" }}>
          ➤
        </div>
      </div>
    </div>
  );
}

// ─── HTML Mockup: AI Assistant Hub ───────────────────────────────────────────
function AIHubMockup({ accentColor }: { accentColor: string }) {
  const tools = [
    {
      icon: "✉️",
      bg: "rgba(49,90,173,0.35)",
      iconBg: "rgba(59,130,246,0.30)",
      title: "Email & Messages",
      desc: "Fix, rewrite, generate professional emails and casual messages for WhatsApp & Slack.",
    },
    {
      icon: "📋",
      bg: "rgba(22,80,50,0.35)",
      iconBg: "rgba(34,197,94,0.25)",
      title: "Meeting Notes → Tasks",
      desc: "Paste meeting notes — AI extracts all action items and adds them to your task list.",
    },
    {
      icon: "🗓️",
      bg: "rgba(50,30,80,0.35)",
      iconBg: "rgba(109,40,217,0.30)",
      title: "Plan My Day",
      desc: "AI reads your tasks and builds a smart time-blocked schedule for today.",
    },
    {
      icon: "🛟",
      bg: "rgba(60,30,80,0.35)",
      iconBg: "rgba(139,92,246,0.30)",
      title: "I am Stuck",
      desc: "Stuck on a task? Get a personalised plan to break through the block.",
    },
  ];

  return (
    <div
      style={{
        borderRadius: "20px",
        background: "rgba(10, 13, 24, 0.98)",
        border: "1px solid rgba(255,255,255,0.10)",
        overflow: "hidden",
        boxShadow: `0 30px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px ${accentColor}18`,
        width: "100%",
      }}
    >
      {/* ── Title bar ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>✨</span>
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>AI Assistant</span>
        </div>
        <div
          style={{
            width: "30px", height: "30px", borderRadius: "9px",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.45)", fontSize: "14px", cursor: "pointer",
          }}
        >
          ✕
        </div>
      </div>

      {/* ── Subtitle ─────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 22px 6px" }}>
        <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "13px", lineHeight: 1.5 }}>
          Choose an AI tool to get started. All powered by Claude AI.
        </p>
      </div>

      {/* ── 2×2 tool grid ────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px", padding: "14px 22px 22px",
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool.title}
            style={{
              background: tool.bg,
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "14px", padding: "16px",
              display: "flex", flexDirection: "column", gap: "10px",
              cursor: "pointer",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: tool.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}
            >
              {tool.icon}
            </div>
            {/* Text */}
            <div>
              <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, marginBottom: "5px" }}>
                {tool.title}
              </p>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "11px", lineHeight: 1.55 }}>
                {tool.desc}
              </p>
            </div>
            {/* Open link */}
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: "11px", marginTop: "auto" }}>
              Open →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WalkthroughItem({
  id,
  label,
  headline,
  description,
  bullets,
  screenshot,
  accentColor,
  index,
  total,
}: WalkthroughItemProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isEven = index % 2 === 0;
  const config = IMAGE_CONFIG[id] ?? { maxWidth: "520px", frame: "screenshot" };
  const cardOffset = Math.min(index * 10, 80);
  const targetScale = isMobile ? 1 : Math.max(0.86, 1 - (total - 1 - index) * 0.018);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  function renderVisual() {
    switch (config.frame) {
      case "html-stats":     return <GreetingStatsMockup     accentColor={accentColor} />;
      case "html-milestone": return <MilestoneProgressMockup accentColor={accentColor} />;
      case "html-calendar":  return <CalendarPickerMockup    accentColor={accentColor} />;
      case "html-streak":    return <StreakBadgeMockup        accentColor={accentColor} />;
      case "html-quote":     return <DailyQuoteMockup         accentColor={accentColor} />;
      case "html-ai-hub":    return <AIHubMockup              accentColor={accentColor} />;
      case "html-bloom-ai":  return <BloomAIMockup            accentColor={accentColor} />;
      case "html-ai-all":    return <CombinedAIMockup         accentColor={accentColor} />;
      case "window":
        return screenshot ? (
          <MacWindowFrame src={screenshot} alt={headline} title="Bloombooard" accentColor={accentColor} />
        ) : null;
      case "contain":
        return screenshot ? <ContainFrame src={screenshot} alt={headline} accentColor={accentColor} /> : null;
      default:
        return screenshot ? <ScreenshotFrame src={screenshot} alt={headline} accentColor={accentColor} /> : null;
    }
  }

  return (
    <div
      ref={container}
      className="relative mb-8 min-h-0 sm:mb-0 sm:h-[88vh] sm:min-h-[760px]"
    >
      <motion.article
        className="grid min-h-0 grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-[#080d19]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur sm:sticky sm:min-h-[620px] sm:gap-10 sm:rounded-[34px] sm:p-6 md:p-8 lg:grid-cols-2 lg:gap-14 xl:gap-20"
        style={{
          scale,
          top: `calc(5rem + ${cardOffset}px)`,
          zIndex: index + 1,
          boxShadow: `0 35px 110px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04), 0 0 70px ${accentColor}12`,
        }}
      >
        {/* Text */}
        <div
          className={`flex flex-col gap-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}
        >
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
            >
              {label}
            </span>
          </div>
          <h3 className="text-2xl font-bold leading-tight text-text-primary sm:text-4xl">{headline}</h3>
          <p className="text-sm leading-relaxed text-text-muted sm:text-base">{description}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-1 flex flex-col gap-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accentColor }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual */}
        <div
          className={`flex justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}
        >
          <div style={{ width: "100%", maxWidth: config.maxWidth }}>
            <GlowWrapper accentColor={accentColor}>
              {renderVisual()}
            </GlowWrapper>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
