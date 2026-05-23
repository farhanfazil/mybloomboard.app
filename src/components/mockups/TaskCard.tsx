"use client";

interface TaskCardProps {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "ongoing" | "done";
  dueLabel: string;
  project: string;
  projectColor: string;
  moodTag?: string;
  size?: "sm" | "md";
}

const priorityConfig = {
  high: { label: "High", color: "#ff453a", dot: "🔴" },
  medium: { label: "Medium", color: "#ff9f0a", dot: "🟡" },
  low: { label: "Low", color: "#39FF14", dot: "🟢" },
};

const statusConfig = {
  pending: { icon: "○", color: "#607080" },
  ongoing: { icon: "▶", color: "#4d9fff" },
  done: { icon: "✓", color: "#39FF14" },
};

export default function TaskCard({
  title,
  description,
  priority,
  status,
  dueLabel,
  project,
  projectColor,
  moodTag,
  size = "md",
}: TaskCardProps) {
  const p = priorityConfig[priority];
  const s = statusConfig[status];
  const isDone = status === "done";
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";
  const titleSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div
      className={`relative rounded-xl overflow-hidden ${isDone ? "opacity-70" : ""}`}
      style={{
        background: "rgba(20, 30, 48, 0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${projectColor}`,
      }}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <button
              className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all"
              style={{
                borderColor: s.color,
                color: s.color,
                background: isDone ? `${s.color}20` : "transparent",
              }}
            >
              {s.icon}
            </button>
            <span
              className={`font-semibold truncate ${titleSize} ${isDone ? "line-through text-text-muted" : "text-text-primary"}`}
            >
              {title}
            </span>
          </div>
          <span
            className={`flex-shrink-0 flex items-center gap-1 ${textSize} font-medium px-1.5 py-0.5 rounded-md`}
            style={{ background: `${p.color}20`, color: p.color }}
          >
            {p.dot} {p.label}
          </span>
        </div>
        <p className={`${textSize} text-text-muted mb-2 pl-6 truncate`}>
          {description}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap pl-6">
          <span
            className={`${textSize} px-1.5 py-0.5 rounded-md`}
            style={{ background: "rgba(255,255,255,0.06)", color: "#607080" }}
          >
            📅 {dueLabel}
          </span>
          <span
            className={`${textSize} px-1.5 py-0.5 rounded-md font-medium`}
            style={{ background: `${projectColor}25`, color: projectColor }}
          >
            {project}
          </span>
          {moodTag && (
            <span
              className={`${textSize} px-1.5 py-0.5 rounded-md`}
              style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}
            >
              {moodTag}
            </span>
          )}
          {status === "ongoing" && (
            <span
              className={`${textSize} px-1.5 py-0.5 rounded-md`}
              style={{ background: "rgba(77,159,255,0.15)", color: "#4d9fff" }}
            >
              ▶ Ongoing
            </span>
          )}
          {status === "done" && (
            <span
              className={`${textSize} px-1.5 py-0.5 rounded-md`}
              style={{ background: "rgba(57,255,20,0.15)", color: "#39FF14" }}
            >
              ✓ Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
