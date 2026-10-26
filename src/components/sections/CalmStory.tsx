"use client";

import { useEffect, useRef } from "react";

/**
 * Home, right after the live demo: "Chaos to calm". Scattered bits of work (an email,
 * a sticky note, a chat line, a sheet cell, an invite, a file) float around the
 * screen; as you scroll they are pulled onto one BloomBoard board and become clean
 * task cards with a date, a flag and a person. The stage stays put (sticky) while the
 * tall section scrolls past; script only sets transforms and opacity, once per frame,
 * and only while the section is on screen. Phones get a short, still version.
 */

const P = (f: string) => `/bloomboard-demo/people/${f}.jpg`;
const RED = "#E5484D", AMB = "#F5A524", BLU = "#3B6FF5", GRN = "#34C77B";

type Bit = {
  look: "mail" | "sticky" | "bubble" | "sheet" | "inv" | "file";
  messy: [string, string?]; // [main line, small line above it]
  title: string; due: string; flag: string; who: string;
  col: number; row: number; x: number; y: number; rot: number;
};

const BITS: Bit[] = [
  { look: "mail", messy: ["Can someone send the deck by Thu??", "Re: Re: FW: launch"], title: "Send the deck", due: "Thursday", flag: RED, who: "women-44", col: 0, row: 0, x: -620, y: -300, rot: -9 },
  { look: "sticky", messy: ["call the client!! tmrw 3pm"], title: "Call the client", due: "Tomorrow, 3 pm", flag: AMB, who: "men-32", col: 0, row: 1, x: 470, y: -330, rot: 7 },
  { look: "bubble", messy: ["who is booking the venue?"], title: "Book the venue", due: "Friday", flag: BLU, who: "men-75", col: 0, row: 2, x: -700, y: 120, rot: 5 },
  { look: "sheet", messy: ["B14 | pricing_final | TODO"], title: "Final pricing page", due: "Today", flag: RED, who: "women-12", col: 1, row: 0, x: 600, y: 40, rot: -6 },
  { look: "inv", messy: ["Press kit review", "Invite · Wed 10:00"], title: "Press kit review", due: "Wednesday, 10 am", flag: AMB, who: "women-44", col: 1, row: 1, x: -380, y: 330, rot: -4 },
  { look: "file", messy: ["walkthrough_v7_FINAL(2).mov"], title: "Record the walkthrough", due: "Thursday", flag: BLU, who: "men-32", col: 1, row: 2, x: 330, y: 340, rot: 8 },
  { look: "mail", messy: ["Review is done, all good", "From: design"], title: "Design review", due: "Done", flag: GRN, who: "women-12", col: 2, row: 0, x: -150, y: -380, rot: 4 },
  { look: "bubble", messy: ["sent the brief, done"], title: "Send the brief", due: "Done", flag: GRN, who: "men-75", col: 2, row: 1, x: 760, y: -140, rot: -8 },
];

const LOOK: Record<Bit["look"], string> = {
  mail: "bg-[#F4F5F7] text-[#2A2F38]",
  sticky: "bg-[#F7E27A] text-[#3D3510] font-mono text-[12px]",
  bubble: "bg-[#2A2F38] text-[#E6E8EC] !rounded-[14px_14px_14px_4px]",
  sheet: "bg-white text-[#1F6F43] font-mono text-[11.5px] ring-1 ring-[#CFE3D7]",
  inv: "bg-[#E9F0FF] text-[#22335E]",
  file: "bg-[#E9EEF7] text-[#2A3A5C] font-mono text-[12px]",
};

const CALLOUTS: { label: string; x: number; y: number; line: [number, number, number, number]; at: number }[] = [
  { label: "Dates picked up", x: -760, y: -170, line: [170, 28, 250, 70], at: 0.66 },
  { label: "@names assigned", x: 520, y: -320, line: [0, 28, -70, 80], at: 0.7 },
  { label: "The whole team sees it", x: 520, y: 290, line: [0, 0, -60, -50], at: 0.74 },
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function Card({ b }: { b: Bit }) {
  return (
    <>
      <div className="text-[13px] text-[#E6E8EC]">{b.title}</div>
      <div className="mt-1.5 flex items-center gap-[7px] text-[11.5px] text-[#7D8492]">
        <i className="h-[7px] w-[7px] rounded-[2px]" style={{ background: b.flag }} />
        <span className="text-[#9DB7FF]">{b.due}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={P(b.who)} alt="" className="ml-auto h-[18px] w-[18px] rounded-full object-cover" />
      </div>
    </>
  );
}

export default function CalmStory() {
  const storyRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const story = storyRef.current, world = worldRef.current;
    if (!story || !world) return;
    const bits = Array.from(world.querySelectorAll<HTMLElement>("[data-bit]"));
    const callouts = Array.from(world.querySelectorAll<HTMLElement>("[data-co]"));
    const board = world.querySelector<HTMLElement>("[data-board]")!;
    const intro = story.querySelector<HTMLElement>("[data-intro]")!;
    const outro = story.querySelector<HTMLElement>("[data-outro]")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      const r = story.getBoundingClientRect();
      const p = reduce ? 1 : clamp(-r.top / (story.offsetHeight - window.innerHeight));
      const vw = window.innerWidth, vh = window.innerHeight;
      const fit = Math.min(vw / 1640, vh / 960, 1.1);
      const settle = eio(seg(p, 0.8, 0.9));
      world.style.transform = `translateY(${(settle * vh * 0.08).toFixed(1)}px) scale(${(fit * (1 - settle * 0.12)).toFixed(4)})`;

      intro.style.opacity = String(1 - seg(p, 0.14, 0.22));
      bits.forEach((el, i) => {
        const b = BITS[i];
        const k = eio(seg(p, 0.2 + i * 0.035, 0.44 + i * 0.035));
        const bob = Math.sin(p * 18 + i) * 10 * (1 - k);
        const sx = b.x - 140, sy = b.y - 32, tx = -456 + b.col * 316, ty = -117 + b.row * 78;
        el.style.transform = `translate(${(sx + (tx - sx) * k).toFixed(1)}px,${(sy + (ty - sy) * k + bob).toFixed(1)}px) rotate(${(b.rot * (1 - k)).toFixed(2)}deg)`;
        const c = seg(k, 0.55, 0.9);
        (el.firstElementChild as HTMLElement).style.opacity = String(1 - c);
        (el.lastElementChild as HTMLElement).style.opacity = String(c);
        el.style.opacity = String(0.35 + 0.65 * Math.max(seg(p, 0.12, 0.2), k));
      });
      const bo = seg(p, 0.22, 0.4);
      board.style.opacity = String(bo);
      board.style.transform = `scale(${0.96 + 0.04 * bo})`;
      const out = 1 - seg(p, 0.8, 0.85);
      callouts.forEach((el, i) => { el.style.opacity = String(seg(p, CALLOUTS[i].at, CALLOUTS[i].at + 0.04) * out); });
      const o = seg(p, 0.84, 0.94);
      outro.style.opacity = String(o);
      outro.style.transform = `translateY(${((1 - o) * 20).toFixed(1)}px)`;
    };

    /* only while it's on screen */
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
  }, []);

  return (
    <>
      {/* desktop and tablet: the scroll story */}
      <section ref={storyRef} aria-labelledby="calm-title" className="relative hidden h-[520vh] bg-black md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={worldRef} className="absolute left-1/2 top-[54%] h-0 w-0" style={{ willChange: "transform" }}>
            <div data-board className="absolute -left-[480px] -top-[215px] h-[360px] w-[960px] rounded-[20px] bg-[#101217] opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_100px_-30px_rgba(0,0,0,0.9)]">
              <div className="absolute left-6 right-6 top-[18px] flex items-center gap-2.5 text-sm">
                <b className="font-semibold text-white">Launch week</b>
                <span className="text-[#7D8492]">Team board</span>
                <div className="ml-auto flex">
                  {["women-44", "men-32", "women-12", "men-75"].map((f, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f} src={P(f)} alt="" className={`h-[26px] w-[26px] rounded-full object-cover ring-2 ring-[#101217] ${i ? "-ml-[7px]" : ""}`} />
                  ))}
                </div>
              </div>
              {["To do", "Doing", "Done"].map((c, i) => (
                <div key={c} className="absolute top-[70px] text-[12.5px] font-semibold text-[#8D94A3]" style={{ left: 24 + i * 316 }}>{c}</div>
              ))}
            </div>

            {BITS.map((b) => (
              <div key={b.title} data-bit aria-hidden className="absolute left-0 top-0 h-16 w-[280px]" style={{ willChange: "transform, opacity" }}>
                <div className={`absolute inset-0 overflow-hidden rounded-[10px] px-3 py-2.5 text-[12.5px] leading-[1.35] ${LOOK[b.look]}`}>
                  {b.messy[1] ? <small className="block text-[11px] opacity-70">{b.messy[1]}</small> : null}
                  {b.messy[0]}
                </div>
                <div className="absolute inset-0 rounded-[10px] bg-[#181B22] px-[13px] py-[11px] opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
                  <Card b={b} />
                </div>
              </div>
            ))}

            {CALLOUTS.map((c) => (
              <div key={c.label} data-co aria-hidden className="absolute opacity-0" style={{ left: c.x, top: c.y }}>
                <span className="block whitespace-nowrap border-b border-white/55 pb-1.5 font-mono text-[13px] uppercase tracking-[0.06em] text-[#E9EEF7]">{c.label}</span>
                <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
                  <line x1={c.line[0]} y1={c.line[1]} x2={c.line[2]} y2={c.line[3]} stroke="rgba(233,238,247,0.55)" strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>

          <div data-intro className="pointer-events-none absolute inset-x-0 top-1/2 z-[5] -translate-y-1/2 text-center">
            <p className="font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2.2rem, 4.2vw, 4rem)", lineHeight: 1.04, textShadow: "0 2px 30px #000" }}>
              Your work is everywhere.
            </p>
            <p className="font-semibold tracking-tight text-[#5D636F]" style={{ fontSize: "clamp(2.2rem, 4.2vw, 4rem)", lineHeight: 1.04, textShadow: "0 2px 30px #000" }}>
              Emails. Chats. Notes. Sheets.
            </p>
          </div>
          <div data-outro className="pointer-events-none absolute inset-x-0 top-[11vh] z-[5] px-6 text-center opacity-0">
            <h2 id="calm-title" className="font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: 1.04 }}>
              All of it, in one calm place.
            </h2>
            <p className="mx-auto mt-3.5 max-w-[540px] text-lg leading-relaxed text-white/65">
              Paste it, type it or drop it in. BloomBoard picks up the dates and names and puts it where your team can see it.
            </p>
          </div>
        </div>
      </section>

      {/* phones: the same idea, still */}
      <section aria-labelledby="calm-title-phone" className="bg-black px-5 py-20 md:hidden">
        <p className="text-center text-[15px] text-white/45">Your work is everywhere. Emails. Chats. Notes. Sheets.</p>
        <h2 id="calm-title-phone" className="mt-3 text-center text-[2rem] font-semibold leading-tight tracking-tight text-white">
          All of it, in one calm place.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-base leading-relaxed text-white/65">
          Paste it, type it or drop it in. BloomBoard picks up the dates and names and puts it where your team can see it.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-2.5">
          {BITS.slice(0, 4).map((b) => (
            <div key={b.title} className="rounded-[10px] bg-[#181B22] px-[13px] py-[11px] shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
              <Card b={b} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
