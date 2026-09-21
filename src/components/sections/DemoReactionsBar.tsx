"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEMO_REACTIONS,
  DEMO_REACTION_STORAGE_KEY,
  EMPTY_DEMO_REACTION_COUNTS,
  type DemoReactionCounts,
  type DemoReactionId,
} from "@/lib/demo-reactions";

type DemoReactionsBarProps = {
  className?: string;
};

type FloatingEmoji = {
  id: number;
  emoji: string;
  x: number;
  delay: number;
};

const POLL_MS = 20_000;

export default function DemoReactionsBar({ className }: DemoReactionsBarProps) {
  const [counts, setCounts] = useState<DemoReactionCounts>(EMPTY_DEMO_REACTION_COUNTS);
  const [votedId, setVotedId] = useState<DemoReactionId | null>(null);
  const [pendingId, setPendingId] = useState<DemoReactionId | null>(null);
  const [floaters, setFloaters] = useState<FloatingEmoji[]>([]);
  const floaterIdRef = useRef(0);

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/demo-reactions", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { counts?: DemoReactionCounts };
      if (data.counts) setCounts(data.counts);
    } catch {
      // ignore network errors — bar stays interactive
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_REACTION_STORAGE_KEY);
    if (stored) setVotedId(stored as DemoReactionId);

    void loadCounts();
    const timer = window.setInterval(() => void loadCounts(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadCounts]);

  // On mount: continuously spawn floating emojis for 20 seconds
  useEffect(() => {
    const emojis = DEMO_REACTIONS.map((r) => r.emoji);
    const timers: ReturnType<typeof setTimeout>[] = [];

    const spawn = () => {
      const floater: FloatingEmoji = {
        id: floaterIdRef.current++,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: 10 + Math.random() * 80,
        delay: 0,
      };
      setFloaters((prev) => [...prev, floater]);
      // remove it after its animation completes
      const remove = setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== floater.id));
      }, 2200);
      timers.push(remove);
    };

    // spawn every 400ms for 20 seconds = ~50 emojis total
    const interval = window.setInterval(spawn, 400);
    const stop = setTimeout(() => {
      clearInterval(interval);
    }, 20_000);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleReact = async (emojiId: DemoReactionId) => {
    if (votedId || pendingId) return;

    setPendingId(emojiId);
    setCounts((prev) => ({ ...prev, [emojiId]: prev[emojiId] + 1 }));

    try {
      const res = await fetch("/api/demo-reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emojiId }),
      });

      if (res.ok) {
        const data = (await res.json()) as { counts?: DemoReactionCounts };
        if (data.counts) setCounts(data.counts);
        localStorage.setItem(DEMO_REACTION_STORAGE_KEY, emojiId);
        setVotedId(emojiId);
      } else {
        setCounts((prev) => ({ ...prev, [emojiId]: Math.max(0, prev[emojiId] - 1) }));
      }
    } catch {
      setCounts((prev) => ({ ...prev, [emojiId]: Math.max(0, prev[emojiId] - 1) }));
    } finally {
      setPendingId(null);
    }
  };

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        {/* Floating emoji burst on load */}
        {floaters.map((f) => (
          <span
            key={f.id}
            aria-hidden
            className="pointer-events-none absolute bottom-full text-2xl"
            style={{
              left: `${f.x}%`,
              animationDelay: `${f.delay}ms`,
              animation: "floatUp 2s ease-out forwards",
            }}
          >
            {f.emoji}
          </span>
        ))}

        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0) scale(0.7); opacity: 0.9; }
            60%  { opacity: 0.6; }
            100% { transform: translateY(-90px) scale(0.5); opacity: 0; }
          }
        `}</style>

        <div
          className={cn(
            "z-10 flex items-center justify-start gap-1 rounded-xl p-1.5 text-lg",
          )}
          style={{
            background: "#0e141b",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {DEMO_REACTIONS.map((reaction) => {
            const isSelected = votedId === reaction.id;
            const isPending = pendingId === reaction.id;

            return (
              <button
                key={reaction.id}
                type="button"
                disabled={Boolean(votedId) || Boolean(pendingId)}
                aria-label={`${reaction.label} reaction (${counts[reaction.id]} total)`}
                aria-pressed={isSelected}
                onClick={() => void handleReact(reaction.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col items-center rounded-lg px-3 py-1.5 transition-colors duration-150 hover:bg-white/[0.07]",
                  "before:absolute before:-top-7 before:hidden before:h-4 before:rounded-lg before:bg-white/90 before:px-1 before:text-[.6rem] before:text-black",
                  "before:content-[attr(data-label)] hover:before:flex hover:before:items-center hover:before:justify-center",
                  (votedId && !isSelected) || isPending ? "pointer-events-none opacity-50" : "",
                )}
                style={isSelected ? { background: "rgba(18,62,90,0.55)", boxShadow: "inset 0 0 0 1px rgba(120,170,200,0.45)" } : undefined}
                data-label={reaction.label}
              >
                <span aria-hidden className="leading-none">
                  {reaction.emoji}
                </span>
                {counts[reaction.id] > 0 && (
                  <span className="mt-0.5 text-[9px] font-semibold leading-none" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {counts[reaction.id].toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-white/45">
        {total > 0 ? (
          <>
            <span className="text-white/70">{total.toLocaleString()}</span> reactions from visitors
          </>
        ) : (
          "Be the first to react to the live demo"
        )}
      </p>
    </div>
  );
}
