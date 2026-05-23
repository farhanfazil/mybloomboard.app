import TaskCard from "./TaskCard";

interface TaskListProps {
  size?: "sm" | "md";
}

export default function TaskList({ size = "md" }: TaskListProps) {
  return (
    <div className="flex flex-col gap-2">
      <TaskCard
        title="Q2 Product Roadmap"
        description="Finalize feature priorities with PM team"
        priority="high"
        status="ongoing"
        dueLabel="Due today"
        project="📺 stc tv"
        projectColor="#4d9fff"
        moodTag="🧠 Deep Work"
        size={size}
      />
      <TaskCard
        title="Design system tokens"
        description="Export spacing and color variables to Figma"
        priority="medium"
        status="pending"
        dueLabel="Due today"
        project="📡 Jawwy TV"
        projectColor="#a78bfa"
        moodTag="🎨 Creative"
        size={size}
      />
      <TaskCard
        title="Weekly standup notes"
        description="Send summary to the team"
        priority="low"
        status="done"
        dueLabel="Due today"
        project="🌱 Personal"
        projectColor="#39FF14"
        moodTag="📞 Comms"
        size={size}
      />
    </div>
  );
}
