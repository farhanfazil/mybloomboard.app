"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { IOS_APP_STORE_URL, useDevice } from "@/lib/downloads";

/**
 * Phones get this instead of the live demo: the desktop app is unusable at this
 * size, so BloomBoard "texts" the visitor and they answer with a tap. The main
 * reply opens the App Store once IOS_APP_STORE_URL is set (src/lib/downloads.ts);
 * until then, and on Android, it sends them the link for their computer.
 */

/* Flip on once the iPhone app has "Explore the demo" on its sign-in screen. */
const IOS_APP_HAS_DEMO = false;

type Msg = { from: "bloom" | "you"; text: string };
type Reply = { key: "app_store" | "send_link"; label: string; primary: boolean };

function script(os: string): { messages: string[]; replies: Reply[] } {
  const hello = "Hey, looks like you're on your phone 👋";
  const honest =
    "Honest moment: our live demo is the full desktop app. On this screen it's like reading a map through a keyhole. You'd pinch, squint and give up, and we'd rather you didn't.";
  const sendLink: Reply = { key: "send_link", label: "Send me the link", primary: true };

  if (os === "iphone" && IOS_APP_STORE_URL) {
    return {
      messages: [
        hello,
        honest,
        "So we made BloomBoard for iPhone, built for exactly this screen. Your tasks, team chat and calls, right in your pocket.",
        IOS_APP_HAS_DEMO
          ? "Open it and tap Explore the demo. No account, no card, just a real team to play with."
          : "It's free to download, and getting a feel for it takes about a minute.",
      ],
      replies: [
        { key: "app_store", label: "Okay, get me the app", primary: true },
        { key: "send_link", label: "I'll try it on my computer", primary: false },
      ],
    };
  }
  if (os === "android") {
    return {
      messages: [
        hello,
        honest,
        "There's no Android app yet, so your computer is the best place to try it. Send yourself the link and it'll be waiting for you. No sign-up needed.",
      ],
      replies: [sendLink],
    };
  }
  return {
    messages: [
      hello,
      honest,
      "The iPhone app is almost ready. Until then, send yourself the link and try the demo on your Mac or PC. No sign-up needed.",
    ],
    replies: [sendLink],
  };
}

function track(name: string) {
  try {
    fetch("/api/demo-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: { [`mobile:${name}`]: 1 } }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M16.37 12.63c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.63 1.11 8.8.73 1.06 1.6 2.25 2.75 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.33-3.56zM14.18 6.16c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.59-2.57 1.32-.56.65-1.06 1.69-.93 2.69.98.08 1.98-.5 2.59-1.23z" />
    </svg>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2">
      <span className="h-7 w-7 shrink-0" aria-hidden />
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-3" aria-label="BloomBoard is typing">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhoneDemoPitch() {
  const { os } = useDevice();
  const { messages, replies } = script(os);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [thread, setThread] = useState<Msg[]>([]);
  const [done, setDone] = useState(false);

  /* Messages arrive one at a time, each after a short "typing…". */
  useEffect(() => {
    if (!inView) return;
    track("shown");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(messages.length);
      return;
    }
    const timers: number[] = [];
    let at = 300;
    messages.forEach((m, i) => {
      timers.push(window.setTimeout(() => setTyping(true), at));
      at += Math.min(1500, 500 + m.length * 9);
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, at),
      );
      at += 350;
    });
    return () => timers.forEach(clearTimeout);
    // The script only changes once, when the device is detected after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, messages.length]);

  const say = (text: string, answer: string) => {
    setThread([{ from: "you", text }]);
    setDone(true);
    window.setTimeout(() => setThread((t) => [...t, { from: "bloom", text: answer }]), 900);
  };

  const onReply = async (reply: Reply) => {
    track(reply.key);
    if (reply.key === "app_store") {
      say(reply.label, "See you in there. It opens right where you left off.");
      window.open(IOS_APP_STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    const url = `${window.location.origin}/?utm_source=mobile_share#live-demo`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "BloomBoard live demo", text: "Try the BloomBoard demo on my computer", url });
        say(reply.label, "Sent. See you on the big screen.");
        return;
      } catch (err) {
        /* They closed the share sheet: leave the choices where they are. */
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      say(reply.label, "Link copied. Paste it somewhere you'll see it on your computer, like a note or an email to yourself.");
    } catch {
      say(reply.label, `Here it is: ${window.location.host}. Open it on your Mac or PC and the demo is right there.`);
    }
  };

  const allIn = shown >= messages.length;

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[#0b0b0d] p-4">
      <div className="mb-4 flex items-center gap-2.5 border-b border-white/[0.08] pb-3">
        <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 rounded-lg" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">BloomBoard</p>
          <p className="text-xs text-white/55">{typing ? "typing…" : "Online"}</p>
        </div>
      </div>

      <div className="space-y-2" aria-live="polite">
        {messages.slice(0, shown).map((text, i) => (
          <div key={i} className="flex items-end gap-2 motion-safe:animate-[bbMsgIn_.25s_ease-out]">
            {i === shown - 1 || (typing && i === shown - 1) ? (
              <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 rounded-full" />
            ) : (
              <span className="h-7 w-7 shrink-0" aria-hidden />
            )}
            <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-[15px] leading-snug text-white">
              {text}
            </p>
          </div>
        ))}
        {typing ? <Typing /> : null}

        {thread.map((m, i) =>
          m.from === "you" ? (
            <div key={`t${i}`} className="flex justify-end motion-safe:animate-[bbMsgIn_.25s_ease-out]">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-[15px] leading-snug text-black">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={`t${i}`} className="flex items-end gap-2 motion-safe:animate-[bbMsgIn_.25s_ease-out]">
              <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 rounded-full" />
              <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-[15px] leading-snug text-white">
                {m.text}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Their answer: tap a reply, like in a chat. */}
      {allIn && !done ? (
        <div className="mt-4 flex flex-col items-end gap-2 motion-safe:animate-[bbMsgIn_.3s_ease-out]">
          {replies.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => onReply(r)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                r.primary
                  ? "bg-white text-black hover:bg-white/90"
                  : "border border-white/25 text-white hover:bg-white/10"
              }`}
            >
              {r.key === "app_store" ? <AppleIcon /> : null}
              {r.label}
            </button>
          ))}
        </div>
      ) : null}

      <style>{`@keyframes bbMsgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
