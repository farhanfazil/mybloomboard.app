"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

const SHADE = [
  "linear-gradient(to bottom,",
  "rgba(0,0,0,0.22) 0%,",
  "rgba(0,0,0,0.08) 28%,",
  "rgba(0,0,0,0.35) 55%,",
  "rgba(0,0,0,0.72) 72%,",
  "rgba(0,0,0,0.94) 86%,",
  "#000000 100%)",
].join(" ");

/**
 * The hero as a little landscape. The sky (hero-sky.jpg) and the words are
 * pinned in place; the mountains (hero-mountains.png, same size and alignment)
 * and everything after them (the live demo) simply scroll up over them, so the
 * words slip behind the hills and the demo follows right below.
 *
 * The movement is pure CSS (a sticky backdrop with the rest of the page laid
 * over it), so it moves exactly with the scroll. As the hills rise, the sky goes
 * fully dark like a sunset and the words dim, then fade away as the demo reaches them: one black layer whose opacity follows the scroll.
 */
/** How far the faster part has climbed ahead after scrolling y: eases out, so
 *  the speed glides back to normal with no kink. Shared with SnapPoints. */
export function liftAt(y: number, max: number, span: number) {
  const u = Math.min(1, Math.max(0, y / span));
  return max * (1 - (1 - u) * (1 - u));
}

export default function MountainRise({ words, children }: { words: ReactNode; children: ReactNode }) {
  const duskRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dusk = duskRef.current, wordsEl = wordsRef.current, rest = restRef.current;
    if (!dusk || !wordsEl || !rest) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let queued = false, maxLift = 0, span = 1;
    /* The live demo climbs faster than the hills: about twice the scroll speed
       at first, easing back to normal speed after three quarters of a screen,
       by which point it has gained almost half a screen. So one scroll brings it
       up ahead of the hills. The page after it is pulled up by the same amount,
       so there's no gap below it. Only a translate (no resizing), so it stays smooth. */
    const size = () => {
      maxLift = reduce ? 0 : Math.round(window.innerHeight * 0.45);
      span = Math.max(1, Math.round(window.innerHeight * 0.75));
      rest.style.marginBottom = -maxLift + "px";
      /* SnapPoints needs to know how this part moves to land on it exactly */
      rest.dataset.liftMax = String(maxLift);
      rest.dataset.liftSpan = String(span);
    };
    const update = () => {
      queued = false;
      const lift = liftAt(window.scrollY, maxLift, span);
      rest.style.transform = lift ? `translate3d(0,${(-lift).toFixed(1)}px,0)` : "";
      /* like a sunset: the sky is completely black by the time the hills reach
         the buttons (about a quarter of a screen of scrolling); the words dim
         a little */
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.24)));
      const e = t * t * (3 - 2 * t);
      dusk.style.opacity = e.toFixed(3);
      /* then, as the demo climbs up to them, the words fade away completely */
      const g = Math.min(1, Math.max(0, (window.scrollY - window.innerHeight * 0.2) / (window.innerHeight * 0.18)));
      wordsEl.style.opacity = ((1 - e * 0.25) * (1 - g * g * (3 - 2 * g))).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    const onResize = () => { size(); onScroll(); };
    size();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* backdrop: the sky and the words, held in place */}
      <div className="sticky top-0 z-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image src="/backgrounds/hero-sky.jpg" alt="" fill priority className="object-cover object-center" sizes="100vw" quality={90} />
          <div className="absolute inset-0" style={{ background: SHADE }} />
        </div>
        {/* dusk: the sky goes dark as the hills come up (under the words) */}
        <div ref={duskRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0, willChange: "opacity" }} />
        <div ref={wordsRef} className="relative" style={{ willChange: "opacity" }}>{words}</div>
      </div>

      {/* over it: the hills, laid exactly on the sky, then the page that follows */}
      {/* clicks pass through the see-through sky part to the buttons underneath */}
      <div className="pointer-events-none relative" style={{ marginTop: "-100svh" }}>
        <div aria-hidden className="pointer-events-none relative h-[100svh]">
          <Image src="/backgrounds/hero-mountains.png" alt="" fill priority className="object-cover object-center" sizes="100vw" quality={90} />
          <div
            className="absolute inset-0"
            style={{
              background: SHADE,
              WebkitMaskImage: "url(/backgrounds/hero-mountains.png)", maskImage: "url(/backgrounds/hero-mountains.png)",
              WebkitMaskSize: "cover", maskSize: "cover", WebkitMaskPosition: "center", maskPosition: "center",
            }}
          />
        </div>
        <div
          ref={restRef}
          className="pointer-events-auto relative z-[45]"
          /* fades in from clear at the top, so climbing over the hills never shows a hard edge;
             above the spotlight's shade (z 44), which darkens everything else */
          style={{ willChange: "transform", background: "linear-gradient(to bottom, rgba(0,0,0,0) 0, #000 32vh)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
