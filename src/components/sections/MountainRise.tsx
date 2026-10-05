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
 * fully dark like a sunset and the words dim a little: one black layer whose opacity follows the scroll.
 */
export default function MountainRise({ words, children }: { words: ReactNode; children: ReactNode }) {
  const duskRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dusk = duskRef.current, wordsEl = wordsRef.current;
    if (!dusk || !wordsEl) return;
    let queued = false;
    const update = () => {
      queued = false;
      /* like a sunset: the sky is completely black by the time the hills reach
         the buttons (about a quarter of a screen of scrolling); the words stay,
         only a little dimmer */
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.24)));
      const e = t * t * (3 - 2 * t);
      dusk.style.opacity = e.toFixed(3);
      wordsEl.style.opacity = (1 - e * 0.25).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
        <div className="pointer-events-auto relative bg-black">{children}</div>
      </div>
    </div>
  );
}
