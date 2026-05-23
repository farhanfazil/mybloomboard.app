import TaskCard from "./TaskCard";

const projects = [
  {
    name: "📺 stc tv / U21",
    color: "#4d9fff",
    tasks: [
      {
        title: "Q2 Product Roadmap",
        description: "Finalize feature priorities with PM",
        priority: "high" as const,
        status: "ongoing" as const,
        dueLabel: "Due today",
        moodTag: "🧠 Deep Work",
      },
    ],
  },
  {
    name: "📡 Jawwy TV",
    color: "#a78bfa",
    tasks: [
      {
        title: "Design system tokens",
        description: "Export spacing and color variables",
        priority: "medium" as const,
        status: "pending" as const,
        dueLabel: "May 20",
        moodTag: "🎨 Creative",
      },
    ],
  },
  {
    name: "🌱 Personal",
    color: "#39FF14",
    tasks: [
      {
        title: "Weekly standup notes",
        description: "Send summary to the team",
        priority: "low" as const,
        status: "done" as const,
        dueLabel: "Due today",
        moodTag: "📞 Comms",
      },
    ],
  },
];

export default function ProjectGroup() {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((proj) => (
        <div key={proj.name}>
          <div
            className="flex items-center gap-2 mb-2 px-1"
          >
            <div
              className="w-1 h-4 rounded-full"
              style={{ background: proj.color }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: proj.color }}
            >
              {proj.name}
            </span>
            <span className="text-[9px] text-text-muted ml-1">
              {proj.tasks.length} task
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {proj.tasks.map((t, i) => (
              <TaskCard
                key={i}
                title={t.title}
                description={t.description}
                priority={t.priority}
                status={t.status}
                dueLabel={t.dueLabel}
                project={proj.name}
                projectColor={proj.color}
                moodTag={t.moodTag}
                size="sm"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
