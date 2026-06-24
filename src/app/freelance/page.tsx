"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/header-2";
import { HolographicButterfly } from "@/components/sections/DeepDiveFlight";
import { LampContainer } from "@/components/ui/lamp";
import { Footer } from "@/components/ui/footer-section";

const FreelanceSmartAIFeatures = dynamic(() => import("@/components/sections/FreelanceSmartAIFeatures"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
import {
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  CreditCard,
  FilePenLine,
  FileSignature,
  FolderKanban,
  Layers,
  Link2,
  Package,
  Palette,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg";

// ─── Count-up hook (mount-based — hero stats are above fold, IntersectionObserver
//     inside overflow:hidden LampContainer is unreliable) ──────────────────────
function useCountUp(target: number, duration = 900, startDelay = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      if (target === 0) { setCount(0); return; }
      let startTime: number | null = null;
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);
    return () => clearTimeout(t);
  }, [target, duration, startDelay]);
  return count;
}

// ─── Sticky CTA bar (bottom — avoids header z-index conflict) ────────────────
function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-cta"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[100] hidden sm:flex items-center gap-3 rounded-full px-3 py-2"
          style={{
            background: "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(4,12,32,0.97) 50%, rgba(6,18,48,0.97) 100%)",
            border: "1.5px solid rgba(77,159,255,0.35)",
            boxShadow: "0 0 0 1px rgba(77,159,255,0.1), 0 8px 40px rgba(10,20,60,0.7), 0 2px 16px rgba(77,159,255,0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            whiteSpace: "nowrap",
          }}
        >
          <span className="hidden text-xs font-medium sm:block" style={{ color: "rgba(147,197,253,0.7)" }}>
            BloomBoard Freelance
          </span>
          <div className="hidden sm:block h-3.5 w-px" style={{ background: "rgba(77,159,255,0.22)" }} />
          <a
            href="https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg"
            className="text-xs font-medium px-3.5 py-1.5 rounded-full transition-all hover:scale-[1.04]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Download Free
          </a>
          <a
            href="https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D"
            className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all hover:scale-[1.04] hover:brightness-110"
            style={{
              background: "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(4,12,32,0.97) 50%, rgba(6,18,48,0.97) 100%)",
              color: "#e8f4ff",
              border: "1.5px solid rgba(77,159,255,0.5)",
              boxShadow: "0 0 12px rgba(30,100,255,0.3)",
            }}
          >
            Start Flow — $7.99/mo
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Pricing tiers ────────────────────────────────────────────────────────────
const FREELANCE_PLANS = [
  {
    name: "Free",
    price: "$0",
    yearlyPrice: null as string | null,
    subtext: "forever, no card needed",
    accentColor: "#607080",
    highlighted: false,
    badge: null as string | null,
    cta: "Download Free",
    ctaHref: DOWNLOAD_URL,
    yearlyHref: null as string | null,
    featureGroups: [
      {
        category: "Workspace",
        items: [
          { text: "2 clients", included: true },
          { text: "2 projects", included: true },
          { text: "3 invoices (lifetime)", included: true },
          { text: "Basic dashboard — 2 KPI cards", included: true },
        ],
      },
      {
        category: "Client Tools",
        items: [
          { text: "Payment Method", included: true, badges: ["Bank Transfer"] },
          { text: "Invoice Templates", included: true, badges: ["Standard Invoice"] },
          { text: "Payments Dashboard — no access", included: false },
          { text: "Smart Pricing Engine", included: false },
          { text: "Client Portal", included: false },
          { text: "Asset Delivery Hub", included: false },
          { text: "Revision Tracker", included: false },
          { text: "Contracts", included: false },
          { text: "Approvals", included: false },
          { text: "Invoice PDF Export", included: false },
        ],
      },
      {
        category: "AI Features",
        items: [
          { text: "AI Contract Generator", included: false },
          { text: "AI Proposal Generator", included: false },
        ],
      },
    ],
  },
  {
    name: "Flow",
    price: "$7.99",
    yearlyPrice: "$72" as string | null,
    subtext: "/ month",
    accentColor: "#4d9fff",
    highlighted: true,
    badge: "Most Popular" as string | null,
    cta: "7 days free trial",
    ctaHref: "https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D",
    yearlyHref: "https://buy.polar.sh/polar_cl_Zv3lKA51r16R0wsXOHm31nViCwIVJaxdJQcHx11AKNu" as string | null,
    featureGroups: [
      {
        category: "Workspace",
        items: [
          { text: "10 clients", included: true },
          { text: "10 projects", included: true },
          { text: "10 invoices", included: true },
          { text: "Dashboard — 4 KPI cards", included: true },
          { text: "Business Health Score", included: true },
        ],
      },
      {
        category: "Client Tools",
        items: [
          { text: "Payment Methods", included: true, badges: ["Bank Transfer", "PayPal", "Custom"] },
          { text: "Invoice Templates", included: true, badges: ["Standard Invoice", "Deposit (50%)", "Final Balance"] },
          { text: "Payments Dashboard — Earned, Awaiting & Overdue KPIs", included: true },
          { text: "Smart Pricing Engine (Floor + Target)", included: true, badges: ["Based on your currency & region"] },
          { text: "Client Portal", included: true },
          { text: "Asset Delivery (1 GB, 5 assets/project)", included: true, badges: ["Video? Use links"] },
          { text: "Revision Tracker (3 rounds/project)", included: true },
          { text: "Contracts (manual)", included: true },
          { text: "Approvals", included: true },
          { text: "Invoice PDF Export", included: true },
        ],
      },
      {
        category: "AI Features",
        items: [
          { text: "Monthly revenue per client", included: false },
          { text: "AI Contract Generator", included: false },
          { text: "AI Proposal Generator", included: false },
        ],
      },
    ],
  },
  {
    name: "Bloom",
    price: "$15.99",
    yearlyPrice: "$156" as string | null,
    subtext: "/ month",
    accentColor: "#a78bfa",
    highlighted: true,
    badge: "Best Value" as string | null,
    cta: "7 days free trial",
    ctaHref: "https://buy.polar.sh/polar_cl_6OVDu8uzWINVJcKoprQ4ZArcfNFLvYCYUDwG30A45DS",
    yearlyHref: "https://buy.polar.sh/polar_cl_mPrYs7EnmqJLA6bDr5eDfUTt5wrogcEBK5dDm0gTV3O" as string | null,
    featureGroups: [
      {
        category: "Workspace",
        items: [
          { text: "Unlimited clients", included: true },
          { text: "Unlimited projects", included: true },
          { text: "Unlimited invoices", included: true },
          { text: "All 5 KPI cards + Revenue This Month", included: true },
          { text: "Monthly revenue per client (full breakdown)", included: true },
          { text: "Business Health Score (full detail)", included: true },
        ],
      },
      {
        category: "Client Tools",
        items: [
          { text: "Payment Methods — all 7", included: true, badges: ["PayPal", "Wise", "Stripe", "+4 more"] },
          { text: "Invoice Templates — all 5", included: true, badges: ["Standard Invoice", "Deposit (50%)", "Revision Charge", "Monthly Retainer"] },
          { text: "Payments Dashboard + Monthly Payout Summary", included: true },
          { text: "Smart Pricing Engine (Full — Premium + rush + region)", included: true, badges: ["Based on your currency & region"] },
          { text: "Client Portal", included: true },
          { text: "Asset Delivery Hub (5 GB, unlimited assets)", included: true, badges: ["Video? Use links"] },
          { text: "Revision Tracker (unlimited + auto-invoice on overages)", included: true },
          { text: "Contracts", included: true },
          { text: "Approvals", included: true },
          { text: "Auto Invoice Trigger", included: true },
          { text: "Invoice PDF Export", included: true },
        ],
      },
      {
        category: "AI Features",
        items: [
          { text: "AI Contract Generator", included: true },
          { text: "AI Proposal Generator (8-section + Accept/Decline)", included: true },
        ],
      },
    ],
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const HIVE_FEATURES = [
  {
    icon: "📊",
    title: "Business Dashboard",
    desc: "KPI cards for revenue, pending invoices, overdue payments, and active clients — with a Business Health score ring.",
    color: "#4d9fff",
  },
  {
    icon: "💰",
    title: "Smart Pricing",
    desc: "Set floor, target, and premium rates based on scope, complexity, timeline, and regional demand.",
    color: "#fbbf24",
  },
  {
    icon: "🔗",
    title: "Client Portal",
    desc: "A no-login shareable link where clients view progress, files, invoices, and approve deliverables.",
    color: "#34d399",
  },
  {
    icon: "🗂️",
    title: "Client Workspace",
    desc: "All projects, files, approvals, invoices, and notes for each client in one focused space.",
    color: "#38bdf8",
  },
  {
    icon: "📄",
    title: "Invoices & Contracts",
    desc: "Create invoices manually or on completion. AI generates contracts — clients sign digitally.",
    color: "#a78bfa",
  },
  {
    icon: "📦",
    title: "Asset Delivery Hub",
    desc: "Upload and share files up to 50 MB with per-asset Approve and Download links for clients.",
    color: "#f472b6",
  },
  {
    icon: "🔄",
    title: "Revision Tracker",
    desc: "Log revision rounds, track status from Open to Resolved, and auto-invoice beyond your limit.",
    color: "#fb923c",
  },
  {
    icon: "🤝",
    title: "Approvals",
    desc: "Send a no-login approval link — client approves or requests changes, auto-triggering the invoice.",
    color: "#38bdf8",
  },
  {
    icon: "📝",
    title: "AI Proposals",
    desc: "AI builds an 8-section proposal with scope, timeline, and pricing — clients accept or decline online.",
    color: "#a78bfa",
  },
  {
    icon: "💳",
    title: "Payment Methods",
    desc: "Add your payment details to invoices so clients always know exactly how to pay you.",
    color: "#34d399",
  },
  {
    icon: "🗃️",
    title: "Projects",
    desc: "Track status, timeline, budget, and deliverables for every project from kickoff to sign-off.",
    color: "#60a5fa",
  },
  {
    icon: "🎨",
    title: "Freelancer Profile",
    desc: "Set your name, role, photo, bio, and skills — your brand across every client-facing page.",
    color: "#f472b6",
  },
];

const HIVE_FEATURE_ICONS: Record<string, LucideIcon> = {
  "Business Dashboard": BarChart3,
  "Smart Pricing": BadgeDollarSign,
  "Client Portal": Link2,
  "Client Workspace": FolderKanban,
  "Invoices & Contracts": FileSignature,
  "Asset Delivery Hub": Package,
  "Revision Tracker": RefreshCw,
  Approvals: BadgeCheck,
  "AI Proposals": FilePenLine,
  "Payment Methods": CreditCard,
  Projects: Layers,
  "Freelancer Profile": Palette,
};

// ─── Stat components ──────────────────────────────────────────────────────────
function CountUpStat({ target, suffix, label, startDelay = 800 }: { target: number; suffix: string; label: string; startDelay?: number }) {
  const count = useCountUp(target, 900, startDelay);
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-bold leading-tight text-white sm:text-2xl tabular-nums">
        {count}{suffix}
      </p>
      <p className="mt-0.5 text-[9px] leading-tight sm:text-xs" style={{ color: "rgba(255,255,255,0.36)" }}>{label}</p>
    </div>
  );
}

function TextRevealStat({ value, label, startDelay = 800 }: { value: string; label: string; startDelay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        className="text-xs font-bold leading-tight text-white whitespace-nowrap sm:text-2xl"
        initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
        animate={show ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 text-[9px] leading-tight sm:text-xs" style={{ color: "rgba(255,255,255,0.36)" }}>{label}</p>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I replaced 4 different tools with BloomBoard. My client portal alone saves me hours every week.",
    name: "Sara M.",
    role: "Brand Designer, Dubai",
    avatar: "SM",
    color: "#4d9fff",
    tag: "Individual",
  },
  {
    quote: "The Smart Pricing Engine finally helped me stop undercharging. I raised my rates 30% and clients didn't blink.",
    name: "James K.",
    role: "Motion Designer, London",
    avatar: "JK",
    color: "#a78bfa",
    tag: "Individual",
  },
  {
    quote: "Sending a proposal, contract, and invoice all from one place feels like magic. Clients love the portal too.",
    name: "Priya R.",
    role: "UX Consultant, Bangalore",
    avatar: "PR",
    color: "#34d399",
    tag: "Individual",
  },
  {
    quote: "Our whole small studio runs on BloomBoard. Every designer has their own board, and we share project files through the portal without any back-and-forth.",
    name: "Lena & Tom",
    role: "Co-founders, Twocraft Studio",
    avatar: "LT",
    color: "#fb923c",
    tag: "Team",
  },
  {
    quote: "The revision tracker is a game changer for us. Clients used to ghost on feedback — now everything is logged, timestamped, and auto-billed when they go over.",
    name: "David O.",
    role: "Creative Director, Nairobi",
    avatar: "DO",
    color: "#f472b6",
    tag: "Individual",
  },
  {
    quote: "We onboarded our 3-person content team in a day. The no-login client portal means clients always know where things stand — zero 'what's the update?' messages.",
    name: "Zara & Co.",
    role: "Content Agency, Toronto",
    avatar: "ZC",
    color: "#38bdf8",
    tag: "Team",
  },
];

function FreelanceTestimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const pageCount = Math.ceil(TESTIMONIALS.length / 3);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => setActivePage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#fbbf24", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
            From freelancers & teams
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">What they&apos;re saying</h2>
        </motion.div>
        {/* Mobile: paginated carousel — 3 per page, full width */}
        <div
          ref={carouselRef}
          className="sm:hidden flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: Math.ceil(TESTIMONIALS.length / 3) }, (_, pi) =>
            TESTIMONIALS.slice(pi * 3, pi * 3 + 3)
          ).map((page, pi) => (
            <div key={pi} className="w-full shrink-0 snap-start flex flex-col gap-3">
              {page.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-3 rounded-2xl p-4"
                  style={{
                    background: "linear-gradient(145deg, rgba(12,12,16,0.95), rgba(6,6,10,0.88))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderTop: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={t.tag === "Team"
                        ? { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }
                        : { background: "rgba(77,159,255,0.08)", color: "#93c5fd", border: "1px solid rgba(77,159,255,0.2)" }}>
                      {t.tag}
                    </span>
                    <span style={{ color: t.color, fontSize: 18, lineHeight: 1 }}>&ldquo;</span>
                  </div>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.72)" }}>
                    {t.quote}
                  </p>
                  <div className="mt-auto flex items-center gap-2.5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: `${t.color}22`, border: `1px solid ${t.color}55`, color: t.color }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{t.name}</p>
                      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="sm:hidden mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => carouselRef.current?.scrollTo({ left: i * carouselRef.current.clientWidth, behavior: "smooth" })}
              className="rounded-full transition-all duration-300"
              style={{
                width: activePage === i ? "1.5rem" : "0.375rem",
                height: "0.375rem",
                background: activePage === i ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 rounded-2xl p-5"
              style={{
                background: "linear-gradient(145deg, rgba(12,12,16,0.95), rgba(6,6,10,0.88))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={t.tag === "Team"
                    ? { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }
                    : { background: "rgba(77,159,255,0.08)", color: "#93c5fd", border: "1px solid rgba(77,159,255,0.2)" }}>
                  {t.tag}
                </span>
                <span style={{ color: t.color, fontSize: 18, lineHeight: 1 }}>&ldquo;</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.72)" }}>
                {t.quote}
              </p>
              <div className="mt-auto flex items-center gap-2.5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: `${t.color}22`, border: `1px solid ${t.color}55`, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Plan Quiz ────────────────────────────────────────────────────────────────
const QUIZ_STEPS = [
  {
    question: "How many active clients do you have?",
    options: [
      { label: "1–2 clients",    points: { free: 2, flow: 1, bloom: 0 } },
      { label: "3–10 clients",   points: { free: 0, flow: 2, bloom: 1 } },
      { label: "10+ clients",    points: { free: 0, flow: 0, bloom: 3 } },
    ],
  },
  {
    question: "Which features matter most to you?",
    options: [
      { label: "Just tracking & invoices",         points: { free: 2, flow: 1, bloom: 0 } },
      { label: "Client portal + smart pricing",    points: { free: 0, flow: 3, bloom: 1 } },
      { label: "AI proposals, contracts & portal", points: { free: 0, flow: 0, bloom: 3 } },
    ],
  },
];

const PLAN_RESULT: Record<string, { name: string; color: string; desc: string; href: string }> = {
  free:  { name: "Free",  color: "#607080", desc: "Perfect to get started — 2 clients, full productivity suite, no card needed.", href: "#pricing" },
  flow:  { name: "Flow",  color: "#4d9fff", desc: "Built for growing freelancers — client portal, smart pricing, 10 clients.", href: "https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D" },
  bloom: { name: "Bloom", color: "#a78bfa", desc: "Unlimited clients, AI proposals & contracts, full automation suite.", href: "https://buy.polar.sh/polar_cl_6OVDu8uzWINVJcKoprQ4ZArcfNFLvYCYUDwG30A45DS" },
};

function FreelancePlanQuiz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ free: 0, flow: 0, bloom: 0 });
  const [result, setResult] = useState<string | null>(null);

  const pick = (points: { free: number; flow: number; bloom: number }) => {
    const next = { free: scores.free + points.free, flow: scores.flow + points.flow, bloom: scores.bloom + points.bloom };
    setScores(next);
    if (step + 1 < QUIZ_STEPS.length) {
      setStep(step + 1);
    } else {
      const winner = (Object.keys(next) as Array<"free" | "flow" | "bloom">)
        .reduce((a, b) => next[a] >= next[b] ? a : b);
      setResult(winner);
    }
  };

  const reset = () => { setStep(0); setScores({ free: 0, flow: 0, bloom: 0 }); setResult(null); };

  const plan = result ? PLAN_RESULT[result] : null;

  return (
    <section ref={ref} className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "rgba(255,255,255,0.82)", background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.12)" }}>
            Find your plan
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">Which plan is right for you?</h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>2 quick questions — get your match instantly.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(10,10,13,0.97), rgba(6,6,8,0.96))",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  {QUIZ_STEPS.map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{ background: i <= step ? "rgba(77,159,255,0.8)" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(77,159,255,0.7)" }}>
                  Question {step + 1} of {QUIZ_STEPS.length}
                </p>
                <h3 className="text-xl font-bold text-white mb-6 leading-snug">{QUIZ_STEPS[step].question}</h3>
                <div className="flex flex-col gap-3">
                  {QUIZ_STEPS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => pick(opt.points)}
                      className="w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(77,159,255,0.45)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(77,159,255,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="p-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Your match</p>
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
                  style={{ background: `${plan!.color}18`, border: `1.5px solid ${plan!.color}55` }}>
                  <span className="text-2xl font-bold" style={{ color: plan!.color }}>{plan!.name}</span>
                </div>
                <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>{plan!.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={plan!.href}
                    className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.03]"
                    style={{ background: plan!.color, color: "#fff", boxShadow: `0 8px 24px ${plan!.color}44` }}>
                    Get started with {plan!.name}
                  </a>
                  <button onClick={reset}
                    className="px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
                    Retake quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Freelance FAQ ─────────────────────────────────────────────────────────────
const FREELANCE_FAQS = [
  {
    question: "Is BloomBoard really free to start?",
    answer: "Yes — the Free plan is free forever. No credit card, no trial expiry. You get 2 clients, 2 projects, and the full productivity dashboard. Upgrade only when you need more.",
  },
  {
    question: "What's the difference between Flow and Bloom?",
    answer: "Flow is built for freelancers managing up to 10 clients — smart pricing, client portal, asset delivery, and revision tracking. Bloom adds unlimited clients, AI-generated proposals and contracts, auto-invoicing, and the full payment suite. Both include a 7-day free trial.",
  },
  {
    question: "Does it work offline? Is my data stored in the cloud?",
    answer: "BloomBoard is local-first — all your data lives on your Mac. No cloud sync, no account required for the core app. Asset Delivery files are the only exception (uploaded via Cloudflare R2 for client sharing), and they auto-delete after 3 days.",
  },
  {
    question: "How does the Client Portal work for my clients?",
    answer: "Each client gets a unique shareable link — no login required. They can view project progress, download files, approve deliverables, and see invoices. Everything is timestamped and IP-tracked for your protection.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Cancel from your Polar dashboard at any time — no questions asked. Your data stays on your Mac regardless. The Free plan is always available to fall back to.",
  },
  {
    question: "Does it work on Intel Macs?",
    answer: "Yes. BloomBoard supports both Apple Silicon (M1/M2/M3/M4) and Intel Macs running macOS 11 Big Sur or later.",
  },
];

function FreelanceFAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="faq" ref={ref} className="relative overflow-hidden border-t px-4 py-16 sm:py-24" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 820, height: 520, background: "radial-gradient(ellipse at center, rgba(77,159,255,0.04) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-5 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.82)", background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.12)" }}>
            FAQ
          </span>
          <h2 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Common questions about plans, privacy, the client portal, and how BloomBoard fits your freelance workflow.
          </p>
          <div className="mt-8 hidden rounded-2xl border border-white/[0.09] bg-black/60 p-5 backdrop-blur-xl lg:block">
            <p className="text-sm font-semibold text-text-primary">Still deciding?</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Start free, explore the dashboard, then upgrade when your client list grows.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-3xl border border-white/[0.09] bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FREELANCE_FAQS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/[0.08] px-5 py-5 transition-colors last:border-b-0 open:bg-white/[0.035] sm:px-7"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-text-primary sm:text-lg">
                <span className="leading-snug">{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.035] text-lg text-text-muted transition-all group-open:rotate-45 group-open:border-white/20 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Bottom CTA (mirrors main DownloadCTA style) ──────────────────────────────
function FreelanceDownloadCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 260px 0px" });

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      {/* Large ambient glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(167,139,250,0.06) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          ref={ref}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#fbbf24" }}>💼 Ready to start?</p>

          <h2
            className="font-bold leading-[1.05] tracking-tight text-text-primary whitespace-nowrap"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)" }}
          >
            Focus on clients, not tools.
          </h2>

          <p className="max-w-lg text-sm leading-relaxed text-text-muted sm:text-lg">
            Download free. No account needed. The Hive suite is waiting inside.
          </p>

          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="relative flex items-center gap-4 flex-wrap justify-center">
              {/* Butterfly — lands near the Start Flow button */}
              <motion.div
                className="pointer-events-none absolute left-[62%] top-0 z-20 hidden lg:block"
                style={{ willChange: "transform, opacity" }}
                initial={{ opacity: 0, x: -420, y: -430, rotate: -28, scale: 0.46 }}
                animate={
                  isInView
                    ? {
                        opacity: [0, 1, 1, 1],
                        x: [-420, -240, -80, 0],
                        y: [-430, -290, -150, -56],
                        rotate: [-28, 18, -8, 0],
                        scale: [0.46, 0.70, 0.63, 0.58],
                      }
                    : {}
                }
                transition={{
                  duration: 2.8,
                  delay: 0.1,
                  times: [0, 0.32, 0.68, 1],
                  x:      { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  y:      { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  rotate: { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  scale:  { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  opacity: { ease: "easeOut", duration: 0.45 },
                }}
              >
                <HolographicButterfly />
              </motion.div>

              {/* Download button — clean white Apple style */}
              <a
                href={DOWNLOAD_URL}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:brightness-105 sm:w-auto sm:px-8"
                style={{
                  background: "rgba(255,255,255,0.93)",
                  color: "#0a0f1c",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download Free for Mac
              </a>

              {/* Flow button — soft light style matching pricing card */}
              <a
                data-butterfly-cta="true"
                href="https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
                style={{
                  background: "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)",
                  color: "#e8f4ff",
                  border: "1.5px solid rgba(77,159,255,0.45)",
                  boxShadow: "0 0 0 1px rgba(77,159,255,0.12), 0 8px 32px rgba(30,120,255,0.28), 0 2px 12px rgba(77,159,255,0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                Start Flow — $7.99/mo
              </a>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-text-muted sm:max-w-none">
              Requires macOS 11+. Apple Silicon & Intel. Free plan available forever.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["No account", "Local-first", "Free to start", "AI-powered"].map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(57,255,20,0.08)",
                  border: "1px solid rgba(57,255,20,0.18)",
                  color: "#39FF14",
                }}
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Feature card mini previews ──────────────────────────────────────────────
function FeaturePreview({ title, color }: { title: string; color: string }) {
  const c = color;
  const c30 = `${color}4d`;
  const c60 = `${color}99`;

  if (title === "Business Dashboard") return (
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {[55, 80, 45, 95, 65].map((h, i) => (
        <motion.div key={i} className="w-[5px] rounded-sm"
          style={{ background: c30, originY: 1, height: `${h}%` }}
          animate={{ scaleY: [1, 1.25, 0.85, 1.1, 1], opacity: [0.5, 1, 0.6, 1, 0.5] }}
          transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  if (title === "Smart Pricing") return (
    <div className="relative flex items-center justify-center" style={{ width: 28, height: 28 }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full border"
          style={{ borderColor: c60, width: 10 + i * 9, height: 10 + i * 9 }}
          animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      <span className="text-[9px] font-bold relative" style={{ color: c }}>$</span>
    </div>
  );

  if (title === "Client Portal") return (
    <div className="flex items-center gap-1.5">
      <motion.div className="h-1.5 w-1.5 rounded-full" style={{ background: c }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <motion.div className="h-px rounded-full" style={{ background: c60, width: 18 }}
        animate={{ scaleX: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </div>
  );

  if (title === "Asset Delivery Hub") return (
    <motion.div className="flex flex-col items-center gap-0.5">
      <motion.div className="text-[11px]" style={{ color: c }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >↑</motion.div>
      <div className="h-[3px] w-5 rounded-full" style={{ background: c30 }} />
    </motion.div>
  );

  if (title === "Revision Tracker") return (
    <motion.div style={{ width: 24, height: 24, color: c }}
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" opacity={0.35} />
        <path d="M21 3v5h-5" />
      </svg>
    </motion.div>
  );

  if (title === "Approvals") return (
    <motion.div style={{ color: c }}
      initial={{ pathLength: 0 }}
    >
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M2 11L9 18L23 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );

  if (title === "AI Proposals") return (
    <div className="flex flex-col gap-1" style={{ width: 36 }}>
      {[100, 75, 55].map((w, i) => (
        <motion.div key={i} className="rounded-full" style={{ height: 2.5, background: i === 0 ? c : c30 }}
          animate={{ scaleX: [1, 0.5, 1] }}
          transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  if (title === "Invoices & Contracts") return (
    <div className="flex flex-col gap-1" style={{ width: 28 }}>
      {[1, 0.6, 0.4].map((op, i) => (
        <motion.div key={i} className="rounded-full h-[2px]" style={{ background: c, opacity: op }}
          animate={{ opacity: [op, op * 1.6, op] }}
          transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
    </div>
  );

  if (title === "Projects") return (
    <div className="flex flex-col gap-1" style={{ width: 36 }}>
      <div className="rounded-full overflow-hidden" style={{ height: 3, background: c30 }}>
        <motion.div className="h-full rounded-full" style={{ background: c }}
          animate={{ width: ["20%", "85%", "20%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 3, background: c30 }}>
        <motion.div className="h-full rounded-full" style={{ background: c60 }}
          animate={{ width: ["55%", "30%", "55%"] }}
          transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  if (title === "Payment Methods") return (
    <motion.div className="rounded" style={{ width: 28, height: 18, background: c30, border: `1px solid ${c60}` }}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mt-1 mx-1.5 rounded-sm" style={{ height: 3, background: c }} />
    </motion.div>
  );

  if (title === "Freelancer Profile") return (
    <div className="relative flex items-center justify-center" style={{ width: 26, height: 26 }}>
      <motion.div className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${c}` }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <div className="rounded-full" style={{ width: 14, height: 14, background: c30, border: `1.5px solid ${c}` }} />
    </div>
  );

  // Client Workspace — default
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="rounded-sm" style={{ width: 7, height: 18, background: c30 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Butterfly ────────────────────────────────────────────────────────────────
function FreelanceButterfly() {
  const bx       = useMotionValue(1600);
  const by       = useMotionValue(300);
  const bRotate  = useMotionValue(0);
  const bOpacity = useMotionValue(0);

  const springCfg = { stiffness: 16, damping: 7, mass: 2.0 };
  const springX   = useSpring(bx,       springCfg);
  const springY   = useSpring(by,       springCfg);
  const springRot = useSpring(bRotate,  { stiffness: 24, damping: 11 });
  const springOp  = useSpring(bOpacity, { stiffness: 44, damping: 17 });

  const phase       = useRef<"idle" | "wandering" | "gone" | "landing" | "landed">("idle");
  const wanderTimer = useRef<ReturnType<typeof setTimeout>>();

  const flee = useCallback(() => {
    if (wanderTimer.current) clearTimeout(wanderTimer.current);
    phase.current = "gone";
    const vw = window.innerWidth;
    bx.set(vw + 140);
    by.set(-100);
    bOpacity.set(0);
  }, [bx, by, bOpacity]);

  const moveTo = useCallback((tx: number, ty: number, snapRot?: number) => {
    const dx = tx - bx.get(), dy = ty - by.get();
    bRotate.set(snapRot ?? Math.atan2(dy, dx) * (180 / Math.PI) * 0.2);
    bx.set(tx);
    by.set(ty);
  }, [bx, by, bRotate]);

  const scheduleWander = useCallback(() => {
    if (wanderTimer.current) clearTimeout(wanderTimer.current);
    const delay = 2600 + Math.random() * 2200;
    wanderTimer.current = setTimeout(() => {
      if (phase.current !== "wandering") return;
      const vw = window.innerWidth, vh = window.innerHeight;
      moveTo(
        vw * 0.22 + Math.random() * vw * 0.56,
        vh * 0.08 + Math.random() * vh * 0.72,
      );
      scheduleWander();
    }, delay);
  }, [moveTo]);


  useEffect(() => {
    if (typeof window === "undefined") return;

    // Carousel navigation → jump to new random spot
    const onCarouselNav = () => {
      if (phase.current !== "wandering") return;
      const vw = window.innerWidth, vh = window.innerHeight;
      moveTo(
        vw * 0.22 + Math.random() * vw * 0.56,
        vh * 0.08 + Math.random() * vh * 0.72,
      );
    };
    window.addEventListener("carouselNav", onCarouselNav);

    const heroEl     = document.getElementById("hero");
    const featuresEl = document.getElementById("features");
    const pricingEl  = document.getElementById("pricing");
    if (!featuresEl || !pricingEl) return;

    // Hero visible (user scrolled back up) → flee
    let heroObs: IntersectionObserver | null = null;
    if (heroEl) {
      heroObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && phase.current === "wandering") flee();
      }, { threshold: 0.15 });
      heroObs.observe(heroEl);
    }

    // Features section → fly in and start wandering (works on every re-entry)
    const featObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      if (phase.current !== "idle" && phase.current !== "gone") return;
      if (wanderTimer.current) clearTimeout(wanderTimer.current);
      const vw = window.innerWidth, vh = window.innerHeight;
      // Fly in from the right each time
      bx.set(vw + 100);
      by.set(vh * 0.3);
      bOpacity.set(1);
      phase.current = "wandering";
      moveTo(
        vw * 0.52 + Math.random() * vw * 0.26,
        vh * 0.18 + Math.random() * vh * 0.32,
      );
      scheduleWander();
    }, { threshold: 0.2 });

    // Pricing section → flee
    const pricObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || phase.current !== "wandering") return;
      flee();
    }, { threshold: 0.1 });

    featObs.observe(featuresEl);
    pricObs.observe(pricingEl);

    return () => {
      window.removeEventListener("carouselNav", onCarouselNav);
      heroObs?.disconnect();
      featObs.disconnect();
      pricObs.disconnect();
      if (wanderTimer.current) clearTimeout(wanderTimer.current);
    };
  }, [bx, by, bOpacity, bRotate, flee, moveTo, scheduleWander]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        rotate: springRot,
        opacity: springOp,
        zIndex: 9998,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {/* Scale the holographic butterfly to a comfortable wandering size */}
      <div style={{ transform: "scale(0.62)", transformOrigin: "center" }}>
        <HolographicButterfly />
      </div>
    </motion.div>
  );
}

// ─── Pricing card ─────────────────────────────────────────────────────────────
function FreelancePricingCard({ plan, yearly }: { plan: typeof FREELANCE_PLANS[0]; yearly: boolean }) {
  const isBloom = plan.name === "Bloom";
  const isFlow  = plan.name === "Flow";
  const isFeatured = isBloom || isFlow;
  const showYearly = yearly && Boolean(plan.yearlyPrice);
  const monthlyEquiv = showYearly && plan.yearlyPrice
    ? `$${(Number(plan.yearlyPrice.replace(/\D/g, "")) / 12).toFixed(2).replace(/\.00$/, "")}`
    : null;
  const displayPrice = monthlyEquiv ?? plan.price;
  const accentMuted = isBloom
    ? "rgba(196,181,253,0.55)"
    : isFlow
      ? "rgba(147,197,253,0.55)"
      : "rgba(255,255,255,0.3)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={isFeatured ? { scale: 1.018, transition: { duration: 0.22 } } : { scale: 1.01, transition: { duration: 0.22 } }}
      className="relative flex w-full flex-col transition-shadow duration-500 cursor-default sm:h-full"
      style={{
        borderRadius: "18px",
        background: isBloom
          ? "linear-gradient(155deg, rgba(22,14,42,0.97) 0%, rgba(14,10,28,0.96) 50%, rgba(20,12,36,0.97) 100%)"
          : isFlow
            ? "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)"
            : "linear-gradient(145deg, rgba(8,8,10,0.92), rgba(18,18,22,0.78))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: isBloom
          ? "1.5px solid rgba(167,139,250,0.35)"
          : isFlow
            ? "1.5px solid rgba(77,159,255,0.38)"
            : "1px solid rgba(255,255,255,0.09)",
        boxShadow: isBloom
          ? "0 0 0 1px rgba(167,139,250,0.12), 0 30px 80px rgba(109,40,217,0.22), 0 8px 32px rgba(167,139,250,0.12)"
          : isFlow
            ? "0 0 0 1px rgba(77,159,255,0.12), 0 30px 80px rgba(30,120,255,0.18), 0 8px 32px rgba(77,159,255,0.1)"
            : "none",
      }}
    >
      {/* Hover glow pulse overlay */}
      {isFeatured && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[18px]"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: isBloom
              ? "radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.18) 0%, transparent 65%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(77,159,255,0.18) 0%, transparent 65%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Ambient glow behind featured cards */}
      {isFeatured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px"
          style={{
            borderRadius: "18px",
            background: isBloom
              ? "radial-gradient(ellipse at 60% 0%, rgba(139,92,246,0.18) 0%, transparent 65%)"
              : "radial-gradient(ellipse at 52% 0%, rgba(77,159,255,0.2) 0%, transparent 65%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5"
            style={isFlow
              ? {
                  background: "linear-gradient(135deg, rgba(77,159,255,0.95), rgba(37,99,235,0.9))",
                  color: "#fff",
                  border: "1px solid rgba(147,197,253,0.45)",
                  boxShadow: "0 4px 22px rgba(37,99,235,0.48), 0 0 0 1px rgba(77,159,255,0.22)",
                }
              : {
                  background: "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(109,40,217,0.85))",
                  color: "#fff",
                  border: "1px solid rgba(196,181,253,0.4)",
                  boxShadow: "0 4px 20px rgba(109,40,217,0.5), 0 0 0 1px rgba(167,139,250,0.2)",
                }}
          >
            <span>✦</span>
            {plan.badge}
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <div
        className="px-6 pt-7 pb-5 relative z-[1] min-h-[12rem]"
        style={{
          borderBottom: isBloom
            ? "1px solid rgba(167,139,250,0.12)"
            : isFlow
              ? "1px solid rgba(77,159,255,0.14)"
              : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: plan.accentColor }}>
            {plan.name}
          </span>
          {isBloom && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.2)" }}
            >
              AI Power
            </span>
          )}
        </div>

        <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="font-bold text-white" style={{ fontSize: isFeatured ? "2.75rem" : "2.25rem" }}>
            {displayPrice}
          </span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.subtext}</span>
        </div>

        {plan.yearlyPrice && !showYearly && (
          <p className="text-xs" style={{ color: accentMuted }}>or {plan.yearlyPrice} / yr</p>
        )}
        {showYearly && plan.yearlyPrice && (
          <p className="text-xs" style={{ color: accentMuted }}>Billed {plan.yearlyPrice} / year</p>
        )}
        {!plan.yearlyPrice && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>&nbsp;</p>
        )}

        {isBloom && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["🤖 AI Contracts", "📄 AI Proposals", "📊 Full KPIs", "🔗 Portal"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(139,92,246,0.14)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.22)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Feature groups ── */}
      <div className="px-6 py-5 flex flex-col flex-1 relative z-[1]">
        {plan.featureGroups.map((group, index) => {
          const isAIGroup     = group.category === "AI Features";
          const isClientGroup = group.category === "Client Tools";

          return (
            <div
              key={group.category}
              className={
                isAIGroup || isClientGroup
                  ? "mt-5 rounded-2xl border p-4"
                  : index > 0
                    ? "mt-5 border-t pt-5"
                    : ""
              }
              style={
                isAIGroup
                  ? {
                      borderColor: isBloom ? "rgba(196,181,253,0.34)" : "rgba(255,255,255,0.11)",
                      background: isBloom
                        ? "linear-gradient(145deg, rgba(124,58,237,0.2), rgba(255,255,255,0.035))"
                        : "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
                      boxShadow: isBloom
                        ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 40px rgba(109,40,217,0.14)"
                        : "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }
                : isClientGroup
                  ? {
                      borderColor: isBloom
                        ? "rgba(251,191,36,0.38)"
                        : isFlow
                          ? "rgba(77,159,255,0.28)"
                          : "rgba(255,255,255,0.08)",
                      background: isBloom
                        ? "linear-gradient(145deg, rgba(217,119,6,0.18), rgba(255,255,255,0.03))"
                        : isFlow
                          ? "linear-gradient(145deg, rgba(30,80,200,0.14), rgba(77,159,255,0.04))"
                          : "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                      boxShadow: isBloom
                        ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 32px rgba(217,119,6,0.15)"
                        : isFlow
                          ? "inset 0 1px 0 rgba(77,159,255,0.1), 0 8px 24px rgba(30,100,255,0.1)"
                          : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }
                : index > 0
                  ? { borderColor: isBloom ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.06)" }
                  : {}
              }
            >
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{
                    color: isAIGroup
                      ? (isBloom ? "#c4b5fd" : "rgba(255,255,255,0.42)")
                    : isClientGroup
                      ? (isBloom ? "#fde68a" : isFlow ? "rgba(77,159,255,0.75)" : "rgba(255,255,255,0.28)")
                    : isBloom
                      ? "rgba(196,181,253,0.4)"
                    : "rgba(255,255,255,0.28)",
                  }}
                >
                  {group.category}
                </p>
                {isAIGroup && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={isBloom
                      ? { color: "#ede9fe", background: "rgba(124,58,237,0.22)", border: "1px solid rgba(196,181,253,0.28)" }
                      : { color: "rgba(255,255,255,0.62)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    AI
                  </span>
                )}
                {isClientGroup && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      color: isBloom ? "#fde68a" : isFlow ? "#93c5fd" : "rgba(255,255,255,0.4)",
                      background: isBloom ? "rgba(217,119,6,0.22)" : isFlow ? "rgba(30,100,220,0.15)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isBloom ? "rgba(251,191,36,0.3)" : isFlow ? "rgba(77,159,255,0.28)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    💼 Hive
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => {
                  const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
                    // Payment methods
                    "Bank Transfer":    { bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                    "PayPal":           { bg: "rgba(0,112,186,0.18)",   color: "#60a5fa", border: "rgba(0,112,186,0.32)" },
                    "Wise":             { bg: "rgba(157,232,112,0.15)", color: "#86efac", border: "rgba(157,232,112,0.28)" },
                    "Stripe":           { bg: "rgba(99,91,255,0.18)",   color: "#a78bfa", border: "rgba(99,91,255,0.32)" },
                    "Custom":           { bg: "rgba(77,159,255,0.08)",  color: "rgba(147,197,253,0.6)", border: "rgba(77,159,255,0.18)" },
                    "+4 more":          { bg: "rgba(77,159,255,0.06)",  color: "rgba(147,197,253,0.45)", border: "rgba(77,159,255,0.14)" },
                    // Invoice templates
                    "Standard Invoice": { bg: "rgba(30,80,160,0.16)",   color: "#93c5fd", border: "rgba(77,159,255,0.24)" },
                    "Deposit (50%)":    { bg: "rgba(52,211,153,0.15)",  color: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
                    "Final Balance":    { bg: "rgba(56,189,248,0.15)",  color: "#7dd3fc", border: "rgba(56,189,248,0.28)" },
                    "Revision Charge":  { bg: "rgba(251,146,60,0.15)",  color: "#fdba74", border: "rgba(251,146,60,0.28)" },
                    "Monthly Retainer": { bg: "rgba(167,139,250,0.18)", color: "#c4b5fd", border: "rgba(167,139,250,0.3)" },
                    // Info tips
                    "Video? Use links":              { bg: "rgba(251,191,36,0.12)", color: "#fcd34d",  border: "rgba(251,191,36,0.3)"  },
                    "Based on your currency & region": { bg: "rgba(34,211,238,0.10)", color: "#67e8f9",  border: "rgba(34,211,238,0.28)" },
                  };
                  const hasBadges = "badges" in item && Array.isArray((item as { badges?: string[] }).badges);
                  const badges = hasBadges ? (item as { badges: string[] }).badges : [];

                  return (
                    <li key={item.text} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex-shrink-0 text-xs font-bold"
                        style={{ color: item.included ? "#39FF14" : "rgba(255,255,255,0.2)" }}
                      >
                        {item.included ? "✓" : "✕"}
                      </span>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span
                          className="text-sm leading-snug"
                          style={{
                            color: item.included
                              ? (isBloom ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)")
                              : "rgba(255,255,255,0.25)",
                            textDecoration: item.included ? "none" : "line-through",
                          }}
                        >
                          {item.text}
                        </span>
                        {badges.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {badges.map((badge) => {
                              const c = badgeColors[badge] ?? badgeColors["Custom"];
                              return (
                                <span
                                  key={badge}
                                  className="rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide"
                                  style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                                >
                                  {badge}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <div className="relative z-[1] mt-auto px-6 pb-6">
        {isBloom && (
          <p className="text-center text-[10px] mb-2" style={{ color: "rgba(196,181,253,0.5)" }}>
            7-day free trial · Cancel anytime
          </p>
        )}
        <a
          href={showYearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref}
          className="block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.025] active:translate-y-0 active:scale-[0.99]"
          style={isBloom
            ? {
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                color: "#fff",
                border: "1px solid rgba(196,181,253,0.3)",
                boxShadow: "0 8px 30px rgba(109,40,217,0.45), 0 0 0 1px rgba(167,139,250,0.15)",
              }
            : isFlow
              ? { background: "#4d9fff", color: "white", border: "1px solid rgba(77,159,255,0.5)" }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }
          }
        >
          {plan.cta}
        </a>
      </div>
    </motion.div>
  );
}

// ─── Hive Features Mobile Carousel ───────────────────────────────────────────
function HiveFeaturesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const pages = Array.from(
    { length: Math.ceil(HIVE_FEATURES.length / 3) },
    (_, pi) => HIVE_FEATURES.slice(pi * 3, pi * 3 + 3)
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => setActivePage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sm:hidden">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {pages.map((page, pi) => (
          <div key={pi} className="w-full shrink-0 snap-start flex flex-col gap-3">
            {page.map((f) => {
              const Icon = HIVE_FEATURE_ICONS[f.title] ?? BarChart3;
              const glowColor = `${f.color}24`;
              const softGlowColor = `${f.color}12`;
              const isAI = f.title.includes("AI") || f.title.includes("Pricing");
              return (
                <div
                  key={f.title}
                  className="relative flex min-h-[100px] flex-col gap-2.5 overflow-hidden rounded-[20px] p-4 pb-5"
                  style={{
                    background: `linear-gradient(145deg, rgba(12,12,14,0.94) 0%, rgba(6,6,8,0.86) 72%), radial-gradient(circle at 86% 10%, ${softGlowColor}, transparent 42%)`,
                    border: "1px solid rgba(255,255,255,0.11)",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-px rounded-[25px] opacity-80"
                    style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.035) 100%)", zIndex: 0 }}
                  />
                  <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                    <div
                      className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        background: `linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035)), radial-gradient(circle at 50% 0%, ${glowColor}, transparent 62%)`,
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <Icon aria-hidden="true" className="relative h-4 w-4 text-white/90" strokeWidth={1.9} />
                    </div>
                    {isAI && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider"
                        style={{ background: "linear-gradient(135deg, #6d28d9, #4f46e5)", color: "#fff", boxShadow: "0 10px 24px rgba(109,40,217,0.35)" }}
                      >
                        AI
                      </span>
                    )}
                  </div>
                  <div className="relative flex flex-col gap-1.5" style={{ zIndex: 1 }}>
                    <h3 className="text-sm font-semibold leading-tight text-text-primary">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-text-muted">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => carouselRef.current?.scrollTo({ left: i * carouselRef.current.clientWidth, behavior: "smooth" })}
            className="rounded-full transition-all duration-300"
            style={{
              width: activePage === i ? "1.5rem" : "0.375rem",
              height: "0.375rem",
              background: activePage === i ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FreelancePage() {
  const [yearly, setYearly] = useState(true);
  const [lampOn, setLampOn] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      <StickyCTABar />
      <FreelanceButterfly />
      <Header
        logoHref="https://mybloomboard.app"
        customLinks={[
          { label: "Features", href: "#features" },
          { label: "Deep Dive", href: "#freelance-smart-ai" },
          { label: "Pricing", href: "#pricing" },
          { label: "Customer Portal", href: "https://polar.sh/bloombooard/portal", external: true },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div id="hero" aria-hidden="true" style={{ position: "absolute", top: 0, height: "1px", width: "1px" }} />
      <LampContainer isOn={lampOn}>

        {/* Headline — beam loads first (0.3s delay, 0.8s duration = done at 1.1s), text comes up after */}
        <motion.h1
          key={lampOn ? "on-title" : "off-title"}
          initial={{ opacity: 0.5, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="text-center text-[1.9rem] leading-[1.18] font-bold sm:text-5xl lg:text-7xl mb-4 sm:mb-6 pt-2 sm:pt-10 lg:pt-20"
          style={{ color: lampOn ? "#ffffff" : "rgba(255,255,255,0.3)" }}
        >
          {lampOn ? (
            <>
              Your freelance business.<br className="hidden sm:block" />
              {" "}
              <span style={{
                background: "linear-gradient(90deg, #4d9fff 0%, #a78bfa 32%, #f472b6 58%, #ff453a 82%, #ff453a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                One Board.
              </span>
            </>
          ) : (
            <>Where Did<br />Everything Go?</>
          )}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          key={lampOn ? "on-sub" : "off-sub"}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeInOut" }}
          className="mx-auto mb-5 sm:mb-10 max-w-2xl text-center text-sm leading-relaxed sm:text-base lg:text-lg px-3 sm:px-0"
          style={{ color: lampOn ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}
        >
          {lampOn
            ? "Manage clients, proposals, contracts, invoices, payments, asset delivery and revisions all in one productivity workspace."
            : "Clients, contracts, invoices, files, revisions, payments, and tasks scattered across different apps."}
        </motion.p>

        {/* Toggle + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-14"
        >
          <button
            onClick={() => setLampOn(!lampOn)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: lampOn ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              color: lampOn ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
              border: `1px solid ${lampOn ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/><path d="M10 22h4"/>
            </svg>
            {lampOn ? "Turn Off" : "Turn On"}
          </button>

          {lampOn && (
            <motion.a
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              href={DOWNLOAD_URL}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #ffffff, #d1d5db)", color: "#000", boxShadow: "0 8px 28px rgba(255,255,255,0.15)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download Free
            </motion.a>
          )}
        </motion.div>

        {/* Stats — only when on */}
        {lampOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8 w-full max-w-xs sm:max-w-none px-4 sm:px-0"
          >
            {/* Row 1 — 3 stats */}
            <div className="grid grid-cols-3 gap-x-6 w-full items-end sm:contents">
              <CountUpStat target={10} suffix="+" label="Modules" startDelay={700} />
              <TextRevealStat value="Free" label="To start" startDelay={850} />
              <TextRevealStat value="AI" label="Invoices" startDelay={950} />
            </div>
            {/* Row 2 — 2 stats centered */}
            <div className="grid grid-cols-2 gap-x-6 items-end sm:contents">
              <TextRevealStat value="Smart Pricing" label="AI pricing" startDelay={1050} />
              <CountUpStat target={0} suffix="" label="Extra tools" startDelay={900} />
            </div>
          </motion.div>
        )}
      </LampContainer>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ color: "#fbbf24", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              Everything you need
            </span>
            <h2 className="text-3xl font-bold sm:text-5xl mb-4">Built for how freelancers actually work</h2>
            <p className="mx-auto max-w-xl text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
              Every module connects — complete a project, trigger an invoice, client approves, contract signed. All without leaving your dashboard.
            </p>
          </motion.div>

          {/* Mobile only: paginated swipe carousel — 3 cards per page */}
          <HiveFeaturesCarousel />

          {/* Desktop only: original grid — untouched */}
          <div className="hidden sm:grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HIVE_FEATURES.map((f, i) => (
              (() => {
                const Icon = HIVE_FEATURE_ICONS[f.title] ?? BarChart3;
                const glowColor = `${f.color}24`;
                const softGlowColor = `${f.color}12`;
                const isAI = f.title.includes("AI") || f.title.includes("Pricing");

                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                    transition={{ duration: 0.5, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.22, ease: "easeOut" } }}
                    className="group relative flex min-h-[160px] cursor-pointer flex-col gap-2.5 overflow-hidden rounded-[20px] p-4 pb-5 sm:p-5 sm:pb-6"
                    style={{
                      background: `linear-gradient(145deg, rgba(12,12,14,0.94) 0%, rgba(6,6,8,0.86) 72%), radial-gradient(circle at 86% 10%, ${softGlowColor}, transparent 42%)`,
                      border: "1px solid rgba(255,255,255,0.11)",
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      contain: "layout paint style",
                      willChange: "transform",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-px rounded-[25px] opacity-80"
                      style={{
                        background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.035) 100%)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 22% 12%, rgba(255,255,255,0.1), transparent 30%), radial-gradient(circle at 82% 78%, ${glowColor}, transparent 42%)`,
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute left-6 right-6 top-0 h-px opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to right, transparent, ${f.color}80, rgba(255,255,255,0.45), transparent)` }}
                    />

                    <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                      <div
                        className="relative flex h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 group-hover:-translate-y-0.5"
                        style={{
                          background: `linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035)), radial-gradient(circle at 50% 0%, ${glowColor}, transparent 62%)`,
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        <span
                          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 68%)` }}
                        />
                        <Icon
                          aria-hidden="true"
                          className="relative h-4 w-4 sm:h-5 sm:w-5 text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
                          strokeWidth={1.9}
                        />
                      </div>

                      {isAI && (
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

                    <div className="relative flex flex-col gap-2.5" style={{ zIndex: 1 }}>
                      <h3 className="text-sm sm:text-base font-semibold leading-tight text-text-primary transition-colors group-hover:text-white">
                        {f.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-text-muted transition-colors duration-500 group-hover:text-white/58">
                        {f.desc}
                      </p>
                    </div>

                    {/* Mini animated preview — visible on hover */}
                    <div
                      className="absolute bottom-5 right-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ zIndex: 1 }}
                      aria-hidden="true"
                    >
                      <FeaturePreview title={f.title} color={f.color} />
                    </div>

                    <div
                      className="absolute bottom-0 left-7 right-7 h-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to right, transparent, ${f.color}, transparent)`,
                        zIndex: 1,
                      }}
                    />
                  </motion.div>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <FreelanceSmartAIFeatures />

      {/* ── Comparison ───────────────────────────────────────────────── */}
      <ComparisonSection />

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 py-20 sm:py-28 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ color: "#fbbf24", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              Freelance Pricing
            </span>
            <h2 className="text-3xl font-bold sm:text-5xl mb-4">Start free.<br />Unlock as you grow.</h2>
            <p className="mx-auto max-w-lg text-base mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              All plans include the full productivity suite. Hive unlocks the freelance business layer.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setYearly(false)}
                className="rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                style={{ background: !yearly ? "rgba(255,255,255,0.1)" : "transparent", color: !yearly ? "#fff" : "#607080" }}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className="flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                style={{ background: yearly ? "rgba(255,255,255,0.1)" : "transparent", color: yearly ? "#fff" : "#607080" }}
              >
                Yearly
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.25)" }}>
                  2 months free
                </span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 pt-6 sm:items-stretch sm:grid-cols-[repeat(3,minmax(0,1fr))]">
            {FREELANCE_PLANS.map((plan) => (
              <div key={plan.name} className="flex min-w-0 w-full pt-4 sm:h-full">
                <FreelancePricingCard plan={plan} yearly={yearly} />
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.3)" }}>
            All paid plans include a 7-day free trial. No credit card required to start. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Testimonials + Plan Quiz ─────────────────────────────────── */}
      <div style={{ background: "linear-gradient(to top, #152331, #000000)" }}>
        <FreelanceTestimonials />
        <FreelancePlanQuiz />
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FreelanceFAQ />

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <FreelanceDownloadCTA />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
