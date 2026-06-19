"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BarChart2 } from "lucide-react";
import { useTheme } from "@/lib/theme";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TEAMS_HEADERS = ["Feature", "BloomBoard", "Notion", "Trello", "ClickUp", "Asana", "Monday"];

const TEAMS_ROWS: (string[] | { section: string })[] = [
  { section: "Platform" },
  ["Works fully offline",         "✅ Always",                              "⚠️ Limited",     "❌",          "⚠️ View only",  "⚠️ View only",  "❌"],
  ["Data location",               "✅ Your Mac (free)\nCloud (paid)",        "❌ Cloud only",   "❌ Cloud only","❌ Cloud only",  "❌ Cloud only",  "❌ Cloud only"],
  ["Account required",            "✅ Free = none\nPaid = account",          "✅ Always",       "✅ Always",   "✅ Always",     "✅ Always",     "✅ Always"],

  { section: "Tasks & Projects" },
  ["Task management",             "✅", "✅", "✅", "✅", "✅", "✅"],
  ["Subtasks & file attachments", "✅", "✅", "✅", "✅", "✅", "✅"],
  ["Project boards (kanban)",     "✅", "✅", "✅", "✅", "✅", "✅"],
  ["KPI tracking + PDF reports",  "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Daily milestone tracker",     "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Streak & badge rewards",      "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "Team & Collaboration" },
  ["Team collaboration",          "✅", "✅", "✅", "✅", "✅", "✅"],
  ["Built-in team chat",          "✅", "❌", "❌", "✅", "❌", "❌"],
  ["Voice messages in boards",    "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Meetings + 5-min alerts",     "✅", "❌", "❌", "✅", "✅", "✅"],

  { section: "Wellbeing & Personal" },
  ["Mood tracking per task",      "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Health & hydration tracker",  "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Mood avatars",                "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Sticky notes",                "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "AI Features" },
  ["AI assistant built-in",       "✅ Included",        "⚠️ Paid add-on", "❌", "⚠️ Paid add-on", "⚠️ Paid add-on", "⚠️ Paid add-on"],
  ["AI email writer",             "✅", "❌", "❌", "❌", "❌", "❌"],
  ["AI meeting notes → tasks",    "✅", "⚠️ Paid", "❌", "❌", "❌", "❌"],
  ["AI plan my day",              "✅", "❌", "❌", "❌", "❌", "❌"],
  ["AI Chief of Staff (Pulse)",   "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "Pricing" },
  ["Free plan",                   "✅", "✅", "✅", "✅", "✅", "⚠️ Trial only"],
];

const FREELANCE_HEADERS = ["Feature", "BloomBoard", "Moxie", "HoneyBook", "Bonsai", "Dubsado"];

const FREELANCE_ROWS: (string[] | { section: string })[] = [
  { section: "Platform" },
  ["Works offline",               "✅ Always",                              "❌", "❌", "❌", "❌"],
  ["Data location",               "✅ Your Mac (free)\nCloud (paid)",        "❌ Cloud only", "❌ Cloud only", "❌ Cloud only", "❌ Cloud only"],
  ["Account required",            "✅ Free = none\nPaid = account",          "✅ Always", "✅ Always", "✅ Always", "✅ Always"],
  ["Mobile app",                  "❌ Mac only",                             "✅", "✅", "✅", "❌"],

  { section: "Client Management" },
  ["Client management",           "✅", "✅", "✅", "✅", "✅"],
  ["Client portal (no login)",    "✅", "✅", "✅", "✅", "✅"],
  ["Project tracking",            "✅", "✅", "❌", "✅", "✅"],

  { section: "Billing & Finance" },
  ["Invoices & PDF export",       "✅", "✅", "✅", "✅", "✅"],
  ["Contracts + digital signing", "✅", "✅", "✅", "✅", "✅"],
  ["Proposals",                   "✅", "✅", "✅", "✅", "✅"],
  ["Payment processing",          "✅", "✅", "✅", "✅", "✅"],
  ["Time tracking",               "❌", "✅", "❌", "✅", "⚠️ Paid only"],
  ["Workflow automation",         "❌", "✅", "✅", "⚠️", "✅"],
  ["Scheduling / booking",        "❌", "✅", "✅", "❌", "⚠️ Paid only"],
  ["Expense & tax tracking",      "❌", "❌", "❌", "✅", "❌"],

  { section: "BloomBoard Exclusive" },
  ["Business KPI dashboard",           "✅", "❌", "❌", "❌", "❌"],
  ["Business Health Score",            "✅", "❌", "❌", "❌", "❌"],
  ["Smart pricing engine (AI)",        "✅", "❌", "❌", "❌", "❌"],
  ["AI contract generator",            "✅", "❌", "❌", "❌", "❌"],
  ["AI proposal generator",            "✅", "❌", "❌", "❌", "❌"],
  ["Asset delivery hub",               "✅", "❌", "❌", "❌", "❌"],
  ["Revision tracker + auto-invoice",  "✅", "❌", "❌", "❌", "❌"],
  ["Approval → auto-triggers invoice", "✅", "❌", "❌", "❌", "❌"],
  ["Full productivity suite included", "✅", "⚠️ Basic", "❌", "⚠️ Basic", "⚠️ Basic"],
  ["Streak, mood & wellbeing tools",   "✅", "❌", "❌", "❌", "❌"],

  { section: "Pricing" },
  ["Free plan",                   "✅", "❌", "❌", "⚠️ Trial only", "❌"],
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function cellStatus(text: string) {
  if (text.startsWith("✅")) return "yes";
  if (text.startsWith("❌")) return "no";
  if (text.startsWith("⚠️")) return "partial";
  return "text";
}

function CellText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={i > 0 ? "block text-[11px] opacity-60 mt-0.5 leading-tight" : ""}>
          {line.replace(/❌/g, "—").replace(/✅/g, "✓")}
        </span>
      ))}
    </>
  );
}

function DataCell({ value, isBloom, isLight }: { value: string; isBloom: boolean; isLight: boolean }) {
  const status = cellStatus(value);

  const colorMap: Record<string, string> = isLight ? {
    yes:     isBloom ? "font-semibold" : "",
    no:      isBloom ? "opacity-40"    : "opacity-30",
    partial: isBloom ? "text-amber-600 font-semibold" : "text-amber-500/60",
    text:    isBloom ? "font-semibold" : "opacity-60",
  } : {
    yes:     isBloom ? "text-white font-semibold" : "text-white/70",
    no:      isBloom ? "text-white/55"             : "text-white/40",
    partial: isBloom ? "text-amber-400 font-semibold" : "text-amber-500/70",
    text:    isBloom ? "text-white/90 font-semibold"  : "text-white/60",
  };

  const bloomStyle = isLight
    ? { background: "rgba(37,99,235,0.06)", borderLeft: "1px solid rgba(37,99,235,0.2)", borderRight: "1px solid rgba(37,99,235,0.2)", color: "#1e3a8a" }
    : { background: "rgba(10,50,120,0.25)", borderLeft: "1px solid rgba(77,159,255,0.4)", borderRight: "1px solid rgba(77,159,255,0.4)" };

  return (
    <td
      className={`px-3 py-2.5 text-sm text-center align-middle border-l ${isLight ? "border-slate-200" : "border-white/[0.15]"} ${colorMap[status]}`}
      style={isBloom ? bloomStyle : {}}
    >
      <CellText text={value} />
    </td>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

function ComparisonTable({
  headers,
  rows,
  title,
  subtitle,
  isLight,
}: {
  headers: string[];
  rows: (string[] | { section: string })[];
  title: string;
  subtitle: string;
  isLight: boolean;
}) {
  const L = isLight;
  return (
    <div className="mb-10">
      <div className="mb-5">
        <h3 className={`text-lg font-bold sm:text-xl ${L ? "text-slate-900" : "text-white"}`}>{title}</h3>
        <p className={`mt-1 text-sm ${L ? "text-slate-500" : "text-white/40"}`}>{subtitle}</p>
      </div>

      <div
        className="overflow-x-auto overflow-y-auto rounded-2xl"
        style={{
          border: L ? "1px solid rgba(37,99,235,0.15)" : "1px solid rgba(77,159,255,0.25)",
          maxHeight: "900px",
          boxShadow: L ? "0 4px 32px rgba(37,99,235,0.08)" : "0 0 40px rgba(30,80,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          background: L ? "rgba(255,255,255,0.97)" : "rgba(8,18,50,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <table className="w-full border-collapse text-sm">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr style={L
              ? { background: "linear-gradient(155deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)", borderBottom: "1.5px solid rgba(37,99,235,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(37,99,235,0.25)" }
              : { background: "linear-gradient(155deg, rgba(20,80,160,0.95) 0%, rgba(10,50,120,0.95) 50%, rgba(15,70,150,0.95) 100%)", borderBottom: "1.5px solid rgba(77,159,255,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 28px rgba(30,120,255,0.35)" }
            }>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`px-3 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                    i === 0 ? `text-left w-48 border-r ${L ? "text-blue-100/70 border-blue-300/30" : "text-white/50 border-white/[0.15]"}` : `text-center text-white border-l ${L ? "border-blue-300/30" : "border-white/[0.15]"}`
                  }`}
                  style={i === 1 ? (L
                    ? { background: "rgba(255,255,255,0.15)", borderLeft: "1px solid rgba(255,255,255,0.3)", borderRight: "1px solid rgba(255,255,255,0.3)" }
                    : { background: "rgba(10,50,120,0.45)", borderLeft: "1px solid rgba(77,159,255,0.4)", borderRight: "1px solid rgba(77,159,255,0.4)" }
                  ) : {}}
                >
                  {i === 1 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-300 inline-block" />
                      {h}
                    </span>
                  ) : h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, ri) => {
              if ("section" in row) {
                return (
                  <tr key={`sec-${ri}`} style={L
                    ? { background: "rgba(37,99,235,0.04)", borderTop: "2px solid rgba(37,99,235,0.12)", borderBottom: "1px solid rgba(37,99,235,0.08)" }
                    : { background: "rgba(167,139,250,0.06)", borderTop: "2px solid rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.10)" }
                  }>
                    <td
                      colSpan={headers.length}
                      className={`px-3 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase ${L ? "text-blue-600" : "text-violet-400"}`}
                    >
                      {row.section}
                    </td>
                  </tr>
                );
              }

              const [feature, ...cols] = row as string[];
              const isAlt = ri % 2 === 0;

              return (
                <tr
                  key={`row-${ri}`}
                  style={L ? {
                    borderTop: "1px solid rgba(37,99,235,0.07)",
                    background: isAlt ? "rgba(248,250,255,0.8)" : "rgba(255,255,255,0.5)",
                  } : {
                    borderTop: "1px solid rgba(255,255,255,0.13)",
                    background: isAlt ? "rgba(255,255,255,0.01)" : "transparent",
                  }}
                  className={`transition-colors ${L ? "hover:bg-blue-50/50" : "hover:bg-white/[0.03]"}`}
                >
                  <td className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap border-r ${L ? "text-slate-700 border-slate-200" : "text-white/70 border-white/[0.15]"}`}>{feature}</td>
                  {cols.map((val, ci) => (
                    <DataCell key={ci} value={val} isBloom={ci === 0} isLight={L} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className={`mt-3 flex flex-wrap gap-4 text-xs ${L ? "text-slate-400" : "text-white/30"}`}>
        <span><span className={L ? "text-slate-700" : "text-white"}>✓</span> Yes / Included</span>
        <span><span className={L ? "text-slate-400" : "text-white/40"}>—</span> No</span>
        <span><span className="text-amber-500/80">⚠️</span> Partial / Limited / Paid only</span>
      </div>
    </div>
  );
}

// ─── EXPORTED SECTION ─────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const [open, setOpen] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative px-3 py-16 sm:px-6 sm:py-24"
      style={isLight ? {
        background: "linear-gradient(160deg, #eef2ff 0%, #f5f8ff 40%, #eff4ff 100%)",
        borderTop: "1px solid rgba(37,99,235,0.12)",
        borderBottom: "1px solid rgba(37,99,235,0.12)",
      } : {
        background: "linear-gradient(160deg, #0d1a3a 0%, #0a1128 35%, #0e0a2e 65%, #0d1a3a 100%)",
        borderTop: "1px solid rgba(77,159,255,0.2)",
        borderBottom: "1px solid rgba(167,139,250,0.2)",
      }}
    >
      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(77,159,255,0.7) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.8) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute left-1/2 top-0 h-[200px] w-[700px] -translate-x-1/2 opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(99,179,237,0.6) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* Heading + toggle button */}
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={isLight ? {
              color: "#1d4ed8",
              background: "rgba(37,99,235,0.08)",
              border: "1.5px solid rgba(37,99,235,0.3)",
            } : {
              color: "#93c5fd",
              background: "rgba(59,130,246,0.15)",
              border: "1.5px solid rgba(77,159,255,0.5)",
              boxShadow: "0 0 16px rgba(77,159,255,0.2)",
            }}
          >
            How We Stack Up
          </span>
          <h2 className={`text-2xl font-bold sm:text-3xl lg:text-4xl ${isLight ? "text-slate-900" : "text-white"}`}>
            See how BloomBoard compares.
          </h2>
          <p className={`max-w-lg text-sm leading-relaxed sm:text-base ${isLight ? "text-slate-500" : "text-white/60"}`}>
            BloomBoard vs Notion, Trello, ClickUp, Moxie, HoneyBook and more.
          </p>

          <button
            onClick={handleToggle}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: open
                ? "rgba(10,50,120,0.3)"
                : "linear-gradient(155deg, rgba(20,80,160,0.95) 0%, rgba(10,50,120,0.95) 50%, rgba(15,70,150,0.95) 100%)",
              border: open ? "1px solid rgba(77,159,255,0.35)" : "1.5px solid rgba(77,159,255,0.7)",
              color: "#fff",
              boxShadow: open ? "none" : "0 8px 32px rgba(30,120,255,0.35)",
            }}
          >
            <BarChart2 className="h-4 w-4" />
            {open ? "Hide Comparison" : "Comparison"}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        </div>

        {/* Expandable tables */}
        <div
          style={{
            display: open ? "block" : "none",
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="pt-10">
            <ComparisonTable
              headers={TEAMS_HEADERS}
              rows={TEAMS_ROWS}
              title="BloomBoard vs The Rest — Solo & Teams"
              subtitle="BloomBoard vs Notion · Trello · ClickUp · Asana · Monday.com"
              isLight={isLight}
            />
            <ComparisonTable
              headers={FREELANCE_HEADERS}
              rows={FREELANCE_ROWS}
              title="BloomBoard Freelance vs The Rest"
              subtitle="BloomBoard vs Moxie · HoneyBook · Bonsai · Dubsado"
              isLight={isLight}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

