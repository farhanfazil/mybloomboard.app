"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import GlowButton from "@/components/ui/GlowButton";
import { useSpotlightBorder } from "@/components/ui/spotlight-border";
import { HolographicButterfly } from "@/components/sections/DeepDiveFlight";

const words = ["Your", "personal", "command", "center."];

function HeroDashboardImage() {
  const { cardRef, spotRef, spotStyle } = useSpotlightBorder({
    radius: 420,
    borderWidth: 2,
    borderRadius: "28px",
    brightness: 2.6,
  });

  return (
    <div ref={cardRef as React.RefObject<HTMLDivElement>} className="relative overflow-hidden rounded-[28px]">
      <div ref={spotRef} style={spotStyle} aria-hidden="true" />
      <Image
        src="/screenshots/hero-dashboard.jpg"
        alt="BloomBoard dashboard preview"
        width={2188}
        height={1638}
        priority
        className="block w-[880px] max-w-none select-none"
        unoptimized
      />
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "0px 0px 80px 0px" });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 px-6"
    >
      {/* Background orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "5%",
          width: 700,
          height: 700,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "5%",
          width: 600,
          height: 600,
          background: "radial-gradient(ellipse at center, rgba(57,255,20,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div style={{ y: textY }} className="flex flex-col gap-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(77,159,255,0.1)",
                  border: "1px solid rgba(77,159,255,0.25)",
                  color: "#4d9fff",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                Now available for macOS
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-3"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    color:
                      word === "command" || word === "center."
                        ? "#4d9fff"
                        : "white",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              className="text-lg text-text-muted leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              BloomBoard replaces scattered tools with one beautifully designed macOS app — tasks, KPIs, streaks, meetings, mood tracking, and hydration in a single glassy window.
            </motion.p>

            {/* CTA */}
            <motion.div
              ref={ctaRef}
              className="relative flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              {/* Butterfly — lands near the Start Flow button */}
              <motion.div
                className="pointer-events-none absolute left-[55%] top-0 z-20 hidden lg:block"
                style={{ willChange: "transform, opacity" }}
                initial={{ opacity: 0, x: -380, y: -400, rotate: -28, scale: 0.46 }}
                animate={
                  isCtaInView
                    ? {
                        opacity: [0, 1, 1, 1],
                        x: [-380, -200, -60, 0],
                        y: [-400, -260, -130, -52],
                        rotate: [-28, 18, -8, 0],
                        scale: [0.46, 0.70, 0.63, 0.58],
                      }
                    : {}
                }
                transition={{
                  duration: 2.8,
                  delay: 0.9,
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

              <GlowButton label="Download Free" variant="primary" large href="https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg" />
              <a
                href="https://buy.polar.sh/polar_cl_bcGVnrH6RUJvB6pVEhW0kRdOJ1wa82yn9xuPK480cmt"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(155deg, rgba(7,23,43,0.97) 0%, rgba(6,13,24,0.96) 50%, rgba(7,20,36,0.97) 100%)",
                  color: "#e8f4ff",
                  border: "1.5px solid rgba(77,159,255,0.45)",
                  boxShadow: "0 0 0 1px rgba(77,159,255,0.12), 0 8px 32px rgba(30,120,255,0.28), 0 2px 12px rgba(77,159,255,0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                Start Flow Trial →
              </a>
            </motion.div>

            {/* Badges row */}
            <motion.div
              className="flex flex-wrap gap-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                "🍎 Built for Apple Silicon",
                "💻 macOS only",
                "🔒 100% local",
                "∅ No account needed",
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#607080",
                  }}
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: App window mockup */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              style={{ y: mockupY, scale: mockupScale }}
              className="animate-float"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glow behind window */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 60% 50%, rgba(77,159,255,0.2) 0%, transparent 65%)",
                  filter: "blur(40px)",
                  transform: "scale(1.1)",
                }}
              />
              <div
                className="relative"
                style={{
                  transform: "perspective(1200px) rotateY(-6deg) rotateX(3deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="hidden xl:block"
                  style={{ transform: "scale(0.85)", transformOrigin: "top right" }}
                >
                  <HeroDashboardImage />
                </div>
                <div
                  className="hidden lg:block xl:hidden"
                  style={{ transform: "scale(0.65)", transformOrigin: "top right" }}
                >
                  <HeroDashboardImage />
                </div>
                <div
                  className="lg:hidden"
                  style={{ transform: "scale(0.45)", transformOrigin: "top center" }}
                >
                  <HeroDashboardImage />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
        <div
          className="w-px h-8 rounded-full"
          style={{
            background: "linear-gradient(to bottom, rgba(77,159,255,0.5), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
