"use client";

import { useEffect, useRef, useState } from "react";
import DemoReactionsBar from "@/components/sections/DemoReactionsBar";

const APP_W = 1280;
const APP_H = 920;
const TITLE_BAR_H = 40;

type LiveDemoFrameProps = {
  /** Show only the top slice of the window (hero peek) */
  peek?: boolean;
  peekHeight?: number;
  className?: string;
  eager?: boolean;
};

export default function LiveDemoFrame({
  peek = false,
  peekHeight = 260,
  className = "",
  eager = false,
}: LiveDemoFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);
  const [iframeReady, setIframeReady] = useState(eager);

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

  const viewportH = peek ? peekHeight - TITLE_BAR_H : Math.ceil(APP_H * scale);

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
  }, [iframeReady]);

  return (
    <div className={className}>
      <DemoReactionsBar className="mb-4" />
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(77,159,255,0.14)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4"
          style={{
            height: TITLE_BAR_H,
            background: "rgba(10, 18, 30, 0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="mx-auto text-[11px] font-medium text-white/45">BloomBoard — Live Demo</span>
          <span className="w-[52px]" aria-hidden />
        </div>

        <div
          ref={frameRef}
          className="relative w-full overflow-hidden bg-[#0a1520]"
          style={{ height: viewportH }}
        >
          {!iframeReady ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-white/40">
              Loading interactive demo…
            </div>
          ) : (
            <iframe
              title="BloomBoard interactive demo"
              src="/bloomboard-demo/index.html?embed=home&v=29"
              className="absolute left-0 top-0 border-0 bg-[#0a1520]"
              style={{
                width: APP_W,
                height: APP_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              allow="clipboard-write"
            />
          )}
        </div>
      </div>
    </div>
  );
}
