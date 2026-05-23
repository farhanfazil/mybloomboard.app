"use client";

interface EventsPanelProps {
  compact?: boolean;
}

const events = [
  {
    label: "Marketing meeting",
    date: "May 19",
    countdown: "in 3d",
    type: "meeting" as const,
  },
  {
    label: "Annual leave",
    date: "May 27 – 31",
    countdown: "in 11d",
    type: "leave" as const,
  },
];

export default function EventsPanel({ compact = false }: EventsPanelProps) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background: "rgba(20, 30, 48, 0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">
          UPCOMING
        </p>
        {!compact && (
          <button
            className="text-[9px] px-2 py-0.5 rounded-lg font-medium"
            style={{
              background: "rgba(77,159,255,0.15)",
              color: "#4d9fff",
              border: "1px solid rgba(77,159,255,0.2)",
            }}
          >
            + Add
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-2 group"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: ev.type === "meeting" ? "#4d9fff" : "#a78bfa",
                boxShadow: `0 0 6px ${ev.type === "meeting" ? "rgba(77,159,255,0.6)" : "rgba(167,139,250,0.5)"}`,
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-text-primary truncate">
                {ev.label}
              </p>
              <p className="text-[9px] text-text-muted">
                {ev.date} ·{" "}
                <span
                  style={{
                    color: ev.type === "meeting" ? "#4d9fff" : "#a78bfa",
                  }}
                >
                  {ev.countdown}
                </span>
              </p>
            </div>
            {!compact && (
              <button className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all text-[10px]">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
