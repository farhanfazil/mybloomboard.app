"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";

// ─── Inner-card spotlight wrapper ─────────────────────────────────────────────
// Wraps any card div with the Apple Intelligence cursor-following border glow.
// Hover-only: invisible until pointer enters, fades out on leave.
function SC({
  children,
  style,
  className,
  r  = "11px",  // border-radius — must match the card
  sp = 100,     // spotlight radius in px
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  r?: string;
  sp?: number;
}) {
  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       sp,
    borderWidth:  1,
    borderRadius: r,
    brightness:   2.6,
    // Apple Intelligence palette — defaults from hook
  });

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      style={{ position: "relative", ...style }}
      className={className}
    >
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />
      {children}
    </div>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const Tag = ({ label, color, bg }: { label: string; color: string; bg: string }) => (
  <span
    style={{
      fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "20px",
      color, background: bg, border: `1px solid ${color}30`, whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const stats = [
    { v: "3", l: "ACTIVE",      c: "#4d9fff" },
    { v: "1", l: "DONE",        c: "#39FF14" },
    { v: "1", l: "IN PROGRESS", c: "#ff9f0a" },
    { v: "1", l: "OVERDUE",     c: "#ff453a" },
  ];

  const events = [
    { icon: "📅", title: "Marketing Team...", sub: "May 19 · Today · 09:00", dot: "#4d9fff" },
    { icon: "🌴", title: "Annual leave",       sub: "May 27 – May 31 · in 8d",  dot: "#a78bfa" },
    { icon: "⏰", title: "Follow up with S...", sub: "Every 2 hours",            dot: "#ff9f0a", urgent: true },
  ];

  return (
    <div
      style={{
        width: "210px", flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 12px",
        display: "flex", flexDirection: "column", gap: "14px",
        overflowY: "hidden",
      }}
    >
      {/* OVERVIEW */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "2px" }}>OVERVIEW</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>↺ RESET</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
          {stats.map((s) => (
            <SC
              key={s.l}
              r="9px" sp={80}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "9px", padding: "8px 10px",
              }}
            >
              <div style={{ color: s.c, fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>{s.v}</div>
              <div style={{ color: "rgba(255,255,255,0.28)", fontSize: "8px", letterSpacing: "0.8px", marginTop: "3px" }}>{s.l}</div>
            </SC>
          ))}
        </div>
      </div>

      {/* AI EMAIL & MESSAGES */}
      <SC r="11px" sp={110}
        style={{
          background: "linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(79,70,229,0.12) 100%)",
          border: "1px solid rgba(167,139,250,0.25)",
          borderRadius: "11px",
          padding: "9px 12px",
          display: "flex",
          alignItems: "center",
          gap: "9px",
        }}
      >
        <span style={{ fontSize: "14px" }}>✨</span>
        <span style={{ flex: 1, color: "#c4b5fd", fontSize: "10px", fontWeight: 600, lineHeight: 1.3 }}>
          AI Assistant
        </span>
        <span
          style={{
            background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
            borderRadius: "20px",
            padding: "2px 7px",
            color: "#fff",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            boxShadow: "0 0 8px rgba(109,40,217,0.5)",
            flexShrink: 0,
          }}
        >
          AI
        </span>
      </SC>

      {/* UPCOMING */}
      <div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "2px", display: "block", marginBottom: "7px" }}>UPCOMING</span>
        <SC r="11px" sp={110}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "11px", padding: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ color: "#fff", fontSize: "10px", fontWeight: 600 }}>Reminders &amp; Meetings</span>
            <div style={{ background: "rgba(77,159,255,0.15)", border: "1px solid rgba(77,159,255,0.3)", borderRadius: "6px", padding: "2px 6px", color: "#4d9fff", fontSize: "9px" }}>
              + Add
            </div>
          </div>
          {events.map((ev) => (
            <SC
              key={ev.title}
              r="8px" sp={90}
              style={{
                background: ev.urgent ? "rgba(255,159,10,0.07)" : "rgba(255,255,255,0.03)",
                border: ev.urgent ? "1px solid rgba(255,159,10,0.2)" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px", padding: "6px 8px", marginBottom: "4px",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ev.dot, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: "9.5px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ev.icon} {ev.title}
                </div>
                <div style={{ color: ev.urgent ? "#ff9f0a" : "rgba(255,255,255,0.35)", fontSize: "8.5px" }}>{ev.sub}</div>
              </div>
            </SC>
          ))}
        </SC>
      </div>

      {/* HEALTH */}
      <div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "2px", display: "block", marginBottom: "7px" }}>HEALTH</span>
        <SC r="11px" sp={100}
          style={{
            background: "rgba(77,159,255,0.07)", border: "1px solid rgba(77,159,255,0.18)",
            borderRadius: "11px", padding: "9px 10px",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>💧</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#4d9fff", fontSize: "9.5px", fontWeight: 600 }}>Stay Hydrated</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "8.5px" }}>Drink some water now!</div>
          </div>
          <span style={{ color: "#4d9fff", fontSize: "8.5px", fontWeight: 600 }}>Snooze</span>
        </SC>
      </div>

      {/* STREAK */}
      <div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "2px", display: "block", marginBottom: "7px" }}>STREAK</span>
        <SC r="11px" sp={100}
          style={{
            background: "rgba(255,159,10,0.07)", border: "1px solid rgba(255,159,10,0.18)",
            borderRadius: "11px", padding: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
            <span style={{ fontSize: "14px" }}>🔥</span>
            <span style={{ color: "#ff9f0a", fontSize: "13px", fontWeight: 700 }}>1</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px" }}>day streak</span>
          </div>
          <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", marginBottom: "5px" }}>
            <div style={{ width: "33%", height: "100%", borderRadius: "2px", background: "#ff9f0a" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px", marginBottom: "8px" }}>2 days to 🥉 3-day badge</div>
          <div
            style={{
              background: "rgba(255,159,10,0.12)", border: "1px solid rgba(255,159,10,0.25)",
              borderRadius: "7px", padding: "4px 8px", textAlign: "center",
              color: "#ff9f0a", fontSize: "8.5px", fontWeight: 600,
            }}
          >
            ↑ Milestones
          </div>
        </SC>
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function MainContent() {
  return (
    <div
      style={{
        flex: 1, padding: "14px 16px",
        display: "flex", flexDirection: "column", gap: "12px",
        overflowY: "hidden", minWidth: 0,
      }}
    >
      {/* Quote card */}
      <SC r="13px" sp={160}
        style={{
          background: "linear-gradient(135deg, rgba(12,28,48,0.95) 0%, rgba(8,18,36,0.95) 100%)",
          border: "1px solid rgba(77,159,255,0.12)",
          borderRadius: "13px", padding: "12px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ color: "#4d9fff", fontSize: "8.5px", fontWeight: 700, letterSpacing: "2px" }}>✦ DAILY REMINDER</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "16px", fontFamily: "Georgia, serif" }}>&ldquo;</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px", fontStyle: "italic", lineHeight: 1.6, marginBottom: "5px" }}>
          &ldquo;Great things never come from comfort zones.&rdquo;
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4d9fff", fontSize: "9.5px", opacity: 0.8 }}>— Unknown</span>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "6px", padding: "3px 8px", color: "rgba(255,255,255,0.35)", fontSize: "8.5px" }}>
            ↺ Refresh
          </div>
        </div>
      </SC>

      {/* Milestone tracker */}
      <SC r="13px" sp={200}
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "13px", padding: "12px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px", letterSpacing: "2px", marginBottom: "3px" }}>TODAY&apos;S PROGRESS</div>
            <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>3 Milestones Today</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
            <span style={{ color: "#39FF14", fontSize: "22px", fontWeight: 700, lineHeight: 1 }}>1</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>/ 3 tasks</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", marginBottom: "14px", overflow: "hidden" }}>
          <div style={{ width: "33%", height: "100%", background: "#39FF14", borderRadius: "2px", boxShadow: "0 0 8px #39FF1460" }} />
        </div>
        {/* Nodes */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0 6px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #39FF14", background: "#39FF1410", display: "flex", alignItems: "center", justifyContent: "center", color: "#39FF14", fontSize: "13px", boxShadow: "0 0 10px #39FF1440" }}>✓</div>
            <span style={{ color: "#39FF14", fontSize: "8.5px", textAlign: "center", maxWidth: "70px" }}>Social Media Ca...</span>
          </div>
          <div style={{ flex: 1, height: "2px", background: "#39FF14", marginTop: "15px", opacity: 0.5 }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #4d9fff", background: "#4d9fff10", display: "flex", alignItems: "center", justifyContent: "center", color: "#4d9fff", fontSize: "11px", boxShadow: "0 0 10px #4d9fff40" }}>▶</div>
            <span style={{ color: "#4d9fff", fontSize: "8.5px", textAlign: "center", maxWidth: "70px" }}>Google Marketing</span>
          </div>
          <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.12)", marginTop: "15px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>3</div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "8.5px", textAlign: "center", maxWidth: "70px" }}>Day &amp; Day Tasks</span>
          </div>
        </div>
      </SC>

      {/* Tasks section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minHeight: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>Tasks</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "4px 10px", color: "rgba(255,255,255,0.5)", fontSize: "9.5px" }}>⊕ Projects</div>
            <div style={{ background: "#4d9fff", borderRadius: "7px", padding: "4px 10px", color: "#fff", fontSize: "9.5px", fontWeight: 600 }}>+ Add Task</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "6px 12px", color: "rgba(255,255,255,0.25)", fontSize: "9.5px" }}>
          Search tasks by keyword...
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }}>
          {[
            { l: "All", active: true },
            { l: "📅 Due Today" },
            { l: "⏩ Due Tomorrow" },
            { l: "🔴 High Priority" },
            { l: "Pending" },
            { l: "⏳ Ongoing" },
            { l: "✓ Done" },
            { l: "📚 History" },
          ].map((tab) => (
            <div
              key={tab.l}
              style={{
                background: tab.active ? "#4d9fff" : "rgba(255,255,255,0.04)",
                border: tab.active ? "none" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px", padding: "3px 9px",
                color: tab.active ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "8.5px", fontWeight: tab.active ? 600 : 400,
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {tab.l}
            </div>
          ))}
        </div>

        {/* Project group label */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#39FF14" }} />
          <span style={{ color: "#39FF14", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px" }}>🌱 PERSONAL</span>
        </div>

        {/* Task 1 — Done */}
        <SC r="10px" sp={180}
          style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: "3px solid #39FF14", borderRadius: "10px", padding: "9px 12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 600, textDecoration: "line-through" }}>Social Media Campaign</div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "8.5px", marginTop: "2px", textDecoration: "line-through" }}>Starting a campaign about new coffee brand</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <Tag label="Medium"       color="#ff9f0a" bg="rgba(255,159,10,0.1)"  />
            <Tag label="✓ Done"       color="#39FF14" bg="rgba(57,255,20,0.1)"   />
            <Tag label="📅 Due today" color="#4d9fff" bg="rgba(77,159,255,0.1)"  />
            <Tag label="🎨 Creative"  color="#a78bfa" bg="rgba(167,139,250,0.1)" />
          </div>
        </SC>

        {/* Task 2 — Ongoing */}
        <SC r="10px" sp={180}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(77,159,255,0.15)",
            borderLeft: "3px solid #4d9fff", borderRadius: "10px", padding: "9px 12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
            <div>
              <div style={{ color: "#fff", fontSize: "10px", fontWeight: 600 }}>Google Marketing</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "8.5px", marginTop: "2px" }}>Design a banners and prepare the metadata for the adss</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "7px" }}>
            <Tag label="🔴 High"          color="#ff453a" bg="rgba(255,69,58,0.1)"    />
            <Tag label="▶ Ongoing"        color="#4d9fff" bg="rgba(77,159,255,0.12)"  />
            <Tag label="📅 Due today"     color="#4d9fff" bg="rgba(77,159,255,0.1)"   />
            <Tag label="🧠 Deep Thinking" color="#a78bfa" bg="rgba(167,139,250,0.1)"  />
            <Tag label="🚀 3/3"           color="#39FF14" bg="rgba(57,255,20,0.1)"    />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "#39FF14", borderRadius: "2px", boxShadow: "0 0 8px #39FF1460" }} />
            </div>
            <span style={{ color: "#39FF14", fontSize: "9px", fontWeight: 600 }}>100%</span>
          </div>
        </SC>
      </div>
    </div>
  );
}

// ─── Full App Mockup ──────────────────────────────────────────────────────────
function FullAppMockup() {
  return (
    <div style={{ display: "flex", height: "100%", background: "#080d1a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function AppPreviewScroll() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 900, height: 600,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-4 mb-4">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: "#4d9fff", background: "rgba(77,159,255,0.1)", border: "1px solid rgba(77,159,255,0.2)" }}
            >
              Full App Preview
            </span>
            <h2
              className="font-bold text-text-primary leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Your entire day.{" "}
              <span style={{ color: "#4d9fff" }}>One window.</span>
            </h2>
            <p className="text-text-muted text-lg max-w-xl">
              Tasks, milestones, reminders, health, and streaks — all visible at a glance. No switching tabs.
            </p>
          </div>
        }
      >
        <FullAppMockup />
      </ContainerScroll>
    </section>
  );
}
