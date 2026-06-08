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
          href="https://sandbox.polar.sh/daily-dashboard/portal"
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
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 700,
          height: 500,
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.04) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "#a78bfa",
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Up and running in minutes.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            Four simple steps to get your workspace fully activated.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col gap-4 rounded-[20px] p-5 sm:p-6"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(18,18,22,0.96) 0%, rgba(10,10,14,0.92) 100%)",
                  border: `1px solid ${step.colorBorder}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Step number */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: step.colorBg,
                      border: `1px solid ${step.colorBorder}`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: step.color }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <span
                    className="text-2xl font-black tabular-nums"
                    style={{ color: `${step.color}30` }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {step.description}
                  </p>
                </div>

                {/* Connector line — hidden on mobile + last item */}
                {i < STEPS.length - 1 && (
                  <div
                    className="pointer-events-none absolute -right-[0.6rem] top-1/2 hidden h-px w-[1.2rem] -translate-y-1/2 lg:block"
                    style={{
                      background: `linear-gradient(to right, ${step.colorBorder}, rgba(255,255,255,0.06))`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
