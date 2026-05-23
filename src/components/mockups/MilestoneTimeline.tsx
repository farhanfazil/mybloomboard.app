"use client";

interface MilestoneTimelineProps {
  compact?: boolean;
}

const milestones = [
  { label: "Standup", status: "done" as const },
  { label: "Roadmap", status: "ongoing" as const },
  { label: "Design", status: "pending" as const },
];

export default function MilestoneTimeline({ compact = false }: MilestoneTimelineProps) {
  const completedCount = milestones.filter((m) => m.status === "done").length;
  const total = milestones.length;
  const progress = (completedCount / total) * 100;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(20, 30, 48, 0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-0.5">
            TODAY&apos;S PROGRESS
          </p>
          <p className={`font-bold text-text-primary ${compact ? "text-[12px]" : "text-[14px]"}`}>
            {total} Milestones Today
          </p>
        </div>
        <div className="text-right">
          <span className="text-accent-green font-bold text-[20px]">{completedCount}</span>
          <span className="text-text-muted text-[11px]"> / {total} tasks</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="rounded-full mb-4 overflow-hidden"
        style={{ height: 3, background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #39FF14, #4d9fff)",
          }}
        />
      </div>

      {/* Dot track */}
      <div className="flex items-center justify-around relative">
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
          style={{ height: 2, background: "rgba(255,255,255,0.06)" }}
        />
        {milestones.map((m, i) => (
          <div key={i} className="relative flex flex-col items-center gap-1.5 z-10">
            {/* Connector line */}
            {i < milestones.length - 1 && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2"
                style={{
                  width: compact ? 60 : 100,
                  height: 2,
                  background:
                    m.status === "done"
                      ? "linear-gradient(to right, #39FF14, #4d9fff)"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            )}
            <div
              className="flex items-center justify-center rounded-full font-bold transition-all"
              style={{
                width: compact ? 28 : 36,
                height: compact ? 28 : 36,
                background:
                  m.status === "done"
                    ? "rgba(57,255,20,0.2)"
                    : m.status === "ongoing"
                      ? "rgba(77,159,255,0.15)"
                      : "rgba(255,255,255,0.06)",
                border:
                  m.status === "done"
                    ? "2px solid #39FF14"
                    : m.status === "ongoing"
                      ? "2px solid #4d9fff"
                      : "2px solid rgba(255,255,255,0.15)",
                color:
                  m.status === "done"
                    ? "#39FF14"
                    : m.status === "ongoing"
                      ? "#4d9fff"
                      : "#607080",
                fontSize: compact ? 10 : 12,
                boxShadow:
                  m.status === "done"
                    ? "0 0 12px rgba(57,255,20,0.4)"
                    : m.status === "ongoing"
                      ? "0 0 12px rgba(77,159,255,0.5)"
                      : "none",
              }}
            >
              {m.status === "done" ? "✓" : m.status === "ongoing" ? "▶" : i + 1}
            </div>
            <span
              className="text-[9px] font-medium text-center"
              style={{
                color:
                  m.status === "done"
                    ? "#39FF14"
                    : m.status === "ongoing"
                      ? "#4d9fff"
                      : "#607080",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
