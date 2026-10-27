"use client";

import { useEffect, useRef } from "react";

/**
 * Phones: the recording of the demo (it types tasks, organises them and moves cards),
 * with a camera that follows the action, like the desktop demo's camera: in on the
 * typing, down to "Found 3 tasks", across the board as cards move, then wide again.
 * The clip is 720 x 720; each shot is [time in s, centre x, centre y, zoom], eased
 * between. Only a transform changes, once a frame, while the clip is on screen.
 */
const SHOTS: [number, number, number, number][] = [
  [0, 210, 110, 2.1], [5, 210, 110, 2.1],       /* typing the tasks */
  [6, 210, 240, 1.75], [9.6, 210, 240, 1.75],   /* Found 3 tasks, added */
  [10.6, 360, 360, 1],                           /* the board, whole */
  [11.6, 200, 250, 1.8], [15, 230, 250, 1.8],   /* a card dragged to In Progress */
  [16, 160, 240, 1.9], [18.5, 160, 240, 1.9],   /* the banner image lands on a card */
  [19.4, 420, 240, 1.6], [21, 420, 240, 1.6],   /* on to In Review */
  [22, 360, 360, 1], [24.1, 360, 360, 1],       /* wide, then it loops */
];
const smooth = (t: number) => t * t * (3 - 2 * t);

function shotAt(t: number): [number, number, number] {
  let i = 0;
  while (i < SHOTS.length - 2 && SHOTS[i + 1][0] <= t) i++;
  const [t0, x0, y0, z0] = SHOTS[i], [t1, x1, y1, z1] = SHOTS[i + 1];
  const k = smooth(Math.max(0, Math.min(1, (t - t0) / (t1 - t0 || 1))));
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, z0 + (z1 - z0) * k];
}

export default function PhoneClip() {
  const box = useRef<HTMLDivElement>(null), vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const b = box.current, v = vid.current;
    if (!b || !v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, on = false;
    const frame = () => {
      const C = b.clientWidth, k = C / 720;
      const [cx, cy, z] = shotAt(v.currentTime || 0);
      /* keep the picture filling the square: never show past its edges */
      const tx = Math.min(0, Math.max(C - C * z, C / 2 - cx * k * z));
      const ty = Math.min(0, Math.max(C - C * z, C / 2 - cy * k * z));
      v.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${z.toFixed(4)})`;
      if (on) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      on = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(frame);
    });
    io.observe(b);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={box} className="mb-4 aspect-square overflow-hidden rounded-2xl border border-white/[0.12] bg-[#171717]">
      <video
        ref={vid}
        src="/bloomboard-demo/phone-clip.mp4"
        poster="/bloomboard-demo/phone-clip.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="BloomBoard turning a few typed lines into tasks on a board"
        className="block aspect-square w-full origin-top-left"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
