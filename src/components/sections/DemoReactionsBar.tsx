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

  // On mount: fire a staggered burst of floating emojis
  useEffect(() => {
    const emojis = DEMO_REACTIONS.map((r) => r.emoji);
    const burst: FloatingEmoji[] = [];

    for (let i = 0; i < 6; i++) {
      burst.push({
        id: floaterIdRef.current++,
        emoji: emojis[i % emojis.length],
        x: 20 + Math.random() * 60, // spread across 20–80% width
        delay: i * 180,
      });
    }

    setFloaters(burst);
    const cleanup = setTimeout(() => setFloaters([]), 2400);
    return () => clearTimeout(cleanup);
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
            className="pointer-events-none absolute bottom-full text-sm"
            style={{
              left: `${f.x}%`,
              animationDelay: `${f.delay}ms`,
              animation: "floatUp 1.6s ease-out forwards",
            }}
          >
            {f.emoji}
          </span>
        ))}

        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0) scale(0.7); opacity: 0.9; }
            60%  { opacity: 0.6; }
            100% { transform: translateY(-52px) scale(0.4); opacity: 0; }
          }
        `}</style>

        <div
          className={cn(
            "z-10 flex items-center justify-start gap-2 rounded-full p-2 text-lg",
            "transition-all duration-300 hover:scale-x-105",
          )}
          style={{
            background: "linear-gradient(135deg, rgba(10,30,80,0.72) 0%, rgba(20,60,140,0.55) 50%, rgba(10,30,80,0.72) 100%)",
            border: "1px solid rgba(77,159,255,0.35)",
            boxShadow: "0 8px 32px rgba(30,80,255,0.18), inset 0 1px 0 rgba(147,197,253,0.2), inset 0 -1px 0 rgba(30,80,255,0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
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
                  "group relative flex cursor-pointer flex-col items-center rounded-full px-3 py-2 transition-all duration-300",
                  "before:absolute before:-top-7 before:hidden before:h-4 before:rounded-lg before:bg-white/90 before:px-1 before:text-[.6rem] before:text-black",
                  "before:content-[attr(data-label)] hover:before:flex hover:before:items-center hover:before:justify-center",
                  "hover:scale-125",
                  (votedId && !isSelected) || isPending ? "pointer-events-none opacity-50" : "",
                )}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(77,159,255,0.35), rgba(30,80,255,0.25))"
                    : "linear-gradient(135deg, rgba(77,159,255,0.12), rgba(30,80,255,0.08))",
                  border: isSelected
                    ? "1px solid rgba(77,159,255,0.6)"
                    : "1px solid rgba(77,159,255,0.2)",
                  boxShadow: isSelected
                    ? "0 0 16px rgba(77,159,255,0.3), inset 0 1px 0 rgba(147,197,253,0.25)"
                    : "inset 0 1px 0 rgba(147,197,253,0.1)",
                }}
                data-label={reaction.label}
              >
                <span aria-hidden className="leading-none">
                  {reaction.emoji}
                </span>
                {counts[reaction.id] > 0 && (
                  <span className="mt-0.5 text-[9px] font-semibold leading-none" style={{ color: "rgba(147,197,253,0.7)" }}>
                    {counts[reaction.id].toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] font-medium tracking-wide text-white/40">
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
