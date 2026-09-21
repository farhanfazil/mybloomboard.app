"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FAQS } from "@/lib/constants";

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative overflow-hidden border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          ref={ref}
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-text-primary sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Clear answers about BloomBoard, pricing, privacy, AI, teams, and how the dashboard fits into your daily workflow.
          </p>
          <div className="mt-8 hidden border-l-2 border-white/15 pl-4 lg:block">
            <p className="text-sm font-semibold text-text-primary">Still deciding?</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Start with the free plan, explore the dashboard, then upgrade only when you need more boards, reports, or AI power.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-white/10"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FAQS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-white/10 py-5"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-text-primary sm:text-lg">
                <span className="leading-snug">{item.question}</span>
                <span aria-hidden className="shrink-0 text-2xl font-light leading-none text-white/50 transition-transform duration-200 group-open:rotate-45 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-white/65 sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
