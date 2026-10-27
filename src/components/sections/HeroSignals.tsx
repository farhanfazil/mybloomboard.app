"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * "Signals" over the hero's dot grid: now and then a small point of light runs along a
 * grid line from the edge toward the headline and dissolves just before the words.
 * Work arriving from everywhere, landing in one place. At most two at a time.
 *
 * The grid itself stays the CSS dots in AppPreviewScroll (26 px tiles, centred, from the
 * top); this canvas only draws the moving points, on those same lines. It runs only
 * while the hero is on screen and the tab is visible, and not at all with Reduce Motion.
 */
const GAP = 26;
const SPEED = 210;   // px per second
const TAIL = 90;     // px
const EVERY = 2.2;   // seconds between signals, roughly

type Signal = { x0: number; y0: number; dx: number; dy: number; len: number; d: number; end: number };

export default function HeroSignals({ avoid }: { avoid: RefObject<HTMLElement> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current, box = avoid.current;
    const host = cv?.parentElement;
    if (!cv || !box || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    /* the words and buttons (the copy box itself is page-wide) */
    let keep = { l: 0, r: 0, t: 0, b: 0 };
    const measure = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hb = host.getBoundingClientRect(), k = { l: 1e9, r: -1e9, t: 1e9, b: -1e9 };
      Array.from(box.children).forEach((el) => {
        /* text: the words themselves (an inline box can stretch past them), leaving out
           the screen-reader copies (sr-only) */
        let rects: DOMRect[] = [el.getBoundingClientRect()];
        if (el.tagName === "H1" || el.tagName === "P") {
          rects = [];
          const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            if (!n.textContent?.trim() || n.parentElement?.closest(".sr-only, .invisible")) continue;
            const g = document.createRange(); g.selectNodeContents(n); rects.push(...Array.from(g.getClientRects()));
          }
        }
        rects.filter((r) => r.width > 2 && r.height > 2).forEach((r) => {
          k.l = Math.min(k.l, r.left - hb.left); k.r = Math.max(k.r, r.right - hb.left);
          k.t = Math.min(k.t, r.top - hb.top); k.b = Math.max(k.b, r.bottom - hb.top);
        });
      });
      keep = k;
    };
    /* grid lines of the CSS dots: columns centred on the page, rows from the top */
    const colX = (c: number) => W / 2 + c * GAP;
    const rowY = (r: number) => GAP / 2 + r * GAP;

    let sigs: Signal[] = [];
    const spawn = () => {
      if (keep.r <= keep.l) return;
      if (Math.random() < 0.78) {
        /* from the left or right edge, along a row beside the words */
        const fromLeft = Math.random() < 0.5;
        const r0 = Math.ceil((keep.t + 10 - GAP / 2) / GAP), r1 = Math.floor((Math.min(keep.b - 10, H * 0.45) - GAP / 2) / GAP);
        const y = rowY(r0 + Math.floor(Math.random() * Math.max(1, r1 - r0 + 1)));
        const start = fromLeft ? -20 : W + 20, stop = fromLeft ? keep.l - 48 : keep.r + 48;
        if ((fromLeft && stop < 60) || (!fromLeft && stop > W - 60)) return;   // no room beside the words
        sigs.push({ x0: start, y0: y, dx: fromLeft ? 1 : -1, dy: 0, len: Math.abs(stop - start), d: 0, end: 0 });
      } else {
        /* down a column from the top, stopping above the headline */
        const c0 = Math.ceil((keep.l - W / 2) / GAP), c1 = Math.floor((keep.r - W / 2) / GAP);
        const x = colX(c0 + Math.floor(Math.random() * Math.max(1, c1 - c0 + 1)));
        if (keep.t - 40 < 80) return;
        sigs.push({ x0: x, y0: -20, dx: 0, dy: 1, len: keep.t - 40 + 20, d: 0, end: 0 });
      }
    };

    let raf = 0, last = 0, t = 0, nextAt = 0.8, onScreen = false;
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; t += dt;
      if (t > nextAt && sigs.length < 2) { spawn(); nextAt = t + EVERY * (0.7 + Math.random() * 0.6); }
      ctx.clearRect(0, 0, W, H);
      sigs = sigs.filter((s) => {
        if (s.d < s.len) s.d = Math.min(s.len, s.d + SPEED * dt); else s.end += dt;
        const life = 1 - Math.min(1, s.end / 0.5);   // dissolves over half a second at the end
        if (life <= 0) return false;
        const hx = s.x0 + s.dx * s.d, hy = s.y0 + s.dy * s.d;
        const tail = Math.min(TAIL, s.d) * life, tx = hx - s.dx * tail, ty = hy - s.dy * tail;
        const g = ctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${0.55 * life})`);
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.95 * life})`;
        ctx.beginPath(); ctx.arc(hx, hy, 1.6, 0, Math.PI * 2); ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      cancelAnimationFrame(raf); last = 0;
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { onScreen = !!e?.isIntersecting; run(); });
    io.observe(host);
    document.addEventListener("visibilitychange", run);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", run); };
  }, [avoid]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
