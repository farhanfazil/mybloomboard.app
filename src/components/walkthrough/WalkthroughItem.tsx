"use client";

import { motion, useInView } from "framer-motion";
import { useRef, Fragment } from "react";
import Image from "next/image";
import { slideFromLeft, slideFromRight } from "@/lib/animations";

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
}

// Per-feature config: maxWidth + which frame/mockup to render
const IMAGE_CONFIG: Record<string, { maxWidth: string; frame: string }> = {
  "greeting-stats":    { maxWidth: "340px", frame: "html-stats"      },
  "milestone-tracker": { maxWidth: "560px", frame: "html-milestone"  },
  "add-event":         { maxWidth: "400px", frame: "html-calendar"   },
  "streak":            { maxWidth: "360px", frame: "html-streak"     },
  "manage-projects":   { maxWidth: "560px", frame: "contain"         },
  "daily-quote":       { maxWidth: "560px", frame: "html-quote"      },
  "ai-hub":            { maxWidth: "520px", frame: "html-ai-hub"    },
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
}: WalkthroughItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  const textVariant = isEven ? slideFromLeft : slideFromRight;
  const mockupVariant = isEven ? slideFromRight : slideFromLeft;

  const config = IMAGE_CONFIG[id] ?? { maxWidth: "520px", frame: "screenshot" };

  function renderVisual() {
    switch (config.frame) {
      case "html-stats":     return <GreetingStatsMockup     accentColor={accentColor} />;
      case "html-milestone": return <MilestoneProgressMockup accentColor={accentColor} />;
      case "html-calendar":  return <CalendarPickerMockup    accentColor={accentColor} />;
      case "html-streak":    return <StreakBadgeMockup        accentColor={accentColor} />;
      case "html-quote":     return <DailyQuoteMockup         accentColor={accentColor} />;
      case "html-ai-hub":    return <AIHubMockup              accentColor={accentColor} />;
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
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center py-20 relative"
    >
      {/* Separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" }}
      />

      {/* Text */}
      <motion.div
        className={`flex flex-col gap-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}
        variants={textVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            {label}
          </span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">{headline}</h3>
        <p className="text-base text-text-muted leading-relaxed">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="flex flex-col gap-2.5 mt-1">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: accentColor }} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Visual — wrapped in GlowWrapper for every feature */}
      <motion.div
        className={`flex justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}
        variants={mockupVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div style={{ width: "100%", maxWidth: config.maxWidth }}>
          <GlowWrapper accentColor={accentColor}>
            {renderVisual()}
          </GlowWrapper>
        </div>
      </motion.div>
    </div>
  );
}
