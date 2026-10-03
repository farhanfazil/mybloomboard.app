"use client";

import Image from "next/image";
import Link from "next/link";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import HeroVerb from "@/components/sections/HeroVerb";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";

export default function AppPreviewScroll() {
  // The download for the visitor's device: Mac, Windows or iPhone.
  const device = useDevice();

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
          <span className="block">The productivity app that</span>
          <span className="mt-1 block">
            <span className="sr-only">thinks</span>
            <HeroVerb /> with you.
          </span>
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
        {/* iPhone sits in the same line as the other platform, so the iPhone note isn't repeated. */}
        <AlsoAvailable
          choice={device.alternate}
          note={device.os === "iphone" ? null : device.note}
          iphone
          className="mt-4"
        />
      </div>

      {/* Live demo — full window, no translate/clip */}
      <div
        id="live-demo"
        className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-4 sm:mt-32 md:mt-40 sm:px-6"
      >
        <LiveDemoFrame eager className="mx-auto" />
      </div>

    </section>
  );
}
