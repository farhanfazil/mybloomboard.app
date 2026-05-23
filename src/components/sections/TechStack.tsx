"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TECH_STACK } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";

function TechPill({ icon, label, color }: { icon: string; label: string; color: string }) {
  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius:       120,
    borderWidth:  1,
    borderRadius: "9999px",
    brightness:   2.4,
    // Apple Intelligence palette — defaults from hook
  });

  return (
    <motion.div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      variants={fadeUp}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                 transition-all duration-200 hover:scale-105 cursor-default"
      style={{
        background: "rgba(20,30,48,0.72)",
        border:     `1px solid ${color}30`,
        color,
      }}
    >
      {/* Apple Intelligence spotlight border */}
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />
      <span style={{ position: "relative", zIndex: 1 }}>{icon}</span>
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </motion.div>
  );
}

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-2">Built with care.</h2>
          <p className="text-text-muted text-sm">No frameworks. No cloud. Just native code.</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {TECH_STACK.map((item) => (
            <TechPill key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
