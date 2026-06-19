"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  BellRing,
  Bot,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Flame,
  Plus,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

export function WebAppDashboard() {
  const {
    addTask,
    boards,
    reminders,
    tasks,
    toggleReminder,
    toggleTask,
  } = useWorkspace();
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [quickTask, setQuickTask] = useState("");
  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const priorityTasks = useMemo(() => tasks.slice(0, 3), [tasks]);
  const upcomingReminders = useMemo(
    () => reminders.filter((reminder) => !reminder.completed).slice(0, 3),
    [reminders],
  );

  function submitQuickTask() {
    if (!quickTask.trim()) return;
    addTask(quickTask);
    setQuickTask("");
    setQuickTaskOpen(false);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(77,159,255,.12),rgba(255,255,255,.025)_55%,rgba(124,58,237,.1))] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                Saturday, June 6
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Good afternoon, James.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/50">
                Your work, team, freelance clients, and AI signals are synced in one
                calm command center.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuickTaskOpen((current) => !current)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Quick task
            </button>
          </div>

          {quickTaskOpen && (
            <div className="mt-6 flex gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
              <input
                autoFocus
                value={quickTask}
                onChange={(event) => setQuickTask(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submitQuickTask()}
                placeholder="What needs to get done?"
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={submitQuickTask}
                className="rounded-xl bg-blue-500 px-4 text-sm font-bold transition hover:bg-blue-400"
              >
                Add
              </button>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [String(tasks.filter((task) => !task.done).length), "Active tasks", Target, "text-blue-300"],
              [String(completed), "Completed today", Check, "text-emerald-300"],
              [String(tasks.filter((task) => task.due.startsWith("Today")).length), "Due today", CalendarDays, "text-amber-300"],
              [String(tasks.filter((task) => !task.done && task.priority === "High").length), "Needs attention", Bell, "text-red-300"],
            ].map(([value, label, Icon, color]) => (
              <div key={label as string} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <Icon className={`h-4 w-4 ${color}`} />
                <p className="mt-4 text-3xl font-black">{value as string}</p>
                <p className="mt-1 text-xs text-white/38">{label as string}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-violet-300/20 bg-violet-400/[0.075] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Always ready
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/70">
            AI Chief of Staff
          </p>
          <h3 className="mt-2 text-2xl font-bold">One signal needs attention.</h3>
          <p className="mt-3 text-sm leading-6 text-white/48">
            Your launch campaign is due tomorrow and has one unresolved review.
          </p>
          <Link
            href="/app/chief-of-staff"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-200 transition hover:text-white"
          >
            Open briefing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/32">
                Today
              </p>
              <h3 className="mt-2 text-2xl font-bold">Priority tasks</h3>
            </div>
            <Link href="/app/tasks" className="text-sm font-semibold text-blue-200 hover:text-white">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {priorityTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border border-white/10 border-l-4 ${task.accent} bg-black/25 p-4 text-left transition hover:bg-white/[0.06]`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    task.done
                      ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                      : "border-white/15 text-white/35"
                  }`}
                >
                  {task.done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold ${task.done ? "text-white/35 line-through" : ""}`}>
                    {task.title}
                  </span>
                  <span className="mt-1 block text-xs text-white/36">
                    {task.priority} priority · {task.due}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-300" />
              <h3 className="font-bold">7 day streak</h3>
            </div>
            <div className="mt-5 flex gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index < 6 ? "bg-orange-300" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-white/42">Complete one more task to keep it alive.</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-300" />
              <h3 className="font-bold">Team pulse</h3>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-black">82%</p>
                <p className="text-xs text-white/38">Weekly completion</p>
              </div>
              <div className="flex -space-x-2">
                {["FA", "AL", "JM"].map((member) => (
                  <span
                    key={member}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-blue-500/25 text-[10px] font-bold"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-[30px] border border-amber-300/15 bg-amber-300/[0.055] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/50">
                Coming up
              </p>
              <h3 className="mt-2 text-2xl font-bold">Reminders</h3>
            </div>
            <Link
              href="/app/reminders"
              className="text-sm font-semibold text-amber-100/70 transition hover:text-white"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-2">
            {upcomingReminders.map((reminder) => (
              <button
                key={reminder.id}
                type="button"
                onClick={() => toggleReminder(reminder.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition hover:bg-white/[0.06]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-100">
                  <BellRing className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {reminder.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/35">
                    {reminder.schedule}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/32">
                Workspace pulse
              </p>
              <h3 className="mt-2 text-2xl font-bold">Everything is connected.</h3>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Synced locally
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              [String(tasks.length), "Tasks"],
              [String(boards.length), "Boards"],
              [String(reminders.length), "Reminders"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-3xl font-black">{value}</p>
                <p className="mt-1 text-xs text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Boards", `${boards.length} active projects`, "/app/boards", Target],
          ["AI Hub", "7 intelligent tools", "/app/ai", Bot],
          ["Daily Recap", "Clear end-of-day summary", "/app/daily-recap", Sparkles],
          ["Chief of Staff", "Private priority signals", "/app/chief-of-staff", BellRing],
          ["Freelance", "3 clients · 2 invoices", "/app/freelance", Clock3],
          ["Team", "3 active members", "/app/team", Users],
        ].map(([title, detail, href, Icon]) => (
          <Link
            key={title as string}
            href={href as string}
            className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-blue-300/20 hover:bg-blue-400/[0.06]"
          >
            <Icon className="h-5 w-5 text-white/55 transition group-hover:text-blue-200" />
            <h3 className="mt-5 text-lg font-bold">{title as string}</h3>
            <p className="mt-1 text-sm text-white/38">{detail as string}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
