"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GlowButton from "@/components/ui/GlowButton";

export default function DownloadCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="download" className="relative py-32 px-6 overflow-hidden">
      {/* Large ambient glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "pulseGlow 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(57,255,20,0.06) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          ref={ref}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fire icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: "rgba(255,159,10,0.12)",
              border: "1px solid rgba(255,159,10,0.25)",
              boxShadow: "0 0 30px rgba(255,159,10,0.2)",
            }}
          >
            🔥
          </div>

          <h2
            className="font-bold leading-[1.05] tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Start your streak today.
          </h2>

          <p className="text-lg text-text-muted max-w-lg">
            Free to start. No cloud. No account. Local-first and beautifully designed for macOS.
          </p>

          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <GlowButton
                label="Download Free for Mac"
                variant="primary"
                large
                href="#"
              />
              <a
                href="https://buy.stripe.com/14AfZh00O28j5XT8li7bW05"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base transition-all duration-300 border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/10 hover:scale-105"
              >
                Start Pro — $5.99/mo
              </a>
            </div>
            <p className="text-xs text-text-muted">
              Requires macOS 11+. Apple Silicon & Intel. Free plan available forever.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["No account", "No cloud", "No tracking", "100% free"].map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(57,255,20,0.08)",
                  border: "1px solid rgba(57,255,20,0.18)",
                  color: "#39FF14",
                }}
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
