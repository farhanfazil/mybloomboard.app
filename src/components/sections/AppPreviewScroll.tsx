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
    <section className="relative overflow-hidden px-4 sm:px-6">
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
          <div className="mb-3 flex flex-col items-center gap-3 sm:mb-4 sm:gap-4">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#4d9fff",
                background: "rgba(77,159,255,0.1)",
                border: "1px solid rgba(77,159,255,0.2)",
              }}
            >
              Full App Preview
            </span>
            <h2
              className="font-bold leading-tight text-text-primary"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Your entire day.{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #4d9fff 0%, #a78bfa 38%, #f472b6 65%, #ff453a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One window.
              </span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-text-muted sm:text-lg">
              Tasks, milestones, reminders, health, and streaks - all visible at a glance. No switching tabs.
            </p>
          </div>
        }
      >
        <FullAppPreviewImage />
      </ContainerScroll>
    </section>
  );
}
