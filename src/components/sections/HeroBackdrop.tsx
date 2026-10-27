"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * Behind the hero words, so the page doesn't open on flat black: abstract, thin lines
 * only (white at low strength, one line of brand blue), the middle kept calm. It fades
 * out as the demo comes up (AppPreviewScroll sets its opacity).
 * "reveal": plain black, and a soft-edged circle that trails the cursor uncovers faint
 * task cards rising underneath (mouse only; transform only, so it stays smooth).
 * While we choose, ?bg=reveal|contours|waves|ripples picks one.
 */
type Kind = "reveal" | "contours" | "waves" | "ripples";

/* a column of faint task cards, rising slowly (globals.css .bb-bd-col) */
function Column({ c }: { c: number }) {
  return (
    <div className="relative h-full w-[170px] flex-none">
      <div className="bb-bd-col absolute inset-x-0 top-0" style={{ animationDuration: `${52 + (c % 3) * 9}s`, animationDelay: `${-c * 7}s` }}>
        {[0, 1].map((rep) => (
          <div key={rep} className="flex flex-col gap-5 pb-5">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white/[0.025]"
                style={{ height: 56 + ((i * 7 + c * 3) % 4) * 14, borderColor: (i + c) % 7 === 0 ? "rgba(91,139,255,0.55)" : "rgba(255,255,255,0.2)" }}
              >
                <i className="ml-3 mt-3 block h-1.5 rounded bg-white/[0.14]" style={{ width: `${40 + ((i * 13 + c * 5) % 45)}%` }} />
                <i className="ml-3 mt-2 block h-1.5 rounded bg-white/[0.08]" style={{ width: `${22 + ((i * 7 + c * 11) % 30)}%` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const LENS = 560; /* the circle's size; its edge is a long soft fade */

/* The lens: a circle that moves (transform) with the field inside it moved the other
   way, so the cards stay put and only the window onto them travels. */
function Reveal() {
  const wrap = useRef<HTMLDivElement>(null), lens = useRef<HTMLDivElement>(null), field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const w = wrap.current, l = lens.current, f = field.current;
    if (!w || !l || !f || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, inside = false, started = false;
    const place = () => {
      l.style.transform = `translate(${(x - LENS / 2).toFixed(1)}px,${(y - LENS / 2).toFixed(1)}px)`;
      f.style.transform = `translate(${(LENS / 2 - x).toFixed(1)}px,${(LENS / 2 - y).toFixed(1)}px)`;
    };
    /* it trails the pointer a little, which is what makes it feel smooth */
    const step = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      place();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(step) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = w.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      const now = ty > 0 && ty < r.height && tx > 0 && tx < r.width;
      if (now && !started) { x = tx; y = ty; started = true; }
      if (now !== inside) { inside = now; l.style.opacity = now ? "1" : "0"; }
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);
  const mask = "radial-gradient(circle closest-side, #000 0, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.3) 62%, transparent 100%)";
  return (
    <div ref={wrap} className="absolute inset-0">
      <div
        ref={lens}
        className="absolute left-0 top-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-700"
        style={{ width: LENS, height: LENS, WebkitMaskImage: mask, maskImage: mask, willChange: "transform, opacity" }}
      >
        <div ref={field} className="absolute left-0 top-0 flex h-[112vh] w-screen justify-center gap-6" style={{ willChange: "transform" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => <Column key={c} c={c} />)}
        </div>
      </div>
    </div>
  );
}

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
  const [kind, setKind] = useState<Kind>("reveal");
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("bg");
    if (k === "reveal" || k === "contours" || k === "waves" || k === "ripples") setKind(k);
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

      {kind === "reveal" && <Reveal />}
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
