"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HolographicButterfly } from "@/components/sections/DeepDiveFlight";

export default function DownloadCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 260px 0px" });

  return (
    <section id="download" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
      {/* Large ambient glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(167,139,250,0.06) 0%, transparent 60%)",
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
          <h2
            className="font-bold leading-[1.05] tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            <span className="sm:whitespace-nowrap">Take control of your day.</span>
          </h2>

          <p className="max-w-lg text-sm leading-relaxed text-text-muted sm:text-lg">
            Free to start. No cloud. No account. Local-first and beautifully designed for macOS.
          </p>

          <div className="flex flex-col items-center gap-4 mt-2 w-full sm:w-auto">
            <div className="relative flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <motion.div
                className="pointer-events-none absolute left-[55%] top-0 z-20 block lg:left-[68%]"
                style={{ willChange: "transform, opacity" }}
                initial={{ opacity: 0, x: -420, y: -430, rotate: -28, scale: 0.46 }}
                animate={
                  isInView
                    ? {
                        opacity: [0, 1, 1, 1],
                        x: [-420, -240, -80, 0],
                        y: [-430, -290, -150, -56],
                        rotate: [-28, 18, -8, 0],
                        scale: [0.46, 0.60, 0.52, 0.44],
                      }
                    : {}
                }
                transition={{
                  duration: 2.8,
                  delay: 0.1,
                  times: [0, 0.32, 0.68, 1],
                  x:      { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  y:      { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  rotate: { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  scale:  { ease: ["easeIn", "linear", "easeOut"], duration: 2.8 },
                  opacity: { ease: "easeOut", duration: 0.45 },
                }}
              >
                <HolographicButterfly />
              </motion.div>

              {/* Download button — clean white Apple style */}
              <a
                href="https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:brightness-105 sm:w-auto sm:px-8"
                style={{
                  background: "rgba(255,255,255,0.93)",
                  color: "#0a0f1c",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download Free for Mac
              </a>

              {/* Flow button — soft light style matching pricing card */}
              <a
                href="https://buy.polar.sh/polar_cl_bcGVnrH6RUJvB6pVEhW0kRdOJ1wa82yn9xuPK480cmt"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
                style={{
                  background: "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)",
                  color: "#e8f4ff",
                  border: "1.5px solid rgba(77,159,255,0.45)",
                  boxShadow: "0 0 0 1px rgba(77,159,255,0.12), 0 8px 32px rgba(30,120,255,0.28), 0 2px 12px rgba(77,159,255,0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                Start Flow — $7.99/mo
              </a>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-text-muted sm:max-w-none">
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
