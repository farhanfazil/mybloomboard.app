"use client";

import { useEffect, useRef, useState } from "react";

/* "One key. It's done.": the app's one-key shortcuts, each shown doing its job in a small
   BloomBoard window. It plays on its own; visitors can click a key, or press it on their
   keyboard while the section is on screen (never while they type in a field). */

type Kind = "task" | "meet" | "rem" | "note" | "board" | "pal";
const KEYS: { cap: string; title: string; sub: string; kind: Kind; key?: string }[] = [
  { cap: "T", title: "New task", sub: "Ready to type", kind: "task", key: "t" },
  { cap: "M", title: "New meeting", sub: "Book a time", kind: "meet", key: "m" },
  { cap: "R", title: "Reminder", sub: "Once or repeating", kind: "rem", key: "r" },
  { cap: "N", title: "Sticky note", sub: "Jot it down", kind: "note", key: "n" },
  { cap: "B", title: "New board", sub: "For a project", kind: "board", key: "b" },
  { cap: "⌘K", title: "Anything", sub: "Search and act", kind: "pal" },
];
const TASKS = ["Send the banners to Maya", "Book the launch photographer", "Share the pricing draft"];
const POP: Record<Exclude<Kind, "pal" | "task">, { head: string; text: string; chips: string[] }> = {
  meet: { head: "New meeting", text: "Launch sync", chips: ["Thu 3:00 PM", "30 min", "Team"] },
  rem: { head: "New reminder", text: "Send the invoice", chips: ["Fri 9:00 AM", "Every week"] },
  note: { head: "", text: "Ask Leo about the export sizes", chips: [] },
  board: { head: "New board", text: "Website relaunch", chips: ["To Do", "Doing", "Done"] },
};

export default function ShortcutsSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState<Kind | null>(null);
  const [typed, setTyped] = useState("");
  const [todo, setTodo] = useState<{ t: string; fresh?: boolean }[]>([{ t: "Homepage hero" }, { t: "Launch email copy" }]);
  const timers = useRef<number[]>([]);
  const loop = useRef<number | null>(null);
  const step = useRef(0);
  const taskN = useRef(0);
  const inView = useRef(false);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms: number, f: () => void) => { timers.current.push(window.setTimeout(f, ms)); };

  const run = (i: number) => {
    clear();
    const k = KEYS[i];
    setActive(i); setTyped(""); setOpen(k.kind);
    const text = k.kind === "task" ? TASKS[taskN.current % TASKS.length] : k.kind === "pal" ? "new task" : POP[k.kind].text;
    for (let c = 1; c <= text.length; c++) at(250 + c * 45, () => setTyped(text.slice(0, c)));
    const end = 250 + text.length * 45 + 600;
    at(end, () => {
      setOpen(null);
      if (k.kind === "task") {
        taskN.current++;
        setTodo(list => [{ t: text, fresh: true }, ...list.map(x => ({ t: x.t }))].slice(0, 3));
      }
    });
  };
  const autoplay = (delay: number) => {
    if (loop.current) clearTimeout(loop.current);
    loop.current = window.setTimeout(function next() {
      if (inView.current) { run(step.current % KEYS.length); step.current++; }
      loop.current = window.setTimeout(next, 4200);
    }, delay);
  };
  const press = (i: number) => { run(i); step.current = i + 1; autoplay(7000); };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; }, { threshold: 0.35 });
    io.observe(el);
    autoplay(600);
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement as HTMLElement | null;
      if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
      const i = KEYS.findIndex(k => k.key === e.key.toLowerCase());
      if (i < 0) return;
      e.preventDefault(); press(i);
    };
    window.addEventListener("keydown", onKey);
    return () => { io.disconnect(); window.removeEventListener("keydown", onKey); clear(); if (loop.current) clearTimeout(loop.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pop = open && open !== "pal" ? (open === "task" ? { head: "New task", chips: ["Medium", "Due tomorrow", "@Maya"] } : POP[open]) : null;

  return (
    <section ref={ref} aria-labelledby="keys-title" className="bg-black px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-[13px] font-semibold tracking-wide text-[#4d9fff]">Built for the keyboard</p>
          <h2 id="keys-title" className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">One key.<br />It&apos;s done.</h2>
          <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-white/60">
            Press T and a task is ready to type. M books a meeting, R sets a reminder. No menus, no hunting, from anywhere in BloomBoard.
          </p>
          <div className="mt-9 grid max-w-[470px] grid-cols-2 gap-3">
            {KEYS.map((k, i) => (
              <button key={k.cap} type="button" onClick={() => press(i)}
                className={`flex items-center gap-3.5 rounded-[14px] border p-3 text-left transition-colors ${active === i ? "border-[#4d9fff]/45 bg-[#0c1320]" : "border-white/[0.08] bg-[#0b0b0d] hover:border-white/[0.16]"}`}>
                <span className={`grid h-12 w-12 flex-none place-items-center rounded-[11px] border font-mono font-bold transition-all ${k.cap.length > 1 ? "text-[15px]" : "text-[19px]"} ${active === i ? "translate-y-[3px] border-[#4d9fff] bg-[#4d9fff] text-[#04101f] shadow-none" : "border-[#2c2e34] bg-[#1a1b1f] text-[#e8e8e8] shadow-[0_3px_0_#2c2e34]"}`}>{k.cap}</span>
                <span><b className="block text-sm font-semibold text-white">{k.title}</b><small className="text-[12.5px] text-white/50">{k.sub}</small></span>
              </button>
            ))}
          </div>
          <p className="mt-4 hidden text-[13px] text-white/50 sm:block">Try it now: press T, M, R, N or B on your keyboard.</p>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-[#26282e] bg-[#141519]" aria-hidden="true">
          <div className="flex h-[38px] items-center gap-[7px] border-b border-[#26282e] px-3.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[#3a3c42]" /><i className="h-2.5 w-2.5 rounded-full bg-[#3a3c42]" /><i className="h-2.5 w-2.5 rounded-full bg-[#3a3c42]" />
            <span className="ml-2.5 text-xs font-semibold text-white/50">BloomBoard</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-[38px] grid grid-cols-[48px_1fr]">
            <div className="flex flex-col items-center gap-3.5 border-r border-[#26282e] pt-4">
              {[0, 1, 2, 3, 4, 5].map(n => <u key={n} className={`block h-4 w-4 rounded border-[1.6px] ${n === 1 ? "border-white/90" : "border-[#4a4d55]"}`} />)}
            </div>
            <div className="grid grid-cols-3 content-start gap-2.5 p-[18px]">
              {[["To Do", todo.map(x => x), todo.length + 0], ["In Progress", [{ t: "Pricing page" }], 1], ["Done", [{ t: "Brand colours" }], 3]].map(([name, cards, n]) => (
                <div key={name as string} className="min-h-[220px] rounded-[10px] border border-[#26282e] p-2.5">
                  <h5 className="mb-2 flex justify-between text-[11.5px] font-semibold text-white">{name as string}<em className="not-italic text-white/40">{n as number}</em></h5>
                  {(cards as { t: string; fresh?: boolean }[]).map(c => (
                    <div key={c.t} className={`mb-[7px] rounded-lg bg-[#1b1d22] px-2.5 py-2 text-[11.5px] font-semibold text-white ${c.fresh ? "outline outline-[1.5px] outline-[#4d9fff]/60" : ""}`}>
                      {c.t}<small className="mt-0.5 block text-[10.5px] font-medium text-white/45">Due tomorrow</small>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={`absolute inset-x-0 bottom-0 top-[38px] bg-black/45 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} />
          {/* the window a key opens */}
          <div className={`absolute left-1/2 top-[54%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,.5)] transition-all duration-200 ${pop ? "scale-100 opacity-100" : "scale-[.97] opacity-0"} ${open === "note" ? "border-[#3d3720] bg-[#2a2618]" : "border-[#26282e] bg-[#141519]"}`}>
            {pop?.head ? <div className="mb-2 text-[11px] font-semibold text-white/50">{pop.head}</div> : null}
            <div className={`min-h-[22px] ${open === "note" ? "text-sm font-semibold text-[#f2e7c4]" : "text-base font-bold text-white"}`}>{pop ? typed : ""}<span className="ml-px inline-block h-[17px] w-0.5 animate-pulse bg-[#4d9fff] align-[-3px]" /></div>
            {pop && pop.chips.length ? <div className="mt-3 flex flex-wrap gap-1.5">{pop.chips.map(c => <span key={c} className="rounded-md border border-[#26282e] bg-[#1b1d22] px-2 py-1 text-[11px] text-white/80">{c}</span>)}</div> : null}
          </div>
          {/* ⌘K */}
          <div className={`absolute left-1/2 top-[16%] w-[70%] -translate-x-1/2 overflow-hidden rounded-xl border border-[#26282e] bg-[#141519] shadow-[0_20px_50px_rgba(0,0,0,.5)] transition-opacity duration-200 ${open === "pal" ? "opacity-100" : "opacity-0"}`}>
            <div className="border-b border-[#26282e] px-3.5 py-2.5 text-[13px] text-white">{open === "pal" ? typed : ""}<span className="ml-px inline-block h-[15px] w-0.5 animate-pulse bg-[#4d9fff] align-[-2px]" /></div>
            {[["New task", "T"], ["Book a meeting", "M"], ["Go to Boards", "G B"]].map(([l, k], i) => (
              <div key={l} className={`flex justify-between px-3.5 py-2 text-xs ${i === 0 ? "bg-[#202227] text-white" : "text-white/75"}`}>{l}<em className="not-italic text-white/40">{k}</em></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
