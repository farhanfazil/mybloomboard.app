"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const SLIDES = [
  { src: "/screenshots/hero-1-dark.jpg",  alt: "Bloombooard dashboard – dark theme" },
  { src: "/screenshots/hero-2-light.jpg", alt: "Bloombooard dashboard – light theme" },
  { src: "/screenshots/hero-3-blue.jpg",  alt: "Bloombooard dashboard – blue theme" },
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
        {/*
         * All slides are always in the DOM so the browser loads every image
         * on first paint — no on-demand fetch when the slide changes.
         * CSS opacity transition is GPU-composited: zero layout/paint cost.
         */}
        <div className="relative h-full w-full bg-[#0a0014]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: i === current ? 1 : 0,
                transition: "opacity 0.55s ease-in-out",
                willChange: "opacity",
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={2196}
                height={1658}
                priority
                className="h-full w-full scale-[1.17] object-contain select-none sm:scale-100"
                style={{ transformOrigin: "center top" }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </ContainerScroll>

      {/* Dot navigation */}
      <div className="relative z-20 -mt-7 flex items-center justify-center gap-2 pb-2 sm:-mt-4 sm:pb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full"
            style={{
              width:      i === current ? 20 : 6,
              height:     6,
              background: i === current ? "rgba(77,159,255,0.9)" : "rgba(255,255,255,0.25)",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
