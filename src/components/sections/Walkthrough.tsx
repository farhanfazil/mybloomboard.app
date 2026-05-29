"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WALKTHROUGH_ITEMS } from "@/lib/constants";
import WalkthroughItem from "@/components/walkthrough/WalkthroughItem";

export default function Walkthrough() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="walkthrough" className="relative border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="mb-10 text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#39FF14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}
          >
            Deep Dive
          </span>
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-5xl">
            Built for the details.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-muted sm:text-lg">
            Eleven thoughtful features designed to make your workday feel effortless.
          </p>
        </motion.div>

        {WALKTHROUGH_ITEMS.map((item, index) => (
          <WalkthroughItem
            key={item.id}
            {...item}
            index={index}
            total={WALKTHROUGH_ITEMS.length}
          />
        ))}
      </div>
    </section>
  );
}
