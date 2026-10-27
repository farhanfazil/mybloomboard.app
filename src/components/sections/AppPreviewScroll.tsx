"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import HeroVerb from "@/components/sections/HeroVerb";
import HeroSignals from "@/components/sections/HeroSignals";
import { useDevice } from "@/lib/downloads";
import { AlsoAvailable, DownloadButton } from "@/components/ui/DownloadButton";
import { WEB_APP_URL } from "@/components/ui/header-2";

/**
 * The opening scene, "Product stage": charcoal with a faint dot grid (and Signals running along it,
 * HeroSignals.tsx), no picture; the product is the picture. A big
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
    <section id="hero" className="relative -mt-16 overflow-hidden bg-[#0d0e11] pb-12 sm:pb-14">
      {/* -mt-16 (and 64 px more top padding): the charcoal runs up under the header, no black strip */}
      {/* a faint dot grid behind the headline, fading out before the demo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.11) 1px, transparent 1.2px)",
          backgroundSize: "26px 26px",
          backgroundPosition: "center top",
          WebkitMaskImage: "linear-gradient(180deg,#000 0,#000 45%,transparent 75%)",
          maskImage: "linear-gradient(180deg,#000 0,#000 45%,transparent 75%)",
        }}
      />
      {/* now and then a point of light runs along the grid toward the headline */}
      <HeroSignals avoid={copyRef} />

      <div ref={copyRef} className="relative flex flex-col items-center px-4 pb-2 pt-44 text-center sm:px-6 md:pt-48" style={{ willChange: "transform, opacity" }}>
        <h1 className="font-semibold text-white" style={{ fontSize: "clamp(3.2rem, 7vw, 6.8rem)", lineHeight: 0.96, letterSpacing: "-0.052em" }}>
          <span className="sr-only">Teamwork. Reworked.</span>
          <span aria-hidden>
            Teamwork.
            <br />
            <span className="bb-re"><span className="bb-re-re">Re</span><span className="bb-re-worked">worked.</span></span>
          </span>
        </h1>

        {/* Two short lines, never wider than the headline. */}
        <p className="mt-5 text-[17px] leading-relaxed text-white/65">
          Tasks, boards, chat, calls and a live office.
          <br />
          One app that <HeroVerb /> with you.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {/* Two compact buttons side by side: the download for the visitor's own system (solid),
              and the other way in (outlined). */}
          <DownloadButton choice={device.primary} iconSize={14} className="h-[38px] rounded-[9px] px-[15px] text-[14px]" />
          {/* Computers can start right away in the browser (nothing to install, good for
              locked-down work laptops); phones get the demo instead. */}
          {device.os === "iphone" || device.os === "android" ? (
            <Link href="/demo" className={SECONDARY}>
              Try live demo <Arrow />
            </Link>
          ) : (
            <a href={WEB_APP_URL} className={SECONDARY}>
              Open web app <Arrow />
            </a>
          )}
        </div>
        {/* One quiet grey line: the other platform and the iPhone app. */}
        <AlsoAvailable choice={device.alternate} iphone quiet className="mt-3.5" />
      </div>

      {/* The live demo, on stage */}
      <div className="relative mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 sm:mt-16">
        <div ref={tiltRef} style={{ transformOrigin: "50% 0", willChange: "transform" }}>
          <div id="live-demo" data-hide-header className="relative z-10">
            <LiveDemoFrame eager className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* the outlined partner of the solid download button: same height and shape */
const SECONDARY = "group inline-flex h-[38px] items-center gap-1.5 rounded-[9px] border border-white/[0.22] px-[15px] text-[14px] font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-[3px]">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
