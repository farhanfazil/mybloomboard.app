"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CreditCard,
  ExternalLink,
  Gauge,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PRICING_PLANS } from "@/lib/constants";
import { POLAR_CUSTOMER_PORTAL_URL, planEntitlements, type PlanName } from "@/lib/webapp/config";

type BillingCycle = "monthly" | "yearly";

const planDescriptions: Record<PlanName, string> = {
  Free: "A calm starting point for personal tasks and light planning.",
  Flow: "For focused solo work with sync, freelance tools, and practical AI.",
  Bloom: "The complete solo workspace with unlimited personal AI power.",
  Team: "Collaboration, reporting, chat, and private workload signals.",
};

const planAccent: Record<PlanName, string> = {
  Free: "#7d8795",
  Flow: "#4d9fff",
  Bloom: "#9b6cff",
  Team: "#2dd4bf",
};

function monthlyEquivalent(yearlyPrice?: string) {
  if (!yearlyPrice) return null;
  const value = Number(yearlyPrice.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? `$${(value / 12).toFixed(2)}` : null;
}

export function BillingWorkspace() {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const [teamSeats, setTeamSeats] = useState(3);

  const plans = useMemo(
    () =>
      PRICING_PLANS.map((plan) => {
        const name = plan.name as PlanName;
        const isYearly = cycle === "yearly" && Boolean(plan.yearlyPrice);
        const isTeam = name === "Team";
        const checkoutHref = name === "Free"
          ? "/app"
          : isTeam
          ? `/api/team-checkout?quantity=${teamSeats}${isYearly ? "&yearly=1" : ""}`
          : isYearly && plan.yearlyHref
            ? plan.yearlyHref
            : plan.ctaHref;

        return {
          ...plan,
          name,
          isYearly,
          checkoutHref,
          displayPrice: isYearly ? monthlyEquivalent(plan.yearlyPrice) : plan.price,
        };
      }),
    [cycle, teamSeats],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(77,159,255,.11),rgba(255,255,255,.025)_55%,rgba(124,58,237,.09))] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-200/75">
                Billing & entitlements
              </p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                One plan. Web and desktop together.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/48">
                Your Bloomboard subscription unlocks the same workspace across the web
                app and desktop app. Billing is handled securely through Polar.
              </p>
            </div>
            <a
              href={POLAR_CUSTOMER_PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.03] hover:bg-blue-50"
            >
              Customer portal
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              Polar sandbox
            </span>
            <span className="text-sm text-white/38">
              Checkout is in test mode until production billing is enabled.
            </span>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
              Current workspace
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
            Current plan
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="text-3xl font-black">Free</h3>
            <span className="text-sm text-white/38">$0 forever</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Sign in to load the active subscription and live usage for this workspace.
          </p>
          <Link
            href="/app/sign-in"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-200 transition hover:text-white"
          >
            Connect account <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/32">
            Choose your plan
          </p>
          <h3 className="mt-2 text-2xl font-bold">Upgrade when your workspace needs more.</h3>
        </div>
        <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.035] p-1">
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCycle(option)}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                cycle === option ? "bg-white text-black" : "text-white/45 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {plans.map((plan) => {
          const color = planAccent[plan.name];
          const isFree = plan.name === "Free";
          const featured = plan.name === "Flow" || plan.name === "Bloom";

          return (
            <article
              key={plan.name}
              className="relative flex min-h-[520px] flex-col overflow-hidden rounded-[30px] border bg-white/[0.025] p-6"
              style={{
                borderColor: `${color}${featured ? "70" : "32"}`,
                boxShadow: featured ? `0 22px 70px ${color}12` : undefined,
                background: featured
                  ? `linear-gradient(180deg, ${color}12, rgba(255,255,255,.02) 42%)`
                  : undefined,
              }}
            >
              {featured && (
                <span
                  className="absolute right-5 top-5 rounded-full border px-3 py-1 text-[11px] font-bold"
                  style={{ borderColor: `${color}55`, color, backgroundColor: `${color}14` }}
                >
                  {plan.name === "Flow" ? "Most popular" : "Best value"}
                </span>
              )}

              <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color }}>
                {plan.name}
              </p>
              <p className="mt-4 min-h-12 text-sm leading-6 text-white/45">
                {planDescriptions[plan.name]}
              </p>

              <div className="mt-6">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black tracking-tight">{plan.displayPrice}</span>
                  <span className="pb-1 text-sm text-white/38">
                    {plan.name === "Team" ? "/ user / month" : isFree ? "" : "/ month"}
                  </span>
                </div>
                {plan.isYearly && plan.yearlyPrice && (
                  <p className="mt-2 text-xs text-white/32">
                    Billed {plan.yearlyPrice} {plan.yearlySubtext}
                  </p>
                )}
              </div>

              {plan.name === "Team" && (
                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    Team seats
                  </span>
                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setTeamSeats((value) => Math.max(3, value - 1))}
                      className="h-8 w-8 rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      -
                    </button>
                    <span className="font-bold">{teamSeats} seats</span>
                    <button
                      type="button"
                      onClick={() => setTeamSeats((value) => Math.min(50, value + 1))}
                      className="h-8 w-8 rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </label>
              )}

              <ul className="mt-6 space-y-3">
                {planEntitlements[plan.name].map((entitlement) => (
                  <li key={entitlement} className="flex gap-3 text-sm leading-5 text-white/58">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
                    {entitlement}
                  </li>
                ))}
              </ul>

              <a
                href={plan.checkoutHref}
                target={isFree ? undefined : "_blank"}
                rel={isFree ? undefined : "noreferrer"}
                className="mt-auto inline-flex h-12 items-center justify-center rounded-2xl border text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-125"
                style={{
                  borderColor: `${color}55`,
                  backgroundColor: featured ? color : `${color}14`,
                  color: featured ? "#050505" : color,
                }}
              >
                {isFree ? "Keep Free" : plan.name === "Team" ? "Start Team checkout" : "Start 7-day trial"}
              </a>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            icon: Gauge,
            title: "Usage follows your plan",
            text: "AI generations, boards, reports, freelance tools, storage, and team seats are enforced through entitlements.",
          },
          {
            icon: CreditCard,
            title: "Manage billing in Polar",
            text: "Customers can review purchases, payment history, subscription status, and cancellations in the secure portal.",
          },
          {
            icon: Users,
            title: "One account across devices",
            text: "The same paid workspace unlocks Bloomboard on web and desktop, with mobile access through the responsive web app.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <Icon className="h-5 w-5 text-blue-200" />
            <h3 className="mt-5 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/42">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
