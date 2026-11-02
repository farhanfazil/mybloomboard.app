"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * A pinned scene with stops: one swipe moves one stop, whatever its momentum. `zone` is the
 * tall box and `pin` the sticky part inside it; the height left over is split evenly between
 * the stops. A swipe that has done its step is held until it dies away, so it can't run on
 * into the next stop or out of the scene, and a swipe arriving from outside lands on the
 * scene's first stop (or its last, coming back up).
 *
 * Only the wheel and trackpad are held. Touch, keyboard, scrollbar and links scroll as usual
 * and the stop just follows the position, so nobody is ever trapped. With Reduce Motion this
 * does nothing: the scene stays on its first stop and the page hides the extra height.
 */
const QUIET = 140;   // ms without a wheel event: that swipe is over
const HOLD = 650;    // ms before another swipe can take the next step
const EARLY = 0.25;  // scrolling (not the wheel): how far towards a stop before it changes

export function useSwipeSteps(
  zone: RefObject<HTMLElement>,
  pin: RefObject<HTMLElement>,
  steps: number,
  onStep: (step: number, instant: boolean) => void,
) {
  const report = useRef(onStep);
  report.current = onStep;

  useEffect(() => {
    const z = zone.current, p = pin.current;
    if (!z || !p || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cur = 0;
    let held = false, heldDir = 0, until = 0, lastT = 0, lastD = 0;
    const box = () => {
      const dist = z.offsetHeight - p.offsetHeight;
      return { top: z.getBoundingClientRect().top + window.scrollY, dist, gap: dist / (steps - 1) };
    };
    const hold = (dir: number, now: number) => { held = true; heldDir = dir; until = now + HOLD; };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || !e.deltaY) return; // pinch zoom
      const { top, dist, gap } = box();
      if (dist <= 0) return; // not shown at this size
      const now = performance.now(), d = Math.abs(e.deltaY), dir = Math.sign(e.deltaY), y = window.scrollY;
      /* still the same swipe dying away? momentum only ever shrinks, so a rising delta is a new one */
      if (now > until && (now - lastT > QUIET || d > lastD * 1.6 + 6 || dir !== heldDir)) held = false;
      lastT = now; lastD = d;

      const end = top + dist;
      if (y < top - 1 || y > end + 1) {
        /* arriving: stop on the scene instead of flying through it */
        if (dir > 0 ? y < top && y + e.deltaY >= top : y > end && y + e.deltaY <= end) {
          e.preventDefault();
          window.scrollTo(0, dir > 0 ? top : end);
          hold(dir, now);
        }
        return;
      }
      const next = cur + dir;
      if (next < 0 || next >= steps) {
        /* leaving is a swipe of its own */
        if (held) e.preventDefault();
        return;
      }
      e.preventDefault();
      if (held) return;
      cur = next;
      window.scrollTo(0, top + next * gap);
      hold(dir, now);
      report.current(next, false);
    };

    const follow = (instant: boolean) => {
      const { top, dist, gap } = box();
      if (dist <= 0) return;
      const y = window.scrollY;
      let next = cur;
      while (next < steps - 1 && y > top + next * gap + gap * EARLY) next++;
      while (next > 0 && y < top + next * gap - gap * EARLY) next--;
      if (next !== cur || instant) { cur = next; report.current(next, instant); }
    };
    const onScroll = () => follow(false);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    follow(true); // a reload can land anywhere in the scene
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, [zone, pin, steps]);
}
