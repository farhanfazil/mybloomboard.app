"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  LockKeyhole,
  TrendingDown,
} from "lucide-react";
import { PhaseTwoCard } from "@/components/webapp/PhaseTwoCard";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function WorkloadHealthWorkspace() {
  const { boards, reminders, syncStatus, tasks, workspaceName } = useWorkspace();
  const completedTasks = tasks.filter((task) => task.done).length;
  const openTasks = tasks.length - completedTasks;
  const highPriorityOpen = tasks.filter(
    (task) => !task.done && task.priority === "High",
  ).length;
  const pendingReminders = reminders.filter((reminder) => !reminder.completed).length;
  const completionRate = percent(completedTasks, tasks.length);
  const boardProgress = boards.length
    ? Math.round(
        boards.reduce((total, board) => total + board.progress, 0) / boards.length,
      )
    : 0;

  const signals = [
    {
      label: "Priority pressure",
      value: `${highPriorityOpen} tasks`,
      tone: highPriorityOpen > 0 ? "Watch" : "Clear",
      description:
        highPriorityOpen > 0
          ? "High-priority work is still open and may need a clearer next action."
          : "No open high-priority tasks are creating pressure right now.",
    },
    {
      label: "Reminder load",
      value: `${pendingReminders} pending`,
      tone: pendingReminders > 1 ? "Watch" : "Healthy",
      description:
        pendingReminders > 1
          ? "A few reminders are still waiting. Good moment to confirm ownership."
          : "Reminder load is light and easy to manage.",
    },
    {
      label: "Work momentum",
      value: `${completionRate}%`,
      tone: completionRate >= 65 ? "Strong" : completionRate >= 35 ? "Moving" : "Needs focus",
      description:
        completionRate >= 65
          ? "Completed work is outpacing open work in this workspace."
          : "Momentum is still forming. Prioritizing a small win will help.",
    },
    {
      label: "Board progress",
      value: `${boardProgress}% avg`,
      tone: boardProgress >= 70 ? "Healthy" : boardProgress >= 40 ? "Moving" : "Early",
      description:
        boardProgress >= 70
          ? "Boards are moving toward completion with strong progress."
          : "Several boards are still early and may need sequencing.",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.16),transparent_32%),linear-gradient(135deg,rgba(16,185,129,0.10),rgba(255,255,255,0.025))] p-6 sm:p-10 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
            Workload Health
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Private signals that help managers support people earlier.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/52">
            Workload Health turns {workspaceName} activity into supportive manager
            signals for workload balance, blocker risk, priority pressure, and healthier
            team conversations.
          </p>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-black/35 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-200">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Manager signal board</h3>
              <p className="text-sm text-white/45">Private to managers and owners</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{signal.label}</p>
                    <p className="mt-2 text-sm leading-5 text-white/45">
                      {signal.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-emerald-100">
                    {signal.value}
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  {signal.tone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <PhaseTwoCard
          title="Private by design"
          description="Only managers and owners can view team health signals, with clear role-based access."
          icon={LockKeyhole}
          accent="green"
        />
        <PhaseTwoCard
          title="Overload patterns"
          description="Detect dense overdue work, repeated delays, and workload spikes before they become team friction."
          icon={AlertTriangle}
          accent="amber"
        />
        <PhaseTwoCard
          title="Activity changes"
          description="Notice lower activity trends without turning individual work into public pressure."
          icon={TrendingDown}
          accent="violet"
        />
        <PhaseTwoCard
          title="Support actions"
          description="Convert signals into check-ins, workload adjustments, or clearer task priorities."
          icon={Activity}
          accent="blue"
        />
      </section>

      <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              Current workspace read
            </p>
            <h3 className="mt-2 text-2xl font-black">
              {openTasks} open tasks, {completedTasks} completed, {pendingReminders} reminders pending.
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {syncStatus === "local"
                ? "Local preview data is active. Sign in to connect private team workload signals to Supabase."
                : "Cloud workspace data is connected and ready for role-aware health checks."}
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            Supportive, not surveillance
          </div>
        </div>
      </section>
    </div>
  );
}
