"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Home: "From alone to together", the live office told as a scroll story. You start
 * alone and grey; glass walls draw themselves around you, the team lights up room by
 * room, a knock, a call, a task passed across the room, then "Your whole team, one
 * open office." The stage stays put (sticky) while the tall section scrolls past;
 * script only sets transforms and opacity, once per frame, while it is on screen.
 * Phones get the same story on a portrait floor (PHONE below), without the labels.
 */

const P = (f: string) => `/bloomboard-demo/people/${f}.jpg`;
type Status = "" | "focus" | "away";
type Floor = {
  W: number; H: number; zoom: number;
  ME: { x: number; y: number }; me: number; mate: number;
  /* teammates: picture, x, y (where they sit), when they appear (0..1), status */
  TEAM: [string, number, number, number, Status][];
  /* desks (top-left corner) with a chair in front, where the person sits */
  DESKS: number[][]; desk: { w: number; h: number };
  TABLE: { x: number; y: number; w: number; h: number; chairs: number[]; top: number; bottom: number };
  ROOMS: { x: number; y: number; w: number; h: number; name: string; call?: boolean }[];
  KNOCK: { x: number; y: number }; TASK: { x: number; y: number; dx: number; dy: number; w: number };
  CALLOUTS: { id: string; label: string; x: number; y: number; line?: [number, number, number, number] }[];
};

/* computers: a wide floor (1200 x 640) */
const DESK: Floor = {
  W: 1200, H: 640, zoom: 2.7, ME: { x: 885, y: 434 }, me: 64, mate: 46,
  TEAM: [
    ["women-44", 180, 113, 0.0, ""], ["men-32", 240, 113, 0.06, ""], ["women-12", 300, 113, 0.12, ""], ["men-75", 240, 227, 0.18, ""],
    ["women-79", 555, 159, 0.26, ""], ["men-86", 705, 159, 0.32, ""],
    ["men-22", 915, 159, 0.38, "focus"], ["women-65", 1065, 264, 0.44, "away"],
    ["men-45", 135, 434, 0.5, ""], ["women-33", 305, 544, 0.56, ""],
    ["women-68", 715, 544, 0.62, ""],
  ],
  DESKS: [
    [490, 100], [640, 100], [490, 205], [640, 205],
    [850, 100], [1000, 100], [850, 205], [1000, 205],
    [70, 375], [240, 375], [410, 375], [70, 485], [240, 485], [410, 485],
    [650, 375], [820, 375], [990, 375], [650, 485], [820, 485], [990, 485],
  ],
  desk: { w: 130, h: 40 },
  TABLE: { x: 150, y: 135, w: 180, h: 70, chairs: [180, 240, 300], top: 103, bottom: 216 },
  ROOMS: [
    { x: 40, y: 40, w: 400, h: 260, name: "● Weekly sync · on a call", call: true },
    { x: 460, y: 40, w: 340, h: 260, name: "Design" },
    { x: 820, y: 40, w: 340, h: 260, name: "Sales" },
    { x: 40, y: 320, w: 560, h: 280, name: "Engineering" },
    { x: 620, y: 320, w: 540, h: 280, name: "Marketing" },
  ],
  KNOCK: { x: 470, y: -6 }, TASK: { x: 560, y: 175, dx: 240, dy: 185, w: 190 },
  CALLOUTS: [
    { id: "c1", label: "See who's free", x: -170, y: 402, line: [170, 28, 262, 32] },
    { id: "c2", label: "Knock to talk", x: 740, y: -74, line: [0, 28, -60, 74] },
    { id: "c3", label: "Walk into a call", x: -170, y: 120, line: [170, 28, 210, 40] },
    { id: "c4", label: "Pass a task across the room", x: 940, y: 612, line: [0, 0, -90, -150] },
  ],
};

/* phones: a portrait floor (400 x 760), Weekly sync on top, then two departments a row */
const PHONE: Floor = {
  W: 400, H: 760, zoom: 2.2, ME: { x: 255, y: 574 }, me: 46, mate: 34,
  TEAM: [
    ["women-44", 140, 64, 0.0, ""], ["men-32", 200, 64, 0.06, ""], ["women-12", 260, 64, 0.12, ""], ["men-75", 200, 177, 0.18, ""],
    ["women-79", 70, 334, 0.26, ""], ["men-86", 150, 424, 0.32, ""],
    ["men-22", 255, 334, 0.38, "focus"], ["women-65", 335, 424, 0.44, "away"],
    ["men-45", 70, 574, 0.5, ""], ["women-33", 150, 674, 0.56, ""],
    ["women-68", 335, 674, 0.62, ""],
  ],
  DESKS: [
    [35, 285], [115, 285], [35, 375], [115, 375],
    [220, 285], [300, 285], [220, 375], [300, 375],
    [35, 525], [115, 525], [35, 625], [115, 625],
    [220, 525], [300, 525], [220, 625], [300, 625],
  ],
  desk: { w: 70, h: 30 },
  TABLE: { x: 110, y: 85, w: 180, h: 70, chairs: [140, 200, 260], top: 53, bottom: 166 },
  ROOMS: [
    { x: 20, y: 20, w: 360, h: 200, name: "● Weekly sync", call: true },
    { x: 20, y: 240, w: 175, h: 220, name: "Design" },
    { x: 205, y: 240, w: 175, h: 220, name: "Sales" },
    { x: 20, y: 480, w: 175, h: 260, name: "Engineering" },
    { x: 205, y: 480, w: 175, h: 260, name: "Marketing" },
  ],
  KNOCK: { x: 40, y: 226 }, TASK: { x: 30, y: 360, dx: 175, dy: 150, w: 160 },
  CALLOUTS: [],
};

const DOT = { "": "#34C77B", focus: "#E5484D", away: "#F5A524" };

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mono = "font-mono uppercase tracking-[0.06em]";

export default function OfficeStory() {
  const storyRef = useRef<HTMLElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  const L = phone ? PHONE : DESK;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const story = storyRef.current, plan = planRef.current;
    if (!story || !plan) return;
    const q = <T extends Element = HTMLElement>(s: string) => Array.from(story.querySelectorAll<T & HTMLElement>(s));
    const one = (s: string) => story.querySelector<HTMLElement>(s)!;
    const walls = q<SVGRectElement>("[data-wall]"), names = q("[data-room]"), desks = q("[data-desk]"), people = q("[data-mate]");
    const co = L.CALLOUTS.map((c) => one(`[data-co="${c.id}"]`));
    const intro = one("[data-intro]"), outro = one("[data-outro]"), meGrey = one("[data-me-grey]"), meDot = one("[data-me-dot]");
    const knock = one("[data-knock]"), task = one("[data-task]");
    const bars = q("[data-step]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      const r = story.getBoundingClientRect();
      const p = reduce ? 1 : clamp(-r.top / (story.offsetHeight - window.innerHeight));
      const vw = window.innerWidth, vh = window.innerHeight;

      /* camera: close on you, pulls out to the whole office, then settles lower for the headline */
      const pull = eio(seg(p, 0.1, 0.48)), settle = eio(seg(p, 0.8, 0.92));
      const fit = phone ? Math.min((vw * 0.92) / L.W, (vh * 0.7) / L.H) : Math.min((vw * 0.86) / L.W, (vh * 0.66) / L.H);
      const S = fit * lerp(L.zoom, 1, pull) * lerp(1, phone ? 0.66 : 0.7, settle);
      const fx = lerp(L.ME.x, L.W / 2, pull), fy = lerp(L.ME.y, L.H / 2, pull);
      const cy = lerp(vh * 0.55, vh * 0.54, pull) + settle * vh * (phone ? 0.2 : 0.155);
      plan.style.transform = `translate(${(vw / 2 - fx * S).toFixed(1)}px,${(cy - fy * S).toFixed(1)}px) scale(${S.toFixed(4)})`;

      /* 1. alone */
      const i = 1 - seg(p, 0.12, 0.24);
      intro.style.opacity = String(i);
      intro.style.transform = `translateY(${(-(1 - i) * 30).toFixed(1)}px)`;
      meGrey.style.opacity = String(1 - seg(p, 0.42, 0.5));
      meDot.style.opacity = String(seg(p, 0.44, 0.5));

      /* 2. glass walls draw themselves */
      walls.forEach((w, n) => {
        w.style.strokeDashoffset = (1 - eio(seg(p, 0.16 + n * 0.04, 0.36 + n * 0.04))).toFixed(4);
        w.style.fillOpacity = String(seg(p, 0.3, 0.42));
      });
      names.forEach((n) => { n.style.opacity = String(seg(p, 0.34, 0.42)); });
      desks.forEach((d) => { d.style.opacity = String(seg(p, 0.26, 0.38)); });

      /* 3. the team lights up, one by one */
      const fill = seg(p, 0.42, 0.62);
      people.forEach((e, n) => {
        const k = eio(clamp((fill - L.TEAM[n][3]) / 0.12));
        e.style.opacity = String(k);
        e.style.transform = `scale(${(0.6 + 0.4 * k).toFixed(3)})`;
      });

      /* 4. the moments, with their labels */
      const out = 1 - seg(p, 0.8, 0.86);
      [0.56, 0.62, 0.66, 0.7].forEach((a, n) => { if (co[n]) co[n].style.opacity = String(seg(p, a, a + 0.04) * out); });
      const kn = seg(p, 0.6, 0.64) * (1 - seg(p, 0.74, 0.78));
      knock.style.opacity = String(kn);
      knock.style.transform = `translateY(${((1 - kn) * 10).toFixed(1)}px)`;
      const tk = eio(seg(p, 0.7, 0.8));
      task.style.opacity = String(seg(p, 0.68, 0.71) * (1 - seg(p, 0.82, 0.85)));
      task.style.transform = `translate(${(tk * L.TASK.dx).toFixed(1)}px,${(tk * L.TASK.dy).toFixed(1)}px) rotate(${((1 - tk) * -3).toFixed(2)}deg)`;

      /* 5. the headline */
      const o = seg(p, 0.84, 0.94);
      outro.style.opacity = String(o);
      outro.style.transform = `translateY(${((1 - o) * 24).toFixed(1)}px)`;
      outro.style.pointerEvents = o > 0.5 ? "auto" : "none";

      const step = p < 0.15 ? 0 : p < 0.42 ? 1 : p < 0.56 ? 2 : p < 0.82 ? 3 : 4;
      bars.forEach((b, n) => { b.style.opacity = n === step ? "0.75" : "0.15"; });
    };

    let on = false, queued = false;
    const onScroll = () => {
      if (!on || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; draw(); });
    };
    const io = new IntersectionObserver(([e]) => { on = !!e?.isIntersecting; if (on) draw(); });
    io.observe(story);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", draw);
    draw();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", draw);
    };
  }, [phone, L]);

  const { desk, TABLE } = L;
  const ring = "ring-[2.5px] ring-[#17181C]";

  return (
    <section ref={storyRef} aria-labelledby="office-story-title" className={`relative bg-[#17181C] ${phone ? "h-[420vh]" : "h-[520vh]"}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={planRef} aria-hidden className="absolute left-0 top-0 origin-top-left" style={{ width: L.W, height: L.H, willChange: "transform" }}>
          <svg viewBox={`0 0 ${L.W} ${L.H}`} className="absolute inset-0 overflow-visible">
            {L.ROOMS.map((r) => (
              <rect
                key={r.name}
                data-wall
                x={r.x} y={r.y} width={r.w} height={r.h} rx={phone ? 14 : 18}
                pathLength={1}
                fill="rgba(255,255,255,0.025)"
                stroke={r.call ? "rgba(80,220,150,0.6)" : "rgba(190,215,255,0.42)"}
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 }}
              />
            ))}
          </svg>
          {L.ROOMS.map((r) => (
            <div
              key={r.name}
              data-room
              className={`absolute opacity-0 ${mono} ${phone ? "text-[10px]" : "text-[12px]"} ${r.call ? "text-[#5BE3A0]" : "text-[rgba(200,215,240,0.55)]"}`}
              style={{ left: r.x + (phone ? 12 : 22), top: r.y + (phone ? 11 : 20) }}
            >
              {r.name}
            </div>
          ))}
          {/* the furniture: a desk with a screen and a chair in front of it; a table and chairs in Weekly sync */}
          <svg viewBox={`0 0 ${L.W} ${L.H}`} className="absolute inset-0 overflow-visible">
            <g data-desk style={{ opacity: 0 }}>
              {L.DESKS.map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <rect x={x} y={y} width={desk.w} height={desk.h} rx={phone ? 6 : 8} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
                  <rect x={x + desk.w * 0.35} y={y + 5} width={desk.w * 0.3} height={phone ? 5 : 6} rx={2} fill="rgba(255,255,255,0.1)" />
                  <rect x={x + desk.w / 2 - 15} y={y + desk.h + 8} width={30} height={22} rx={8} fill="rgba(255,255,255,0.06)" />
                </g>
              ))}
              <rect x={TABLE.x} y={TABLE.y} width={TABLE.w} height={TABLE.h} rx={16} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
              {TABLE.chairs.map((x) => (
                <g key={x}>
                  <rect x={x - 15} y={TABLE.top} width={30} height={22} rx={8} fill="rgba(255,255,255,0.06)" />
                  <rect x={x - 15} y={TABLE.bottom} width={30} height={22} rx={8} fill="rgba(255,255,255,0.06)" />
                </g>
              ))}
            </g>
          </svg>

          {/* you */}
          <div className="absolute" style={{ left: L.ME.x - L.me / 2, top: L.ME.y - L.me / 2, width: L.me, height: L.me }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={P("women-26")} alt="" className={`h-full w-full rounded-full object-cover ${ring}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-me-grey src={P("women-26")} alt="" className="absolute inset-0 h-full w-full rounded-full object-cover" style={{ filter: "grayscale(1) brightness(.75)" }} />
            <span data-me-dot className="absolute -bottom-px -right-px h-3 w-3 rounded-full border-[2.5px] border-[#17181C] bg-[#34C77B] opacity-0" />
            <span className={`absolute text-[rgba(220,228,240,0.8)] ${mono} ${phone ? "left-1/2 top-[50px] -translate-x-1/2 text-[9px]" : "left-[72px] top-[24px] text-[11px]"}`}>You</span>
          </div>

          {L.TEAM.map(([f, x, y, , st]) => (
            <div key={f} data-mate className="absolute opacity-0" style={{ left: x - L.mate / 2, top: y - L.mate / 2, width: L.mate, height: L.mate, willChange: "transform, opacity" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P(f)} alt="" className={`h-full w-full rounded-full object-cover ${ring}`} />
              <span className="absolute -bottom-px -right-px h-3 w-3 rounded-full border-[2.5px] border-[#17181C]" style={{ background: DOT[st] }} />
            </div>
          ))}

          <div data-knock className={`absolute flex items-center gap-2.5 whitespace-nowrap rounded-[11px] bg-white px-3 py-[9px] text-[#0A0F1A] opacity-0 bb-sh-pop ${phone ? "text-[12px]" : "text-[13px]"}`} style={{ left: L.KNOCK.x, top: L.KNOCK.y }}>
            <b className="font-semibold">Maya</b> knocked
            <span className="inline-flex h-[26px] items-center rounded-[7px] bg-[#0A0F1A] px-2.5 text-xs font-semibold text-white">Come in</span>
          </div>
          <div data-task className="absolute rounded-[10px] bg-white px-3 py-2.5 text-[12.5px] text-[#0A0F1A] opacity-0 bb-sh-pop" style={{ left: L.TASK.x, top: L.TASK.y, width: L.TASK.w }}>
            <b className="font-semibold">Final pricing page</b>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-[#6B7385]">
              <i className="h-[7px] w-[7px] rounded-[2px] bg-[#E5484D]" />Today · from Leo
            </div>
          </div>

          {L.CALLOUTS.map((c) => (
            <div key={c.id} data-co={c.id} className="absolute opacity-0" style={{ left: c.x, top: c.y }}>
              <span className={`block whitespace-nowrap border-b border-[rgba(233,238,247,0.55)] pb-1.5 text-[13px] text-[#E9EEF7] ${mono}`}>{c.label}</span>
              {c.line ? (
                <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
                  <line x1={c.line[0]} y1={c.line[1]} x2={c.line[2]} y2={c.line[3]} stroke="rgba(233,238,247,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>

        <div data-intro className={`absolute max-w-[620px] ${phone ? "left-6 right-6 top-[12vh]" : "left-[8vw] top-[22vh]"}`} style={{ willChange: "opacity, transform" }}>
          <p className="font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)", lineHeight: 1.06 }}>Remote work.</p>
          <p className="font-semibold tracking-tight text-[#5D636F]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)", lineHeight: 1.06 }}>
            Everyone&apos;s somewhere.<br />No one&apos;s here.
          </p>
        </div>
        <div data-outro className={`absolute inset-x-0 px-6 text-center opacity-0 ${phone ? "top-[9vh]" : "top-[11vh]"}`} style={{ willChange: "opacity, transform" }}>
          <h2 id="office-story-title" className="font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2.1rem, 4.4vw, 4.2rem)", lineHeight: 1.02 }}>
            Your whole team,<br />one open office.
          </h2>
          <p className={`mx-auto mt-4 max-w-[560px] leading-relaxed text-white/65 ${phone ? "text-base" : "text-lg"}`}>
            See who is free, knock, walk in and pass work across the room. Together in seconds, wherever everyone is.
          </p>
          <Link href="/office" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-[#0a0f1c] transition-colors hover:bg-white/90">
            Step inside the office
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div aria-hidden className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2, 3, 4].map((n) => <i key={n} data-step className="h-0.5 w-[22px] rounded-sm bg-white" style={{ opacity: 0.15 }} />)}
        </div>
      </div>
    </section>
  );
}
