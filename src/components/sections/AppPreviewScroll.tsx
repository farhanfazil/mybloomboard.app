"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";

/** Legacy carousel slides — kept for the hidden card (not deleted) */
const SLIDES = [
  { src: "/screenshots/hero-1-dark.jpg", alt: "BloomBoard dashboard – dark theme" },
  { src: "/screenshots/hero-2-light.jpg", alt: "BloomBoard dashboard – light theme" },
  { src: "/screenshots/hero-3-blue.jpg", alt: "BloomBoard dashboard – blue theme" },
];

export default function AppPreviewScroll() {
  // The download for the visitor's device: Mac, Windows or iPhone.
  const device = useDevice();
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
          <span className="mt-1 block">thinks with you.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg">
          Tasks, boards, notes, chat and calls for you and your team.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          {/* One main button for the visitor's own system; the other one is a quiet link below. */}
          <DownloadButton choice={device.primary} className="px-5 py-2.5 text-sm" />
          <Link
            href="/demo"
            className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Try live demo
          </Link>
        </div>
        <AlsoAvailable choice={device.alternate} note={device.note} className="mt-4" />
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
