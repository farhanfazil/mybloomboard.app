"use client";

interface HydrationCardProps {
  compact?: boolean;
}

export default function HydrationCard({ compact = false }: HydrationCardProps) {
  const minutes = 43;
  const totalMinutes = 45;
  const progress = ((totalMinutes - minutes) / totalMinutes) * 100;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(20, 30, 48, 0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: "1px solid rgba(77,159,255,0.3)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "rgba(77,159,255,0.15)" }}
          >
            💧
          </div>
          <div>
            <p className="font-semibold text-text-primary text-[12px]">Stay Hydrated</p>
            <p className="text-[9px] text-text-muted">
              Next reminder in{" "}
              <span className="text-accent-blue font-medium">{minutes} min</span>
            </p>
          </div>
        </div>
        {!compact && (
          <button
            className="text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              background: "rgba(77,159,255,0.15)",
              color: "#4d9fff",
              border: "1px solid rgba(77,159,255,0.25)",
            }}
          >
            Snooze
          </button>
        )}
      </div>

      {/* Timer ring progress */}
      <div className="mt-3 flex items-center gap-3">
        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
          <svg width="40" height="40" className="-rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#4d9fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
              style={{ filter: "drop-shadow(0 0 4px rgba(77,159,255,0.6))" }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-accent-blue"
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: 3, background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #4d9fff, #74b9ff)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
