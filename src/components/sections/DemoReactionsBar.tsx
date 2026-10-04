"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEMO_REACTIONS,
  DEMO_REACTION_STORAGE_KEY,
  EMPTY_DEMO_REACTION_COUNTS,
  isDemoReactionId,
  type DemoReactionCounts,
  type DemoReactionId,
} from "@/lib/demo-reactions";

type DemoReactionsBarProps = {
  className?: string;
};

const POLL_MS = 20_000;

/** Whole percentages that always add up to 100 (largest remainder). */
function shares(counts: DemoReactionCounts): Record<DemoReactionId, number> {
  const ids = DEMO_REACTIONS.map((r) => r.id);
  const total = ids.reduce((s, id) => s + counts[id], 0);
  const out = { ...EMPTY_DEMO_REACTION_COUNTS };
  if (!total) return out;
  const raw = ids.map((id) => ({ id, v: (counts[id] / total) * 100 }));
  raw.forEach((r) => (out[r.id] = Math.floor(r.v)));
  let left = 100 - ids.reduce((s, id) => s + out[id], 0);
  raw.sort((a, b) => (b.v % 1) - (a.v % 1)).forEach((r) => {
    if (left > 0 && counts[r.id] > 0) { out[r.id] += 1; left -= 1; }
  });
  return out;
}

/* Mac Dock magnification: the hovered picture grows most, its neighbours a
   little, the rest stay put. */
function dockScale(i: number, hover: number | null) {
  if (hover === null) return 1;
  const d = Math.abs(i - hover);
  return d === 0 ? 1.45 : d === 1 ? 1.18 : 1;
}

/**
 * "How does it feel?" under the live demo. Small transparent pictures that
 * magnify like the Mac Dock; the word shows on hover. One tap per visitor;
 * afterwards one compact line shows how everyone answered as percentages.
 * Real taps only, and no totals, so it reads the same with ten visitors as
 * with ten thousand.
 */
export default function DemoReactionsBar({ className }: DemoReactionsBarProps) {
  const [counts, setCounts] = useState<DemoReactionCounts>(EMPTY_DEMO_REACTION_COUNTS);
  const [votedId, setVotedId] = useState<DemoReactionId | null>(null);
  const [pendingId, setPendingId] = useState<DemoReactionId | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/demo-reactions", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { counts?: DemoReactionCounts };
      if (data.counts) setCounts({ ...EMPTY_DEMO_REACTION_COUNTS, ...data.counts });
    } catch {
      // ignore network errors; the bar stays usable
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEMO_REACTION_STORAGE_KEY);
      if (stored && isDemoReactionId(stored)) setVotedId(stored);
    } catch {}
    void loadCounts();
    const timer = window.setInterval(() => void loadCounts(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadCounts]);

  const handleReact = async (id: DemoReactionId) => {
    if (votedId || pendingId) return;
    setPendingId(id);
    setCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    try {
      const res = await fetch("/api/demo-reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emojiId: id }),
      });
      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { counts?: DemoReactionCounts };
      if (data.counts) setCounts({ ...EMPTY_DEMO_REACTION_COUNTS, ...data.counts });
      try { localStorage.setItem(DEMO_REACTION_STORAGE_KEY, id); } catch {}
      setVotedId(id);
      setHover(null);
    } catch {
      setCounts((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
    } finally {
      setPendingId(null);
    }
  };

  const pct = shares(counts);
  const mine = DEMO_REACTIONS.find((r) => r.id === votedId);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-xs font-medium text-white/60">
        {mine ? <>Thanks! You said <span className="font-semibold text-white/90">{mine.label}</span>. Here&apos;s how others feel:</> : "How does it feel?"}
      </p>

      {!votedId ? (
        <div className="mt-3 flex items-end gap-1" onMouseLeave={() => setHover(null)}>
          {DEMO_REACTIONS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={r.label}
              disabled={Boolean(pendingId)}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => void handleReact(r.id)}
              className="group relative flex h-11 w-11 items-end justify-center rounded-lg bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {/* The word, like a Dock label */}
              <span
                className={cn(
                  "pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 px-1.5 py-0.5 text-[10.5px] font-semibold text-black transition-opacity duration-150",
                  hover === i ? "opacity-100" : "opacity-0",
                )}
              >
                {r.label}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.img}
                alt=""
                width={28}
                height={28}
                className={cn("mb-1.5 h-7 w-7 origin-bottom transition-transform duration-150 ease-out", pendingId === r.id ? "opacity-60" : "")}
                style={{ transform: `scale(${dockScale(i, hover)})` }}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5">
          {DEMO_REACTIONS.map((r) => (
            <span
              key={r.id}
              title={r.label}
              className={cn("inline-flex items-center gap-1 text-xs tabular-nums", r.id === votedId ? "font-semibold text-white" : "text-white/55")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt="" width={18} height={18} className={cn("h-[18px] w-[18px]", r.id === votedId ? "" : "opacity-80")} />
              <span className="sr-only">{r.label}</span>
              {pct[r.id]}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
