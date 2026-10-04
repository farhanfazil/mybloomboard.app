"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { FAQSection } from "@/components/ui/faqsection";
import { FAQS } from "@/lib/constants";

/* Same two-column accordion as the Security page's FAQ. */
export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const half = Math.ceil(FAQS.length / 2);

  return (
    <section id="faq" className="relative overflow-hidden border-y border-white/[0.04] bg-black px-4 py-6 sm:px-6 sm:py-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <FAQSection
          className="max-w-6xl"
          subtitle="FAQ"
          title="Frequently asked questions"
          description="Answers about BloomBoard, pricing, privacy, AI and teams. Still deciding? Start with the free plan and upgrade only when you need more."
          buttonLabel="Start free →"
          buttonHref="/start"
          faqsLeft={FAQS.slice(0, half)}
          faqsRight={FAQS.slice(half)}
        />
      </motion.div>
    </section>
  );
}
