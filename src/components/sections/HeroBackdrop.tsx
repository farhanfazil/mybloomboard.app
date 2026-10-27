"use client";

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Behind the hero words, so the page doesn't open on flat black: abstract, thin lines
 * only (white at low strength, one line of brand blue), the middle kept calm. It fades
 * out as the demo comes up (AppPreviewScroll sets its opacity).
 * Hover reveals (mouse only; transform only, so they stay smooth): a soft-edged circle
 * trailing the cursor uncovers what is hidden underneath.
 *  - "bloom": tiny dots at rest; under the cursor they bloom into small flowers
 *  - "office": a dark floor plan, the team already inside, lit like a torch
 *  - "links": scattered points; under the cursor they link up into a network
 *  - "cards": faint task cards rising (the first try)
 * While we choose, ?bg=bloom|office|links|cards|contours|waves|ripples picks one.
 */
type Kind = "bloom" | "office" | "links" | "cards" | "contours" | "waves" | "ripples";
const KINDS: Kind[] = ["bloom", "office", "links", "cards", "contours", "waves", "ripples"];

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
   way, so the field stays put and only the window onto it travels. `base` is what shows
   everywhere at rest (optional); `children` is what the lens uncovers. */
function Reveal({ base, children }: { base?: ReactNode; children: ReactNode }) {
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
      {base ? <div className="absolute inset-0" style={{ WebkitMaskImage: VFADE, maskImage: VFADE }}>{base}</div> : null}
      <div
        ref={lens}
        className="absolute left-0 top-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-700"
        style={{ width: LENS, height: LENS, WebkitMaskImage: mask, maskImage: mask, willChange: "transform, opacity" }}
      >
        <div ref={field} className="absolute left-0 top-0 h-[112vh] w-screen" style={{ willChange: "transform" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const VFADE = "linear-gradient(180deg, transparent 0, #000 12%, #000 60%, transparent 95%)";
const svg = (body: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(body)}")`;

/* Bloom: tiny dots at rest; under the lens each one is a small four-petal flower */
const DOT = svg('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="1" fill="rgba(255,255,255,0.16)"/></svg>');
/* five round petals around a darker heart, slightly turned so it reads as a flower */
const petals = (fill: string, c = 22) =>
  [0, 72, 144, 216, 288].map((a) => `<circle cx="${c}" cy="${c - 4.6}" r="3.6" fill="${fill}" transform="rotate(${a + 18} ${c} ${c})"/>`).join("") + `<circle cx="${c}" cy="${c}" r="2.1" fill="#000"/>`;
const FLOWER = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">${petals("rgba(255,255,255,0.42)")}</svg>`);
const FLOWER_BLUE = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="308" height="220"><g transform="translate(132 88)">${petals("rgba(91,139,255,0.95)")}</g></svg>`);

/* Connections: the same points everywhere; under the lens they link to their neighbours */
const NODES = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 120 }, () => [Math.round(rnd() * 1440), Math.round(rnd() * 1000)] as const);
})();
const EDGES = NODES.flatMap(([x1, y1], i) => NODES.slice(i + 1).filter(([x2, y2]) => Math.hypot(x2 - x1, y2 - y1) < 150).map(([x2, y2]) => [x1, y1, x2, y2]));
function Nodes({ lines }: { lines: boolean }) {
  return (
    <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {lines && EDGES.map(([x1, y1, x2, y2], k) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.28)" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
      {NODES.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={k % 9 === 0 ? 3 : 2} fill={k % 9 === 0 ? (lines ? "#5B8BFF" : "rgba(91,139,255,0.5)") : lines ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.18)"} />
      ))}
    </svg>
  );
}

/* The office in the dark: a floor plan with the team already in it, lit only by the lens */
const PEOPLE: [string, number, number][] = [
  ["women-44", 170, 175], ["men-32", 250, 175], ["women-12", 330, 175], ["men-75", 250, 290],
  ["women-79", 600, 200], ["men-86", 760, 200], ["men-22", 1080, 200], ["women-65", 1240, 290],
  ["men-45", 160, 520], ["women-33", 400, 620], ["women-26", 880, 520], ["women-68", 1180, 620], ["women-44", 300, 820], ["men-32", 1000, 830],
];
const ROOMS: [number, number, number, number, string, boolean?][] = [
  [60, 80, 380, 260, "WEEKLY SYNC · ON A CALL", true], [480, 80, 420, 260, "DESIGN"], [940, 80, 440, 260, "MARKETING"],
  [60, 380, 620, 300, "ENGINEERING"], [720, 380, 660, 300, "SALES"], [60, 720, 1320, 220, "LOUNGE"],
];
const DESKS = [[520, 140], [700, 140], [520, 250], [700, 250], [980, 140], [1160, 140], [980, 250], [1160, 250],
  [100, 450], [300, 450], [480, 450], [100, 570], [300, 570], [480, 570], [760, 450], [960, 450], [1160, 450], [760, 570], [960, 570], [1160, 570]];
function OfficePlan() {
  const line = "rgba(255,255,255,0.3)";
  return (
    <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs><clipPath id="bb-face" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5" /></clipPath></defs>
      {ROOMS.map(([x, y, w, h, name, call]) => (
        <g key={name}>
          <rect x={x} y={y} width={w} height={h} rx={18} fill="rgba(255,255,255,0.03)" stroke={call ? "rgba(80,220,150,0.7)" : line} strokeWidth={1.2} />
          <text x={x + 22} y={y + 32} fontSize={13} letterSpacing={1.5} fontFamily="ui-monospace, monospace" fill={call ? "#5BE3A0" : "rgba(255,255,255,0.55)"}>{name}</text>
        </g>
      ))}
      <rect x={160} y={200} width={180} height={66} rx={16} fill="rgba(255,255,255,0.05)" stroke={line} />
      {DESKS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={130} height={40} rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
          <rect x={x + 45} y={y + 6} width={40} height={6} rx={2} fill="rgba(255,255,255,0.2)" />
        </g>
      ))}
      <rect x={140} y={800} width={260} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={line} />
      <rect x={940} y={800} width={260} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={line} />
      {PEOPLE.map(([f, x, y], k) => (
        <g key={k}>
          <image href={`/bloomboard-demo/people/${f}.jpg`} x={x - 20} y={y - 20} width={40} height={40} clipPath="url(#bb-face)" preserveAspectRatio="xMidYMid slice" />
          <circle cx={x + 14} cy={y + 14} r={6} fill={k === 6 ? "#E5484D" : "#34C77B"} stroke="#000" strokeWidth={2.5} />
        </g>
      ))}
    </svg>
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
  const [kind, setKind] = useState<Kind>("bloom");
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("bg");
    if (KINDS.includes(k as Kind)) setKind(k as Kind);
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

      {kind === "bloom" && (
        <Reveal base={<div className="absolute inset-0" style={{ backgroundImage: DOT }} />}>
          <div className="absolute inset-0" style={{ backgroundImage: `${FLOWER_BLUE}, ${FLOWER}` }} />
        </Reveal>
      )}
      {kind === "office" && <Reveal><OfficePlan /></Reveal>}
      {kind === "links" && <Reveal base={<Nodes lines={false} />}><Nodes lines /></Reveal>}
      {kind === "cards" && (
        <Reveal>
          <div className="absolute inset-0 flex justify-center gap-6">{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => <Column key={c} c={c} />)}</div>
        </Reveal>
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
