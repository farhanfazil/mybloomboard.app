"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FAQS } from "@/lib/constants";

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.08) 0%, rgba(167,139,250,0.04) 36%, transparent 70%)",
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
              color: "#4d9fff",
              background: "rgba(77,159,255,0.1)",
              border: "1px solid rgba(77,159,255,0.2)",
            }}
          >
            FAQ
          </span>
          <h2 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-text-primary sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Clear answers about Bloombooard, pricing, privacy, AI, teams, and how the dashboard fits into your daily workflow.
          </p>
          <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur lg:block">
            <p className="text-sm font-semibold text-text-primary">Still deciding?</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Start with the free plan, explore the dashboard, then upgrade only when you need more boards, reports, or AI power.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1522]/80 shadow-[0_24px_90px_rgba(0,0,0,0.30)] backdrop-blur"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FAQS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/10 px-5 py-5 transition-colors last:border-b-0 open:bg-white/[0.035] sm:px-7"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-text-primary sm:text-lg">
                <span className="leading-snug">{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-text-muted transition-all group-open:rotate-45 group-open:border-accent-blue/30 group-open:text-accent-blue">
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
