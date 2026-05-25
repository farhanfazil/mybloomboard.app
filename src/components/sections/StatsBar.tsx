"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/lib/constants";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-12">
      <div
        className="max-w-6xl mx-auto rounded-3xl overflow-hidden"
        style={{
          background: "rgba(20, 30, 48, 0.6)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Top glow line */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(77,159,255,0.5), rgba(57,255,20,0.5), transparent)" }}
        />

        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-6 sm:px-4 sm:py-7"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Vertical divider */}
              {i > 0 && (
                <div
                  className="absolute left-0 top-1/4 bottom-1/4 w-px hidden lg:block"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              )}
              <AnimatedCounter
                value={stat.value}
                className="text-2xl font-bold sm:text-3xl"
                style={{
                  color:
                    i === 0
                      ? "#4d9fff"
                      : i === 1
                        ? "#39FF14"
                        : i === 5
                          ? "#ff9f0a"
                          : "#eeeeee",
                } as React.CSSProperties}
              />
              <span className="text-xs text-text-muted text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)" }}
        />
      </div>
    </section>
  );
}
