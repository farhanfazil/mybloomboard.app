"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";
import { PhaseTwoCard } from "@/components/webapp/PhaseTwoCard";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function ReportsWorkspace() {
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

  const rows = [
    {
      name: "Tasks",
      completed: `${completedTasks} completed`,
      risk: `${openTasks} open`,
      health: completionRate >= 70 ? "Strong" : completionRate >= 40 ? "Watch" : "Needs focus",
    },
    {
      name: "Boards",
      completed: `${boards.length} boards`,
      risk: `${boardProgress}% avg progress`,
      health: boardProgress >= 70 ? "Healthy" : boardProgress >= 40 ? "Moving" : "Early",
    },
    {
      name: "Reminders",
      completed: `${reminders.length - pendingReminders} handled`,
      risk: `${pendingReminders} pending`,
      health: pendingReminders <= 1 ? "Clear" : "Watch",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(77,159,255,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-6 sm:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
              Team Reports
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Progress, performance, and blockers without manual reporting.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/52">
              Live workspace reporting for {workspaceName}. Track completed work,
              overdue pressure, board progress, reminders, and manager-ready
              summaries as the web app syncs.
            </p>
          </div>

          <div className="grid min-w-[min(100%,520px)] grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Complete", `${completionRate}%`],
              ["Open tasks", openTasks],
              ["Priority", highPriorityOpen],
              ["Board avg", `${boardProgress}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-black/35 p-4 text-center"
              >
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PhaseTwoCard
          title="Member progress"
          description="Track completed tasks, active work, overdue items, and contribution trends by teammate."
          icon={CheckCircle2}
          accent="green"
        />
        <PhaseTwoCard
          title="Performance snapshots"
          description="Turn day-to-day work into weekly and monthly summaries managers can scan quickly."
          icon={BarChart3}
          accent="blue"
        />
        <PhaseTwoCard
          title="Export-ready reports"
          description="Prepare weekly summaries, KPI snapshots, and PDFs for clients, founders, or team leads."
          icon={FileText}
          accent="violet"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-white/10 bg-black/35 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Snapshot
              </p>
              <h3 className="mt-1 text-2xl font-bold">This week</h3>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            {rows.map((row) => (
              <div
                key={row.name}
                className="grid gap-3 border-b border-white/10 bg-white/[0.025] p-4 text-sm last:border-b-0 sm:grid-cols-4"
              >
                <span className="font-semibold text-white">{row.name}</span>
                <span className="text-white/55">{row.completed}</span>
                <span className="text-white/55">{row.risk}</span>
                <span className="font-semibold text-emerald-200">{row.health}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex h-full flex-col justify-between gap-8 rounded-[26px] border border-blue-300/15 bg-blue-400/[0.06] p-6">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-300/10 text-blue-100">
                <Clock3 className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-black">Manager summary</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                {syncStatus === "local"
                  ? "Preview mode is using local workspace data. Sign in to create cloud-backed reports across your team."
                  : "Cloud reports are connected to the synced workspace and ready for role-based reporting."}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.08] px-5 py-3 text-sm font-bold text-white/75 transition hover:-translate-y-0.5 hover:border-blue-200/35 hover:bg-blue-400/15 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Prepare report export
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
