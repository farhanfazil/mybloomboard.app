"use client";

import { motion, useInView } from "framer-motion";
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
  Video,
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
  "Voice & Video Calls": Video,
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

/** One short line per feature so every card reads at a glance. */
const SUMMARIES: Record<string, string> = {
  "Smart Task Management": "Priority, deadlines and one-click status on every task.",
  "Daily Milestone Tracker": "Today's tasks become a live progress bar.",
  "KPI Goals & PDF Reports": "Set targets, log results, export a clean PDF report.",
  "Streak & Reward System": "Badges at 3, 7, 14, 30, 60 and 100 days.",
  "Bloom & AI Assistant": "Plans, drafts and recaps your day with you.",
  Boards: "Progress, chat, comments and tags for every project.",
  Teams: "Tasks, progress and reports for the whole team.",
  "Team Chat": "Group chats, DMs, voice notes and images.",
  "Voice & Video Calls": "Call any teammate in one click — no Zoom needed.",
  "Voice Messages": "Leave a voice note on any board comment.",
  "Mood Avatars": "Pick an avatar that matches your energy.",
  "Cloud Data": "Tasks, boards and notes backed up and ready anywhere.",
  Security: "Private access and privacy-first by default.",
  "Quick Sticky Notes": "Notes that float above your workspace.",
  "Unlimited Team Members": "Invite everyone. No seat caps.",
  "Dark & Light Mode": "Switch themes and tune the colours.",
  "Notification Bell": "Know the moment a task or mention needs you.",
  "AI Email & Messages": "Draft or polish emails and messages in seconds.",
  "AI Meeting Notes to Tasks": "Paste your notes, get action items as tasks.",
  "AI Plan My Day": "A time-blocked plan built from your tasks.",
  "Reminders & Meetings": "Countdowns and a 5-minute alert before meetings.",
  "Health & Hydration": "A water timer in your sidebar, one tap to log.",
};

function isAI(title: string) {
  return /\bai\b/i.test(title) || title.toLowerCase().includes("bloom");
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  const Icon = FEATURE_ICONS[title] ?? Sparkles;
  const summary = SUMMARIES[title] ?? description;

  return (
    <div
      className="flex h-full w-full items-start gap-3 rounded-xl border border-white/10 bg-[#0b0f14] p-4 transition-colors duration-200 hover:border-white/25 hover:bg-[#0f151c]"
      title={description}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#123e5a]/60 text-white">
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-white">{title}</span>
          {isAI(title) && (
            <span className="shrink-0 rounded border border-white/20 px-1 text-[10px] font-semibold leading-4 text-white/70">AI</span>
          )}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-white/65">{summary}</span>
      </span>
    </div>
  );
}

/** A row that slowly scrolls on its own and pauses while hovered. */
function MarqueeRow({ items, reverse = false }: { items: typeof FEATURES; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="bb-marquee group flex overflow-hidden">
      <div
        className="bb-marquee-track flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {loop.map((f, i) => (
          <div key={`${f.title}-${i}`} className="w-[300px] shrink-0" aria-hidden={i >= items.length || undefined}>
            <FeatureCard title={f.title} description={f.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFeatureSwiper() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const pages = Array.from({ length: Math.ceil(FEATURES.length / 4) }, (_, i) => FEATURES.slice(i * 4, i * 4 + 4));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setActivePage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sm:hidden">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {pages.map((page, pi) => (
          <div key={pi} className="flex w-full shrink-0 snap-center flex-col gap-2.5 px-0.5">
            {page.map((f) => (
              <FeatureCard key={f.title} title={f.title} description={f.description} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to page ${i + 1}`}
            onClick={() => scrollRef.current?.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: "smooth" })}
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

// Injected raw: React escapes > and quotes inside <style> children on the server,
// which then no longer matches the client and triggers a hydration error.
const MARQUEE_CSS = `
        @keyframes bb-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bb-marquee-track { animation: bb-marquee 70s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bb-marquee-track { animation: none; }
          .bb-marquee { overflow: visible; }
          .bb-marquee-track { width: 100%; flex-wrap: wrap; justify-content: center; row-gap: 0.75rem; }
          .bb-marquee-track > [aria-hidden="true"] { display: none; }
        }
      `;

export default function FeatureGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const half = Math.ceil(FEATURES.length / 2);
  const rowA = FEATURES.slice(0, half);
  const rowB = FEATURES.slice(half);

  return (
    <section id="features" className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-24">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            One app. Everything you need.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Tasks, boards, team chat and calls, KPIs, reminders and an AI assistant — in one window on your Mac.
          </p>
        </motion.div>

        <MobileFeatureSwiper />
      </div>

      {/* Desktop: two slow rows, edge to edge; hover to pause and read */}
      <div
        className="relative left-1/2 hidden w-screen -translate-x-1/2 flex-col gap-3 sm:flex"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  );
}
