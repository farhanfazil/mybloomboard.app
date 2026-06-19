"use client";

import {
  BellRing,
  CalendarClock,
  Check,
  Circle,
  Clock3,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

export function RemindersWorkspace() {
  const { addReminder, reminders, toggleReminder } = useWorkspace();
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<"Reminder" | "Meeting">("Reminder");

  const upcoming = useMemo(
    () => reminders.filter((reminder) => !reminder.completed),
    [reminders],
  );
  const completed = reminders.length - upcoming.length;

  function submitReminder() {
    if (!draft.trim()) return;
    addReminder(draft, kind);
    setDraft("");
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/65">
            Your attention system
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Remember less. Do more.
          </h2>
          <p className="mt-3 max-w-2xl text-white/45">
            Keep meetings, follow-ups, and personal nudges close to the work they support.
          </p>
        </div>
        <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
          {upcoming.length} upcoming
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto]">
            <div className="flex rounded-2xl border border-white/10 bg-black/25 p-1">
              {(["Reminder", "Meeting"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setKind(option)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    kind === option
                      ? "bg-white text-black"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && submitReminder()}
              placeholder="What should Bloomboard remind you about?"
              className="h-12 min-w-0 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm outline-none placeholder:text-white/25 focus:border-amber-200/30"
            />
            <button
              type="button"
              onClick={submitReminder}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {reminders.map((reminder) => (
              <article
                key={reminder.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/[0.055]"
              >
                <button
                  type="button"
                  onClick={() => toggleReminder(reminder.id)}
                  aria-label={`Mark ${reminder.title} ${
                    reminder.completed ? "upcoming" : "complete"
                  }`}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    reminder.completed
                      ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                      : "border-white/15 text-white/30 hover:text-white"
                  }`}
                >
                  {reminder.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-semibold ${
                        reminder.completed ? "text-white/35 line-through" : ""
                      }`}
                    >
                      {reminder.title}
                    </h3>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/38">
                      {reminder.kind}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/35">
                    <Clock3 className="h-3 w-3" />
                    {reminder.schedule}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-amber-300/20 bg-amber-300/[0.075] p-6">
            <BellRing className="h-5 w-5 text-amber-200" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/60">
              Today&apos;s rhythm
            </p>
            <h3 className="mt-2 text-xl font-bold">Your next nudge is protected.</h3>
            <p className="mt-3 text-sm leading-6 text-white/45">
              Bloomboard keeps reminders visible without turning your day into a wall of alerts.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <CalendarClock className="h-5 w-5 text-blue-200" />
            <p className="mt-4 text-3xl font-black">{completed}</p>
            <p className="mt-1 text-sm text-white/40">Completed reminders</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
