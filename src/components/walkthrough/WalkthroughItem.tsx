"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
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
  "greeting-stats":    { maxWidth: "480px", frame: "screenshot"      },
  "task-list":         { maxWidth: "400px", frame: "html-task-list"  },
  "subtasks":          { maxWidth: "520px", frame: "html-task-detail" },
  "daily-progress":    { maxWidth: "480px", frame: "screenshot"      },
  "milestone-tracker": { maxWidth: "560px", frame: "html-milestone"  },
  "avatar-chooser":    { maxWidth: "420px", frame: "contain"         },
  "boards":            { maxWidth: "900px", frame: "contain"         },
  "team-chat":         { maxWidth: "520px", frame: "contain"         },
  "add-event":         { maxWidth: "400px", frame: "html-calendar"   },
  "streak":            { maxWidth: "360px", frame: "html-streak"     },
  "manage-projects":   { maxWidth: "560px", frame: "contain"         },
  "daily-quote":       { maxWidth: "380px", frame: "html-quote"      },
  "ai-hub":            { maxWidth: "520px", frame: "html-ai-hub"     },
  "bloom-ai":          { maxWidth: "400px", frame: "html-bloom-ai"   },
  "ai-all":            { maxWidth: "800px", frame: "html-ai-all"     },
};

function VisualWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ position: "relative" }}>{children}</div>;
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
        width={1254}
        height={1254}
        className="w-full h-auto rounded-2xl"
        style={{ display: "block" }}
        unoptimized
      />
    </div>
  );
}

// ─── HTML Mockup: Task List (Feature 02) ─────────────────────────────────────
function TaskListMockup({ accentColor }: { accentColor: string }) {
  const tasks = [
    { title: "Social Media Campaign", desc: "Starting a campaign about new coffee brand", status: "Done", tone: "#39ff14", muted: true },
    { title: "Google Marketing", desc: "Design banners and prepare the metadata for the ads", status: "Ongoing", tone: "#4d9fff", muted: false },
    { title: "Day & Day Tasks", desc: "Track the data from the sheets", status: "Pending", tone: "#a78bfa", muted: false },
  ];

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "20px",
        background: "linear-gradient(145deg, rgba(12,17,29,0.98) 0%, rgba(8,11,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "18px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "14px" }}>
        <h4 style={{ color: "#fff", fontSize: "20px", fontWeight: 850, lineHeight: 1 }}>Tasks</h4>
        <div style={{ display: "flex", gap: "7px" }}>
          <button
            type="button"
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.055)",
              color: "rgba(255,255,255,0.72)",
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            Projects
          </button>
          <button
            type="button"
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(77,159,255,0.32)",
              background: "linear-gradient(135deg, rgba(77,159,255,0.88), rgba(79,70,229,0.86))",
              color: "#fff",
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: 850,
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      <div
        style={{
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.045)",
          color: "rgba(255,255,255,0.36)",
          padding: "10px 14px",
          fontSize: "12px",
          marginBottom: "12px",
        }}
      >
        Search tasks by keyword...
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
        {["All", "Due Today", "Due Tomorrow", "High Priority", "Pending"].map((filter, index) => (
          <span
            key={filter}
            style={{
              borderRadius: "999px",
              border: index === 0 ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.11)",
              background: index === 0 ? accentColor : "rgba(255,255,255,0.045)",
              color: index === 0 ? "#fff" : "rgba(255,255,255,0.58)",
              padding: "5px 10px",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {filter}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "99px", background: "#39ff14" }} />
        <p style={{ color: "#39ff14", fontSize: "10px", fontWeight: 900, letterSpacing: "3px" }}>PERSONAL</p>
      </div>

      <div style={{ display: "grid", gap: "9px" }}>
        {tasks.map((task, index) => (
          <div
            key={task.title}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: index === 1 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.045)",
              padding: "12px 14px 12px 20px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: "4px",
                background: task.tone,
                boxShadow: `0 0 14px ${task.tone}70`,
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: task.tone,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 900,
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <h5
                    style={{
                      color: task.muted ? "rgba(57,255,20,0.58)" : "#fff",
                      textDecoration: task.muted ? "line-through" : "none",
                      fontSize: "13px", fontWeight: 850, marginBottom: "3px",
                    }}
                  >
                    {task.title}
                  </h5>
                  <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "11px", marginBottom: "7px" }}>{task.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {[
                      task.status,
                      index === 0 ? "Due today" : index === 1 ? "High Priority" : "Motivated",
                      index === 1 ? "Deep Work" : "Creative",
                    ].map((chip) => (
                      <span
                        key={chip}
                        style={{
                          borderRadius: "999px",
                          border: "1px solid rgba(255,255,255,0.11)",
                          background: "rgba(255,255,255,0.055)",
                          color: "rgba(255,255,255,0.7)",
                          padding: "3px 8px",
                          fontSize: "10px", fontWeight: 800,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "16px", lineHeight: 1, flexShrink: 0 }}>⋯</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HTML Mockup: Expanded Task Detail (Feature 03) ──────────────────────────
function TaskDetailMockup({ accentColor }: { accentColor: string }) {
  const subtasks = [
    { label: "Draft campaign outline", done: true },
    { label: "Review creative assets", done: true },
    { label: "Schedule launch checklist", done: false },
  ];
  const moods = ["Creative", "Focused", "Motivated", "Deep Work"];

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "20px",
        background: "linear-gradient(145deg, rgba(12,17,29,0.98) 0%, rgba(8,11,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "14px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px", height: "40px", borderRadius: "13px", flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "17px", fontWeight: 800,
            }}
          >
            G
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, lineHeight: 1.15, marginBottom: "7px" }}>
              Google paid campaigns
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["High Priority", "Overdue · May 25", "Creative"].map((chip, index) => (
                <span
                  key={chip}
                  style={{
                    borderRadius: "999px",
                    border: index === 0 ? "1px solid rgba(255,92,92,0.35)" : index === 1 ? "1px solid rgba(255,159,10,0.32)" : "1px solid rgba(167,139,250,0.28)",
                    background: index === 0 ? "rgba(255,92,92,0.14)" : index === 1 ? "rgba(255,159,10,0.12)" : "rgba(167,139,250,0.14)",
                    color: index === 0 ? "#ff8a8a" : index === 1 ? "#ffd166" : "#c4b5fd",
                    padding: "4px 9px", fontSize: "11px", fontWeight: 800,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>PROGRESS</p>
          <p style={{ color: "#fff", fontSize: "20px", fontWeight: 800 }}>67%</p>
        </div>
      </div>

      <div style={{ height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ width: "67%", height: "100%", borderRadius: "999px", background: `linear-gradient(90deg, ${accentColor}, #a78bfa)` }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "12px", marginBottom: "12px" }}>
        <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", padding: "13px" }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", fontWeight: 800, letterSpacing: "2.5px", marginBottom: "8px" }}>NOTES</p>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "12px", lineHeight: 1.5 }}>
            Add campaign notes, links, client feedback, and blockers in one focused space.
          </p>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "10px", marginTop: "10px" }}>148 / 500</p>
        </div>
        <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", padding: "13px" }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", fontWeight: 800, letterSpacing: "2.5px", marginBottom: "8px" }}>ATTACHMENTS</p>
          <div style={{ height: "60px", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.58)", fontSize: "12px", fontWeight: 700 }}>
            Add file
          </div>
        </div>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.035)", padding: "13px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>Subtasks</p>
          <span style={{ borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.64)", padding: "3px 8px", fontSize: "11px", fontWeight: 800 }}>2 / 3</span>
        </div>
        <div style={{ display: "grid", gap: "7px" }}>
          {subtasks.map((task) => (
            <div key={task.label} style={{ display: "flex", alignItems: "center", gap: "9px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.035)", padding: "9px 11px" }}>
              <span style={{ width: "18px", height: "18px", borderRadius: "6px", flexShrink: 0, border: task.done ? "1px solid rgba(57,255,20,0.55)" : "1px solid rgba(255,255,255,0.16)", background: task.done ? "rgba(57,255,20,0.12)" : "rgba(255,255,255,0.035)", color: task.done ? "#39ff14" : "rgba(255,255,255,0.34)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900 }}>
                {task.done ? "✓" : ""}
              </span>
              <span style={{ color: task.done ? "rgba(255,255,255,0.46)" : "rgba(255,255,255,0.82)", textDecoration: task.done ? "line-through" : "none", fontSize: "12px", fontWeight: 650 }}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
        {moods.map((mood, index) => (
          <span key={mood} style={{ borderRadius: "999px", border: index === 0 ? "1px solid rgba(167,139,250,0.38)" : "1px solid rgba(255,255,255,0.11)", background: index === 0 ? "rgba(167,139,250,0.16)" : "rgba(255,255,255,0.045)", color: index === 0 ? "#d8b4fe" : "rgba(255,255,255,0.58)", padding: "6px 11px", fontSize: "11px", fontWeight: 800 }}>
            {mood}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[
          { label: "Edit", color: "#60a5fa", border: "rgba(96,165,250,0.34)" },
          { label: "Snooze", color: "#ffd166", border: "rgba(255,209,102,0.34)" },
          { label: "Delete", color: "#ff6b6b", border: "rgba(255,107,107,0.34)" },
        ].map((action) => (
          <button key={action.label} type="button" style={{ borderRadius: "11px", border: `1px solid ${action.border}`, background: "rgba(255,255,255,0.045)", color: action.color, padding: "10px", fontSize: "12px", fontWeight: 850 }}>
            {action.label}
          </button>
        ))}
      </div>
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
          <p style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, lineHeight: 1.15 }}>James.</p>
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
        borderRadius: "22px",
        background: "linear-gradient(145deg, rgba(12,17,29,0.98) 0%, rgba(8,11,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "22px",
        boxShadow: `0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)`,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
        <button
          type="button"
          aria-label="Previous reminder"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.055)",
            color: "rgba(255,255,255,0.78)",
            fontSize: "22px",
            lineHeight: 1,
          }}
        >
          ‹
        </button>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.36)",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            Daily Reminder
          </p>
          <h4 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, lineHeight: 1.1 }}>
            Today&apos;s Focus
          </h4>
        </div>

        <button
          type="button"
          aria-label="Next reminder"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.055)",
            color: "rgba(255,255,255,0.78)",
            fontSize: "22px",
            lineHeight: 1,
          }}
        >
          ›
        </button>
      </div>

      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
          padding: "18px",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            color: "#8bbcff",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          ✦ DAILY REMINDER
        </span>

        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "16px",
            fontStyle: "italic",
            lineHeight: 1.55,
            marginBottom: "10px",
          }}
        >
          &ldquo;Success is not final, failure is not fatal: it is the courage to continue that counts.&rdquo;
        </p>

        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "13px" }}>— Winston Churchill</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        {["Islamic", "Motivational"].map((item, index) => (
          <button
            key={item}
            type="button"
            style={{
              borderRadius: "12px",
              border: index === 1 ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.11)",
              background: index === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.045)",
              color: index === 1 ? "#fff" : "rgba(255,255,255,0.58)",
              padding: "11px 14px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {index === 0 ? "☾ " : "✦ "}
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        style={{
          width: "100%",
          borderRadius: "14px",
          border: "1px solid rgba(77,159,255,0.32)",
          background: "linear-gradient(135deg, rgba(77,159,255,0.85), rgba(96,165,250,0.95))",
          color: "#fff",
          padding: "13px",
          fontSize: "14px",
          fontWeight: 800,
        }}
      >
        Refresh Reminder
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "18px",
        }}
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
          style={{
              width: dot === 1 ? "22px" : "8px",
              height: "8px",
              borderRadius: "99px",
              background: dot === 1 ? accentColor : "rgba(255,255,255,0.18)",
          }}
          />
        ))}
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
function CombinedAIMockup({ accentColor, isMobile = false }: { accentColor: string; isMobile?: boolean }) {
  const tools = [
    { mark: "M", iconBg: "rgba(59,130,246,0.25)", title: "Email & Messages", desc: "Fix, rewrite, or generate emails." },
    { mark: "N", iconBg: "rgba(34,197,94,0.22)",  title: "Meeting Notes", desc: "Extract every action item." },
    { mark: "P", iconBg: "rgba(109,40,217,0.28)", title: "Plan My Day", desc: "Smart time-blocked schedule." },
    { mark: "S", iconBg: "rgba(139,92,246,0.25)", title: "I am Stuck", desc: "Break through any block." },
  ];

  // ── Mobile layout — full-size, purpose-built ─────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        borderRadius: "20px",
        background: "linear-gradient(145deg, rgba(12,17,29,0.98), rgba(8,11,20,0.98))",
        border: "1px solid rgba(255,255,255,0.12)",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
        width: "100%",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#4f1fb5,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 900, flexShrink: 0, boxShadow: "0 0 12px rgba(109,40,217,0.5)" }}>B</div>
          <span style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>Bloom</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: "0 2px" }}>·</span>
          <span style={{ color: "#c4b5fd", fontSize: "14px", fontWeight: 700 }}>AI Assistant</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 6px #39FF1470" }} />
            <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "11px" }}>Ready</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
          {/* LEFT — Bloom chat */}
          <div style={{ padding: "14px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: 800, letterSpacing: "2px", marginBottom: "10px" }}>YOUR AI COWORKER</div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "10px 12px", marginBottom: "10px" }}>
              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "12px", lineHeight: 1.55, margin: 0 }}>
                I&apos;m Bloom — create tasks, schedule meetings, and plan your day by voice or text.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
              {[
                { l: "My day",     c: "#a0c8ff", bg: "rgba(77,159,255,0.12)",  b: "rgba(77,159,255,0.25)"  },
                { l: "Overdue",    c: "#ffa0a0", bg: "rgba(255,69,58,0.10)",   b: "rgba(255,69,58,0.22)"   },
                { l: "Prioritize", c: "#ffd080", bg: "rgba(255,159,10,0.10)",  b: "rgba(255,159,10,0.22)"  },
              ].map((c) => (
                <div key={c.l} style={{ background: c.bg, border: `1px solid ${c.b}`, borderRadius: "999px", padding: "5px 9px", color: c.c, fontSize: "10px", fontWeight: 700 }}>{c.l}</div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "9px 11px", color: "rgba(255,255,255,0.28)", fontSize: "11px" }}>
              Ask Bloom anything…
            </div>
          </div>

          {/* RIGHT — AI Hub */}
          <div style={{ padding: "14px" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: 800, letterSpacing: "2px", marginBottom: "10px" }}>AI ASSISTANT HUB</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
              {tools.map((t) => (
                <div key={t.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "9px 10px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: t.iconBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900, marginBottom: "6px" }}>{t.mark}</div>
                  <div style={{ color: "#fff", fontSize: "10px", fontWeight: 700, lineHeight: 1.3, marginBottom: "4px" }}>{t.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", lineHeight: 1.4, marginBottom: "5px" }}>{t.desc}</div>
                  <div style={{ color: accentColor, fontSize: "9px", fontWeight: 800 }}>Open →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop layout (unchanged) ───────────────────────────────────────────
  return (
    <div style={{
      borderRadius: "28px",
      background: "linear-gradient(145deg, rgba(12,17,29,0.98) 0%, rgba(8,11,20,0.98) 100%)",
      border: "1px solid rgba(255,255,255,0.12)",
      overflow: "hidden",
      boxShadow: "0 30px 90px rgba(0,0,0,0.58), 0 0 0 1px rgba(255,255,255,0.05)",
      width: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "22px 26px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg,#4f1fb5,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", fontWeight: 900, boxShadow: "0 0 18px rgba(109,40,217,0.5)" }}>B</div>
        <span style={{ color: "#fff", fontSize: "20px", fontWeight: 850 }}>Bloom</span>
        <span style={{ color: "rgba(255,255,255,0.24)", fontSize: "18px", margin: "0 6px" }}>·</span>
        <span style={{ color: "#c4b5fd", fontSize: "19px", fontWeight: 850 }}>AI Assistant</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 9px #39FF1470" }} />
          <span style={{ color: "rgba(255,255,255,0.42)", fontSize: "13px", fontWeight: 700 }}>Always ready</span>
        </div>
      </div>

      {/* ── Split body ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>

        {/* LEFT — Bloom chat ──────────────────────────────────────── */}
        <div style={{ padding: "26px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ color: "rgba(255,255,255,0.34)", fontSize: "12px", fontWeight: 850, letterSpacing: "3px", marginBottom: "16px" }}>YOUR AI COWORKER</div>

          {/* Chat bubble */}
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "18px", padding: "18px 20px", marginBottom: "18px" }}>
            <p style={{ color: "rgba(255,255,255,0.86)", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>
              Good evening. I&apos;m Bloom, your AI coworker. I can create tasks, schedule meetings, and help you plan your day.
            </p>
          </div>

          {/* Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "9px", marginBottom: "18px" }}>
            {[
              { l: "My day",     c: "#a0c8ff", bg: "rgba(77,159,255,0.12)",  b: "rgba(77,159,255,0.25)"  },
              { l: "Overdue",    c: "#ffa0a0", bg: "rgba(255,69,58,0.10)",   b: "rgba(255,69,58,0.22)"   },
              { l: "Prioritize", c: "#ffd080", bg: "rgba(255,159,10,0.10)",  b: "rgba(255,159,10,0.22)"  },
              { l: "+ Quick task",  c: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.05)", b: "rgba(255,255,255,0.12)" },
            ].map((c) => (
              <div key={c.l} style={{ background: c.bg, border: `1px solid ${c.b}`, borderRadius: "999px", padding: "8px 13px", color: c.c, fontSize: "13px", fontWeight: 800 }}>{c.l}</div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "15px 16px", color: "rgba(255,255,255,0.34)", fontSize: "14px" }}>
              Ask Bloom anything...
            </div>
            <div style={{ width: "48px", height: "48px", borderRadius: "15px", background: "linear-gradient(135deg,#4f46e5,#6d28d9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>›</div>
          </div>
        </div>

        {/* RIGHT — AI Hub tools ────────────────────────────────────── */}
        <div style={{ padding: "18px 20px" }}>
          <div style={{ color: "rgba(255,255,255,0.34)", fontSize: "11px", fontWeight: 850, letterSpacing: "3px", marginBottom: "12px" }}>AI ASSISTANT HUB</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", alignItems: "start" }}>
            {tools.map((t) => (
              <div key={t.title} style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "13px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: t.iconBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, marginBottom: "10px" }}>{t.mark}</div>
                <div style={{ color: "#fff", fontSize: "13px", fontWeight: 850, marginBottom: "5px", lineHeight: 1.25 }}>{t.title}</div>
                <div style={{ color: "rgba(255,255,255,0.43)", fontSize: "11px", lineHeight: 1.4 }}>{t.desc}</div>
                <div style={{ color: accentColor, fontSize: "11px", fontWeight: 800, marginTop: "8px", opacity: 0.9 }}>Open →</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={{ padding: "14px 26px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#ffd166", fontSize: "14px", fontWeight: 900 }}>•</span>
        <span style={{ color: "rgba(255,255,255,0.34)", fontSize: "13px", fontWeight: 650 }}>Powered by Claude AI · Runs locally · No API key needed</span>
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
            Good evening, James! 🌱 I&apos;m Bloom, your AI coworker. I can create tasks, schedule meetings, manage your boards, and help you plan your day — just ask, or use voice input. What can I help with?
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

// ─── Mobile-only card (carousel) — no scroll animations ──────────────────────
export function WalkthroughMobileCard({
  label,
  headline,
  description,
  bullets,
  accentColor,
}: Omit<WalkthroughItemProps, "index" | "total">) {

  return (
    <div
      className="flex flex-col gap-4 rounded-3xl p-5"
      style={{
        background: `linear-gradient(145deg, rgba(8,8,10,0.94) 0%, rgba(3,3,5,0.88) 72%), radial-gradient(circle at 88% 12%, ${accentColor}18, transparent 40%)`,
        border: "1px solid rgba(255,255,255,0.1)",
        borderTop: `1px solid ${accentColor}40`,
      }}
    >
      {/* Label */}
      <span
        className="self-start rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, rgba(255,255,255,0.045))`,
          color: accentColor,
          border: `1px solid ${accentColor}45`,
        }}
      >
        {label}
      </span>

      {/* Headline */}
      <h3 className="text-xl font-bold leading-tight text-white">{headline}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-text-muted">{description}</p>

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="flex flex-col gap-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accentColor }} />
              {b}
            </li>
          ))}
        </ul>
      )}

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
  const isWideVisual = id === "ai-all" || id === "boards";
  const articleGridClass = isWideVisual
    ? "lg:grid-cols-[0.72fr_1.28fr] lg:gap-8 xl:gap-10"
    : "lg:grid-cols-2 lg:gap-14 xl:gap-20";
  const glowColor = `${accentColor}20`;
  const softGlowColor = `${accentColor}10`;
  const isMobileAIMockup = isMobile && (id === "ai-all" || id === "ai-hub" || id === "bloom-ai");
  const mobileAIMockupViewportStyle: CSSProperties | undefined = isMobileAIMockup
    ? {
        // ai-all renders its own mobile layout — no clipping needed
        height: id === "bloom-ai" ? "290px" : id === "ai-hub" ? "260px" : "auto",
        overflow: id === "ai-all" ? "visible" : "hidden",
        alignItems: "flex-start",
        width: "100%",
      }
    : undefined;
  const mobileAIMockupInnerStyle: CSSProperties = isMobileAIMockup
    ? id === "ai-all"
      // ai-all: native mobile layout — no scale transform, just full width
      ? { width: "100%", maxWidth: "none" }
      // bloom-ai / ai-hub: scaled-down desktop mockups
      : {
          width: id === "bloom-ai" ? "560px" : "680px",
          maxWidth: "none",
          transform: id === "bloom-ai" ? "scale(0.50)" : "scale(0.42)",
          transformOrigin: "top center",
        }
    : { width: "100%", maxWidth: config.maxWidth };

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
      case "html-task-detail": return <TaskDetailMockup        accentColor={accentColor} />;
      case "html-task-list":   return <TaskListMockup          accentColor={accentColor} />;
      case "html-stats":     return <GreetingStatsMockup     accentColor={accentColor} />;
      case "html-milestone": return <MilestoneProgressMockup accentColor={accentColor} />;
      case "html-calendar":  return <CalendarPickerMockup    accentColor={accentColor} />;
      case "html-streak":    return <StreakBadgeMockup        accentColor={accentColor} />;
      case "html-quote":     return <DailyQuoteMockup         accentColor={accentColor} />;
      case "html-ai-hub":    return <AIHubMockup              accentColor={accentColor} />;
      case "html-bloom-ai":  return <BloomAIMockup            accentColor={accentColor} />;
      case "html-ai-all":    return <CombinedAIMockup         accentColor={accentColor} isMobile={isMobile} />;
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
        className={`group relative grid min-h-0 grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/[0.16] sm:sticky sm:min-h-[620px] sm:gap-10 sm:rounded-[34px] sm:p-6 md:p-8 ${articleGridClass}`}
        style={{
          scale,
          top: `calc(5rem + ${cardOffset}px)`,
          zIndex: index + 1,
          background: `linear-gradient(145deg, rgba(8,8,10,0.94) 0%, rgba(3,3,5,0.88) 72%), radial-gradient(circle at ${isEven ? "88% 12%" : "14% 14%"}, ${glowColor}, transparent 40%), radial-gradient(circle at ${isEven ? "12% 88%" : "86% 86%"}, ${softGlowColor}, transparent 42%)`,
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "none",
        }}
      >
        <div
          className="pointer-events-none absolute inset-px rounded-[33px] opacity-80"
          style={{
            background:
              "linear-gradient(140deg, rgba(255,255,255,0.065) 0%, transparent 24%, transparent 72%, rgba(255,255,255,0.035) 100%)",
            zIndex: 0,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[34px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${isEven ? "18% 16%" : "82% 18%"}, rgba(255,255,255,0.1), transparent 28%), radial-gradient(circle at ${isEven ? "82% 82%" : "18% 82%"}, ${glowColor}, transparent 44%)`,
            zIndex: 0,
          }}
        />
        <div
          className="pointer-events-none absolute left-8 right-8 top-0 h-px opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}80, rgba(255,255,255,0.5), transparent)`,
            zIndex: 1,
          }}
        />
        {/* Text */}
        <div
          className={`relative z-10 flex flex-col gap-5 ${isEven ? "lg:order-1" : "lg:order-2"} ${isWideVisual ? "lg:max-w-[560px]" : ""}`}
        >
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-500 group-hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${accentColor}20, rgba(255,255,255,0.045))`,
                color: accentColor,
                border: `1px solid ${accentColor}45`,
              }}
            >
              {label}
            </span>
          </div>
          <h3 className="text-2xl font-bold leading-tight text-text-primary transition-colors duration-500 group-hover:text-white sm:text-4xl">{headline}</h3>
          <p className="text-sm leading-relaxed text-text-muted transition-colors duration-500 group-hover:text-white/60 sm:text-base">{description}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-1 flex flex-col gap-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-text-muted transition-colors duration-500 group-hover:text-white/58">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accentColor }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual */}
        <div
          className={`relative z-10 flex justify-center transition-transform duration-500 ease-out group-hover:scale-[1.01] ${isEven ? "lg:order-2" : "lg:order-1"}`}
          style={mobileAIMockupViewportStyle}
        >
          <div style={mobileAIMockupInnerStyle}>
            <VisualWrapper>
              {renderVisual()}
            </VisualWrapper>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
