"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * Behind the hero words, so the page doesn't open on flat black: abstract, thin lines
 * only (white at low strength, one line of brand blue), the middle kept calm. It fades
 * out as the demo comes up (AppPreviewScroll sets its opacity).
 * While we choose, ?bg=contours|waves|ripples picks one.
 */
type Kind = "contours" | "waves" | "ripples";

/* one wobbly ring of a contour map */
function ring(cx: number, cy: number, r: number, k: number) {
  const pts: string[] = [];
  for (let a = 0; a <= 360; a += 6) {
    const t = (a * Math.PI) / 180;
    const rr = r + 16 * Math.sin(3 * t + k * 0.35) + 9 * Math.sin(5 * t - k * 0.22) + 5 * Math.sin(8 * t + k * 0.5);
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}
const CONTOUR_SETS = [
  { cx: 0, cy: 0, spin: "bb-bd-spin" },
  { cx: 0, cy: 0, spin: "bb-bd-spin-r" },
];

/* the waves: fine parallel lines drawn on a canvas, only while the hero is on screen */
function Waves() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, on = true;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const N = 42;
    const draw = (ms: number) => {
      const t = reduce ? 0 : ms / 9000;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        const f = i / (N - 1);
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 14) {
          const u = x / w;
          const y = h * (0.66 + 0.16 * Math.sin(u * 4.2 + t + f * 1.6) * Math.sin(u * 1.3 - t * 0.6)) + (f - 0.5) * h * 0.22 * (0.6 + 0.4 * Math.sin(u * 3 + t));
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const blue = i === Math.round(N * 0.62);
        ctx.strokeStyle = blue ? "rgba(91,139,255,0.55)" : `rgba(255,255,255,${(0.035 + 0.075 * Math.sin(f * Math.PI)).toFixed(3)})`;
        ctx.lineWidth = blue ? 1.2 : 1;
        ctx.stroke();
      }
      if (on && !reduce) raf = requestAnimationFrame(draw);
    };
    size();
    raf = requestAnimationFrame(draw);
    /* stop drawing once the hero is scrolled away */
    const io = new IntersectionObserver(([e]) => {
      on = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    const onResize = () => { size(); if (reduce) draw(0); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

const HeroBackdrop = forwardRef<HTMLDivElement>(function HeroBackdrop(_, ref) {
  const [kind, setKind] = useState<Kind>("contours");
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("bg");
    if (k === "contours" || k === "waves" || k === "ripples") setKind(k);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[112vh] overflow-hidden" style={{ willChange: "opacity" }}>
      {kind === "contours" && (
        <>
          {/* two contour fields, one rising from the bottom left and one from the top right, turning slowly */}
          {[{ side: "left-[-18vw] bottom-[-30vh]", spin: CONTOUR_SETS[0].spin }, { side: "right-[-20vw] top-[-38vh]", spin: CONTOUR_SETS[1].spin }].map((s, n) => (
            <svg key={n} viewBox="-460 -460 920 920" className={`absolute h-[110vh] w-[110vh] ${s.side} ${s.spin}`} fill="none">
              {Array.from({ length: 17 }, (_, k) => (
                <path
                  key={k}
                  d={ring(0, 0, 40 + k * 25, k + n * 7)}
                  stroke={k === 9 ? "rgba(91,139,255,0.5)" : `rgba(255,255,255,${(0.05 + 0.06 * (1 - k / 17)).toFixed(3)})`}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          ))}
        </>
      )}

      {kind === "waves" && <Waves />}

      {kind === "ripples" && (
        <svg viewBox="-500 -500 1000 1000" className="absolute left-1/2 top-[86vh] h-[150vh] w-[150vh] -translate-x-1/2 -translate-y-1/2" fill="none">
          {Array.from({ length: 7 }, (_, k) => (
            <circle
              key={k}
              r={480}
              className="bb-bd-ripple"
              stroke={k === 3 ? "rgba(91,139,255,0.6)" : "rgba(255,255,255,0.16)"}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${-k * (21 / 7)}s` }}
            />
          ))}
        </svg>
      )}
    </div>
  );
});

export default HeroBackdrop;
