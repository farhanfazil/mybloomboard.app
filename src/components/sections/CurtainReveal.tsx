"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A "curtain" between two sections. The lid (the plan quiz and the trust row)
 * is a full-screen dark grey card that scrolls up and away; the section under
 * it (Pricing) stays still while it is uncovered, then the page scrolls on.
 *
 * How (CSS only, so it never lags behind the scroll): the lid is at least one
 * screen tall, and the lower section's wrapper is pulled up under it by one
 * screen. Inside the wrapper the section is `position: sticky; top: 0`, with one
 * screen of extra room after it, so it holds still for exactly the screen of
 * scrolling it takes the lid's bottom edge to cross the screen, then scrolls
 * normally. Script only fades it up and moves its #anchor to where it shows.
 */
export default function CurtainReveal({
  lid,
  under,
  lidClassName = "flex flex-col justify-center rounded-b-[36px] border-b border-white/[0.09] bg-[#0e0e10]",
  lidShadow = "0 40px 80px rgba(0,0,0,0.7)",
}: {
  lid: ReactNode;
  under: ReactNode;
  /** Look of the lid (it is always at least one screen tall and opaque). */
  lidClassName?: string;
  lidShadow?: string;
}) {
  const lidRef = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lidEl = lidRef.current, under = underRef.current, mark = markRef.current;
    if (!lidEl || !under) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* The section's own anchor (e.g. #pricing) would land a screen early; the
       marker after the lid is exactly where it shows. It can load lazily, so
       keep trying until it's there. */
    let adopted = false;
    const adopt = () => {
      const sec = under.querySelector("section");
      if (!sec) return;
      adopted = true;
      if (sec.id && mark && !mark.id) { mark.id = sec.id; sec.removeAttribute("id"); }
    };
    adopt();

    let queued = false;
    const update = () => {
      queued = false;
      if (!adopted) adopt();
      if (reduce) return;
      const r = Math.min(1, Math.max(0, 1 - lidEl.getBoundingClientRect().bottom / window.innerHeight));
      under.style.opacity = (0.55 + 0.45 * r).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
      window.setTimeout(() => queued && update(), 120);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={lidRef}
        className={`curtain-lid relative z-20 min-h-screen overflow-clip ${lidClassName}`}
        style={{ boxShadow: lidShadow }}
      >
        {lid}
      </div>
      <div ref={markRef} aria-hidden className="h-0" />
      <div className="curtain-under relative z-10" style={{ marginTop: "-100vh" }}>
        <div ref={underRef} className="sticky top-0">
          {under}
        </div>
        <div aria-hidden style={{ height: "100vh" }} />
      </div>
    </div>
  );
}
