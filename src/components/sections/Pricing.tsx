"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Minus } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/animations";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureItem {
  text: string;
  included: boolean;
  badge?: string;
  badges?: string[];
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

/** Who each plan is for, in plain words. */
const TAGLINES: Record<string, string> = {
  Free: "Try BloomBoard on your own, for as long as you like.",
  Flow: "For focused individuals who want AI help every day.",
  Bloom: "Everything unlocked, with unlimited AI and KPI reports.",
  Team: "For teams of three or more working in one place.",
};

/** One signature colour per paid plan, used only for the top line, the tag and the button. */
const PLAN_STYLE: Record<string, { line?: string; tag?: string; tagClass?: string; border: string; button: string }> = {
  Free: {
    border: "border-white/10 bg-[#0b0f14]",
    button: "border border-white/20 text-white hover:bg-white/[0.07]",
  },
  Flow: {
    line: "#60a5fa",
    tag: "Most popular",
    tagClass: "bg-white text-black",
    border: "border-white/35 bg-[#0f151c]",
    button: "bg-white text-black hover:bg-white/90",
  },
  Bloom: {
    line: "#a78bfa",
    tagClass: "bg-violet-400/15 text-violet-200",
    border: "border-violet-300/25 bg-[#0b0f14]",
    button: "bg-violet-600 text-white hover:bg-violet-500",
  },
  Team: {
    line: "#2dd4bf",
    tag: "For teams",
    tagClass: "bg-teal-400/15 text-teal-200",
    border: "border-teal-300/30 bg-[#0b0f14]",
    button: "bg-teal-600 text-white hover:bg-teal-500",
  },
};

function formatMonthlyEquivalent(yearlyPrice: string) {
  const numericPrice = Number(yearlyPrice.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numericPrice)) return "";
  const monthly = (numericPrice / 12).toFixed(2);
  // Strip trailing .00 for clean whole numbers (e.g. $6.00 → $6)
  return `$${monthly.replace(/\.00$/, "")}`;
}

/** "Ask anything", "Create tasks", "and more..." → "Ask anything, create tasks and more". */
function examplesLine(badges: string[]) {
  const words = badges.map((b, i) => (i === 0 ? b : b.charAt(0).toLowerCase() + b.slice(1)));
  const more = words[words.length - 1]?.startsWith("and more");
  const list = more ? words.slice(0, -1) : words;
  return list.join(", ") + (more ? " and more" : "");
}

// ─── Single card ──────────────────────────────────────────────────────────────
function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const isTeam = plan.name === "Team";
  const style = PLAN_STYLE[plan.name] ?? PLAN_STYLE.Free;
  const tag = style.tag ?? plan.badgeLabel;
  const hasTrial = plan.name === "Flow" || plan.name === "Bloom";

  const [seats, setSeats] = useState(3);

  const showYearly = yearly && Boolean(plan.yearlyPrice);
  // Monthly equivalent is always the big number when yearly is selected
  const displayPrice = showYearly ? formatMonthlyEquivalent(plan.yearlyPrice!) : plan.price;
  const billingLine = showYearly
    ? `Billed ${plan.yearlyPrice} ${plan.yearlySubtext ?? "/ yr"}`
    : plan.yearlyPrice
      ? `or ${plan.yearlyPrice} ${plan.yearlySubtext ?? "/ year"}`
      : " ";

  const href = isTeam
    ? `/api/team-checkout?quantity=${seats}${showYearly ? "&yearly=1" : ""}`
    : yearly && plan.yearlyHref
      ? plan.yearlyHref
      : plan.ctaHref;

  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex flex-col overflow-hidden rounded-2xl border sm:h-full ${style.border}`}
    >
      {style.line && (
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: style.line }} />
      )}
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="p-6 2xl:p-7">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          {tag && (
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${style.tagClass}`}>{tag}</span>
          )}
        </div>
        <p className="mt-1.5 min-h-[2.5rem] text-sm leading-snug text-white/55">{TAGLINES[plan.name]}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-4xl font-bold tracking-tight text-white">{displayPrice}</span>
          <span className="text-sm text-white/50">{plan.subtext}</span>
        </div>
        <p className="mt-1 text-sm text-white/45">{billingLine}</p>

        {/* ── Team seat picker ─────────────────────────────────────────── */}
        {isTeam && (
          <TeamSeats seats={seats} setSeats={setSeats} yearly={showYearly} />
        )}

        <a
          href={href}
          className={`mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${style.button}`}
        >
          {plan.cta}
        </a>
        <p className="mt-2 text-center text-xs text-white/40">
          {hasTrial ? "7-day free trial · cancel anytime" : isTeam ? "3-seat minimum · cancel anytime" : "macOS 11+ · Apple Silicon & Intel"}
        </p>
      </div>

      {/* ── What's included ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col border-t border-white/10 px-6 pb-6 2xl:px-7">
        {plan.featureGroups.map((group) => (
          <div key={group.category} className="pt-5">
            <p className="mb-2.5 text-sm font-medium text-white/85">{group.category}</p>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => {
                const text = item.text.replace(/^🦋\s*/, "");
                return (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm leading-snug">
                    {item.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.6} />
                    ) : (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/25" strokeWidth={2.4} />
                    )}
                    <span className="min-w-0">
                      <span className={item.included ? "text-white/80" : "text-white/35"}>{text}</span>
                      {item.badge && !item.included && (
                        <span className="text-white/35"> · on {item.badge}</span>
                      )}
                      {item.badges && item.badges.length > 0 && (
                        <span className="mt-0.5 block text-xs leading-snug text-white/40">
                          {examplesLine(item.badges)}
                        </span>
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

function TeamSeats({
  seats,
  setSeats,
  yearly,
}: {
  seats: number;
  setSeats: (update: (s: number) => number) => void;
  yearly: boolean;
}) {
  const monthlyTiers = [
    { label: "3–9 seats", min: 3, max: 9, price: 14.99 },
    { label: "10–19 seats", min: 10, max: 19, price: 12.99 },
    { label: "20+ seats", min: 20, max: Infinity, price: 10.99 },
  ];
  const yearlyTiers = [
    { label: "3–9 seats", min: 3, max: 9, price: 12 },
    { label: "10–19 seats", min: 10, max: 19, price: 10 },
    { label: "20+ seats", min: 20, max: Infinity, price: 8 },
  ];
  const tiers = yearly ? yearlyTiers : monthlyTiers;
  const activeTier = tiers.find((t) => seats >= t.min && seats <= t.max)!;
  const total = (seats * activeTier.price).toFixed(2).replace(/\.00$/, "");

  return (
    <div className="mt-5 rounded-lg border border-teal-300/20 bg-teal-400/[0.04]">
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <span className="text-sm text-white/80">Seats</span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSeats((s) => Math.max(3, s - 1))}
            disabled={seats === 3}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-base text-white/80 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Remove seat"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums text-white">{seats}</span>
          <button
            type="button"
            onClick={() => setSeats((s) => s + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-base text-white/80 transition-colors hover:bg-white/[0.08]"
            aria-label="Add seat"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-baseline justify-between border-t border-white/10 px-3.5 py-2.5">
        <span className="text-xs text-white/50">
          {seats} × ${activeTier.price} / month
        </span>
        <span className="text-sm font-semibold tabular-nums text-teal-100">${total} / mo</span>
      </div>
      <div className="border-t border-white/10 px-3.5 py-2">
        <p className="mb-1 text-xs text-white/45">Volume pricing</p>
        {tiers.map((tier) => {
          const isActive = tier === activeTier;
          return (
            <div
              key={tier.label}
              className={`flex items-center justify-between py-0.5 text-xs ${isActive ? "font-medium text-teal-200" : "text-white/40"}`}
            >
              <span>{tier.label}</span>
              <span className="tabular-nums">${tier.price} / seat</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative border-y border-white/[0.06] bg-black px-4 py-16 sm:px-6 sm:py-28">
      <div className="relative mx-auto max-w-[94rem]">
        {/* Header */}
        <motion.div
          ref={ref}
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
            Start free. Upgrade when ready.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-white/60">
            Every plan includes the core app. Flow and Bloom add AI and reports, Team adds your people.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex rounded-lg border border-white/15 p-0.5">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  !yearly ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  yearly ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
            <span className="text-sm text-white/55">Save 2 months with yearly</span>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-stretch xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan as PricingPlan} yearly={yearly} />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-center text-sm text-white/45"
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
