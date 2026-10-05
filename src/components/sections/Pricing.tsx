"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Minus } from "lucide-react";
import {
  PRICING_PLANS,
  TEAM_SEAT_TIERS,
  TEAM_MIN_SEATS,
  TEAM_MAX_SEATS,
  AI_LIMIT_NOTE,
  type PricingPlan,
  type PlanFeature,
  type TeamSeatTier,
} from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/animations";

/** One accent (white) on neutral cards: the recommended plan is the brighter card, nothing is tinted. */
const PLAN_STYLE: Record<PricingPlan["name"], { line?: string; tagClass?: string; border: string; button: string }> = {
  Free: {
    border: "border-white/10 bg-[#111113]",
    button: "border border-white/20 text-white hover:bg-white/[0.07]",
  },
  Bloom: {
    tagClass: "text-white",
    border: "border-white/35 bg-[#18181b]",
    button: "bg-white text-black hover:bg-white/90",
  },
  Team: {
    tagClass: "text-white/60",
    border: "border-white/15 bg-[#111113]",
    button: "border border-white/25 bg-white/[0.06] text-white hover:bg-white/[0.12]",
  },
};

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const toNumber = (price: string) => Number(price.replace(/[^0-9.]/g, ""));

function tierFor(seats: number): TeamSeatTier {
  return TEAM_SEAT_TIERS.find((t) => seats >= t.min && seats <= t.max) ?? TEAM_SEAT_TIERS[0];
}

/** Bold a leading "Unlimited" so the value is easy to scan. */
function FeatureText({ text }: { text: string }) {
  const m = /^Unlimited\b/.exec(text);
  if (!m) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-white">Unlimited</strong>
      {text.slice(m[0].length)}
    </>
  );
}

/** Product names keep their capitals in the examples line. */
const KEEP_CASE = ["Team Live", "Pulse"];

/** Sentence case for an example label, keeping acronyms (AI, 24/7) and product names. */
function softCase(label: string) {
  if (KEEP_CASE.includes(label)) return label;
  return label
    .split(" ")
    .map((w) => (/^[A-Z0-9/]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

/** "Ask anything", "Create tasks", "and more..." → "Ask anything, create tasks and more". */
function examplesLine(badges: string[]) {
  const words = badges.map((b, i) => {
    const soft = softCase(b);
    return i === 0 ? soft.charAt(0).toUpperCase() + soft.slice(1) : soft;
  });
  const more = words[words.length - 1]?.startsWith("and more");
  const list = more ? words.slice(0, -1) : words;
  return list.join(", ") + (more ? " and more" : "");
}

function FeatureLine({ item }: { item: PlanFeature }) {
  const text = item.text.replace(/🦋\s*/, "");
  return (
    <li className="flex items-start gap-2.5 text-sm leading-snug">
      {item.included ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.6} />
      ) : (
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/25" strokeWidth={2.4} />
      )}
      <span className="min-w-0">
        <span className={item.included ? "text-white/80" : "text-white/40"}>
          {item.included ? <FeatureText text={text} /> : text}
        </span>
        {item.badge && !item.included && <span className="text-white/40"> · on {item.badge}</span>}
        {item.tag && (
          <span className="ml-1 whitespace-nowrap text-white/45">
            {item.tag}
          </span>
        )}
        {item.included && item.badges && item.badges.length > 0 && (
          <span className="mt-0.5 block text-xs leading-snug text-white/45">{examplesLine(item.badges)}</span>
        )}
      </span>
    </li>
  );
}

// ─── Single card ──────────────────────────────────────────────────────────────
function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const isTeam = plan.name === "Team";
  const isFree = plan.name === "Free";
  const style = PLAN_STYLE[plan.name];
  const [seats, setSeats] = useState(TEAM_MIN_SEATS);
  const billing = yearly ? "yearly" : "monthly";

  // Big number: price per month. Yearly shows the monthly equivalent, with the yearly total under it.
  let bigPrice = plan.price;
  let smallLine = isFree ? "No card, no account needed" : "";
  if (isTeam) {
    const tier = tierFor(seats);
    bigPrice = money(yearly ? tier.yearly : tier.monthly);
    smallLine = yearly ? `${money(tier.yearly * 12)} per person billed yearly` : "Billed monthly";
  } else if (plan.yearlyPrice) {
    const total = toNumber(plan.yearlyPrice);
    bigPrice = yearly ? money(total / 12) : plan.price;
    smallLine = yearly ? `${plan.yearlyPrice} billed yearly` : `or ${plan.yearlyPrice} a year, billed yearly`;
  }

  const href = isFree
    ? plan.ctaHref
    : `${plan.ctaHref}${isTeam ? `&seats=${seats}` : ""}&billing=${billing}`;

  const underCta = isFree
    ? "Mac and Windows"
    : isTeam
      ? `${plan.trialDays}-day free trial · 3-seat minimum`
      : `${plan.trialDays}-day free trial · no card to start`;

  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex flex-col overflow-hidden rounded-2xl border lg:h-full ${style.border}`}
    >
      {style.line && (
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: style.line }} />
      )}
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="p-6 2xl:p-7">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          {plan.badgeLabel && (
            <span className={`text-xs font-medium ${style.tagClass}`}>{plan.badgeLabel}</span>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-snug text-white/60 lg:min-h-[2.5rem]">{plan.tagline}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-4xl font-bold tracking-tight text-white">{bigPrice}</span>
          <span className="text-sm text-white/55">{plan.unit}</span>
        </div>
        <p className="mt-1 text-sm text-white/50">{smallLine}</p>

        {/* ── Team seat picker ─────────────────────────────────────────── */}
        {isTeam && <TeamSeats seats={seats} setSeats={setSeats} yearly={yearly} />}

        <a
          href={href}
          className={`mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${style.button}`}
        >
          {plan.cta}
        </a>
        <p className="mt-2 text-center text-xs text-white/45">
          {underCta}
        </p>
      </div>

      {/* ── What's included ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col border-t border-white/10 px-6 pb-6 2xl:px-7">
        {plan.featureGroups.map((group) => (
          <div key={group.category} className="pt-5">
            <p className="mb-2.5 text-sm font-medium text-white/90">{group.category}</p>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <FeatureLine key={item.text} item={item} />
              ))}
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
  const activeTier = tierFor(seats);
  const perSeat = yearly ? activeTier.yearly : activeTier.monthly;
  const monthlyTotal = seats * perSeat;

  return (
    <div className="mt-5 rounded-lg border border-white/15 bg-white/[0.03]">
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <span className="text-sm text-white/80">Seats</span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSeats((s) => Math.max(TEAM_MIN_SEATS, s - 1))}
            disabled={seats <= TEAM_MIN_SEATS}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-base text-white/80 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Remove seat"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums text-white">{seats}</span>
          <button
            type="button"
            onClick={() => setSeats((s) => Math.min(TEAM_MAX_SEATS, s + 1))}
            disabled={seats >= TEAM_MAX_SEATS}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-base text-white/80 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Add seat"
          >
            +
          </button>
        </div>
      </div>
      <div className="border-t border-white/10 px-3.5 py-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/55">
            {seats} × {money(perSeat)} / month
          </span>
          <span className="text-sm font-semibold tabular-nums text-white">{money(monthlyTotal)} / mo</span>
        </div>
        {yearly && (
          <p className="mt-0.5 text-right text-xs tabular-nums text-white/45">{money(monthlyTotal * 12)} billed yearly</p>
        )}
      </div>
      <div className="border-t border-white/10 px-3.5 py-2">
        <p className="mb-1 text-xs text-white/50">Volume pricing, per person a month</p>
        {TEAM_SEAT_TIERS.map((tier) => {
          const isActive = tier === activeTier;
          return (
            <div
              key={tier.label}
              className={`flex items-center justify-between py-0.5 text-xs ${isActive ? "font-medium text-white" : "text-white/45"}`}
            >
              <span>{tier.label}</span>
              <span className="tabular-nums">{money(yearly ? tier.yearly : tier.monthly)}</span>
            </div>
          );
        })}
        <p className="mt-1.5 text-xs text-white/45">
          More than {TEAM_MAX_SEATS} people?{" "}
          <a href="mailto:hello@mybloomboard.app" className="text-white/75 underline decoration-white/30 underline-offset-2 hover:text-white">
            Contact us
          </a>
        </p>
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
      <div className="relative mx-auto max-w-6xl">
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
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/60">
            Free covers the core app. Bloom makes everything unlimited, including AI. Team adds your people:
            replace Trello and Slack with one app, for less.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
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
            <span className="text-sm text-white/55">Save up to 25% with yearly</span>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mx-auto grid max-w-xl grid-cols-1 gap-5 lg:max-w-none lg:grid-cols-3 lg:items-stretch"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </motion.div>

        {/* Bottom notes: three plain facts side by side, then the AI note */}
        <motion.div
          className="mx-auto mt-12 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="grid gap-6 border-t border-white/10 pt-6 text-left sm:grid-cols-3 sm:gap-0">
            <div className="sm:pr-6">
              <h4 className="text-sm font-semibold text-white">Free trial first</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                7 days for Bloom, 14 days for Team. No card needed, or add one and nothing is charged until the trial ends.
              </p>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:px-6">
              <h4 className="text-sm font-semibold text-white">Founding price</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                The price you join at stays yours for as long as you stay subscribed.
              </p>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-6">
              <h4 className="text-sm font-semibold text-white">Cancel anytime</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                14-day refund on your first payment and on yearly renewals.{" "}
                <a href="/refund" className="text-white/80 underline underline-offset-2 hover:text-white">Refund policy</a>
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-white/45">{AI_LIMIT_NOTE}</p>
        </motion.div>
      </div>
    </section>
  );
}
