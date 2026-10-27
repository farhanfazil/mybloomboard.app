"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import HeroVerb from "@/components/sections/HeroVerb";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";
import { WEB_APP_URL } from "@/components/ui/header-2";

/**
 * The opening scene, "Product stage": no picture, the product is the picture. A big
 * two-line headline where a blue "Re" arrives in front of "worked." (CSS only,
 * globals.css .bb-re), then the live demo lying back slightly; as you scroll the
 * window stands up. Script only sets transforms and opacity, once a frame,
 * and only near the top of the page.
 */
export default function AppPreviewScroll() {
  // The download for the visitor's device: Mac, Windows or iPhone.
  const device = useDevice();
  const copyRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copy = copyRef.current, tilt = tiltRef.current;
    if (!copy || !tilt) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = () => window.innerWidth < 640;

    let last = -1;
    const draw = () => {
      const y = window.scrollY, vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, y / (vh * 0.75)));
      if (t === last) return;
      last = t;
      copy.style.transform = `translateY(${(-y * 0.18).toFixed(1)}px)`;
      copy.style.opacity = String(Math.max(0, 1 - t * 1.25));
      const e = reduce || phone() ? 1 : 1 - Math.pow(1 - Math.min(1, t * 1.2), 3);
      /* flat once it has stood up: no transform left on the demo at all */
      tilt.style.transform = e >= 1 ? "" : `perspective(2200px) rotateX(${(9 * (1 - e)).toFixed(2)}deg) scale(${(0.94 + 0.06 * e).toFixed(4)})`;
    };

    let queued = false;
    const onScroll = () => {
      if (queued || (last === 1 && window.scrollY > window.innerHeight * 1.3)) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; draw(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", draw);
    draw();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden bg-black pb-12 sm:pb-14">
      {/* two faint page lines framing the content, fading out before the demo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden justify-center md:flex"
        style={{ WebkitMaskImage: "linear-gradient(180deg,#000 0,#000 40%,transparent 70%)", maskImage: "linear-gradient(180deg,#000 0,#000 40%,transparent 70%)" }}
      >
        <span className="h-full w-[1240px] max-w-[calc(100%-80px)] border-x border-white/[0.06]" />
      </div>

      <div ref={copyRef} className="relative flex flex-col items-center px-4 pb-2 pt-28 text-center sm:px-6 sm:pt-32 md:pt-36 lg:pt-40" style={{ willChange: "transform, opacity" }}>
        <h1 className="font-semibold text-white" style={{ fontSize: "clamp(3.2rem, 7.6vw, 7.4rem)", lineHeight: 0.96, letterSpacing: "-0.052em" }}>
          <span className="sr-only">Teamwork. Reworked.</span>
          <span aria-hidden>
            Teamwork.
            <br />
            <span className="bb-re"><span className="bb-re-re">Re</span><span className="bb-re-worked">worked.</span></span>
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
          <span className="block">Tasks, boards, chat, calls and a live office, in one app.</span>
          {/* phones: a plain line (the typing word needs room a phone line doesn't have) */}
          <span className="block sm:hidden">The productivity app that thinks with you.</span>
          <span className="hidden sm:block">
            <span className="sr-only">The productivity app that thinks with you.</span>
            <span aria-hidden>The productivity app that <span className="text-white"><HeroVerb /></span> with you.</span>
          </span>
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {/* One main button for the visitor's own system; the other way in is a quiet link. */}
          <DownloadButton choice={device.primary} className="h-[52px] rounded-xl px-6 text-[15.5px]" />
          {/* Computers can start right away in the browser (nothing to install, good for
              locked-down work laptops); phones get the demo instead. */}
          {device.os === "iphone" || device.os === "android" ? (
            <Link href="/demo" className="group inline-flex items-center gap-1.5 text-[15.5px] font-semibold text-white">
              Try live demo <Arrow />
            </Link>
          ) : (
            <a href={WEB_APP_URL} className="group inline-flex items-center gap-1.5 text-[15.5px] font-semibold text-white">
              Open web app <Arrow />
            </a>
          )}
        </div>
        {/* iPhone sits in the same line as the other platform, so the iPhone note isn't repeated. */}
        <AlsoAvailable choice={device.alternate} note={device.os === "iphone" ? null : device.note} iphone className="mt-5" />
      </div>

      {/* The live demo, on stage */}
      <div className="relative mx-auto mt-14 w-full max-w-6xl px-4 sm:mt-16 sm:px-6">
        <div ref={tiltRef} style={{ transformOrigin: "50% 0", willChange: "transform" }}>
          <div id="live-demo" data-hide-header className="relative z-10">
            <LiveDemoFrame eager className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-[3px]">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
