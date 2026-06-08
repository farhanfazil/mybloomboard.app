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

function formatMonthlyEquivalent(yearlyPrice: string) {
  const numericPrice = Number(yearlyPrice.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numericPrice)) {
    return "";
  }

  const monthly = (numericPrice / 12).toFixed(2);
  // Strip trailing .00 for clean whole numbers (e.g. $6.00 → $6)
  return `$${monthly.replace(/\.00$/, "")}`;
}

// ─── Single card ──────────────────────────────────────────────────────────────
function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const isFlow = plan.name === "Flow";
  const isBloom = plan.name === "Bloom";
  const isTeam = plan.name === "Team";
  const isFeaturedPlan = isFlow || isBloom || isTeam;

  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       isFeaturedPlan ? 380 : 300,
    borderWidth:  isFeaturedPlan ? 1.5 : 1,
    borderRadius: "16px",
    brightness:   isFeaturedPlan ? 3.2 : 2.4,
  });

  const [seats, setSeats] = useState(3);

  const showYearly = yearly && Boolean(plan.yearlyPrice);
  // Monthly equivalent is always the BIG hero number when yearly is selected
  const monthlyEquivalent = showYearly ? formatMonthlyEquivalent(plan.yearlyPrice!) : "";
  const displayPrice   = showYearly ? monthlyEquivalent : plan.price;
  const displaySubtext = plan.subtext; // always "/ month" (or "/ user / month")
  // Yearly total shown small below the price
  const yearlyBillingText = showYearly
    ? `Billed ${plan.yearlyPrice} ${plan.yearlySubtext ?? "/ yr"}`
    : "";
  const accentMutedColor = isBloom
    ? "rgba(196,181,253,0.55)"
    : isFlow
      ? "rgba(147,197,253,0.55)"
      : isTeam
        ? "rgba(94,234,212,0.56)"
        : "rgba(255,255,255,0.3)";

  return (
    <motion.div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      variants={fadeUp}
      className="relative flex flex-col transition-all duration-300 sm:h-full"
      style={{
        borderRadius: "18px",
        background: isBloom
          ? "linear-gradient(155deg, rgba(22,14,42,0.97) 0%, rgba(14,10,28,0.96) 50%, rgba(20,12,36,0.97) 100%)"
          : isFlow
            ? "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)"
            : isTeam
              ? "linear-gradient(155deg, rgba(4,32,28,0.97) 0%, rgba(5,13,13,0.96) 52%, rgba(8,35,31,0.97) 100%)"
          : "linear-gradient(145deg, rgba(8,8,10,0.92), rgba(18,18,22,0.78))",
        backdropFilter:       "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: isBloom
          ? "1.5px solid rgba(167,139,250,0.35)"
          : isFlow
            ? "1.5px solid rgba(77,159,255,0.38)"
            : isTeam
              ? "1.5px solid rgba(45,212,191,0.34)"
          : "1px solid rgba(255,255,255,0.09)",
        boxShadow: isBloom
          ? "0 0 0 1px rgba(167,139,250,0.12), 0 30px 80px rgba(109,40,217,0.22), 0 8px 32px rgba(167,139,250,0.12)"
          : isFlow
            ? "0 0 0 1px rgba(77,159,255,0.12), 0 30px 80px rgba(30,120,255,0.18), 0 8px 32px rgba(77,159,255,0.1)"
            : isTeam
              ? "0 0 0 1px rgba(45,212,191,0.11), 0 30px 80px rgba(20,184,166,0.16), 0 8px 32px rgba(45,212,191,0.1)"
          : "none",
      }}
    >
      {/* Ambient glow behind highlighted cards */}
      {isFeaturedPlan && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[18px]"
          style={{
            background: isBloom
              ? "radial-gradient(ellipse at 60% 0%, rgba(139,92,246,0.18) 0%, transparent 65%)"
              : isFlow
                ? "radial-gradient(ellipse at 52% 0%, rgba(77,159,255,0.2) 0%, transparent 65%)"
                : "radial-gradient(ellipse at 52% 0%, rgba(45,212,191,0.16) 0%, transparent 66%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Apple Intelligence spotlight border */}
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />

      {/* Badge */}
      {plan.highlighted && (
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
            {plan.badgeLabel ?? "Most popular"}
          </span>
        </div>
      )}

      {isTeam && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.96), rgba(13,148,136,0.9))",
              color: "#ecfeff",
              border: "1px solid rgba(153,246,228,0.45)",
              boxShadow: "0 4px 22px rgba(20,184,166,0.38), 0 0 0 1px rgba(45,212,191,0.18)",
            }}
          >
            <span>✦</span>
            Built for Teams
          </span>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className="px-6 pt-7 pb-5 2xl:px-7 relative z-[1]"
        style={{
          borderBottom: isBloom
            ? "1px solid rgba(167,139,250,0.12)"
            : isFlow
              ? "1px solid rgba(77,159,255,0.14)"
              : isTeam
                ? "1px solid rgba(45,212,191,0.13)"
              : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Plan name + plan signal */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: plan.accentColor }}
          >
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

        {/* Price */}
        <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span
            className="font-bold text-white"
            style={{ fontSize: isFeaturedPlan ? "2.75rem" : "2.25rem" }}
          >
            {displayPrice}
          </span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {displaySubtext}
          </span>
        </div>

        {/* Yearly alt price line */}
        {plan.yearlyPrice && !showYearly && (
          <p className="text-xs" style={{ color: accentMutedColor }}>
            or {plan.yearlyPrice} / yr
          </p>
        )}
        {showYearly && (
          <p className="text-xs" style={{ color: accentMutedColor }}>
            {yearlyBillingText}
          </p>
        )}
        {!plan.yearlyPrice && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>&nbsp;</p>
        )}

        {/* Team 3-seat minimum note */}
        {isTeam && (
          <p className="mt-2 text-xs font-medium" style={{ color: accentMutedColor }}>
            3-seat minimum
          </p>
        )}

        {/* Bloom power-feature highlight strip */}
        {isBloom && (
          <div
            className="mt-4 flex flex-wrap gap-1.5"
          >
            {["🦋 Bloom AI", "✨ AI Hub", "📊 KPI Reports", "🔒 Local"].map((tag) => (
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

      {/* ── Feature groups ───────────────────────────────────────────────── */}
      <div className="px-6 py-5 flex flex-col flex-1 2xl:px-7 relative z-[1]">
        {plan.featureGroups.map((group, index) => {
          const isAIGroup = group.category === "AI Assistant Hub";
          const isTeamGroup = isTeam && group.category === "Team";
          const isFreelanceGroup = group.category === "Freelance";
          const isPersonalGroup = !isTeam && group.category === "Tasks & Planning";

          return (
            <div
              key={group.category}
              className={
                isAIGroup || isTeamGroup || isFreelanceGroup || isPersonalGroup
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
                  : isTeamGroup
                    ? {
                        borderColor: "rgba(45,212,191,0.28)",
                        background: "linear-gradient(145deg, rgba(20,184,166,0.13), rgba(255,255,255,0.025))",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                      }
                  : isFreelanceGroup
                    ? {
                        borderColor: isBloom ? "rgba(251,191,36,0.38)" : "rgba(251,191,36,0.2)",
                        background: isBloom
                          ? "linear-gradient(145deg, rgba(217,119,6,0.18), rgba(255,255,255,0.03))"
                          : "linear-gradient(145deg, rgba(217,119,6,0.1), rgba(255,255,255,0.018))",
                        boxShadow: isBloom
                          ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 32px rgba(217,119,6,0.15)"
                          : "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }
                  : isPersonalGroup
                    ? {
                        borderColor: isBloom ? "rgba(77,159,255,0.32)" : isFlow ? "rgba(77,159,255,0.28)" : "rgba(77,159,255,0.18)",
                        background: isBloom
                          ? "linear-gradient(145deg, rgba(30,80,180,0.16), rgba(255,255,255,0.025))"
                          : isFlow
                            ? "linear-gradient(145deg, rgba(30,80,180,0.13), rgba(255,255,255,0.02))"
                            : "linear-gradient(145deg, rgba(30,80,180,0.08), rgba(255,255,255,0.015))",
                        boxShadow: isBloom
                          ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 32px rgba(30,120,255,0.12)"
                          : "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }
                  : index > 0
                    ? { borderColor: isBloom ? "rgba(167,139,250,0.1)" : isTeam ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.06)" }
                    : {}
              }
            >
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{
                    color: isAIGroup
                      ? (isBloom ? "#c4b5fd" : "rgba(255,255,255,0.42)")
                      : isTeamGroup
                        ? "#5eead4"
                      : isFreelanceGroup
                        ? (isBloom ? "#fde68a" : "rgba(251,191,36,0.7)")
                      : isPersonalGroup
                        ? (isBloom ? "#93c5fd" : isFlow ? "rgba(147,197,253,0.75)" : "rgba(147,197,253,0.6)")
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
                      ? {
                          color: "#ede9fe",
                          background: "rgba(124,58,237,0.22)",
                          border: "1px solid rgba(196,181,253,0.28)",
                        }
                      : {
                          color: "rgba(255,255,255,0.62)",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                  >
                    AI
                  </span>
                )}
                {isFreelanceGroup && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      color: isBloom ? "#fde68a" : "rgba(251,191,36,0.85)",
                      background: isBloom ? "rgba(217,119,6,0.22)" : "rgba(217,119,6,0.12)",
                      border: `1px solid ${isBloom ? "rgba(251,191,36,0.3)" : "rgba(251,191,36,0.18)"}`,
                    }}
                  >
                    💼 Hive
                  </span>
                )}
                {isPersonalGroup && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      color: isBloom ? "#93c5fd" : isFlow ? "rgba(147,197,253,0.9)" : "rgba(147,197,253,0.75)",
                      background: isBloom ? "rgba(30,80,180,0.22)" : "rgba(30,80,180,0.14)",
                      border: `1px solid ${isBloom ? "rgba(77,159,255,0.3)" : "rgba(77,159,255,0.2)"}`,
                    }}
                  >
                    ✦ Personal
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    {item.included ? (
                      <span className="mt-0.5 flex-shrink-0 text-xs font-bold" style={{ color: "#39FF14" }}>✓</span>
                    ) : (
                      <span className="mt-0.5 flex-shrink-0 text-xs font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>✕</span>
                    )}
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-sm leading-snug"
                          style={{
                            color: item.included ? (isBloom ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)") : "rgba(255,255,255,0.25)",
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
                      {item.badges && item.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.badges.map((b) => {
                            const BADGE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
                              // AI Coworker
                              "Ask anything":     { bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                              "Create tasks":     { bg: "rgba(20,120,80,0.18)",   color: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
                              "Automation":       { bg: "rgba(109,40,217,0.18)",  color: "#c4b5fd", border: "rgba(167,139,250,0.28)" },
                              "Write emails":     { bg: "rgba(180,100,20,0.18)",  color: "#fcd34d", border: "rgba(251,191,36,0.28)" },
                              "and more...":      { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.38)", border: "rgba(255,255,255,0.1)" },
                              // Email & Messages
                              "Grammar fix":      { bg: "rgba(20,150,160,0.16)",  color: "#67e8f9", border: "rgba(34,211,238,0.28)" },
                              "Rewrite emails":   { bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                              "Professional":     { bg: "rgba(20,120,80,0.18)",   color: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
                              "Formal":           { bg: "rgba(109,40,217,0.18)",  color: "#c4b5fd", border: "rgba(167,139,250,0.28)" },
                              "Friendly":         { bg: "rgba(180,100,20,0.18)",  color: "#fcd34d", border: "rgba(251,191,36,0.28)" },
                              // AI Chief of Staff
                              "24/7 Watch":       { bg: "rgba(220,38,38,0.15)",   color: "#fca5a5", border: "rgba(248,113,113,0.28)" },
                              "Risk Alerts":      { bg: "rgba(234,88,12,0.15)",   color: "#fdba74", border: "rgba(251,146,60,0.28)" },
                              "Live Intelligence":{ bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                              "Critical Signals": { bg: "rgba(220,38,38,0.15)",   color: "#fca5a5", border: "rgba(248,113,113,0.28)" },
                              "Pulse AI":         { bg: "rgba(109,40,217,0.18)",  color: "#c4b5fd", border: "rgba(167,139,250,0.28)" },
                              // Daily Recap
                              "Daily":            { bg: "rgba(20,120,80,0.18)",   color: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
                              "30 days":          { bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                              "180 days":         { bg: "rgba(109,40,217,0.18)",  color: "#c4b5fd", border: "rgba(167,139,250,0.28)" },
                              "Copy to chat":     { bg: "rgba(180,100,20,0.18)",  color: "#fcd34d", border: "rgba(251,191,36,0.28)" },
                              // I am Stuck
                              "AI Support":       { bg: "rgba(30,80,160,0.18)",   color: "#93c5fd", border: "rgba(77,159,255,0.28)" },
                              "AI Planning":      { bg: "rgba(109,40,217,0.18)",  color: "#c4b5fd", border: "rgba(167,139,250,0.28)" },
                              "Smart Plan":       { bg: "rgba(20,120,80,0.18)",   color: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
                            };
                            const s = BADGE_COLORS[b] ?? { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)" };
                            return (
                              <span
                                key={b}
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                              >
                                {b}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="relative z-[1] mt-auto px-6 pb-6 2xl:px-7">
        {isBloom && (
          <p className="text-center text-[10px] mb-2" style={{ color: "rgba(196,181,253,0.5)" }}>
            7-day free trial · Cancel anytime
          </p>
        )}

        {/* ── Team seat picker ───────────────────────────────────────────── */}
        {isTeam && (
          <div className="mb-4">
            {/* Seat counter row */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3 mb-2"
              style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(45,212,191,0.18)" }}
            >
              <span className="text-sm font-medium" style={{ color: "rgba(153,246,228,0.85)" }}>
                Seats
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSeats((s) => Math.max(3, s - 1))}
                  disabled={seats === 3}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-base font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                  style={{ background: "rgba(20,184,166,0.2)", color: "#5eead4" }}
                  aria-label="Remove seat"
                >
                  −
                </button>
                <span className="w-6 text-center text-base font-bold text-white">{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats((s) => s + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-base font-bold transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ background: "rgba(20,184,166,0.2)", color: "#5eead4" }}
                  aria-label="Add seat"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dynamic total */}
            <div className="flex items-baseline justify-between px-1 mb-3">
              <span className="text-xs" style={{ color: "rgba(153,246,228,0.5)" }}>
                {seats} seat{seats > 1 ? "s" : ""} × ${showYearly ? "12" : "14.99"}/mo
              </span>
              <span className="text-sm font-bold" style={{ color: "#99f6e4" }}>
                ${showYearly
                  ? (seats * 12).toFixed(0)
                  : (seats * 14.99 % 1 === 0 ? seats * 14.99 : (seats * 14.99).toFixed(2))
                }/mo
              </span>
            </div>
          </div>
        )}

        <a
          href={isTeam
            ? `/api/team-checkout?quantity=${seats}${showYearly ? "&yearly=1" : ""}`
            : yearly && plan.yearlyHref ? plan.yearlyHref : plan.ctaHref
          }
          className="block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.025] active:translate-y-0 active:scale-[0.99]"
          style={
            isBloom
              ? {
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                  color: "#fff",
                  border: "1px solid rgba(196,181,253,0.3)",
                  boxShadow: "0 8px 30px rgba(109,40,217,0.45), 0 0 0 1px rgba(167,139,250,0.15)",
                }
              : isTeam
                ? {
                    background: "linear-gradient(135deg, rgba(20,184,166,0.92), rgba(13,148,136,0.82))",
                    color: "#ecfeff",
                    border: "1px solid rgba(94,234,212,0.32)",
                    boxShadow: "0 8px 28px rgba(20,184,166,0.26), 0 0 0 1px rgba(45,212,191,0.12)",
                  }
                : {
                    background: plan.highlighted ? "#4d9fff" : "rgba(255,255,255,0.06)",
                    color: plan.highlighted ? "white" : "rgba(255,255,255,0.7)",
                    border: plan.highlighted ? "1px solid rgba(77,159,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  }
          }
        >
          {plan.cta}
        </a>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [yearly, setYearly] = useState(true);
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
            All plans include the core app. Flow and Bloom unlock the full power.
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
                2 months free
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 overflow-visible sm:auto-rows-fr sm:grid-cols-2 sm:items-stretch xl:grid-cols-4 2xl:gap-7"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className="overflow-visible pt-4 sm:h-full"
            >
              <PricingCard plan={plan as PricingPlan} yearly={yearly} />
            </div>
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
