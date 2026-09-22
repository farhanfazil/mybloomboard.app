"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Check, Minus, Video } from "lucide-react";

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
  ["Pulse — AI chief of staff",   "✅", "❌", "❌", "❌", "❌", "❌"],

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

const BLOOM_TINT = "rgba(18,62,90,0.055)";

function DataCell({ value, isBloom }: { value: string; isBloom: boolean }) {
  const status = cellStatus(value);
  const [first, ...rest] = cellLines(value);

  let mark: React.ReactNode = null;
  if (status === "yes") {
    mark = isBloom ? (
      <span className="inline-flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3.2} />
      </span>
    ) : (
      <Check className="h-[18px] w-[18px] flex-none text-emerald-600" strokeWidth={2.8} />
    );
  } else if (status === "no") {
    mark = <Minus className="h-[18px] w-[18px] flex-none text-[#c7c7cc]" strokeWidth={2.4} />;
  }

  const label =
    status === "partial" ? (
      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200/80">
        {first || "Limited"}
      </span>
    ) : first ? (
      <span className={status === "no" ? "text-[#86868b]" : isBloom ? "font-semibold text-[#123e5a]" : "text-[#1d1d1f]"}>
        {first}
      </span>
    ) : null;

  return (
    <td
      className="border-b border-black/[0.06] px-3 py-3.5 text-center align-middle text-sm"
      style={isBloom ? { background: BLOOM_TINT } : undefined}
    >
      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
        {mark}
        {label}
      </span>
      {rest.map((line) => (
        <span key={line} className="mt-0.5 block text-[11px] leading-tight text-[#86868b]">
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
}: {
  headers: string[];
  rows: (string[] | { section: string })[];
  title?: string;
}) {
  return (
    <div className="mb-12 last:mb-0">
      {title && <h3 className="mb-4 text-xl font-semibold text-[#1d1d1f]">{title}</h3>}

      {/* No inner scroll on desktop, so the header row can stick under the site header */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] lg:overflow-visible">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead className="lg:sticky lg:top-0 lg:z-10">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap border-b border-black/[0.08] bg-white/95 px-3 py-4 text-[13px] font-semibold backdrop-blur ${
                    i === 0
                      ? "w-[24%] rounded-tl-2xl text-left text-[#86868b] font-medium"
                      : `text-center text-[#1d1d1f] ${i === headers.length - 1 ? "rounded-tr-2xl" : ""}`
                  }`}
                  style={i === 1 ? { background: "rgba(236,242,246,0.97)" } : undefined}
                >
                  {i === 1 ? (
                    <span className="inline-flex items-center gap-2 text-[#123e5a]">
                      <Image src="/logo-black.svg" alt="" width={17} height={20} unoptimized className="h-5 w-auto" />
                      {h}
                    </span>
                  ) : i === 0 ? "Features" : h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => {
              if ("section" in row) {
                return (
                  <tr key={`sec-${ri}`}>
                    <td className="border-b border-black/[0.06] px-3 pb-2.5 pt-7 text-[15px] font-semibold text-[#1d1d1f]">
                      {row.section}
                    </td>
                    {headers.slice(1).map((h, ci) => (
                      <td
                        key={h}
                        className="border-b border-black/[0.06]"
                        style={ci === 0 ? { background: BLOOM_TINT } : undefined}
                      />
                    ))}
                  </tr>
                );
              }

              const [feature, ...cols] = row as string[];
              const badge = FEATURED[feature];

              return (
                <tr
                  key={`row-${ri}`}
                  className={`group ${badge ? "bg-emerald-50/70" : "hover:bg-[#fafafa]"}`}
                >
                  <td
                    className={`border-b border-black/[0.06] px-3 text-sm ${
                      badge ? "py-4 font-semibold text-[#1d1d1f]" : "py-3.5 text-[#1d1d1f]"
                    }`}
                  >
                    {badge ? (
                      <span className="inline-flex items-center gap-2">
                        <Video className="h-4 w-4 text-emerald-600" strokeWidth={2.4} />
                        {feature}
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
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
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6e6e73]">
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" strokeWidth={2.8} /> Included</span>
        <span className="inline-flex items-center gap-1.5"><Minus className="h-4 w-4 text-[#c7c7cc]" strokeWidth={2.4} /> Not available</span>
        <span className="inline-flex items-center gap-1.5"><span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 ring-1 ring-amber-200/80">Paid</span> Limited or paid extra</span>
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
  const showTeams = tables.includes("teams");
  const showFreelance = tables.includes("freelance");
  const both = showTeams && showFreelance;
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
    <section ref={sectionRef} data-hide-header className="bg-black px-2 py-6 sm:px-4">
      <div className="rounded-[28px] bg-[#f5f5f7] px-4 py-16 sm:rounded-[36px] sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              See how BloomBoard compares.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
              {both
                ? "BloomBoard vs Notion, Trello, ClickUp, Moxie, HoneyBook and more."
                : showFreelance
                  ? "BloomBoard vs Moxie, HoneyBook, Bonsai and Dubsado."
                  : "BloomBoard vs Notion, Trello, ClickUp, Asana and Monday.com."}
            </p>

            <button
              onClick={handleToggle}
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#123e5a] transition-colors hover:text-[#0b2a3e]"
            >
              {open ? "Hide comparison" : "Show comparison"}
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
          </div>

          <div style={{ display: open ? "block" : "none" }}>
            <div className="pt-10 sm:pt-14">
              {showTeams && (
                <ComparisonTable headers={TEAMS_HEADERS} rows={TEAMS_ROWS} title={both ? "Solo & Teams" : undefined} />
              )}
              {showFreelance && (
                <ComparisonTable headers={FREELANCE_HEADERS} rows={FREELANCE_ROWS} title={both ? "Freelance" : undefined} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
