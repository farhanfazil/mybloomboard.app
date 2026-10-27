"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Home, right after the live demo: "Chaos to calm". Bits of work from everywhere
 * (an email, a chat, a missed call, a video call link, a meeting invite, a note, a
 * file, a sheet row, two messages), each labelled with its own icon, float around the
 * words "Your work is everywhere." As you scroll, a BloomBoard window appears and each
 * bit flies into its own home there (Mail, Chat, Calls, Calendar, Notes & files, Plans,
 * Tasks, Office) and becomes a clean item; it ends on "All of it, in one place." with
 * the whole window just under the words. The stage stays put (sticky) while the tall
 * section scrolls past; script only sets transforms and opacity, once a frame, and only
 * while the section is on screen. Phones get a short, still version.
 */

const P = (f: string) => `/bloomboard-demo/people/${f}.jpg`;

const ICON = {
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  video: <><path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  note: <><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M15 3v6h6" /></>,
  sheet: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  task: <><path d="m9 11 3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  office: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" /></>,
  home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  plan: <><path d="M3 3v18h18" /><path d="M7 16v-5M12 16V8M17 16v-9" /></>,
};
type IconName = keyof typeof ICON;
function Ic({ n, size = 15, className = "" }: { n: IconName; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={`flex-none ${className}`} aria-hidden>
      {ICON[n]}
    </svg>
  );
}

/* the window and its eight areas, 4 x 2, in world units (the window is 1240 x 524, centred) */
const COLX = [-540, -251, 38, 327], ROWY = [-194, 34], PW = 273, PH = 212;
/* icon, name, note, and the quieter items already there (under where a bit lands) */
const PANELS: [IconName, string, string, [string, string][]][] = [
  ["mail", "Mail", "3 new", [["Invoice for October", "Finance"], ["Welcome the new designer", "People team"]]],
  ["chat", "Chat", "Team room", [["Maya: banners are up for review", "2 min"], ["Daniel: looks great, ship it", "5 min"]]],
  ["phone", "Calls", "", []],
  ["cal", "Calendar", "Today", [["Design review", "3:00 pm"], ["Client call", "4:00 pm"]]],
  ["note", "Notes & files", "", []],
  ["plan", "Plans", "Q3 launch", [["Launch page", "Week 4 · Maya"], ["Press kit", "Week 4 · Nora"]]],
  ["task", "Tasks", "12 open", [["Book the venue", "Friday"], ["Press kit review", "Wednesday"]]],
  ["office", "Office", "8 here", [["Weekly sync", "3 in the room"], ["Daniel", "Focus until 3 pm"]]],
];

const BLUE = "text-[#9DB7FF]", GREEN = "text-[#5BE3A0]";
type Bit = {
  look: string; icon: IconName; kind: string; messy: ReactNode;
  panel: number; slot: number; title: string; meta: ReactNode; who?: string;
  x: number; y: number; rot: number; size: number;
};
/* where each bit floats at the start: hand-placed, uneven, never touching or off screen */
const BITS: Bit[] = [
  { look: "bg-[#F4F5F7] text-[#2A2F38]", icon: "mail", kind: "Email", messy: <>Re: Re: FW: Q3 launch<br /><b className="font-semibold">Final deck by Thursday, anyone??</b></>, panel: 0, slot: 0, title: "Send the final deck", meta: <><i className="h-1.5 w-1.5 rounded-[2px] bg-[#E5484D]" /><span className={BLUE}>Thursday</span></>, who: "women-44", x: -470, y: -300, rot: -9, size: 1 },
  { look: "bg-[#3B414D] text-[#E6E8EC] !rounded-[14px_14px_14px_4px]", icon: "chat", kind: "Chat", messy: <>Leo: who&apos;s booking the venue for Friday??</>, panel: 1, slot: 0, title: "Who's booking the venue?", meta: <span>Leo · reply: <span className={GREEN}>I&apos;ll do it</span></span>, who: "men-32", x: 300, y: -270, rot: -4, size: 1 },
  { look: "bg-[#1B1D22] text-[#F0B4B4] ring-1 ring-[rgba(229,72,77,0.45)]", icon: "phone", kind: "Missed call", messy: <>Client · 2:14 pm<br />Call back about the contract</>, panel: 2, slot: 0, title: "Call back the client", meta: <span className={BLUE}>Today, 4 pm</span>, who: "women-12", x: -600, y: -40, rot: 6, size: 1 },
  { look: "bg-[#E9EEF7] text-[#2A3A5C]", icon: "video", kind: "Video call", messy: <>Link for the 3 pm review? Anyone?</>, panel: 2, slot: 1, title: "Design review · video call", meta: <><span className={BLUE}>3:00 pm</span><span className={GREEN}>Join in the office</span></>, x: 565, y: 95, rot: -8, size: 1 },
  { look: "bg-[#E9F0FF] text-[#22335E]", icon: "cal", kind: "Meeting invite", messy: <>Weekly sync · Mon 10:00<br />Accept · Maybe · Decline</>, panel: 3, slot: 0, title: "Weekly sync", meta: <><span className={BLUE}>Monday, 10:00</span><span>6 going</span></>, x: 250, y: 210, rot: 4, size: 0.96 },
  { look: "bg-[#F7E27A] text-[#3D3510]", icon: "note", kind: "Note", messy: <>follow up with legal re: contract!!</>, panel: 4, slot: 0, title: "Follow up with legal", meta: <span>Launch notes</span>, who: "men-75", x: -80, y: 290, rot: -6, size: 1.05 },
  { look: "bg-[#ECEAF6] text-[#3A3366] font-mono text-[11.5px]", icon: "file", kind: "File", messy: <>brand_guidelines_FINAL(2).pdf</>, panel: 4, slot: 1, title: "Brand guidelines.pdf", meta: <span>Added to Launch notes</span>, x: -95, y: -350, rot: 5, size: 0.92 },
  { look: "bg-white text-[#1F6F43] font-mono text-[11.5px]", icon: "sheet", kind: "Sheet", messy: <>Q3_budget_v4.xlsx · Row 14<br />Pricing page | ? | TODO</>, panel: 5, slot: 0, title: "Pricing page", meta: <><span>Week 3</span><span className={BLUE}>Leo</span><span className={GREEN}>On track</span></>, x: 600, y: 300, rot: -5, size: 1 },
  { look: "bg-[#463A52] text-[#EFE4F7] !rounded-[14px_14px_14px_4px]", icon: "chat", kind: "Message", messy: <>any update on the launch?? where are we</>, panel: 6, slot: 0, title: "Launch: 9 of 12 done", meta: <><span className={GREEN}>75%</span><span>updated just now</span></>, x: -430, y: 205, rot: 10, size: 0.95 },
  { look: "bg-[#2C4660] text-[#DCEBF8] !rounded-[14px_14px_4px_14px]", icon: "chat", kind: "Message", messy: <>is anyone free for a quick question?</>, panel: 7, slot: 0, title: "Maya is free", meta: <><span className={GREEN}>In the lounge</span><span className={BLUE}>Knock</span></>, who: "women-44", x: 590, y: -360, rot: 7, size: 0.94 },
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function Clean({ b }: { b: Bit }) {
  return (
    <>
      <div>{b.title}</div>
      <div className="mt-[5px] flex items-center gap-1.5 text-[11px] text-[#959CA8]">
        {b.meta}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {b.who ? <img src={P(b.who)} alt="" className="ml-auto h-4 w-4 rounded-full object-cover" /> : null}
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
    const panels = Array.from(world.querySelectorAll<HTMLElement>("[data-panel]"));
    const win = world.querySelector<HTMLElement>("[data-win]")!;
    const intro = story.querySelector<HTMLElement>("[data-intro]")!;
    const outro = story.querySelector<HTMLElement>("[data-outro]")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* when each area wakes up: as its first bit arrives */
    const wake = PANELS.map((_, i) => { const n = BITS.findIndex((b) => b.panel === i); return n < 0 ? 0.5 : 0.38 + n * 0.04; });

    /* where the words end, inside the stage, so the window can sit right under them */
    let outroBottom = 0;
    const measure = () => {
      const t = outro.style.transform;
      outro.style.transform = "none";
      outroBottom = outro.getBoundingClientRect().bottom - (outro.parentElement as HTMLElement).getBoundingClientRect().top;
      outro.style.transform = t;
    };

    const draw = () => {
      const r = story.getBoundingClientRect();
      const p = reduce ? 1 : clamp(-r.top / (story.offsetHeight - window.innerHeight));
      const vh = window.innerHeight, fit = Math.min(window.innerWidth / 1520, vh / 900, 1.15);
      /* at the end: the whole window, 32 px under the words */
      const settle = eio(seg(p, 0.82, 0.92));
      const top = outroBottom + 32, s2 = Math.min(1, (vh - 24 - top) / (524 * fit));
      const sc = fit * (1 + (s2 - 1) * settle), ty = (top + 262 * fit * s2 - vh * 0.55) * settle;
      world.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;

      const io = 1 - seg(p, 0.15, 0.23);
      intro.style.opacity = String(io);
      intro.style.transform = `translateY(calc(-50% - ${((1 - io) * 20).toFixed(1)}px))`;

      const wo = seg(p, 0.2, 0.36);
      win.style.opacity = String(wo);
      win.style.transform = `scale(${(0.96 + 0.04 * wo).toFixed(4)})`;
      bits.forEach((el, i) => {
        const b = BITS[i];
        const a = 0.24 + i * 0.04, k = eio(seg(p, a, a + 0.22));
        const bob = Math.sin(p * 16 + i * 1.7) * 9 * (1 - k);
        const sx = b.x - 125, sy = b.y - 33, tx = COLX[b.panel % 4] + 11, tyy = ROWY[Math.floor(b.panel / 4)] + 40 + b.slot * 74;
        el.style.transform = `translate(${(sx + (tx - sx) * k).toFixed(1)}px,${(sy + (tyy - sy) * k + bob).toFixed(1)}px) rotate(${(b.rot * (1 - k)).toFixed(2)}deg) scale(${(b.size + (1 - b.size) * k).toFixed(3)})`;
        const c = seg(k, 0.6, 0.92);
        (el.firstElementChild as HTMLElement).style.opacity = String(1 - c);
        (el.lastElementChild as HTMLElement).style.opacity = String(c);
        el.style.opacity = String(0.8 + 0.2 * Math.max(seg(p, 0.12, 0.2), k));
      });
      panels.forEach((el, i) => { el.style.opacity = String(0.35 + 0.65 * seg(p, wake[i], wake[i] + 0.06)); });

      const o = seg(p, 0.86, 0.95);
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
    const onResize = () => { measure(); draw(); };
    const io = new IntersectionObserver(([e]) => { on = !!e?.isIntersecting; if (on) { measure(); draw(); } });
    io.observe(story);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const big = { fontSize: "clamp(2.2rem, 4.2vw, 4rem)", lineHeight: 1.06 };

  return (
    <>
      {/* desktop and tablet: the scroll story */}
      <section ref={storyRef} aria-labelledby="calm-title" className="relative hidden h-[560vh] bg-[#2A2B30] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={worldRef} className="absolute left-1/2 top-[55%] h-0 w-0" style={{ willChange: "transform" }}>
            {/* the BloomBoard window everything lands in */}
            <div data-win aria-hidden style={{ willChange: "opacity, transform" }} className="absolute -left-[620px] -top-[262px] h-[524px] w-[1240px] rounded-[20px] bg-[#0E1014] opacity-0 bb-sh-window">
              <div className="absolute inset-x-0 top-0 flex h-[52px] items-center gap-2.5 border-b border-white/[0.06] px-[18px] text-[13.5px]">
                <span className="mr-2 flex gap-[7px]">{[0, 1, 2].map((n) => <i key={n} className="h-[11px] w-[11px] rounded-full bg-[#2A2E36]" />)}</span>
                <b className="font-semibold text-white">BloomBoard</b>
                <span className="text-[#8A909C]">Launch week</span>
                <span className="ml-auto flex items-center gap-2.5 text-[12.5px] text-[#7D8492]">
                  <span className="flex">
                    {["women-44", "men-32", "women-12", "men-75", "women-79"].map((f, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={f} src={P(f)} alt="" className={`h-6 w-6 rounded-full object-cover ring-2 ring-[#0E1014] ${i ? "-ml-[7px]" : ""}`} />
                    ))}
                  </span>
                  8 in the office
                </span>
              </div>
              <div className="absolute bottom-0 left-0 top-[52px] flex w-16 flex-col items-center gap-4 border-r border-white/[0.06] pt-[18px] text-[#8A909C]">
                {(["home", "mail", "chat", "phone", "cal", "note", "plan", "task", "office"] as IconName[]).map((n, i) => (
                  <span key={n} className={i ? "" : "text-white"}><Ic n={n} size={18} /></span>
                ))}
              </div>
              {PANELS.map(([icon, name, note, rows], i) => (
                <div
                  key={name}
                  data-panel
                  className="absolute rounded-[14px] bg-[#15181E] px-3.5 py-[13px] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                  style={{ left: COLX[i % 4] + 620, top: ROWY[Math.floor(i / 4)] + 262, width: PW, height: PH, opacity: 0.35, willChange: "opacity" }}
                >
                  <h5 className="flex items-center gap-2 text-[12.5px] font-semibold text-[#C9CDD5]">
                    <Ic n={icon} className="text-[#8D94A3]" />{name}
                    {note ? <small className="ml-auto text-[11.5px] font-medium text-[#8A909C]">{note}</small> : null}
                  </h5>
                  {rows.length ? (
                    <div className="absolute inset-x-3.5 bottom-3 divide-y divide-white/[0.05]">
                      {rows.map(([t, m]) => (
                        <div key={t} className="flex items-center justify-between gap-3 py-2 text-[11.5px]">
                          <span className="truncate text-[#9AA1AE]">{t}</span>
                          <span className="flex-none text-[#8A909C]">{m}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {BITS.map((b) => (
              <div key={b.title} data-bit aria-hidden className="absolute left-0 top-0 h-[66px] w-[250px]" style={{ willChange: "transform, opacity" }}>
                <div className={`absolute inset-0 rounded-[11px] px-3 py-[9px] text-[12.5px] leading-[1.35] bb-sh-chip ${b.look}`} style={{ willChange: "opacity" }}>
                  <div className="mb-1 flex items-center gap-1.5 font-sans text-[10.5px] font-semibold uppercase tracking-[0.04em] opacity-60">
                    <Ic n={b.icon} size={12} />{b.kind}
                  </div>
                  {b.messy}
                </div>
                <div className="absolute inset-0 rounded-[11px] bg-[#1C2028] px-[11px] py-[9px] text-[12.5px] leading-[1.3] text-[#E6E8EC] opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]" style={{ willChange: "opacity" }}>
                  <Clean b={b} />
                </div>
              </div>
            ))}
          </div>

          <div data-intro className="pointer-events-none absolute inset-x-0 top-1/2 z-[5] -translate-y-1/2 text-center" style={{ willChange: "opacity, transform" }}>
            <p className="font-semibold tracking-tight text-white" style={big}>Your work is everywhere.</p>
            <p className="mt-2.5 font-semibold tracking-tight text-[#8E94A0]" style={{ ...big, fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}>
              Emails, chats, calls, meetings, tasks and plans.
            </p>
          </div>
          <div data-outro className="pointer-events-none absolute inset-x-0 top-[10vh] z-[5] px-6 text-center opacity-0" style={{ willChange: "opacity, transform" }}>
            <h2 id="calm-title" className="font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: 1.04 }}>
              All of it, in one place.
            </h2>
            <p className="mx-auto mt-3.5 max-w-[600px] text-lg leading-relaxed text-white/65">
              Mail, chat, calls, meetings, notes, plans and tasks, with your whole team in the office. Everything falls into place, so nothing slips.
            </p>
          </div>
        </div>
      </section>

      {/* phones: the same idea, still */}
      <section aria-labelledby="calm-title-phone" className="bg-[#2A2B30] px-5 py-20 md:hidden">
        <p className="text-center text-[15px] text-[#8E94A0]">Your work is everywhere. Emails, chats, calls, meetings, tasks and plans.</p>
        <h2 id="calm-title-phone" className="mt-3 text-center text-[2rem] font-semibold leading-tight tracking-tight text-white">
          All of it, in one place.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-base leading-relaxed text-white/65">
          Mail, chat, calls, meetings, notes, plans and tasks, with your whole team in the office. Everything falls into place, so nothing slips.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-2.5">
          {[0, 1, 2, 4, 7, 9].map((i) => {
            const b = BITS[i];
            return (
              <div key={b.title} className="rounded-[11px] bg-[#1C2028] px-3 py-2.5 text-[13px] leading-[1.3] text-[#E6E8EC] shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#8D94A3]">
                  <Ic n={PANELS[b.panel][0]} size={12} />{PANELS[b.panel][1]}
                </div>
                <Clean b={b} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
