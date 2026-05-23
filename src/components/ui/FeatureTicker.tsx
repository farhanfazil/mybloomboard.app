"use client";

import { TICKER_ITEMS } from "@/lib/constants";

export default function FeatureTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden py-5 border-y border-white/5 bg-white/[0.02] ticker-mask">
      <div
        className="flex gap-6 whitespace-nowrap animate-ticker"
        style={{ width: "max-content" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass-sm text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
