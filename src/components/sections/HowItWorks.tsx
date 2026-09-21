"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, CreditCard, Key, CheckCircle } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Download,
    title: "Install the app",
    description:
      "Download the free app and make sure the workflow fits your editing needs.",
    color: "#a78bfa",
    colorBg: "rgba(167,139,250,0.08)",
    colorBorder: "rgba(167,139,250,0.18)",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Start a trial or buy a plan",
    description:
      "Use one of the plan buttons below to begin billing or start your trial.",
    color: "#4d9fff",
    colorBg: "rgba(77,159,255,0.08)",
    colorBorder: "rgba(77,159,255,0.18)",
  },
  {
    number: "03",
    icon: Key,
    title: "Get your license key from the portal",
    description: (
      <>
        Check your email for{" "}
        <strong className="font-semibold text-white/90">Access Purchase</strong>{" "}
        button. Open it to go to your{" "}
        <a
          href="https://polar.sh/bloombooard/portal"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-white/80 hover:text-white transition-colors"
        >
          customer portal
        </a>
        . In the customer portal, copy your license key.
      </>
    ),
    color: "#34d399",
    colorBg: "rgba(52,211,153,0.08)",
    colorBorder: "rgba(52,211,153,0.18)",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Paste your license key",
    description:
      "Open Settings in the app, enter the key, and activate this Mac.",
    color: "#f472b6",
    colorBg: "rgba(244,114,182,0.08)",
    colorBorder: "rgba(244,114,182,0.18)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/[0.05] bg-black px-3 py-16 sm:px-6 sm:py-24"
    >
      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-10 text-center sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Up and running in minutes.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            Four steps from download to a fully activated workspace.
          </p>
        </motion.div>

        {/* ── Mobile: stacked cards (unchanged) ── */}
        <div className="flex flex-col gap-4 lg:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-4 rounded-[20px] p-5"
                style={{ background: "#0b0d10", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)" }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold leading-snug text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Desktop: horizontal timeline rows ── */}
        <div className="hidden lg:flex lg:flex-col lg:gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex items-start gap-8"
              >
                {/* Left: timeline spine — connector line only */}
                <div className="flex flex-col items-center" style={{ width: 2, flexShrink: 0, alignSelf: "stretch" }}>
                  {!isLast && (
                    <div
                      className="w-px flex-1"
                      style={{
                        background: `linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.03))`,
                      }}
                    />
                  )}
                </div>

                {/* Right: content row */}
                <div
                  className="flex flex-1 items-center gap-6 rounded-2xl mb-4"
                  style={{ background: "#0b0d10", border: "1px solid rgba(255,255,255,0.1)", padding: "20px 28px" }}
                >
                  {/* Icon in place of number */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)" }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>

                  {/* Divider */}
                  <div className="h-12 w-px shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />

                  {/* Title + description */}
                  <div className="flex flex-1 items-center gap-8">
                    <h3 className="text-lg font-bold text-white shrink-0 w-56 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/55 flex-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
