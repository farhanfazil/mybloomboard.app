"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const SLIDES = [
  { src: "/screenshots/Card_Black.jpg",     alt: "Bloombooard dashboard – black theme" },
  { src: "/screenshots/hero-dashboard.jpg", alt: "Bloombooard dashboard – dark theme" },
  { src: "/screenshots/Card_Light.jpg",     alt: "Bloombooard dashboard – light theme" },
];

export default function AppPreviewScroll() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number) => {
    setCurrent(index);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCurrent((i) => (i + 1) % SLIDES.length), 3000);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => setCurrent((i) => (i + 1) % SLIDES.length), 3000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  return (
    <section id="hero" className="relative overflow-hidden px-4 sm:px-6">
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 600,
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <ContainerScroll
        titleComponent={
          <div className="relative z-0 mb-0 flex translate-y-2 flex-col items-center gap-2 sm:translate-y-3 sm:gap-3 md:-translate-y-[34px]">
            <p className="text-sm font-medium tracking-wide text-text-muted sm:text-lg">
              Tasks, goals, reminders, health &amp; streaks
            </p>
            <h2
              className="font-bold leading-[0.92] tracking-normal text-text-primary md:whitespace-nowrap"
              style={{ fontSize: "clamp(2.2rem, 5.2vw, 6.7rem)" }}
            >
              Your Day.{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #4d9fff 0%, #a78bfa 38%, #f472b6 65%, #ff453a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One Board
              </span>
            </h2>
          </div>
        }
      >
        {/* Slide images — fill the card without cropping */}
        <div className="relative h-full w-full bg-[#0a0014]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={SLIDES[current].src}
                alt={SLIDES[current].alt}
                width={2188}
                height={1638}
                priority={current === 0}
                className="h-full w-full object-contain select-none"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </ContainerScroll>

      {/* Dot navigation — sits just below the card */}
      <div className="flex items-center justify-center gap-2 pb-6 -mt-4 relative z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width:  i === current ? 20 : 6,
              height: 6,
              background: i === current ? "rgba(77,159,255,0.9)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
