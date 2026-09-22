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
const PlanQuiz = dynamic(() => import("@/components/sections/PlanQuiz"));
const LiveDemoFrame = dynamic(() => import("@/components/sections/LiveDemoFrame"));
import type { QuizStep, PlanResult } from "@/components/sections/PlanQuiz";
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
import {
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  Check,
  CreditCard,
  FilePenLine,
  FileSignature,
  FolderKanban,
  Layers,
  Link2,
  Minus,
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
          className="fixed bottom-5 right-5 z-[100] hidden sm:flex items-center gap-3 rounded-xl px-3 py-2"
          style={{
            background: "#0e141b",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          <span className="hidden text-xs font-medium sm:block" style={{ color: "rgba(255,255,255,0.6)" }}>
            BloomBoard Freelance
          </span>
          <div className="hidden sm:block h-3.5 w-px" style={{ background: "rgba(255,255,255,0.15)" }} />
          <a
            href="https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/15 text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            Download Free
          </a>
          <a
            href="https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D"
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white text-black transition-colors hover:bg-white/90"
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
    cta: "Download free",
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
    badge: "Most popular" as string | null,
    cta: "Start 7-day trial",
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
    badge: "Best value" as string | null,
    cta: "Start 7-day trial",
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
      <p className="mt-0.5 text-[10px] leading-tight sm:text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
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
        initial={{ opacity: 0, y: 6 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 text-[10px] leading-tight sm:text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
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
          <h2 className="text-3xl font-bold sm:text-4xl">What freelancers say</h2>
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
                  style={{ background: "#0b0d10", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">{t.tag === "Team" ? "Team" : "Solo"}</span>
                  </div>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.78)" }}>
                    {t.quote}
                  </p>
                  <div className="mt-auto flex items-center gap-2.5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}>
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
                background: activePage === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
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
              style={{ background: "#0b0d10", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/45">{t.tag === "Team" ? "Team" : "Solo"}</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.78)" }}>
                {t.quote}
              </p>
              <div className="mt-auto flex items-center gap-2.5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}>
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

// ─── Plan Quiz (shared component, freelance questions) ───────────────────────
const FREELANCE_QUIZ_STEPS: QuizStep[] = [
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

const FREELANCE_QUIZ_RESULTS: Record<"free" | "flow" | "bloom", PlanResult> = {
  free:  { name: "Free",  desc: "Perfect to get started — 2 clients, full productivity suite, no card needed.", href: "#pricing" },
  flow:  { name: "Flow",  desc: "Built for growing freelancers — client portal, smart pricing, 10 clients.", href: "https://buy.polar.sh/polar_cl_vlLVUrxnBszMR59XsC2pmP5R3rmcqAgll5B501xt17D" },
  bloom: { name: "Bloom", desc: "Unlimited clients, AI proposals & contracts, full automation suite.", href: "https://buy.polar.sh/polar_cl_6OVDu8uzWINVJcKoprQ4ZArcfNFLvYCYUDwG30A45DS" },
};

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
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Common questions about plans, privacy, the client portal, and how BloomBoard fits your freelance workflow.
          </p>
          <div className="mt-8 hidden border-l-2 border-white/15 pl-4 lg:block">
            <p className="text-sm font-semibold text-text-primary">Still deciding?</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Start free, explore the dashboard, then upgrade when your client list grows.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-white/10"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FREELANCE_FAQS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/10 py-5"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-text-primary sm:text-lg">
                <span className="leading-snug">{item.question}</span>
                <span aria-hidden className="shrink-0 text-2xl font-light leading-none text-white/50 transition-transform duration-200 group-open:rotate-45 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-white/65 sm:text-base">
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
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          ref={ref}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
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
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a0f1c] transition-colors hover:bg-white/90 sm:w-auto"
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
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07] sm:w-auto"
              >
                Start Flow — $7.99/mo
              </a>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-text-muted sm:max-w-none">
              Requires macOS 11+. Apple Silicon & Intel. Free plan available forever.
            </p>
          </div>

          <p className="mt-2 text-sm text-white/50">No account · Local-first · Free to start</p>
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
/** Who each freelance plan is for, in plain words. */
const FREELANCE_TAGLINES: Record<string, string> = {
  Free: "Try the freelance tools with up to two clients.",
  Flow: "For growing freelancers with up to ten clients.",
  Bloom: "Unlimited clients, with AI proposals and contracts.",
};

function FreelancePricingCard({ plan, yearly }: { plan: typeof FREELANCE_PLANS[0]; yearly: boolean }) {
  const isPopular = plan.name === "Flow";
  const isBloom = plan.name === "Bloom";
  const hasTrial = plan.name === "Flow" || plan.name === "Bloom";
  const showYearly = yearly && Boolean(plan.yearlyPrice);
  const monthlyEquiv = showYearly && plan.yearlyPrice
    ? `$${(Number(plan.yearlyPrice.replace(/\D/g, "")) / 12).toFixed(2).replace(/\.00$/, "")}`
    : null;
  const displayPrice = monthlyEquiv ?? plan.price;
  const billingLine = showYearly && plan.yearlyPrice
    ? `Billed ${plan.yearlyPrice} / year`
    : plan.yearlyPrice
      ? `or ${plan.yearlyPrice} / year`
      : "\u00a0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border sm:h-full ${
        isPopular ? "border-white/35 bg-[#18181b]" : isBloom ? "border-violet-300/25 bg-[#111113]" : "border-white/10 bg-[#111113]"
      }`}
    >
      {(isPopular || isBloom) && (
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: isBloom ? "#a78bfa" : "#60a5fa" }} />
      )}
      {/* ── Header ── */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          {isPopular && (
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-black">Most popular</span>
          )}
          {!isPopular && plan.badge && (
            <span className="rounded-md bg-violet-400/15 px-2 py-0.5 text-xs font-semibold text-violet-200">{plan.badge}</span>
          )}
        </div>
        <p className="mt-1.5 min-h-[2.5rem] text-sm leading-snug text-white/55">{FREELANCE_TAGLINES[plan.name]}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-4xl font-bold tracking-tight text-white">{displayPrice}</span>
          <span className="text-sm text-white/50">{plan.subtext}</span>
        </div>
        <p className="mt-1 text-sm text-white/45">{billingLine}</p>

        <a
          href={showYearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref}
          className={`mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
            isPopular
              ? "bg-white text-black hover:bg-white/90"
              : isBloom
                ? "bg-violet-600 text-white hover:bg-violet-500"
                : "border border-white/20 text-white hover:bg-white/[0.07]"
          }`}
        >
          {plan.cta}
        </a>
        <p className="mt-2 text-center text-xs text-white/40">
          {hasTrial ? "7-day free trial · cancel anytime" : "macOS 11+ · Apple Silicon & Intel"}
        </p>
      </div>

      {/* ── What's included ── */}
      <div className="flex flex-1 flex-col border-t border-white/10 px-6 pb-6">
        {plan.featureGroups.map((group) => (
          <div key={group.category} className="pt-5">
            <p className="mb-2.5 text-sm font-medium text-white/85">{group.category}</p>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => {
                const badges = "badges" in item && Array.isArray((item as { badges?: string[] }).badges)
                  ? (item as { badges: string[] }).badges
                  : [];
                return (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm leading-snug">
                    {item.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.6} />
                    ) : (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/25" strokeWidth={2.4} />
                    )}
                    <span className="min-w-0">
                      <span className={item.included ? "text-white/80" : "text-white/35"}>{item.text}</span>
                      {badges.length > 0 && (
                        <span className="mt-0.5 block text-xs leading-snug text-white/40">{badges.join(" · ")}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
              const isAI = f.title.includes("AI") || f.title.includes("Pricing");
              return (
                <div
                  key={f.title}
                  className="relative flex min-h-[100px] flex-col gap-2.5 overflow-hidden rounded-[20px] p-4 pb-5"
                  style={{
                    background: "#0b0d10",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                    <div
                      className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <Icon aria-hidden="true" className="relative h-4 w-4 text-white/90" strokeWidth={1.9} />
                    </div>
                    {isAI && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider"
                        style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
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
              background: activePage === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
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
          { label: "Live Demo", href: "#live-demo" },
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
              <span className="text-white/55">One Board.</span>
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
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/[0.1]"
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
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
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

      {/* ── Live demo: the freelance workspace only ─────────────────────── */}
      <section id="live-demo" className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <LiveDemoFrame workspaces="freelance" className="mx-auto" />
      </section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-5xl mb-4">Built for how freelancers actually work</h2>
            <p className="mx-auto max-w-xl text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
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
                const isAI = f.title.includes("AI") || f.title.includes("Pricing");

                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                    transition={{ duration: 0.5, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
                    className="group relative flex min-h-[160px] cursor-pointer flex-col gap-2.5 overflow-hidden rounded-[20px] p-4 pb-5 sm:p-5 sm:pb-6"
                    style={{
                      background: "#0b0d10",
                    border: "1px solid rgba(255,255,255,0.1)",
                      contain: "layout paint style",
                      willChange: "transform",
                    }}
                  >

                    <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                      <div
                        className="relative flex h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 group-hover:-translate-y-0.5"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <Icon
                          aria-hidden="true"
                          className="relative h-4 w-4 sm:h-5 sm:w-5 text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
                          strokeWidth={1.9}
                        />
                      </div>

                      {isAI && (
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider transition-transform duration-500 group-hover:-translate-y-0.5"
                          style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
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
                  </motion.div>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <FreelanceSmartAIFeatures />

      {/* ── Comparison ───────────────────────────────────────────────── */}
      <ComparisonSection tables={["freelance"]} />

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 py-20 sm:py-28 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-5xl mb-4">Start free.<br />Unlock as you grow.</h2>
            <p className="mx-auto max-w-lg text-base mb-8 text-white/60">
              All plans include the full productivity suite. Hive unlocks the freelance business layer.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3">
              <div className="inline-flex rounded-lg border border-white/15 p-0.5">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  aria-pressed={!yearly}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${!yearly ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  aria-pressed={yearly}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${yearly ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                >
                  Yearly
                </button>
              </div>
              <span className="text-sm text-white/55">Save 2 months with yearly</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 pt-6 sm:items-stretch sm:grid-cols-[repeat(3,minmax(0,1fr))]">
            {FREELANCE_PLANS.map((plan) => (
              <div key={plan.name} className="flex min-w-0 w-full pt-4 sm:h-full">
                <FreelancePricingCard plan={plan} yearly={yearly} />
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-10 text-white/45">
            All paid plans include a 7-day free trial. No credit card required to start. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Testimonials + Plan Quiz ─────────────────────────────────── */}
      <div className="bg-black">
        <FreelanceTestimonials />
        <PlanQuiz
          steps={FREELANCE_QUIZ_STEPS}
          results={FREELANCE_QUIZ_RESULTS}
          note="Every plan includes the full productivity suite. Upgrade only when your client list grows."
        />
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
