"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HolographicButterfly } from "@/components/sections/DeepDiveFlight";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";

export default function DownloadCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 260px 0px" });
  const device = useDevice();

  return (
    <section id="download" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
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
            Working solo? It is free, with no account needed: your tasks and notes stay on your computer. Teams sign in to sync and work together. Designed for Mac and Windows.
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

              {/* One main button for the visitor's own system */}
              <DownloadButton choice={device.primary} className="w-full gap-2.5 px-6 py-3 text-sm text-[#0a0f1c] sm:w-auto" />

              {/* Bloom button */}
              <a
                href="/start?plan=bloom"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07] sm:w-auto"
              >
                Try Bloom free for 7 days
              </a>
            </div>
            <AlsoAvailable choice={device.alternate} note={device.note} />
            <p className="max-w-xs text-xs leading-relaxed text-text-muted sm:max-w-none">
              Mac: macOS 13+, Apple Silicon & Intel. Windows: Windows 10 & 11, from the Microsoft Store.
              Free plan available forever.
            </p>
          </div>

          <p className="mt-2 text-sm text-white/50">Solo: no account needed · No ad trackers · Free to start</p>
        </motion.div>
      </div>
    </section>
  );
}
