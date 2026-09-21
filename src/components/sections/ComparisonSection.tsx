"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BarChart2, Check, Minus, Video } from "lucide-react";

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
  ["Voice & video calls",         "✅ Built-in", "❌ Via add-on", "❌ Via add-on", "✅", "❌ Via add-on", "❌ Via add-on"],
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

/** Headline features get a highlighted row with a badge. */
const FEATURED: Record<string, string> = {
  "Voice & video calls": "New",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function cellStatus(text: string) {
  if (text.startsWith("✅")) return "yes";
  if (text.startsWith("❌")) return "no";
  if (text.startsWith("⚠️")) return "partial";
  return "text";
}

/** Text after the leading status emoji, e.g. "✅ Your Mac (free)\nCloud (paid)". */
function cellLines(text: string) {
  return text.replace(/^(✅|❌|⚠️)\s*/, "").split("\n").filter(Boolean);
}

function DataCell({ value, isBloom }: { value: string; isBloom: boolean }) {
  const status = cellStatus(value);
  const [first, ...rest] = cellLines(value);

  let mark: React.ReactNode = null;
  if (status === "yes") {
    mark = isBloom ? (
      <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3.2} />
      </span>
    ) : (
      <Check className="h-[18px] w-[18px] flex-none text-emerald-600" strokeWidth={3} />
    );
  } else if (status === "no") {
    mark = <Minus className="h-[18px] w-[18px] flex-none text-slate-300" strokeWidth={2.6} />;
  }

  const label =
    status === "partial" ? (
      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        {first || "Limited"}
      </span>
    ) : first ? (
      <span className={status === "no" ? "text-slate-500" : isBloom ? "font-semibold text-[#123e5a]" : "text-slate-700"}>
        {first}
      </span>
    ) : null;

  return (
    <td
      className="border-l border-slate-200 px-3 py-3 text-center align-middle text-sm"
      style={isBloom ? { background: "rgba(18,62,90,0.06)", borderLeft: "1px solid rgba(18,62,90,0.2)", borderRight: "1px solid rgba(18,62,90,0.2)" } : undefined}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {mark}
        {label}
      </span>
      {rest.map((line) => (
        <span key={line} className="mt-0.5 block text-[11px] leading-tight text-slate-500">
          {line}
        </span>
      ))}
    </td>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

function ComparisonTable({
  headers,
  rows,
  title,
  subtitle,
}: {
  headers: string[];
  rows: (string[] | { section: string })[];
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
        <p className="mt-1 text-sm text-white/40">{subtitle}</p>
      </div>

      <div
        className="overflow-x-auto overflow-y-auto rounded-2xl bg-white"
        style={{
          maxHeight: "900px",
          border: "1px solid rgba(18,62,90,0.25)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <table className="w-full border-collapse text-sm">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr style={{ background: "#123e5a" }}>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap px-3 py-3.5 text-xs font-bold uppercase tracking-widest ${
                    i === 0 ? "w-48 border-r border-white/15 text-left text-white/70" : "border-l border-white/15 text-center text-white"
                  }`}
                  style={i === 1 ? { background: "#1a5478" } : undefined}
                >
                  {i === 1 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                  <tr key={`sec-${ri}`} style={{ background: "#eef4f8", borderTop: "1px solid rgba(18,62,90,0.15)", borderBottom: "1px solid rgba(18,62,90,0.12)" }}>
                    <td
                      colSpan={headers.length}
                      className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#123e5a]"
                    >
                      {row.section}
                    </td>
                  </tr>
                );
              }

              const [feature, ...cols] = row as string[];
              const badge = FEATURED[feature];

              return (
                <tr
                  key={`row-${ri}`}
                  className={`border-t border-slate-100 transition-colors ${
                    badge ? "" : "odd:bg-white even:bg-slate-50/60 hover:bg-[#f3f8fb]"
                  }`}
                  style={badge ? { background: "linear-gradient(90deg, #e3f5ec 0%, #f1faf5 60%, #f7fcf9 100%)" } : undefined}
                >
                  <td
                    className={`whitespace-nowrap border-r border-slate-200 px-3 text-sm ${
                      badge ? "py-4 font-bold text-[#123e5a]" : "py-3 font-medium text-slate-800"
                    }`}
                    style={badge ? { boxShadow: "inset 4px 0 0 #123e5a" } : undefined}
                  >
                    {badge ? (
                      <span className="inline-flex items-center gap-2">
                        <Video className="h-4 w-4 text-emerald-600" strokeWidth={2.4} />
                        {feature}
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          {badge}
                        </span>
                      </span>
                    ) : feature}
                  </td>
                  {cols.map((val, ci) => (
                    <DataCell key={ci} value={val} isBloom={ci === 0} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/60">
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" strokeWidth={3} /> Yes / Included</span>
        <span className="inline-flex items-center gap-1.5"><Minus className="h-4 w-4 text-white/40" strokeWidth={2.6} /> No</span>
        <span className="inline-flex items-center gap-1.5"><span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">Paid</span> Partial / Limited / Paid only</span>
      </div>
    </div>
  );
}

// ─── EXPORTED SECTION ─────────────────────────────────────────────────────────

type ComparisonTableId = "teams" | "freelance";

/** `tables` picks which comparisons to show; the home page shows only Solo & Teams. */
export default function ComparisonSection({
  tables = ["teams", "freelance"],
}: { tables?: ComparisonTableId[] } = {}) {
  const showFreelance = tables.includes("freelance");
  const [open, setOpen] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      className="relative bg-black px-3 py-16 sm:px-6 sm:py-24"
    >
      {/* Heading + toggle button */}
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest text-white"
          >
            How We Stack Up
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            See how BloomBoard compares.
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
            {showFreelance
              ? "BloomBoard vs Notion, Trello, ClickUp, Moxie, HoneyBook and more."
              : "BloomBoard vs Notion, Trello, ClickUp, Asana and Monday.com."}
          </p>

          <button
            onClick={handleToggle}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: open
                ? "rgba(18,62,90,0.3)"
                : "linear-gradient(155deg, rgba(26,80,112,0.97) 0%, rgba(18,62,90,0.97) 50%, rgba(22,72,103,0.97) 100%)",
              border: open ? "1px solid rgba(74,140,180,0.35)" : "1.5px solid rgba(74,140,180,0.7)",
              color: "#fff",
              boxShadow: open ? "none" : "0 8px 32px rgba(18,62,90,0.55)",
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
            {tables.includes("teams") && <ComparisonTable
              headers={TEAMS_HEADERS}
              rows={TEAMS_ROWS}
              title="BloomBoard vs The Rest — Solo & Teams"
              subtitle="BloomBoard vs Notion · Trello · ClickUp · Asana · Monday.com"
            />}
            {showFreelance && <ComparisonTable
              headers={FREELANCE_HEADERS}
              rows={FREELANCE_ROWS}
              title="BloomBoard Freelance vs The Rest"
              subtitle="BloomBoard vs Moxie · HoneyBook · Bonsai · Dubsado"
            />}
          </div>
        </div>
      </div>
    </section>
  );
}

