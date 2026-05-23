"use client";

interface StreakCardProps {
  compact?: boolean;
}

export default function StreakCard({ compact = false }: StreakCardProps) {
  const streak = 7;
  const nextMilestone = 14;
  const progress = (streak / nextMilestone) * 100;
  const badges = [
    { label: "🥉 3d", earned: true },
    { label: "🥈 7d", earned: true },
    { label: "🥇 14d", earned: false },
    { label: "🏆 30d", earned: false },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(20, 30, 48, 0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: "1px solid rgba(255,159,10,0.3)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="font-bold text-accent-orange"
                style={{ fontSize: compact ? 24 : 32 }}
              >
                {streak}
              </span>
              <span className="text-text-muted text-[11px]">day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] text-text-muted">{streak} days</span>
          <span className="text-[9px] text-text-muted">{nextMilestone} days</span>
        </div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 4, background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #ff9f0a, #ffcc50)",
              boxShadow: "0 0 8px rgba(255,159,10,0.6)",
            }}
          />
        </div>
        <p className="text-[9px] text-text-muted mt-1">
          {nextMilestone - streak} days to 🥇 {nextMilestone}-day badge
        </p>
      </div>

      {/* Badges */}
      {!compact && (
        <div className="flex gap-1.5 flex-wrap mt-3">
          {badges.map((b, i) => (
            <span
              key={i}
              className="text-[9px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: b.earned
                  ? "rgba(255,159,10,0.2)"
                  : "rgba(255,255,255,0.05)",
                color: b.earned ? "#ff9f0a" : "#607080",
                border: `1px solid ${b.earned ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
