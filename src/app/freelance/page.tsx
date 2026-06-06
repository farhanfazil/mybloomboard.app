"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Header } from "@/components/ui/header-2";
import { LampContainer } from "@/components/ui/lamp";
import FreelanceSmartAIFeatures from "@/components/sections/FreelanceSmartAIFeatures";
import { Footer } from "@/components/ui/footer-section";
import {
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  FilePenLine,
  FileSignature,
  FolderKanban,
  Link2,
  Package,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBooard-Installer.dmg";

// ─── Pricing tiers ────────────────────────────────────────────────────────────
const FREELANCE_PLANS = [
  {
    name: "Free",
    price: "$0",
    yearlyPrice: null,
    subtext: "forever, no card needed",
    accentColor: "#607080",
    cta: "Download Free",
    ctaHref: DOWNLOAD_URL,
    features: [
      { text: "2 clients", included: true },
      { text: "2 projects", included: true },
      { text: "3 invoices (lifetime)", included: true },
      { text: "Basic dashboard — 2 KPI cards", included: true },
      { text: "Smart Pricing Engine", included: false },
      { text: "Client Portal", included: false },
      { text: "Asset Delivery Hub", included: false },
      { text: "Revision Tracker", included: false },
      { text: "Contracts", included: false },
      { text: "Approvals", included: false },
      { text: "Proposals", included: false },
      { text: "Invoice PDF Export", included: false },
      { text: "Business Health Score", included: false },
      { text: "Monthly revenue per client", included: false },
      { text: "AI Contract Generator", included: false },
      { text: "AI Proposal Generator", included: false },
    ],
  },
  {
    name: "Flow",
    price: "$7.99",
    yearlyPrice: "$72",
    subtext: "/ month",
    accentColor: "#4d9fff",
    highlighted: true,
    badge: "Most Popular",
    cta: "7 days free trial",
    ctaHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_TQSyTPGy63wMNw0r31v3GtyYNvU6YFgOmO7Rz3I5phX/redirect",
    yearlyHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_PTRNqDJFKdiinLZkSM3oWu8rBSGaJjiERFhh70bsuvj/redirect",
    features: [
      { text: "10 clients", included: true },
      { text: "10 projects", included: true },
      { text: "10 invoices", included: true },
      { text: "Dashboard — 4 KPI cards (no revenue/client)", included: true },
      { text: "Business Health Score", included: true },
      { text: "Smart Pricing Engine (Floor + Target)", included: true },
      { text: "Client Portal", included: true },
      { text: "Asset Delivery (10 MB, 5 assets/project)", included: true },
      { text: "Revision Tracker (3 rounds/project)", included: true },
      { text: "Contracts (manual)", included: true },
      { text: "Approvals", included: true },
      { text: "Invoice PDF Export", included: true },
      { text: "Monthly revenue per client", included: false },
      { text: "AI Contract Generator", included: false },
      { text: "AI Proposal Generator", included: false },
    ],
  },
  {
    name: "Bloom",
    price: "$15.99",
    yearlyPrice: "$156",
    subtext: "/ month",
    accentColor: "#a78bfa",
    highlighted: true,
    badge: "Full Power",
    cta: "7 days free trial",
    ctaHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_tZmnylGTB2b9OizlujPnaSQe0y0HJRqG9IVfn0X241v/redirect",
    yearlyHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_EIbHh4jzESx721RcASjBJVu8cfFZGcP8yQLDV1TigcR/redirect",
    features: [
      { text: "Unlimited clients", included: true },
      { text: "Unlimited projects", included: true },
      { text: "Unlimited invoices", included: true },
      { text: "All 5 KPI cards + Revenue This Month", included: true },
      { text: "Monthly revenue per client (full breakdown)", included: true },
      { text: "Business Health Score (full detail)", included: true },
      { text: "Smart Pricing Engine (Full — Premium + rush + region)", included: true },
      { text: "Client Portal", included: true },
      { text: "Asset Delivery Hub (50 MB, unlimited assets)", included: true },
      { text: "Revision Tracker (unlimited + auto-invoice on overages)", included: true },
      { text: "AI Contract Generator", included: true },
      { text: "AI Proposal Generator (8-section + Accept/Decline)", included: true },
      { text: "Auto Invoice Trigger", included: true },
      { text: "Invoice PDF Export", included: true },
    ],
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const HIVE_FEATURES = [
  {
    icon: "📊",
    title: "Business Dashboard",
    desc: "KPI cards for invoices pending, revenue this month, total earned, overdue payments, and active clients — plus a Business Health score ring.",
    color: "#4d9fff",
  },
  {
    icon: "💰",
    title: "Smart Pricing",
    desc: "AI-powered pricing helps you set floor, target, and premium rates using project scope, complexity, timeline, region, and rush pressure.",
    color: "#fbbf24",
  },
  {
    icon: "🔗",
    title: "Client Portal",
    desc: "Generate a no-login client link. Clients see project progress, deliverables, invoices, and approval buttons — all without creating an account.",
    color: "#34d399",
  },
  {
    icon: "🗂️",
    title: "Client Workspace",
    desc: "Keep each client’s projects, approvals, files, invoices, notes, and progress in one focused workspace built for clear delivery.",
    color: "#38bdf8",
  },
  {
    icon: "📄",
    title: "Invoices & Contracts",
    desc: "Create invoices manually or auto-trigger on project completion. AI generates full contracts from your project data — client signs digitally.",
    color: "#a78bfa",
  },
  {
    icon: "📦",
    title: "Asset Delivery Hub",
    desc: "Upload files up to 50 MB via Cloudflare R2 with 3-day auto-delete. Share links directly with clients, with Approval and Download buttons per asset.",
    color: "#f472b6",
  },
  {
    icon: "🔄",
    title: "Revision Tracker",
    desc: "Log client revision rounds, track status from Open to Resolved, and auto-generate extra-charge invoices when revisions exceed your included limit.",
    color: "#fb923c",
  },
  {
    icon: "🤝",
    title: "Approvals",
    desc: "Request client approval on any deliverable. Client gets a no-login link to Approve or Request Changes — timestamped with IP. Auto-triggers invoice on approval.",
    color: "#38bdf8",
  },
  {
    icon: "📝",
    title: "AI Proposals",
    desc: "AI generates a full 8-section proposal from your project data — scope, timeline, pricing, process, and next steps — with a client-facing Accept/Decline page.",
    color: "#a78bfa",
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
};

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
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Download button — clean white Apple style */}
              <a
                href={DOWNLOAD_URL}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 hover:brightness-105 sm:w-auto sm:px-8"
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

              {/* Flow button — dark glass */}
              <a
                href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_TQSyTPGy63wMNw0r31v3GtyYNvU6YFgOmO7Rz3I5phX/redirect"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 hover:brightness-110 sm:w-auto sm:px-8"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.25)",
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

// ─── Pricing card ─────────────────────────────────────────────────────────────
function FreelancePricingCard({ plan, yearly }: { plan: typeof FREELANCE_PLANS[0]; yearly: boolean }) {
  const isBloom = plan.name === "Bloom";
  const isFlow = plan.name === "Flow";
  const isFree = plan.name === "Free";
  const showYearly = yearly && Boolean(plan.yearlyPrice);
  const monthlyEquiv = showYearly && plan.yearlyPrice
    ? `$${(Number(plan.yearlyPrice.replace(/\D/g, "")) / 12).toFixed(2).replace(/\.00$/, "")}`
    : null;
  const displayPrice = monthlyEquiv ?? plan.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative flex h-full min-h-[720px] w-full min-w-0 flex-col rounded-2xl p-6"
      style={{
        background: isBloom
          ? "linear-gradient(155deg, rgba(22,14,42,0.97) 0%, rgba(14,10,28,0.96) 50%, rgba(20,12,36,0.97) 100%)"
          : isFlow
            ? "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)"
            : "linear-gradient(145deg, rgba(8,8,10,0.92), rgba(18,18,22,0.78))",
        border: isBloom
          ? "1.5px solid rgba(167,139,250,0.35)"
          : isFlow
            ? "1.5px solid rgba(77,159,255,0.38)"
            : "1px solid rgba(255,255,255,0.09)",
        boxShadow: isBloom
          ? "0 0 0 1px rgba(167,139,250,0.12), 0 30px 80px rgba(109,40,217,0.22)"
          : isFlow
            ? "0 0 0 1px rgba(77,159,255,0.12), 0 30px 80px rgba(30,120,255,0.18)"
            : "none",
      }}
    >
      {/* Badge */}
      {"badge" in plan && plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
            style={isBloom
              ? { background: "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(109,40,217,0.85))", color: "#fff", border: "1px solid rgba(196,181,253,0.4)" }
              : { background: "linear-gradient(135deg, rgba(77,159,255,0.95), rgba(37,99,235,0.9))", color: "#fff", border: "1px solid rgba(147,197,253,0.45)" }
            }
          >
            ✦ {plan.badge}
          </span>
        </div>
      )}
      {isFree && <div className="absolute -top-4 left-1/2 h-8 w-1 -translate-x-1/2" aria-hidden="true" />}

      {/* Name */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: plan.accentColor }}>{plan.name}</p>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-4xl font-bold text-white">{displayPrice}</span>
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.subtext}</span>
      </div>
      {showYearly && plan.yearlyPrice && (
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Billed {plan.yearlyPrice} / year</p>
      )}
      {!showYearly && plan.yearlyPrice && (
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>or {plan.yearlyPrice} / yr</p>
      )}
      {!plan.yearlyPrice && <div className="mb-4" />}

      {/* Features */}
      <ul className={`mb-6 flex flex-1 flex-col gap-2 ${isFree ? "justify-start" : ""}`}>
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex-shrink-0 text-xs font-bold" style={{ color: f.included ? "#39FF14" : "rgba(255,255,255,0.2)" }}>
              {f.included ? "✓" : "✕"}
            </span>
            <span className="text-sm leading-snug" style={{
              color: f.included ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.22)",
              textDecoration: f.included ? "none" : "line-through",
            }}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={"yearlyHref" in plan && showYearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref}
        className="block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.025]"
        style={isBloom
          ? { background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)", color: "#fff", border: "1px solid rgba(196,181,253,0.3)", boxShadow: "0 8px 30px rgba(109,40,217,0.45)" }
          : isFlow
            ? { background: "#4d9fff", color: "white", border: "1px solid rgba(77,159,255,0.5)" }
            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }
        }
      >
        {plan.cta}
      </a>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FreelancePage() {
  const [yearly, setYearly] = useState(true);
  const [lampOn, setLampOn] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        logoHref="https://mybloomboard.app"
        customLinks={[
          { label: "Features", href: "#features" },
          { label: "Deep Dive", href: "#freelance-smart-ai" },
          { label: "Pricing", href: "#pricing" },
          { label: "Customer Portal", href: "https://sandbox.polar.sh/daily-dashboard/portal", external: true },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <LampContainer isOn={lampOn}>

        {/* Headline — beam loads first (0.3s delay, 0.8s duration = done at 1.1s), text comes up after */}
        <motion.h1
          key={lampOn ? "on-title" : "off-title"}
          initial={{ opacity: 0.5, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="text-center text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl mb-6 pt-20"
          style={{ color: lampOn ? "#ffffff" : "rgba(255,255,255,0.3)" }}
        >
          {lampOn ? <>Your freelance business.<br />One Board.</> : <>Where Did<br />Everything Go?</>}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          key={lampOn ? "on-sub" : "off-sub"}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeInOut" }}
          className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed sm:text-lg"
          style={{ color: lampOn ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}
        >
          {lampOn
            ? "Clients, invoices, contracts, proposals, asset delivery, and revision tracking — built directly into your daily productivity dashboard. No extra tools. No switching tabs."
            : "Clients, contracts, invoices, files, revisions, payments, and tasks scattered across different apps."}
        </motion.p>

        {/* Toggle + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <button
            onClick={() => setLampOn(!lampOn)}
            className="flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
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
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:scale-[1.03]"
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
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {[
              { value: "10+", label: "Freelance modules" },
              { value: "Free", label: "To start" },
              { value: "AI", label: "Invoices & Proposals" },
              { value: "Smart Pricing", label: "AI powered pricing" },
              { value: "0", label: "Extra tools needed" },
            ].map((s) => (
              <div key={s.label} className="min-w-[92px] text-center sm:min-w-[112px]">
                <p className="text-xl font-bold leading-tight text-white sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-[11px] leading-tight sm:text-xs" style={{ color: "rgba(255,255,255,0.36)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </LampContainer>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIVE_FEATURES.map((f, i) => (
              (() => {
                const Icon = HIVE_FEATURE_ICONS[f.title] ?? BarChart3;
                const glowColor = `${f.color}24`;
                const softGlowColor = `${f.color}12`;
                const isAI = f.title.includes("AI") || f.title.includes("Pricing");

                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="group relative flex min-h-[210px] cursor-pointer flex-col gap-3.5 overflow-hidden rounded-[24px] p-5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.012] sm:h-[210px]"
                    style={{
                      background: `linear-gradient(145deg, rgba(12,12,14,0.94) 0%, rgba(6,6,8,0.86) 72%), radial-gradient(circle at 86% 10%, ${softGlowColor}, transparent 42%)`,
                      border: "1px solid rgba(255,255,255,0.11)",
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      contain: "layout paint style",
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
                        background: `radial-gradient(circle at 22% 12%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 82% 78%, ${glowColor}, transparent 42%)`,
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute left-6 right-6 top-0 h-px opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to right, transparent, ${f.color}80, rgba(255,255,255,0.45), transparent)` }}
                    />

                    <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                      <div
                        className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 group-hover:-translate-y-0.5"
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
                          className="relative h-5 w-5 text-white/90 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
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
                      <h3 className="text-base font-semibold leading-tight text-text-primary transition-colors group-hover:text-white">
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-muted transition-colors duration-500 group-hover:text-white/58">
                        {f.desc}
                      </p>
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
            <h2 className="text-3xl font-bold sm:text-5xl mb-4">Start free. Unlock as you grow.</h2>
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

          <div className="grid grid-cols-1 items-stretch gap-6 pt-6 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
            {FREELANCE_PLANS.map((plan) => (
              <div key={plan.name} className="flex min-w-0 w-full pt-4">
                <FreelancePricingCard plan={plan} yearly={yearly} />
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.3)" }}>
            All paid plans include a 7-day free trial. No credit card required to start. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <FreelanceDownloadCTA />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
