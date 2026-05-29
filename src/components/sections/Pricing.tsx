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
  badgeLabel?: string;
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
        background:           plan.highlighted
          ? "linear-gradient(145deg, rgba(12,12,16,0.92), rgba(18,15,28,0.86))"
          : "linear-gradient(145deg, rgba(8,8,10,0.92), rgba(18,18,22,0.78))",
        backdropFilter:       "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border:               plan.highlighted ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.09)",
        boxShadow:            "none",
      }}
    >
      {/* Apple Intelligence spotlight border */}
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />

      {/* Most Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1 rounded-full text-xs font-semibold"
            style={{
              background: plan.name === "Pro Max" ? "rgba(167,139,250,0.22)" : "rgba(255,255,255,0.12)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {plan.badgeLabel ?? "Most popular"}
          </span>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className="px-6 pt-7 pb-5 2xl:px-7"
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
        <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
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
      <div className="px-6 py-5 flex flex-col flex-1 2xl:px-7">
        {plan.featureGroups.map((group, index) => (
          <div
            key={group.category}
            className={index > 0 ? "mt-5 border-t border-white/10 pt-5" : ""}
          >
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
      <div className="px-6 pb-6 2xl:px-7">
        <a
          href={yearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref}
          className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
          style={{
            background: plan.highlighted
              ? plan.name === "Pro Max"
                ? "rgba(167,139,250,0.24)"
                : "#4d9fff"
              : plan.name === "Pro Max"
              ? "rgba(167,139,250,0.15)"
              : "rgba(255,255,255,0.06)",
            color: plan.highlighted
              ? plan.name === "Pro Max"
                ? "#c4b5fd"
                : "white"
              : plan.name === "Pro Max"
              ? "#a78bfa"
              : "rgba(255,255,255,0.7)",
            border: plan.highlighted
              ? plan.name === "Pro Max"
                ? "1px solid rgba(167,139,250,0.45)"
                : "none"
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
    <section id="pricing" className="relative overflow-hidden border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-28">
      {/* Background sheen */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800, height: 600,
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.035) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-[94rem] relative">
        {/* Header */}
        <motion.div
          ref={ref}
          className="mb-10 text-center sm:mb-14"
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
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-5xl">
            Start free. Upgrade when ready.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-text-muted sm:text-lg">
            All plans include the core app. Pro and Pro Max unlock the full power.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setYearly(false)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all sm:px-5"
              style={{
                background: !yearly ? "rgba(255,255,255,0.1)" : "transparent",
                color: !yearly ? "#fff" : "#607080",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all sm:px-5"
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
          className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-7"
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

      </div>
    </section>
  );
}
