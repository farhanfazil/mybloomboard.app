"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PRICING_PLANS } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureItem {
  text: string;
  included: boolean;
  badge?: string;
}
interface FeatureGroup {
  category: string;
  items: FeatureItem[];
}
interface PricingPlan {
  name: string;
  price: string;
  subtext: string;
  yearlyPrice?: string;
  yearlySubtext?: string;
  yearlyHref?: string;
  featureGroups: FeatureGroup[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  accentColor: string;
}

// ─── Single card ──────────────────────────────────────────────────────────────
function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       300,
    borderWidth:  1,
    borderRadius: "16px",
    brightness:   2.4,
  });

  const showYearly = yearly && plan.yearlyPrice;
  const displayPrice   = showYearly ? plan.yearlyPrice! : plan.price;
  const displaySubtext = showYearly ? plan.yearlySubtext! : plan.subtext;

  return (
    <motion.div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      variants={fadeUp}
      className="relative rounded-2xl flex flex-col transition-all duration-300 h-full"
      style={{
        background:           plan.highlighted ? "rgba(77,159,255,0.07)"           : "rgba(18, 26, 42, 0.80)",
        backdropFilter:       "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:               plan.highlighted ? "1px solid rgba(77,159,255,0.40)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow:            plan.highlighted ? "0 0 60px rgba(77,159,255,0.10)"  : "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      {/* Apple Intelligence spotlight border */}
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />

      {/* Most Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1 rounded-full text-xs font-semibold"
            style={{ background: "#4d9fff", color: "white" }}
          >
            Most popular
          </span>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className="px-6 pt-7 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Plan name */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: plan.accentColor }}
          >
            {plan.name}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-4xl font-bold text-white">{displayPrice}</span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {displaySubtext}
          </span>
        </div>

        {/* Yearly alt price line */}
        {plan.yearlyPrice && !yearly && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            or {plan.yearlyPrice}/yr
          </p>
        )}
        {plan.yearlyPrice && yearly && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {plan.price} / month
          </p>
        )}
        {!plan.yearlyPrice && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            &nbsp;
          </p>
        )}
      </div>

      {/* ── Feature groups ───────────────────────────────────────────────── */}
      <div className="px-6 py-5 flex flex-col gap-5 flex-1">
        {plan.featureGroups.map((group) => (
          <div key={group.category}>
            {/* Category label */}
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2.5"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              {group.category}
            </p>
            {/* Items */}
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  {item.included ? (
                    <span
                      className="mt-0.5 flex-shrink-0 text-xs font-bold"
                      style={{ color: "#39FF14" }}
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className="mt-0.5 flex-shrink-0 text-xs font-bold"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      ✕
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-sm leading-snug"
                      style={{
                        color: item.included
                          ? "rgba(255,255,255,0.75)"
                          : "rgba(255,255,255,0.25)",
                        textDecoration: item.included ? "none" : "line-through",
                      }}
                    >
                      {item.text}
                    </span>
                    {item.badge && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, rgba(109,40,217,0.35), rgba(79,70,229,0.35))",
                          color: "#c4b5fd",
                          border: "1px solid rgba(167,139,250,0.3)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="px-6 pb-6">
        <a
          href={yearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref}
          className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
          style={{
            background: plan.highlighted
              ? "#4d9fff"
              : plan.name === "Pro Max"
              ? "rgba(167,139,250,0.15)"
              : "rgba(255,255,255,0.06)",
            color: plan.highlighted
              ? "white"
              : plan.name === "Pro Max"
              ? "#a78bfa"
              : "rgba(255,255,255,0.7)",
            border: plan.highlighted
              ? "none"
              : `1px solid ${plan.name === "Pro Max" ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          {plan.cta}
        </a>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative py-28 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800, height: 600,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#a78bfa", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}
          >
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Start free. Upgrade when ready.
          </h2>
          <p className="text-lg text-text-muted max-w-lg mx-auto mb-8">
            All plans include the core app. Pro and Pro Max unlock the full power.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: !yearly ? "rgba(255,255,255,0.1)" : "transparent",
                color: !yearly ? "#fff" : "#607080",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: yearly ? "rgba(255,255,255,0.1)" : "transparent",
                color: yearly ? "#fff" : "#607080",
              }}
            >
              Yearly
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.25)" }}
              >
                Save 30%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan as PricingPlan} yearly={yearly} />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-xs text-text-muted mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          All paid plans include a 7-day free trial. No credit card required to start. Cancel anytime.
        </motion.p>

        {/* Team plan — Coming Soon */}
        <motion.div
          className="mt-14 relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(79,70,229,0.08) 50%, rgba(109,40,217,0.06) 100%)",
            border: "1px solid rgba(167,139,250,0.18)",
          }}
        >
          {/* Subtle glow orb */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 600, height: 320,
              background: "radial-gradient(ellipse at center, rgba(167,139,250,0.10) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />

          <div className="relative px-8 pt-7 pb-6">
            {/* Plan name + badge */}
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-bold text-white">Team Plan</h3>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(109,40,217,0.45), rgba(79,70,229,0.45))",
                  color: "#c4b5fd",
                  border: "1px solid rgba(167,139,250,0.35)",
                }}
              >
                Coming Soon
              </span>
            </div>

            {/* Subheading */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5 mt-4"
              style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.15em" }}
            >
              What&apos;s included in Team
            </p>

            {/* Feature grid — 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3.5 mb-6">
              {[
                { icon: "👥", label: "Shared project workspaces" },
                { icon: "📊", label: "Team performance reports" },
                { icon: "🛡️", label: "Admin dashboard & controls" },
                { icon: "📄", label: "Shared PDF report exports" },
                { icon: "🔗", label: "Real-time task sync across members" },
                { icon: "🏆", label: "Team streak & KPI leaderboard" },
                { icon: "📋", label: "Task assignment & delegation by managers" },
                { icon: "💬", label: "In-task comments & team feedback threads" },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <span className="text-base w-6 flex-shrink-0 mt-0.5">{f.icon}</span>
                  <span className="text-sm font-medium leading-snug" style={{ color: "rgba(255,255,255,0.78)" }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div
              className="flex items-center justify-between pt-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Up to 10 team members
              </span>
              <span className="text-base font-bold" style={{ color: "#a78bfa" }}>
                $14.99 / month
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
