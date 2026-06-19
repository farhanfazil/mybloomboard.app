"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type RecapDetails = {
  completed: string[];
  attention: string[];
  reminders: string[];
  boardProgress: number;
};

type Recap = {
  id: string;
  date: string;
  summary: string;
  details: RecapDetails;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function DailyRecapWorkspace() {
  const { boards, currentUser, reminders, syncStatus, tasks, workspaceId, workspaceName } =
    useWorkspace();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [history, setHistory] = useState<Recap[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activity, setActivity] = useState("Ready to summarize your day.");
  const [saving, setSaving] = useState(false);

  const currentDetails = useMemo<RecapDetails>(() => {
    const completed = tasks.filter((task) => task.done).map((task) => task.title);
    const attention = tasks
      .filter((task) => !task.done && (task.priority === "High" || task.due.startsWith("Today")))
      .map((task) => task.title);
    const pendingReminders = reminders
      .filter((reminder) => !reminder.completed)
      .map((reminder) => reminder.title);
    const boardProgress = boards.length
      ? Math.round(boards.reduce((sum, board) => sum + board.progress, 0) / boards.length)
      : 0;

    return { completed, attention, reminders: pendingReminders, boardProgress };
  }, [boards, reminders, tasks]);

  useEffect(() => {
    let active = true;

    async function loadRecaps() {
      if (supabase && workspaceId) {
        const { data, error } = await supabase
          .from("daily_recaps")
          .select("*")
          .eq("workspace_id", workspaceId)
          .order("recap_date", { ascending: false })
          .limit(30);

        if (!active) return;
        if (!error && data) {
          const cloudHistory = data.map((recap) => ({
            id: recap.id,
            date: recap.recap_date,
            summary: recap.summary,
            details: recap.details as RecapDetails,
          }));
          setHistory(cloudHistory);
          setSelectedId(cloudHistory[0]?.id ?? null);
          setActivity("Cloud recap history loaded.");
          return;
        }
      }

      const saved = window.localStorage.getItem("bloomboard-daily-recaps-v1");
      if (!active || !saved) return;
      try {
        const localHistory = JSON.parse(saved) as Recap[];
        setHistory(localHistory);
        setSelectedId(localHistory[0]?.id ?? null);
      } catch {
        window.localStorage.removeItem("bloomboard-daily-recaps-v1");
      }
    }

    void loadRecaps();
    return () => {
      active = false;
    };
  }, [supabase, workspaceId]);

  const selected = history.find((recap) => recap.id === selectedId) ?? history[0] ?? null;

  async function generateRecap() {
    setSaving(true);
    const date = todayKey();
    const completedCount = currentDetails.completed.length;
    const attentionCount = currentDetails.attention.length;
    const summary = completedCount
      ? `You completed ${completedCount} ${completedCount === 1 ? "task" : "tasks"}. ${attentionCount ? `${attentionCount} important ${attentionCount === 1 ? "item needs" : "items need"} your next focus.` : "Your priority queue is clear."}`
      : `No tasks are marked complete yet. ${attentionCount ? `Start with ${currentDetails.attention[0]}.` : "Choose one small task to build momentum."}`;

    const localRecap: Recap = {
      id: crypto.randomUUID(),
      date,
      summary,
      details: currentDetails,
    };

    let savedRecap = localRecap;
    if (supabase && workspaceId && currentUser) {
      const { data, error } = await supabase
        .from("daily_recaps")
        .upsert(
          {
            workspace_id: workspaceId,
            recap_date: date,
            summary,
            details: currentDetails,
          },
          { onConflict: "workspace_id,recap_date" },
        )
        .select("*")
        .single();

      if (!error && data) {
        savedRecap = {
          id: data.id,
          date: data.recap_date,
          summary: data.summary,
          details: data.details as RecapDetails,
        };
        setActivity("Today’s recap saved to your cloud workspace.");
      } else {
        setActivity("Cloud save was unavailable. Recap saved in this browser.");
      }
    } else {
      setActivity("Today’s recap saved in this browser preview.");
    }

    setHistory((current) => {
      const next = [savedRecap, ...current.filter((recap) => recap.date !== date)];
      window.localStorage.setItem("bloomboard-daily-recaps-v1", JSON.stringify(next));
      return next;
    });
    setSelectedId(savedRecap.id);
    setSaving(false);
  }

  const preview = selected ?? {
    id: "preview",
    date: todayKey(),
    summary: "Generate your first recap to turn today’s work into a clear, shareable summary.",
    details: currentDetails,
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_85%_0%,rgba(59,130,246,.18),transparent_28%),linear-gradient(135deg,rgba(37,99,235,.12),rgba(124,58,237,.07),rgba(255,255,255,.025))] p-6 sm:p-9">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
              AI Daily Recap
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Close the day with clarity, not another status meeting.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/52">
              Bloomboard turns completed work, priority pressure, reminders, and board
              progress from {workspaceName} into one concise daily record.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void generateRecap()}
            disabled={saving}
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:opacity-60"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate today’s recap
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <article className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">Daily record</p>
              <h3 className="mt-2 text-2xl font-black">{formatDate(preview.date)}</h3>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready to share
            </span>
          </div>

          <p className="mt-6 text-xl font-semibold leading-8 text-white/85">{preview.summary}</p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Completed",
                values: preview.details.completed,
                icon: CheckCircle2,
                color: "text-emerald-200",
              },
              {
                label: "Needs attention",
                values: preview.details.attention,
                icon: Target,
                color: "text-amber-200",
              },
              {
                label: "Still upcoming",
                values: preview.details.reminders,
                icon: Clock3,
                color: "text-blue-200",
              },
            ].map(({ label, values: items, icon: Icon, color }) => {
              return (
                <div key={label} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <h4 className="mt-4 font-bold">{label}</h4>
                  <div className="mt-3 space-y-2 text-sm text-white/48">
                    {items.length ? items.slice(0, 4).map((item) => <p key={item}>• {item}</p>) : <p>Nothing to report.</p>}
                  </div>
                </div>
              );
            })}
            <div className="rounded-3xl border border-violet-300/15 bg-violet-300/[0.06] p-5">
              <CalendarDays className="h-5 w-5 text-violet-200" />
              <h4 className="mt-4 font-bold">Workspace momentum</h4>
              <p className="mt-3 text-4xl font-black">{preview.details.boardProgress}%</p>
              <p className="mt-2 text-sm text-white/45">Average board progress</p>
            </div>
          </div>
          <p className="mt-5 text-xs text-white/35">{activity} · Sync: {syncStatus}</p>
        </article>

        <aside className="rounded-[32px] border border-white/10 bg-black/35 p-5">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-200" />
            <div>
              <h3 className="font-bold">Recap history</h3>
              <p className="text-xs text-white/35">Your latest 30 daily summaries</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {history.length ? history.map((recap) => (
              <button
                key={recap.id}
                type="button"
                onClick={() => setSelectedId(recap.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${selectedId === recap.id ? "border-blue-300/30 bg-blue-400/10" : "border-white/10 bg-white/[0.025] hover:bg-white/[0.06]"}`}
              >
                <span>
                  <span className="block text-sm font-bold">{formatDate(recap.date)}</span>
                  <span className="mt-1 block text-xs text-white/35">{recap.details.completed.length} completed</span>
                </span>
                <ArrowRight className="h-4 w-4 text-white/35" />
              </button>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/12 px-4 py-8 text-center text-sm text-white/35">
                Your generated recaps will appear here.
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => void generateRecap()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" /> Refresh today
          </button>
        </aside>
      </section>
    </div>
  );
}
