"use client";

import Link from "next/link";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import DemoSpotlight from "@/components/sections/DemoSpotlight";
import MountainRise from "@/components/sections/MountainRise";
import HeroVerb from "@/components/sections/HeroVerb";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";
import { WEB_APP_URL } from "@/components/ui/header-2";

export default function AppPreviewScroll() {
  // The download for the visitor's device: Mac, Windows or iPhone.
  const device = useDevice();

  return (
    <section id="hero" className="relative bg-black pb-14 sm:pb-20">
      {/* The spotlight's full-screen shade lives out here: inside the hero's moving
          part (MountainRise) a transform would trap it in that box. */}
      <DemoSpotlight targetId="live-demo" />
      {/* The opening scene: the sky and the words stay put while the mountains,
          and the live demo right under them, scroll up over them (MountainRise). */}
      <MountainRise
        words={
        /* Hero copy */
        <div className="flex flex-col items-center px-4 pb-2 pt-28 text-center sm:px-6 sm:pt-32 md:pt-36 lg:pt-40">
          <h1
            className="max-w-5xl font-bold tracking-tight text-white [text-wrap:balance]"
            style={{ fontSize: "clamp(2rem, 4.4vw, 4.75rem)", lineHeight: 1.06 }}
          >
            <span className="sm:block">Tasks, team chat, calls </span>
            <span className="sm:block">and a live office in one app.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75 sm:mt-6 sm:text-xl">
            {/* phones: a plain line (the typing word needs room a phone line doesn't have) */}
            <span className="sm:hidden">The productivity app that thinks with you.</span>
            <span className="hidden sm:inline">
              <span className="sr-only">The productivity app that thinks with you.</span>
              <span aria-hidden>The productivity app that <HeroVerb /> with you.</span>
            </span>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            {/* One main button for the visitor's own system; the other one is a quiet link below. */}
            <DownloadButton choice={device.primary} className="px-5 py-2.5 text-sm" />
            {/* Computers can start right away in the browser (nothing to install, good for
                locked-down work laptops); phones get the demo instead. */}
            {device.os === "iphone" || device.os === "android" ? (
              <Link
                href="/demo"
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Try live demo
              </Link>
            ) : (
              <a
                href={WEB_APP_URL}
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Open web app
              </a>
            )}
          </div>
          {/* iPhone sits in the same line as the other platform, so the iPhone note isn't repeated. */}
          <AlsoAvailable
            choice={device.alternate}
            note={device.os === "iphone" ? null : device.note}
            iphone
            className="mt-4"
          />
        </div>
        }
      >
      {/* Live demo — full window, no translate/clip */}
      <div
        id="live-demo"
        data-hide-header
        className="relative z-[45] mx-auto -mt-[6svh] w-full max-w-6xl px-4 sm:px-6"
      >
        <LiveDemoFrame eager className="mx-auto" />
      </div>
      </MountainRise>
    </section>
  );
}
