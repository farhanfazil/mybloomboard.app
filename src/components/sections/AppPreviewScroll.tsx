"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";

const DOWNLOAD_URL =
  "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg";

/** Legacy carousel slides — kept for the hidden card (not deleted) */
const SLIDES = [
  { src: "/screenshots/hero-1-dark.jpg", alt: "BloomBoard dashboard – dark theme" },
  { src: "/screenshots/hero-2-light.jpg", alt: "BloomBoard dashboard – light theme" },
  { src: "/screenshots/hero-3-blue.jpg", alt: "BloomBoard dashboard – blue theme" },
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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current]);

  const titleComponent = (
    <div className="relative z-0 mb-0 flex translate-y-2 flex-col items-center gap-3 sm:translate-y-3 sm:gap-4 md:-translate-y-[34px]">
      <p className="text-center text-sm font-medium tracking-wide text-text-muted sm:text-lg">
        Whether you work solo or lead a team
        <br />
        one place to run it all.
      </p>
      <h2
        className="text-center font-bold tracking-normal text-text-primary"
        style={{ fontSize: "clamp(2rem, 4.4vw, 5.8rem)", lineHeight: 1.08 }}
      >
        <span className="block">Productivity app that</span>
        <span
          className="block"
          style={{
            background: "linear-gradient(90deg, #4d9fff 0%, #a78bfa 38%, #f472b6 65%, #ff453a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          thinks with you.
        </span>
      </h2>
    </div>
  );

  return (
    <section id="hero" className="relative bg-black pb-14 sm:pb-20">
      {/* Cinematic background — upper hero only; fades to black before demo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(100svh,920px)]">
        <Image
          src="/backgrounds/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom,",
              "rgba(0,0,0,0.22) 0%,",
              "rgba(0,0,0,0.08) 28%,",
              "rgba(0,0,0,0.35) 55%,",
              "rgba(0,0,0,0.72) 72%,",
              "rgba(0,0,0,0.94) 86%,",
              "#000000 100%)",
            ].join(" "),
          }}
          aria-hidden
        />
      </div>

      {/* Hero copy */}
      <div className="relative z-20 flex flex-col items-center px-4 pb-2 pt-28 text-center sm:px-6 sm:pt-32 md:pt-36 lg:pt-40">
        <h1
          className="max-w-5xl font-bold tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 4.8vw, 5.5rem)", lineHeight: 1.06 }}
        >
          <span className="block">Productivity app that</span>
          <span
            className="mt-1 block"
            style={{
              background: "linear-gradient(90deg, #4d9fff 0%, #a78bfa 38%, #f472b6 65%, #ff453a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            thinks with you.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-xs font-medium tracking-wide text-white/55 sm:mt-5 sm:text-sm">
          Whether you&apos;re a freelancer, work solo, or lead a team — one place to run it all.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download for Mac
          </a>
          <Link
            href="/demo"
            className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            Try live demo
          </Link>
        </div>
      </div>

      {/* Live demo — full window, no translate/clip */}
      <div
        id="live-demo"
        className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-4 sm:mt-32 md:mt-40 sm:px-6"
      >
        <LiveDemoFrame eager className="mx-auto" />
      </div>

      {/* Legacy scroll card — hidden, not deleted */}
      <div hidden aria-hidden="true">
        <div className="relative px-4 sm:px-6 [overflow-x:clip]">
          <ContainerScroll titleComponent={titleComponent}>
            <div className="relative h-full w-full bg-[#0a0014]">
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.src}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={2196}
                    height={1658}
                    className="h-full w-full object-contain select-none"
                    sizes="900px"
                    quality={85}
                  />
                </div>
              ))}
            </div>
          </ContainerScroll>
          <div className="relative z-20 mt-6 flex items-center justify-center gap-2 pb-2">
            {SLIDES.map((_, i) => (
              <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
