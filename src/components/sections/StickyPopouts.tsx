"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sticky notes that came out of the live demo. The demo runs in a frame, so
 * public/bloomboard-demo/demo-boot.js hands a note over (by message) when it is
 * dragged to the edge of the demo window or popped out with its button; this
 * takes over the same note and the same drag, so it can be put anywhere on the
 * page. It looks and works like the app's sticky note: colour, text size,
 * typing and close. Notes stay in place on screen while the page scrolls.
 */

type Note = { key: string; text: string; color: string; fontSize: number; ts: string; x: number; y: number; rot: number };

const HEX: Record<string, string> = {
  "sn-yellow": "#fde68a", "sn-pink": "#fecdd3", "sn-blue": "#bae6fd", "sn-green": "#bbf7d0", "sn-purple": "#ddd6fe",
};
const DOTS: Record<string, string> = {
  "sn-yellow": "#facc15", "sn-pink": "#f472b6", "sn-blue": "#38bdf8", "sn-green": "#4ade80", "sn-purple": "#a78bfa",
};
const SIZES = [12, 14, 16, 18];
const W = 230;
/* While a note is dragged over the demo, the frame would take the pointer. */
const framesTakePointer = (on: boolean) =>
  document.querySelectorAll("iframe").forEach((f) => { (f as HTMLIFrameElement).style.pointerEvents = on ? "" : "none"; });

export default function StickyPopouts() {
  const [notes, setNotes] = useState<Note[]>([]);
  /* the note being dragged: its element and where the pointer holds it */
  const dragRef = useRef<{ key: string; el: HTMLElement | null; offX: number; offY: number } | null>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});

  const place = (key: string, x: number, y: number) => {
    const el = els.current[key];
    if (el) { el.style.left = `${x}px`; el.style.top = `${y}px`; }
  };
  const settle = useCallback(() => {
    const d = dragRef.current;
    dragRef.current = null;
    framesTakePointer(true);
    if (!d) return;
    const el = els.current[d.key];
    if (!el) return;
    /* keep it on screen, and remember where it landed */
    const x = Math.min(Math.max(8, parseFloat(el.style.left)), window.innerWidth - W - 8);
    const y = Math.min(Math.max(8, parseFloat(el.style.top)), window.innerHeight - 120);
    place(d.key, x, y);
    el.style.transform = `rotate(var(--rot)) scale(1)`;
    el.classList.remove("held");
    setNotes((ns) => ns.map((n) => (n.key === d.key ? { ...n, x, y } : n)));
  }, []);

  useEffect(() => {
    const frameOf = (src: MessageEventSource | null) =>
      Array.from(document.querySelectorAll("iframe")).find((f) => f.contentWindow === src) || null;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data.type !== "string") return;
      const frame = frameOf(e.source);
      if (!frame) return;
      const r = frame.getBoundingClientRect();
      const scale = frame.offsetWidth ? r.width / frame.offsetWidth : 1;
      const px = r.left + e.data.x * scale, py = r.top + e.data.y * scale;

      if (e.data.type === "bb-sticky-pop") {
        const n = e.data.note || {};
        const key = `${n.id || "n"}-${Date.now()}`;
        const offX = (e.data.offX || 20) * scale, offY = (e.data.offY || 14) * scale;
        const note: Note = {
          key, text: String(n.text || ""), color: HEX[n.color] ? n.color : "sn-yellow",
          fontSize: SIZES.includes(n.fontSize) ? n.fontSize : 14, ts: String(n.ts || ""),
          x: px - offX, y: py - offY, rot: -2 + Math.random() * 2.5,
        };
        if (!e.data.dragging) {
          /* popped with the button: make sure it lands where it can be seen */
          note.x = Math.min(Math.max(8, note.x), window.innerWidth - W - 8);
          note.y = Math.min(Math.max(72, note.y), window.innerHeight - 160);
        }
        setNotes((ns) => [...ns, note]);
        dragRef.current = e.data.dragging ? { key, el: null, offX, offY } : null;
        /* starts at the demo's size, grows to full size once it lands */
        requestAnimationFrame(() => {
          const el = els.current[key];
          if (!el) return;
          el.style.transform = `rotate(var(--rot)) scale(${scale})`;
          if (e.data.dragging) el.classList.add("held");
          else requestAnimationFrame(() => { el.style.transform = `rotate(var(--rot)) scale(1)`; });
        });
      } else if (e.data.type === "bb-sticky-move") {
        const d = dragRef.current;
        if (d) place(d.key, px - d.offX, py - d.offY);
      } else if (e.data.type === "bb-sticky-drop") {
        settle();
      }
    };
    /* where the browser sends the pointer to this page instead of the frame */
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (d) place(d.key, e.clientX - d.offX, e.clientY - d.offY);
    };
    const onUp = () => { if (dragRef.current) settle(); };
    window.addEventListener("message", onMessage);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [settle]);

  const update = (key: string, patch: Partial<Note>) => setNotes((ns) => ns.map((n) => (n.key === key ? { ...n, ...patch } : n)));

  if (!notes.length) return null;
  return (
    <>
      <style>{`
        .bb-pop-note{position:fixed;z-index:70;width:${W}px;border-radius:6px;box-shadow:0 10px 28px rgba(0,0,0,.35);color:rgba(0,0,0,.82);
          transform-origin:0 0;transition:transform .28s cubic-bezier(.34,1.45,.64,1);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif}
        .bb-pop-note.held{transition:none;cursor:grabbing}
        .bb-pop-note .hd{display:flex;align-items:center;gap:6px;height:36px;padding:0 6px 0 8px;cursor:grab;user-select:none;touch-action:none}
        .bb-pop-note .pin{width:18px;height:18px;display:grid;place-items:center;color:rgba(0,0,0,.55)}
        .bb-pop-note .pin svg{width:15px;height:15px;transform:rotate(35deg)}
        .bb-pop-note .dot{width:11px;height:11px;border-radius:50%;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;padding:0}
        .bb-pop-note .dot.on{outline:2px solid rgba(0,0,0,.45);outline-offset:1px}
        .bb-pop-note .fa{height:22px;min-width:24px;border:1px solid rgba(0,0,0,.14);border-radius:6px;background:transparent;color:rgba(0,0,0,.6);font-weight:700;line-height:1;cursor:pointer}
        .bb-pop-note .fa:hover,.bb-pop-note .x:hover{background:rgba(0,0,0,.07);color:rgba(0,0,0,.85)}
        .bb-pop-note .fa:disabled{opacity:.35;cursor:default}
        .bb-pop-note .x{margin-left:auto;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:rgba(0,0,0,.5);cursor:pointer;display:grid;place-items:center}
        .bb-pop-note textarea{display:block;width:100%;min-height:96px;border:0;outline:0;resize:none;background:transparent;color:rgba(0,0,0,.82);line-height:1.6;padding:6px 12px 6px;font-family:inherit}
        .bb-pop-note textarea::placeholder{color:rgba(0,0,0,.35)}
        .bb-pop-note .ft{font-size:10.5px;color:rgba(0,0,0,.42);padding:0 12px 8px;text-align:right}
        @media (prefers-reduced-motion:reduce){.bb-pop-note{transition:none}}
      `}</style>
      {notes.map((n) => {
        const i = SIZES.indexOf(n.fontSize);
        return (
          <div
            key={n.key}
            ref={(el) => { els.current[n.key] = el; }}
            className="bb-pop-note"
            role="dialog"
            aria-label="Sticky note"
            style={{ left: n.x, top: n.y, background: HEX[n.color], ["--rot" as string]: `${n.rot}deg`, transform: `rotate(${n.rot}deg)` }}
          >
            <div
              className="hd"
              onPointerDown={(e) => {
                if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
                const el = els.current[n.key];
                if (!el) return;
                const r = el.getBoundingClientRect();
                dragRef.current = { key: n.key, el, offX: e.clientX - r.left, offY: e.clientY - r.top };
                el.classList.add("held");
                framesTakePointer(false);
              }}
            >
              <span className="pin" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
              </span>
              {Object.keys(HEX).map((c) => (
                <button key={c} type="button" className={`dot${c === n.color ? " on" : ""}`} style={{ background: DOTS[c] }} aria-label={c.replace("sn-", "")} onClick={() => update(n.key, { color: c })} />
              ))}
              <button type="button" className="fa" style={{ fontSize: 10, marginLeft: 4 }} disabled={i <= 0} aria-label="Smaller text" onClick={() => update(n.key, { fontSize: SIZES[Math.max(0, i - 1)] })}>A</button>
              <button type="button" className="fa" style={{ fontSize: 14 }} disabled={i >= SIZES.length - 1} aria-label="Larger text" onClick={() => update(n.key, { fontSize: SIZES[Math.min(SIZES.length - 1, i + 1)] })}>A</button>
              <button type="button" className="x" aria-label="Close note" onClick={() => setNotes((ns) => ns.filter((x) => x.key !== n.key))}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <textarea
              value={n.text}
              placeholder="Write something important…"
              spellCheck
              style={{ fontSize: n.fontSize }}
              onChange={(e) => update(n.key, { text: e.target.value })}
            />
            {n.ts ? <div className="ft">{n.ts}</div> : null}
          </div>
        );
      })}
    </>
  );
}
