"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

function FullAppPreviewImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080d1a]">
      <Image
        src="/screenshots/hero-dashboard.png"
        alt="Bloombooard dashboard preview"
        width={2188}
        height={1710}
        priority
        className="h-full w-full object-contain md:object-cover"
        unoptimized
      />
    </div>
  );
}

export default function AppPreviewScroll() {
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
          <div className="relative z-0 mb-0 flex translate-y-2 flex-col items-center gap-2 sm:translate-y-3 sm:gap-3 md:translate-y-[8px]">
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
        <FullAppPreviewImage />
      </ContainerScroll>
    </section>
  );
}
