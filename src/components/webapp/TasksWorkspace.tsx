"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

export function TasksWorkspace() {
  const { addTask, tasks, toggleTask } = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Today" | "Completed">("All");
  const [draft, setDraft] = useState("");

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Today" && task.due.startsWith("Today")) ||
        (filter === "Completed" && task.done);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, tasks]);

  function submitTask() {
    const title = draft.trim();
    if (!title) return;
    addTask(title);
    setDraft("");
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300/70">
            Task workspace
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Make today count.</h2>
          <p className="mt-3 text-white/45">Capture, prioritize, and complete work without losing context.</p>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
          {tasks.filter((task) => task.done).length} completed today
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-4 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4">
              <Search className="h-4 w-4 text-white/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks..."
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-white/25"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              {(["All", "Today", "Completed"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    filter === option
                      ? "border-blue-300/30 bg-blue-400/15 text-white"
                      : "border-white/10 text-white/45 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
              <button type="button" className="rounded-full border border-white/10 p-3 text-white/45 hover:text-white">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && submitTask()}
              placeholder="Add a new task"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm outline-none focus:border-blue-300/30"
            />
            <button
              type="button"
              onClick={submitTask}
              className="flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add task</span>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {visibleTasks.map((task) => (
              <article
                key={task.id}
                className={`group flex items-center gap-4 rounded-2xl border border-white/10 border-l-4 ${task.accent} bg-black/25 p-4 transition hover:bg-white/[0.055]`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    task.done
                      ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                      : "border-white/15 text-white/30 hover:text-white"
                  }`}
                >
                  {task.done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold ${task.done ? "text-white/35 line-through" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/35">
                    <span>{task.project}</span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {task.due}
                    </span>
                    <span>{task.priority} priority</span>
                  </div>
                </div>
                <button type="button" className="text-white/25 transition hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-violet-300/20 bg-violet-400/[0.075] p-6">
            <Sparkles className="h-5 w-5 text-violet-200" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/60">
              AI suggestion
            </p>
            <h3 className="mt-2 text-xl font-bold">Protect a focus block.</h3>
            <p className="mt-3 text-sm leading-6 text-white/45">
              Your two highest-priority tasks need about 90 minutes. Block 2:00–3:30 PM.
            </p>
            <button type="button" className="mt-5 text-sm font-bold text-violet-200 hover:text-white">
              Add to my day
            </button>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Upcoming</h3>
              <ChevronDown className="h-4 w-4 text-white/30" />
            </div>
            <div className="mt-5 space-y-5">
              {[
                ["3:00 PM", "Design review"],
                ["4:30 PM", "Launch checkpoint"],
                ["Tomorrow", "Client presentation"],
              ].map(([time, title]) => (
                <div key={title} className="border-l border-white/15 pl-4">
                  <p className="text-xs text-blue-200">{time}</p>
                  <p className="mt-1 text-sm font-semibold">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
