"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Check, Minus, MessageCircle, Video, Building2, Keyboard, Mail, LayoutDashboard, ClipboardList, HeartPulse, type LucideIcon } from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TEAMS_HEADERS = ["Feature", "BloomBoard", "Notion", "Trello", "ClickUp", "Asana", "Monday"];

const TEAMS_ROWS: (string[] | { section: string })[] = [
  { section: "Platform" },
  ["Works offline",               "✅ Your own tasks and notes\nTeam features need a connection",                              "⚠️ Limited",     "❌",          "⚠️ View only",  "⚠️ View only",  "❌"],
  ["Data location",               "✅ Your computer\nCloud backup when signed in", "❌ Cloud only",   "❌ Cloud only","❌ Cloud only",  "❌ Cloud only",  "❌ Cloud only"],
  ["Works without an account",    "✅ Free plan\nPaid plans need an account", "❌",              "❌",          "❌",            "❌",            "❌"],

  { section: "Tasks & Projects" },
  ["Create several boards at once", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Type to Task", "✅", "❌", "⚠️ Paste a list", "⚠️ Paste a list", "⚠️ Paste a list", "❌"],
  ["KPI tracking + PDF reports",  "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "Workspace" },
  ["Notes with PIN lock",         "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Bookmarks for links & resources", "✅", "✅", "❌", "⚠️ Via extension", "❌", "❌"],
  ["Performance overview",        "✅", "❌", "❌", "⚠️ Paid dashboards", "⚠️ Paid reporting", "⚠️ Paid dashboards"],

  { section: "Email & Calendar" },
  ["Gmail and Outlook inbox",       "✅ Built-in", "⚠️ Separate app", "❌", "⚠️ Paid plans", "❌", "⚠️ Via app"],
  ["Turn an email into a task",     "✅", "❌", "⚠️ Forward to a board", "⚠️ Email to task", "⚠️ Forward to Asana", "⚠️ Via app"],
  ["Reply to emails with AI",       "✅", "⚠️ Separate app", "❌", "⚠️ Paid add-on", "❌", "❌"],
  ["Outlook & Google Calendar sync", "✅", "⚠️ Separate app", "⚠️ Power-Up", "✅", "⚠️ One-way", "⚠️ Via app"],

  { section: "Team & Collaboration" },
  ["Voice & video calls",         "✅ Built-in", "❌ Via add-on", "❌ Via add-on", "✅", "❌ Via add-on", "❌ Via add-on"],
  ["Built-in team chat",          "✅", "❌", "❌", "✅", "❌", "❌"],
  ["Live team office",            "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Handovers before a vacation", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Team vacation calendar",      "✅", "❌", "❌", "❌", "⚠️ Out-of-office only", "⚠️ Via template"],
  ["Voice messages in boards",    "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Meetings + 5-min alerts",     "✅", "❌", "❌", "✅", "✅", "✅"],
  ["Daily Recap",                 "✅", "❌", "❌", "⚠️ Paid add-on", "⚠️ Paid", "❌"],

  { section: "For managers" },
  ["Manager dashboard",           "✅", "❌", "⚠️ Paid", "⚠️ Limited", "⚠️ Paid", "⚠️ Paid"],
  ["Workload Health",             "✅", "❌", "❌", "⚠️ Capacity view", "⚠️ Capacity view", "⚠️ Capacity view"],

  { section: "Wellbeing & Personal" },
  ["Wellbeing: mood, hydration and avatars", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Sticky notes",                "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "AI Features" },
  ["AI assistant built-in",       "✅ Included",        "⚠️ Paid add-on", "❌", "⚠️ Paid add-on", "⚠️ Paid add-on", "⚠️ Paid add-on"],
  ["AI planning: plan my day, meeting notes to tasks, risk alerts", "✅", "⚠️ Meeting notes, paid", "❌", "❌", "❌", "❌"],

  { section: "Pricing" },
  ["Free plan",                   "✅ Free\nBloom from $6/mo, Team from $8/person/mo\n(billed yearly)", "✅", "✅", "✅", "✅", "✅"],
];

/* What the table shows first: only the rows where BloomBoard is clearly
   different (about one screen). "See all features" opens TEAMS_ROWS. */
const TEAMS_TOP_ROWS: (string[] | { section: string })[] = [
  { section: "Talk to your team" },
  ["Voice & video calls",         "✅ Built-in", "❌ Via add-on", "❌ Via add-on", "✅", "❌ Via add-on", "❌ Via add-on"],
  ["Built-in team chat",          "✅", "❌", "❌", "✅", "❌", "❌"],
  ["Live team office",            "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Handovers before a vacation", "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "Email and planning" },
  ["Gmail and Outlook inbox",     "✅ Built-in", "⚠️ Separate app", "❌", "⚠️ Paid plans", "❌", "⚠️ Via app"],
  ["Turn an email into a task",   "✅", "❌", "⚠️ Forward to a board", "⚠️ Email to task", "⚠️ Forward to Asana", "⚠️ Via app"],
  ["Type to Task",                "✅", "❌", "⚠️ Paste a list", "⚠️ Paste a list", "⚠️ Paste a list", "❌"],

  { section: "For managers, with AI included" },
  ["AI assistant built-in",       "✅ Included", "⚠️ Paid add-on", "❌", "⚠️ Paid add-on", "⚠️ Paid add-on", "⚠️ Paid add-on"],
  ["Daily Recap",                 "✅", "❌", "❌", "⚠️ Paid add-on", "⚠️ Paid", "❌"],
  ["Workload Health",             "✅", "❌", "❌", "⚠️ Capacity view", "⚠️ Capacity view", "⚠️ Capacity view"],

  { section: "Your data and price" },
  ["Works offline",               "✅ Your own tasks and notes", "⚠️ Limited", "❌", "⚠️ View only", "⚠️ View only", "❌"],
  ["Works without an account",    "✅ Free plan", "❌", "❌", "❌", "❌", "❌"],
  ["Price",                       "✅ Free\nBloom from $6/mo, Team from $8/person/mo\n(billed yearly)", "⚠️ Free plan", "⚠️ Free plan", "⚠️ Free plan", "⚠️ Free plan", "⚠️ Free plan"],
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
  ["Free plan",                   "✅ Free\nBloom $6/mo, Team from $8/user/mo\n(billed yearly)", "❌", "❌", "⚠️ Trial only", "❌"],
];

/** Headline features get a highlighted row, with an icon, an optional badge and
    an optional one-line detail under the name. */
const FEATURED: Record<string, { icon: LucideIcon; badge?: string; detail?: string; detailShort?: string }> = {
  "Turn an email into a task": {
    icon: Mail,
    badge: "New",
    detail: "AI reads the email and fills in the task for you: title, deadline, priority and subtasks.",
    detailShort: "AI fills in the deadline and subtasks.",
  },
  "Type to Task": {
    icon: Keyboard,
    detail: "Type your to-dos as plain sentences. Dates become deadlines, @names assign teammates, and every line becomes its own task.",
    detailShort: "Dates become deadlines, @names assign teammates.",
  },
  "Voice & video calls": { icon: Video, badge: "New" },
  "Manager dashboard": {
    icon: LayoutDashboard,
    detail: "Live team performance: every teammate's to do, in progress, done and overdue work, with a delivery health score that shows who is on track and who is at risk.",
    detailShort: "Each teammate's progress, overdue work and delivery health.",
  },
  "Daily Recap": {
    icon: ClipboardList,
    detail: "Your day written up for you: what you finished yesterday, what is due today and any blockers. Post it to team chat or send it to your manager in one click, no more writing status updates.",
    detailShort: "Your day written up. Post it to your manager in one click.",
  },
  "Workload Health": {
    icon: HeartPulse,
    detail: "Private signals for owners and managers: overload, overdue work piling up, stuck cards, or someone going quiet. A nudge to check in early, never a public score.",
    detailShort: "Flags overload, stuck work and quiet teammates, privately.",
  },
  "Built-in team chat": { icon: MessageCircle },
  "Live team office": {
    icon: Building2,
    badge: "New",
    detail: "See who's in, knock before you walk over, and join a room to talk or share your screen.",
    detailShort: "See who's in, knock, join a room.",
  },
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

const DIVIDER = "border-l border-black/[0.05]";

function DataCell({ value, isBloom, divider = false }: { value: string; isBloom: boolean; divider?: boolean }) {
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
      <span className="text-xs font-medium text-[#6e6e73]">
        {first || "Limited"}
      </span>
    ) : first ? (
      <span className={status === "no" ? "text-[#86868b]" : isBloom ? "font-semibold text-[#123e5a]" : "text-[#1d1d1f]"}>
        {first}
      </span>
    ) : null;

  return (
    <td
      className={`border-b border-black/[0.06] px-3 py-3.5 text-center align-middle text-sm ${divider ? DIVIDER : ""}`}
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

/** Phone cell: the same marks, stacked so a narrow column can wrap. */
function MobileCell({ value, isBloom }: { value: string; isBloom: boolean }) {
  const status = cellStatus(value);
  /* Keep "add-on" / "Out-of-office" whole: wrap at spaces, never at a hyphen. */
  const [first, ...rest] = cellLines(value).map((line) => line.replace(/-/g, "\u2011"));

  let mark: React.ReactNode = null;
  if (status === "yes") {
    mark = isBloom ? (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3 w-3" strokeWidth={3.2} />
      </span>
    ) : (
      <Check className="h-[18px] w-[18px] text-emerald-600" strokeWidth={2.8} />
    );
  } else if (status === "no") {
    mark = <Minus className="h-[18px] w-[18px] text-[#c7c7cc]" strokeWidth={2.4} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-1 px-1.5 py-3 text-center"
      style={isBloom ? { background: BLOOM_TINT } : undefined}
    >
      {status === "partial" ? (
        <span className="text-[11px] font-medium leading-tight text-[#6e6e73]">
          {first || "Limited"}
        </span>
      ) : (
        <>
          {mark}
          {first ? (
            <span
              className={`text-[11px] leading-tight ${
                status === "no" ? "text-[#6e6e73]" : isBloom ? "font-semibold text-[#123e5a]" : "text-[#1d1d1f]"
              }`}
            >
              {first}
            </span>
          ) : null}
        </>
      )}
      {rest.map((line) => (
        <span key={line} className="text-[10px] leading-tight text-[#6e6e73]">
          {line}
        </span>
      ))}
    </div>
  );
}

/** Phones: BloomBoard against one competitor at a time, picked from tabs. */
function MobileComparison({ headers, rows }: { headers: string[]; rows: (string[] | { section: string })[] }) {
  const rivals = headers.slice(2);
  const [pick, setPick] = useState(0);
  const cols = "grid grid-cols-[minmax(0,1fr)_104px_92px]";

  return (
    <div className="md:hidden">
      <p className="mb-2 text-center text-xs text-[#6e6e73]">Compare BloomBoard with</p>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Compare with">
        {rivals.map((name, i) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={pick === i}
            onClick={(e) => {
              setPick(i);
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              pick === i ? "bg-[#1d1d1f] text-white" : "bg-white text-[#1d1d1f] ring-1 ring-black/10"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="overflow-clip rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]">
        <div className={`${cols} sticky top-0 z-10 border-b border-black/[0.08] bg-white/95 text-[13px] font-semibold backdrop-blur`}>
          <div className="px-3 py-3 font-medium text-[#6e6e73]">Features</div>
          <div className="flex items-center justify-center gap-1.5 px-1 py-3 text-[12.5px] text-[#123e5a]" style={{ background: "rgba(236,242,246,0.97)" }}>
            <Image src="/logo-black.svg" alt="" width={14} height={16} unoptimized className="h-4 w-auto" />
            <span className="truncate">BloomBoard</span>
          </div>
          <div className="flex items-center justify-center px-1 py-3 text-center text-[#1d1d1f]">{rivals[pick]}</div>
        </div>

        {rows.map((row, ri) => {
          if ("section" in row) {
            return (
              <div key={`sec-${ri}`} className={`${cols} border-b border-black/[0.06]`}>
                <div className="px-3 pb-2 pt-6 text-[15px] font-semibold text-[#1d1d1f]">{row.section}</div>
                <div style={{ background: BLOOM_TINT }} />
                <div />
              </div>
            );
          }
          const [feature, bloom, ...others] = row as string[];
          const featured = FEATURED[feature];
          const FeaturedIcon = featured?.icon;
          return (
            <div
              key={`row-${ri}`}
              className={`${cols} border-b border-black/[0.06] ${featured ? "bg-emerald-50/70" : ""}`}
            >
              <div className={`flex flex-col justify-center px-3 py-3 text-sm leading-snug text-[#1d1d1f] ${featured ? "font-semibold" : ""}`}>
                {featured && FeaturedIcon ? (
                  <span className="inline-flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <FeaturedIcon className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.4} />
                      <span className="min-w-0">{feature}</span>
                    </span>
                    {featured.badge && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {featured.badge}
                      </span>
                    )}
                  </span>
                ) : (
                  feature
                )}
                {(featured?.detailShort || featured?.detail) && (
                  <span className="mt-1 block text-xs font-normal leading-snug text-[#4b5563]">
                    {featured.detailShort || featured.detail}
                  </span>
                )}
              </div>
              <MobileCell value={bloom} isBloom />
              <MobileCell value={others[pick] ?? ""} isBloom={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

function ComparisonTable({
  headers,
  rows: allRows,
  topRows,
  title,
}: {
  headers: string[];
  rows: (string[] | { section: string })[];
  /** Shown first; "See all features" switches to the full rows. */
  topRows?: (string[] | { section: string })[];
  title?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const compact = !!topRows && !showAll;
  const rows = compact ? topRows! : allRows;
  const featureCount = allRows.filter((r) => !("section" in r)).length;
  return (
    <div className="mb-12 last:mb-0">
      {title && <h3 className="mb-4 text-xl font-semibold text-[#1d1d1f]">{title}</h3>}

      <MobileComparison headers={headers} rows={rows} />

      {/* No inner scroll on desktop, so the header row can stick under the site header */}
      <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] md:block lg:overflow-visible">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead className="lg:sticky lg:top-0 lg:z-10">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap border-b border-black/[0.08] bg-white/95 px-3 py-4 text-[13px] font-semibold backdrop-blur ${
                    i === 0
                      ? "w-[24%] rounded-tl-2xl text-left text-[#86868b] font-medium"
                      : `text-center text-[#1d1d1f] ${i === headers.length - 1 ? "rounded-tr-2xl" : ""} ${i >= 3 ? DIVIDER : ""}`
                  }`}
                  style={i === 1 ? { background: "rgba(236,242,246,0.97)" } : undefined}
                >
                  {i === 1 ? (
                    <span className="inline-flex items-center gap-2 text-[#123e5a]">
                      <Image src="/logo-black.svg" alt="" width={17} height={20} unoptimized className="h-5 w-auto" />
                      {h}
                    </span>
                  ) : i === 0 ? (compact ? "Where BloomBoard is different" : "Features") : h}
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
                        className={`border-b border-black/[0.06] ${ci >= 2 ? DIVIDER : ""}`}
                        style={ci === 0 ? { background: BLOOM_TINT } : undefined}
                      />
                    ))}
                  </tr>
                );
              }

              const [feature, ...cols] = row as string[];
              const featured = FEATURED[feature];
              const FeaturedIcon = featured?.icon;

              return (
                <tr
                  key={`row-${ri}`}
                  className={`group ${featured ? "bg-emerald-50/70" : "hover:bg-[#fafafa]"}`}
                >
                  <td
                    className={`border-b border-black/[0.06] px-3 text-sm ${
                      featured ? "py-4 font-semibold text-[#1d1d1f]" : "py-3.5 text-[#1d1d1f]"
                    }`}
                  >
                    {featured && FeaturedIcon ? (
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <FeaturedIcon className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.4} />
                        {feature}
                        {featured.badge && (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {featured.badge}
                          </span>
                        )}
                      </span>
                    ) : feature}
                    {featured?.detail && (
                      <span className="mt-1 block max-w-[300px] pl-6 text-xs font-normal leading-snug text-[#4b5563]">
                        {compact ? featured.detailShort || featured.detail : featured.detail}
                      </span>
                    )}
                  </td>
                  {cols.map((val, ci) => (
                    <DataCell key={ci} value={val} isBloom={ci === 0} divider={ci >= 2} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {topRows && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.08] transition-colors hover:bg-[#fafafa]"
          >
            {showAll ? "Show fewer" : `See all ${featureCount} features`}
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6e6e73]">
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" strokeWidth={2.8} /> Included</span>
        <span className="inline-flex items-center gap-1.5"><Minus className="h-4 w-4 text-[#c7c7cc]" strokeWidth={2.4} /> Not available</span>
        <span className="inline-flex items-center gap-1.5"><span className="font-medium text-[#1d1d1f]">Paid</span> Limited or paid extra</span>
        <span className="sm:ml-auto">Compared October 2026. Other apps change often; if something is out of date, tell us and we will fix it.</span>
      </div>
    </div>
  );
}

// ─── EXPORTED SECTION ─────────────────────────────────────────────────────────

type ComparisonTableId = "teams" | "freelance";

/** `tables` picks which comparisons to show; the home page shows only Solo & Teams. */
export default function ComparisonSection({
  tables = ["teams"],
  embedded = false,
}: {
  tables?: ComparisonTableId[];
  /** Inside a light panel that already has the frame (the home page's reveal panel). */
  embedded?: boolean;
} = {}) {
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
    <section ref={sectionRef} data-hide-header className={embedded ? "" : "bg-black px-2 py-6 sm:px-4"}>
      <div className={embedded ? "px-4 pb-4 pt-16 sm:px-8 sm:pt-24" : "rounded-[28px] bg-[#f5f5f7] px-4 py-16 sm:rounded-[36px] sm:px-8 sm:py-24"}>
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
                <ComparisonTable headers={TEAMS_HEADERS} rows={TEAMS_ROWS} topRows={TEAMS_TOP_ROWS} title={both ? "Solo & Teams" : undefined} />
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
