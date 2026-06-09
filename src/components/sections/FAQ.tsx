"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FAQS } from "@/lib/constants";

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative overflow-hidden border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.035) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          ref={ref}
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="mb-5 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "rgba(255,255,255,0.82)",
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            FAQ
          </span>
          <h2 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-text-primary sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Clear answers about BloomBoard, pricing, privacy, AI, teams, and how the dashboard fits into your daily workflow.
          </p>
          <div className="mt-8 hidden rounded-2xl border border-white/[0.09] bg-black/60 p-5 backdrop-blur-xl lg:block">
            <p className="text-sm font-semibold text-text-primary">Still deciding?</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Start with the free plan, explore the dashboard, then upgrade only when you need more boards, reports, or AI power.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-3xl border border-white/[0.09] bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FAQS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/[0.08] px-5 py-5 transition-colors last:border-b-0 open:bg-white/[0.035] sm:px-7"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-text-primary sm:text-lg">
                <span className="leading-snug">{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.035] text-lg text-text-muted transition-all group-open:rotate-45 group-open:border-white/20 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
