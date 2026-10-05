"use client";

import { useEffect, useRef, useState } from "react";
import DemoIframe, { type DemoCommand, type DemoState } from "@/components/sections/DemoIframe";
import DemoReactionsBar from "@/components/sections/DemoReactionsBar";
import DemoUsefulPoll from "@/components/sections/DemoUsefulPoll";
import PhoneDemoPitch from "@/components/sections/PhoneDemoPitch";
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
        <DemoReactionsBar className="mb-4" />
        <PhoneDemoPitch />
      </div>
    );
  }

  return (
    <div className={className}>
      <DemoReactionsBar className="bb-demo-reacts mb-4" />
      {/* the bar and the window together: the home page snaps to this (SnapPoints) */}
      <div data-snap="demo">
      {!peek && <DemoControls demo={demo} pending={pending} send={send} />}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div
          ref={frameRef}
          className="relative w-full overflow-hidden bg-[#171717]"
          style={{ height: viewportH }}
        >
          {!iframeReady || phone !== false ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-white/40">
              Loading interactive demo…
            </div>
          ) : (
            <DemoIframe
              title="BloomBoard interactive demo"
              src={`/bloomboard-demo/index.html?embed=home&ws=${workspaces}&v=34`}
              className="!absolute left-0 top-0 bg-[#171717]"
              onState={onState}
              commandRef={commandRef}
              style={{
                width: APP_W,
                height: APP_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          )}
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
