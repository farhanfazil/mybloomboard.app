"use client";

import { useEffect, useRef } from "react";

/**
 * When the live demo fills most of the screen, the rest of the page goes dark
 * so the demo has the visitor's full attention.
 * Scroll on and the page comes back.
 *
 * The darkness follows the scroll (one opacity on one fixed layer, cheap); the
 * header and the demo's bars switch once with a `demo-focus` class on
 * <html> and CSS transitions (globals.css). The header reads `data-demo-focus`.
 */
export default function DemoSpotlight({ targetId }: { targetId: string }) {
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const shade = shadeRef.current;
    if (!target || !shade) return;
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 639px)");
    let queued = false, on = false;

    const set = (next: boolean) => {
      if (next === on) return;
      on = next;
      root.classList.toggle("demo-focus", on);
      if (on) root.setAttribute("data-demo-focus", "");
      else root.removeAttribute("data-demo-focus");
      window.dispatchEvent(new Event("bb-demo-focus"));
    };
    const update = () => {
      queued = false;
      if (phone.matches) { shade.style.opacity = "0"; set(false); return; }
      const r = target.getBoundingClientRect(), vh = window.innerHeight;
      /* Darkens step by step as the demo comes up, reaching full black only when
         it fills the screen (its top at the top); the same on the way out. */
      const comeIn = Math.min(1, Math.max(0, 1 - r.top / (vh * 0.8)));
      const goOut = Math.min(1, Math.max(0, (r.bottom - vh * 0.2) / (vh * 0.8)));
      const t = Math.min(comeIn, goOut), f = t * t * (3 - 2 * t);
      shade.style.opacity = (f * 0.94).toFixed(3);
      /* the rest (header, emojis, the demo's bar) switches once, near full screen */
      set(on ? f > 0.75 : f > 0.9);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
      window.setTimeout(() => queued && update(), 120);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("demo-focus");
      root.removeAttribute("data-demo-focus");
    };
  }, [targetId]);

  return <div ref={shadeRef} aria-hidden className="bb-demo-shade pointer-events-none fixed inset-0 z-[44] bg-black" style={{ opacity: 0 }} />;
}
