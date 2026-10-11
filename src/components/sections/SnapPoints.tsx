"use client";

import { useEffect } from "react";
import { liftAt } from "@/components/sections/MountainRise";

/**
 * Soft landing spots on the home page: the whole live demo window, and the whole
 * feature wall. When a scroll ARRIVES near one of them (it came from further
 * away, or went past it) and comes to rest, the page eases the rest of the way
 * so it sits exactly in frame. Nudging away from a spot you're already on, to
 * read the heading above or see the reactions, never pulls you back; small
 * adjustments never snap. Any new scroll, touch, key or click takes over.
 */
function blockTarget(el: Element, vh: number) {
  const r = el.getBoundingClientRect();
  /* centred when it fits, otherwise its top just under the edge */
  const want = r.height <= vh - 40 ? vh / 2 - r.height / 2 : 16;
  /* Inside the hero's faster-climbing part (MountainRise) the element also moves
     by lift(y), so solve y + lift(y) = top + lift(now) - want (it only ever grows,
     so halving the range finds it). */
  const mover = el.closest("[data-lift-max]") as HTMLElement | null;
  const max = mover ? +(mover.dataset.liftMax || 0) : 0, span = mover ? +(mover.dataset.liftSpan || 1) : 1;
  const y = window.scrollY, lift = (v: number) => liftAt(v, max, span);
  const goal = r.top + y + lift(y) - want;
  if (!max) return goal;
  let lo = Math.max(0, goal - max), hi = Math.max(0, goal);
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (mid + lift(mid) < goal) lo = mid; else hi = mid;
  }
  return hi;
}

/* The wall sits in a pinned section (PinnedSection): work from where that section
   would be without the pin, and never past the moment it pins (it doesn't move
   after that). */
function wallTarget(wall: Element, vh: number) {
  const pin = wall.closest(".sticky") as HTMLElement | null;
  if (!pin || !pin.parentElement) return blockTarget(wall, vh);
  const pinTop = pin.parentElement.getBoundingClientRect().top + window.scrollY;
  const inPin = wall.getBoundingClientRect().top - pin.getBoundingClientRect().top;
  const h = wall.getBoundingClientRect().height;
  const t = h <= vh - 40 ? pinTop + inPin + h / 2 - vh / 2 : pinTop + inPin - 16;
  return Math.min(t, pinTop + Math.max(0, pin.offsetHeight - vh));
}

export default function SnapPoints() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const small = window.matchMedia("(max-width: 639px)");
    /* Wait for scrolling to really finish: "scrollend" fires only after a
       trackpad's glide is over. Browsers without it get a longer quiet period. */
    const hasEnd = "onscrollend" in window;
    let idle = 0, gliding = false, target = 0, anim = 0;
    /* Where the current scroll started. One scroll lasts until a pause of 0.4 s,
       so a mouse wheel's separate notches still count as one movement. */
    let from: number | null = null, lastMove = 0;

    /* A slow, soft landing: eases in gently and settles gently (no push), and
       takes longer for longer distances. "instant" steps, because the site's
       scroll-behavior: smooth would otherwise animate every step on its own. */
    const glide = (a: number, b: number) => {
      const d = b - a, dur = Math.min(1300, 800 + Math.abs(d) * 1.2), t0 = performance.now();
      const step = (now: number) => {
        if (!gliding) { anim = 0; return; }
        const p = Math.min(1, (now - t0) / dur);
        const e = -(Math.cos(Math.PI * p) - 1) / 2; /* ease in and out */
        window.scrollTo({ top: a + d * e, behavior: "instant" as ScrollBehavior });
        if (p < 1) anim = requestAnimationFrame(step);
        else { anim = 0; window.setTimeout(() => { gliding = false; }, 80); }
      };
      if (anim) cancelAnimationFrame(anim);
      anim = requestAnimationFrame(step);
    };

    const settle = () => {
      const start = from;
      if (small.matches) return;
      if (performance.now() - lastMove < 100) return; /* still moving */
      const vh = window.innerHeight, y = window.scrollY;
      if (gliding) { if (Math.abs(target - y) <= 3) gliding = false; else return; }
      if (start === null || Math.abs(y - start) < 80) return; /* small adjustment */
      const targets: number[] = [];
      const demo = document.querySelector('#live-demo [data-snap="demo"]');
      if (demo) targets.push(blockTarget(demo, vh));
      const wall = document.querySelector("#features .wall");
      if (wall) targets.push(wallTarget(wall, vh));
      let best: number | null = null;
      targets.forEach((t) => {
        const dEnd = Math.abs(t - y), dStart = Math.abs(t - start);
        const passed = (start - t) * (y - t) < 0;
        /* arriving: it got closer, or went past it, and didn't start on it */
        const arriving = dStart > 40 && (dEnd < dStart || passed);
        if (arriving && dEnd < vh * 0.4 && (best === null || dEnd < Math.abs(best - y))) best = t;
      });
      if (best === null || Math.abs(best - y) <= 3) return;
      gliding = true;
      from = null;
      target = Math.round(best);
      glide(y, target);
    };

    const onScroll = () => {
      const now = performance.now();
      if (!gliding && (from === null || now - lastMove > 400)) from = window.scrollY;
      lastMove = now;
      window.clearTimeout(idle);
      if (!hasEnd) idle = window.setTimeout(settle, 220);
    };
    /* land only once it has been still for a moment, never in a gap between
       a wheel's notches */
    const onEnd = () => { window.clearTimeout(idle); idle = window.setTimeout(settle, 130); };
    /* A real new scroll (not the faint tail of a trackpad glide) hands control back. */
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > 6) { gliding = false; window.clearTimeout(idle); } };
    const takeOver = () => { gliding = false; };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (hasEnd) window.addEventListener("scrollend", onEnd);
    window.addEventListener("wheel", onWheel, { passive: true });
    ["touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, takeOver, { passive: true }));
    return () => {
      gliding = false;
      if (anim) cancelAnimationFrame(anim);
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      if (hasEnd) window.removeEventListener("scrollend", onEnd);
      window.removeEventListener("wheel", onWheel);
      ["touchstart", "keydown", "pointerdown"].forEach((ev) => window.removeEventListener(ev, takeOver));
    };
  }, []);

  return null;
}
