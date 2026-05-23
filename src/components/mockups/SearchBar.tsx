"use client";

interface SearchBarProps {
  compact?: boolean;
}

const filters = ["All", "Pending", "Ongoing", "Done", "High Priority"];

export default function SearchBar({ compact = false }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Search input */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#607080" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-[11px] text-text-muted">Search tasks by keyword...</span>
      </div>

      {/* Filter tabs */}
      {!compact && (
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f, i) => (
            <button
              key={f}
              className="text-[9px] px-2.5 py-1 rounded-full font-medium transition-all"
              style={
                i === 0
                  ? {
                      background: "#4d9fff",
                      color: "white",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "#607080",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }
              }
            >
              {f === "Ongoing" ? "⏸ " : f === "Done" ? "✓ " : f === "High Priority" ? "🔴 " : ""}
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
