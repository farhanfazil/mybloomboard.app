"use client";

import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";

type Frame = { id: number; shown: boolean };

export type DemoState = { ws: string; data: string; options: string[] };
export type DemoCommand = { ws?: string; data?: string };

type DemoIframeProps = {
  src: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  /** The demo reports its plan and data mode (when the site shows the controls). */
  onState?: (state: DemoState) => void;
  /** Filled in with a function that sends a command to the demo on screen. */
  commandRef?: MutableRefObject<((cmd: DemoCommand) => void) | null>;
};

const FADE_MS = 220;
/* If the new version never says it is ready, show it anyway. */
const READY_TIMEOUT_MS = 7000;

/**
 * The live demo in a frame that switches without a blank screen. When the visitor
 * changes plan or data, the demo (public/bloomboard-demo/demo-boot.js) asks for a
 * swap: the new version loads out of sight under the current one and fades in once
 * it has drawn, then the old one is removed.
 */
export default function DemoIframe({ src, title, className = "", style, onState, commandRef }: DemoIframeProps) {
  const [frames, setFrames] = useState<Frame[]>([{ id: 0, shown: true }]);
  const refs = useRef(new Map<number, HTMLIFrameElement>());
  const nextId = useRef(1);
  const onStateRef = useRef(onState);
  onStateRef.current = onState;

  useEffect(() => {
    if (!commandRef) return;
    commandRef.current = (cmd) => {
      /* the newest frame is the one on screen */
      let top: HTMLIFrameElement | null = null, topId = -1;
      refs.current.forEach((el, id) => { if (id > topId) { topId = id; top = el; } });
      (top as HTMLIFrameElement | null)?.contentWindow?.postMessage({ type: "bb-demo-cmd", ...cmd }, window.location.origin);
    };
    return () => { commandRef.current = null; };
  }, [commandRef]);

  useEffect(() => {
    const idOf = (source: MessageEventSource | null) => {
      let found: number | null = null;
      refs.current.forEach((el, id) => {
        if (el.contentWindow === source) found = id;
      });
      return found;
    };

    const reveal = (id: number) => {
      setFrames((list) => (list.some((f) => f.id === id && !f.shown) ? list.map((f) => (f.id === id ? { ...f, shown: true } : f)) : list));
      window.setTimeout(() => setFrames((list) => list.filter((f) => f.id >= id)), FADE_MS + 60);
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data) return;
      const id = idOf(e.source);
      if (id === null) return;
      if (e.data.type === "bb-demo-switch") {
        const newId = nextId.current++;
        setFrames((list) => [...list.filter((f) => f.shown), { id: newId, shown: false }]);
        window.setTimeout(() => reveal(newId), READY_TIMEOUT_MS);
      } else if (e.data.type === "bb-demo-ready") {
        reveal(id);
      } else if (e.data.type === "bb-demo-state") {
        onStateRef.current?.({ ws: String(e.data.ws), data: String(e.data.data), options: Array.isArray(e.data.options) ? e.data.options : [] });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className={`relative ${className}`} style={style}>
      {frames.map((f) => (
        <iframe
          key={f.id}
          ref={(el) => {
            if (el) refs.current.set(f.id, el);
            else refs.current.delete(f.id);
          }}
          title={title}
          src={src}
          onLoad={(e) => e.currentTarget.contentWindow?.postMessage({ type: "bb-demo-host" }, window.location.origin)}
          aria-hidden={!f.shown}
          tabIndex={f.shown ? undefined : -1}
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          style={{
            opacity: f.shown ? 1 : 0,
            pointerEvents: f.shown ? "auto" : "none",
            transition: `opacity ${FADE_MS}ms ease`,
            zIndex: f.id,
          }}
          allow="clipboard-write"
        />
      ))}
    </div>
  );
}
