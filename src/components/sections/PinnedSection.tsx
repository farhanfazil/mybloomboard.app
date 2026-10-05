"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Holds a section in place once you've scrolled to its end, so the next section
 * slides up over it like a card (the features stay put while the comparison
 * panel rises). Wrap the pinned section and what comes over it in one parent:
 * the pin lets go when that parent ends.
 *
 * CSS only for the pin (position: sticky with the top set so it sticks by its
 * bottom edge); script just keeps that offset right and dims it as it's covered.
 */
export default function PinnedSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current, shade = shadeRef.current;
    if (!el || !shade) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = () => { el.style.top = Math.min(0, window.innerHeight - el.offsetHeight) + "px"; };
    let queued = false;
    const dim = () => {
      queued = false;
      if (reduce) return;
      const next = el.nextElementSibling as HTMLElement | null;
      if (!next) return;
      /* how far the next section has come up over this one, 0 to 1 */
      const r = next.getBoundingClientRect(), vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, 1 - r.top / vh));
      /* a black layer fades in over it (cheap), rather than fading the whole section */
      shade.style.opacity = (t * 0.6).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(dim);
      window.setTimeout(() => queued && dim(), 120);
    };
    place();
    dim();
    /* measured only when its size changes, never per scroll step */
    const ro = new ResizeObserver(() => { place(); dim(); });
    ro.observe(el);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, { passive: true });
    const late = [800, 2500].map((ms) => window.setTimeout(place, ms));
    return () => {
      late.forEach((t) => window.clearTimeout(t));
      ro.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="sticky z-0">
      {children}
      <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0, willChange: "opacity" }} />
    </div>
  );
}
