"use client";

import { useEffect, useRef, useState } from "react";
import DemoIframe, { type DemoCommand, type DemoFocus, type DemoState } from "@/components/sections/DemoIframe";
import DemoUsefulPoll from "@/components/sections/DemoUsefulPoll";
import PhoneDemoPitch from "@/components/sections/PhoneDemoPitch";
import PhoneClip from "@/components/sections/PhoneClip";
import StickyPopouts from "@/components/sections/StickyPopouts";

const APP_W = 1280;
const APP_H = 920;
const PHONE_QUERY = "(max-width: 639px)";

type LiveDemoFrameProps = {
  /** Show only the top slice of the window (hero peek) */
  peek?: boolean;
  peekHeight?: number;
  className?: string;
  eager?: boolean;
  /** Workspaces the demo offers, e.g. "personal,team" (home) or "freelance" (freelance page). */
  workspaces?: string;
};

export default function LiveDemoFrame({
  peek = false,
  peekHeight = 260,
  className = "",
  eager = false,
  workspaces = "personal,team",
}: LiveDemoFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);
  const [iframeReady, setIframeReady] = useState(eager);
  /* null until measured: the demo only loads once we know this isn't a phone. */
  const [phone, setPhone] = useState<boolean | null>(null);
  /* The demo's plan and data mode; the switch lives here, outside the window. */
  const [demo, setDemo] = useState<DemoState | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const commandRef = useRef<((cmd: DemoCommand) => void) | null>(null);
  const onState = (st: DemoState) => { setDemo(st); setPending(null); };
  /* The camera: the demo says what it is doing and the window zooms in on it, then back out.
     Off for the hero peek. */
  const [focus, setFocus] = useState<DemoFocus>(null);
  const cam = (() => {
    if (!focus || peek) return "";
    const z = Math.min(1.8, Math.max(1, Math.min(APP_W / focus.w, APP_H / focus.h)));
    if (z < 1.05) return "";
    const tx = Math.min(0, Math.max(APP_W - APP_W * z, -focus.x * z));
    const ty = Math.min(0, Math.max(APP_H - APP_H * z, -focus.y * z));
    return ` translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${z.toFixed(3)})`;
  })();
  const send = (cmd: DemoCommand, key: string) => { setPending(key); commandRef.current?.(cmd); };

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (eager) {
      setIframeReady(true);
      return;
    }
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIframeReady(true);
      },
      { rootMargin: "320px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  const viewportH = peek ? peekHeight : Math.ceil(APP_H * scale);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, Math.max(0.45, w / APP_W)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [iframeReady, phone]);

  /* The desktop app can't be used on a phone; talk to the visitor instead. */
  if (phone && !peek) {
    return (
      <div className={className}>
        {/* A real recording of the demo, with a camera that follows the action, so phone
            visitors see the product, not just words about it. */}
        <PhoneClip />
        <PhoneDemoPitch />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* The "How does it feel?" emoji row (DemoReactionsBar) was retired 2026-10-19: one quiet
          question under the demo (DemoUsefulPoll) is enough. Its past votes stay on /demo-insights. */}
      {/* the bar and the window together */}
      <div data-snap="demo">
      {!peek && <DemoControls demo={demo} pending={pending} send={send} />}
      <div className="relative">
      {/* A real object: a soft shadow under it, and the top edge catches the light. */}
      <div aria-hidden className="bb-sh-pop pointer-events-none absolute inset-0 rounded-2xl" />
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderTopColor: "rgba(255,255,255,0.2)",
        }}
      >
        {/* hairline highlight along the top edge, brightest in the middle */}
        <div
          aria-hidden
          className="bb-demo-edge pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 4%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 96%)" }}
        />
        <div
          ref={frameRef}
          className="relative w-full overflow-hidden bg-[#171717]"
          style={{ height: viewportH }}
        >
          {/* A picture of the demo's first screen shows from the very first paint;
              the live demo loads behind it and fades in over it once it has drawn
              (npm run demo-poster takes the picture). */}
          {!peek && phone !== true ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              /* a small WebP/AVIF through the image optimiser; normal priority, so it
                 never competes with the hero picture above it */
              src="/_next/image?url=%2Fbloomboard-demo%2Fposter.jpg&w=1200&q=80"
              alt=""
              aria-hidden
              decoding="async"
              className="absolute left-0 top-0 h-full w-full object-cover object-left-top"
            />
          ) : null}
          {!iframeReady || phone !== false ? (
            peek ? (
              <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-white/40">
                Loading interactive demo…
              </div>
            ) : null
          ) : (
            <DemoIframe
              fadeIn={!peek}
              title="BloomBoard interactive demo"
              src={`/bloomboard-demo/index.html?embed=home&ws=${workspaces}&v=36`}
              className="!absolute left-0 top-0"
              onState={onState}
              commandRef={commandRef}
              onFocus={setFocus}
              style={{
                width: APP_W,
                height: APP_H,
                transform: `scale(${scale})${cam}`,
                transformOrigin: "top left",
                /* slow and smooth, no bounce; the text is drawn sharp again once it settles */
                transition: "transform .8s cubic-bezier(.65,0,.35,1)",
              }}
            />
          )}
        </div>
      </div>
      </div>
      </div>
      <DemoUsefulPoll className="mt-4" />
      <StickyPopouts />
    </div>
  );
}

const PLAN_LABEL: Record<string, string> = { personal: "Personal", team: "Team", freelance: "Freelance" };

/** Above the window, like a toolbar: what this is, Start fresh, and the plan switch. */
function DemoControls({
  demo,
  pending,
  send,
}: {
  demo: DemoState | null;
  pending: string | null;
  send: (cmd: DemoCommand, key: string) => void;
}) {
  const fresh = demo?.data === "fresh";
  const ws = demo?.ws ?? "personal";
  const options = demo?.options ?? [];
  return (
    <div className="bb-demo-controls mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <p className="text-sm font-semibold text-white">{fresh ? "Fresh start" : "Live demo"}</p>
      <div className={`flex items-center gap-2 transition-opacity ${demo ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button
          type="button"
          onClick={() => send({ data: fresh ? "sample" : "fresh" }, "data")}
          disabled={!!pending}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm text-white/85 transition-colors hover:bg-white/[0.06] disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            {fresh ? (
              <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
          {pending === "data" ? (fresh ? "Opening live demo" : "Starting fresh") : fresh ? "Back to live demo" : "Start fresh"}
        </button>
        {options.length > 1 && (
          <div role="group" aria-label="Plan" className="flex h-9 items-center rounded-lg border border-white/15 p-[3px]">
            {options.map((m) => {
              const on = (pending && pending !== "data" ? pending : ws) === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  disabled={!!pending}
                  onClick={() => m !== ws && send({ ws: m }, m)}
                  className={`h-full rounded-md px-3 text-sm transition-colors ${on ? "bg-white font-medium text-black" : "text-white/70 hover:text-white"}`}
                >
                  {PLAN_LABEL[m] ?? m} plan
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
