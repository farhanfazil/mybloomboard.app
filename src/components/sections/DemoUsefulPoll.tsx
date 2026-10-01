"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bloomboard-demo-useful";

/**
 * "Was this demo useful? Yes / No" under the live demo. Each answer is counted
 * anonymously through /api/demo-events (useful:yes / useful:no) and shows on
 * /demo-insights. One answer per browser, so the counts stay honest.
 */
export default function DemoUsefulPoll({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "yes" || saved === "no") setAnswer(saved);
    } catch {}
  }, []);

  const vote = (value: "yes" | "no") => {
    if (answer) return;
    setAnswer(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    void fetch("/api/demo-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: { [`useful:${value}`]: 1 } }),
      keepalive: true,
    }).catch(() => {});
  };

  const button = (value: "yes" | "no", label: string) => (
    <button
      type="button"
      onClick={() => vote(value)}
      aria-pressed={answer === value}
      disabled={!!answer}
      className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
        answer === value
          ? "border-white bg-white text-black"
          : answer ? "border-white/10 text-white/35" : "border-white/15 text-white/80 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${compact ? "" : "justify-center"} ${className}`}
      role="group"
      aria-label="Was this demo useful?"
    >
      <span className="text-sm text-white/60">{answer ? "Thanks for letting us know." : "Was this demo useful?"}</span>
      <div className="flex gap-2">
        {button("yes", "Yes")}
        {button("no", "No")}
      </div>
    </div>
  );
}
