"use client";

interface StatsGridProps {
  compact?: boolean;
}

const stats = [
  { label: "ACTIVE", value: 6, color: "#4d9fff" },
  { label: "DONE", value: 3, color: "#39FF14" },
  { label: "IN PROGRESS", value: 4, color: "#ff9f0a" },
  { label: "OVERDUE", value: 1, color: "#ff453a" },
];

export default function StatsGrid({ compact = false }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl p-2.5 flex flex-col gap-0.5"
          style={{
            background: "rgba(20, 30, 48, 0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="font-bold"
            style={{ fontSize: compact ? 20 : 26, color: s.color, lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span className="text-[8px] font-semibold tracking-wide text-text-muted">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
