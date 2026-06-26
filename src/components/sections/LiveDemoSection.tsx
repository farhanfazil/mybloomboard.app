"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";

const DOWNLOAD_URL =
  "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg";

export default function LiveDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "120px 0px" });

  return (
    <section
      ref={sectionRef}
      id="live-demo-full"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/[0.06] bg-black px-4 py-16 sm:scroll-mt-28 sm:px-6 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            Try it live
          </span>
          <h2
            className="font-bold text-white"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.12 }}
          >
            The app. Live in your browser.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            This isn&apos;t a preview. It&apos;s a live demo with working features you can try yourself.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl"
        >
          <LiveDemoFrame />

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <p className="text-center text-xs text-white/45 sm:text-sm">
              Your changes save in this browser session. Download for the full Mac experience.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/demo"
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/5 sm:text-sm"
              >
                Expand demo
              </Link>
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#4d9fff] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3d8fef] sm:text-sm"
              >
                Download for Mac
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
