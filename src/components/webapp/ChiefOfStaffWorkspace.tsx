"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  Check,
  CheckCircle2,
  Eye,
  FolderKanban,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Severity = "warning" | "opportunity" | "info";

type Signal = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  href: string;
  resolved: boolean;
  persisted: boolean;
};

const severityStyle: Record<Severity, string> = {
  warning: "border-amber-300/20 bg-amber-300/[0.075] text-amber-100",
  opportunity: "border-emerald-300/20 bg-emerald-300/[0.075] text-emerald-100",
  info: "border-blue-300/20 bg-blue-300/[0.075] text-blue-100",
};

function normalizeSeverity(value: string): Severity {
  return value === "warning" || value === "opportunity" ? value : "info";
}

export function ChiefOfStaffWorkspace() {
  const { boards, currentUser, reminders, tasks, workspaceId, workspaceName } = useWorkspace();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [cloudSignals, setCloudSignals] = useState<Signal[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("Watching your workspace for what matters next.");

  const derivedSignals = useMemo<Signal[]>(() => {
    const next: Signal[] = [];
    const highPriority = tasks.filter((task) => !task.done && task.priority === "High");
    const dueToday = tasks.filter((task) => !task.done && task.due.startsWith("Today"));
    const pendingReminders = reminders.filter((reminder) => !reminder.completed);
    const slowBoards = boards.filter((board) => board.progress < 50);

    if (highPriority.length) {
      next.push({
        id: "priority-pressure",
        title: `${highPriority.length} high-priority ${highPriority.length === 1 ? "task needs" : "tasks need"} attention`,
        detail: `Start with ${highPriority[0].title}. It has the strongest priority signal in your current queue.`,
        severity: "warning",
        href: "/app/tasks",
        resolved: false,
        persisted: false,
      });
    }
    if (dueToday.length) {
      next.push({
        id: "today-focus",
        title: `${dueToday.length} ${dueToday.length === 1 ? "item is" : "items are"} due today`,
        detail: "Protect a focused block before adding lower-priority work to the day.",
        severity: "info",
        href: "/app/tasks",
        resolved: false,
        persisted: false,
      });
    }
    if (pendingReminders.length > 1) {
      next.push({
        id: "reminder-load",
        title: "Clear your reminder queue",
        detail: `${pendingReminders.length} reminders are still open. Confirm the next one before it becomes background noise.`,
        severity: "info",
        href: "/app/reminders",
        resolved: false,
        persisted: false,
      });
    }
    if (slowBoards.length) {
      next.push({
        id: "board-momentum",
        title: `${slowBoards[0].name} can regain momentum`,
        detail: `The board is ${slowBoards[0].progress}% complete. A smaller next milestone would make progress easier to see.`,
        severity: "opportunity",
        href: "/app/boards",
        resolved: false,
        persisted: false,
      });
    }
    if (!next.length) {
      next.push({
        id: "all-clear",
        title: "Your workspace is in a healthy rhythm",
        detail: "No critical pressure signals are showing. Keep the current priorities steady.",
        severity: "opportunity",
        href: "/app",
        resolved: false,
        persisted: false,
      });
    }
    return next.slice(0, 4);
  }, [boards, reminders, tasks]);

  const signals = cloudSignals ?? derivedSignals;

  useEffect(() => {
    let active = true;

    async function loadSignals() {
      if (!supabase || !workspaceId) return;
      const { data, error } = await supabase
        .from("chief_of_staff_signals")
        .select("*")
        .eq("workspace_id", workspaceId)
        .is("resolved_at", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!active || error || !data?.length) return;
      setCloudSignals(
        data.map((signal) => ({
          id: signal.id,
          title: signal.title,
          detail: signal.detail ?? "This signal needs your review.",
          severity: normalizeSeverity(signal.severity),
          href:
            signal.source_table === "boards"
              ? "/app/boards"
              : signal.source_table === "reminders"
                ? "/app/reminders"
                : "/app/tasks",
          resolved: false,
          persisted: true,
        })),
      );
      setNotice("Cloud signals loaded from your workspace.");
    }

    void loadSignals();
    return () => {
      active = false;
    };
  }, [supabase, workspaceId]);

  async function refreshSignals() {
    setRefreshing(true);
    setCloudSignals(derivedSignals);

    if (supabase && workspaceId && currentUser) {
      const { data, error } = await supabase
        .from("chief_of_staff_signals")
        .insert(
          derivedSignals.map((signal) => ({
            workspace_id: workspaceId,
            title: signal.title,
            detail: signal.detail,
            severity: signal.severity,
            source_table: signal.href.includes("boards")
              ? "boards"
              : signal.href.includes("reminders")
                ? "reminders"
                : "tasks",
          })),
        )
        .select("*");

      if (!error && data) {
        setCloudSignals(
          data.map((signal) => ({
            id: signal.id,
            title: signal.title,
            detail: signal.detail ?? "This signal needs your review.",
            severity: normalizeSeverity(signal.severity),
            href:
              signal.source_table === "boards"
                ? "/app/boards"
                : signal.source_table === "reminders"
                  ? "/app/reminders"
                  : "/app/tasks",
            resolved: false,
            persisted: true,
          })),
        );
        setNotice("Fresh signals saved to your cloud workspace.");
      } else {
        setNotice("Signals refreshed locally. Cloud save is unavailable right now.");
      }
    } else {
      setNotice("Signals refreshed from this browser workspace.");
    }
    setRefreshing(false);
  }

  async function resolveSignal(signal: Signal) {
    setCloudSignals((current) =>
      (current ?? derivedSignals).filter((item) => item.id !== signal.id),
    );
    if (supabase && workspaceId && currentUser && signal.persisted) {
      await supabase
        .from("chief_of_staff_signals")
        .update({ resolved_at: new Date().toISOString() })
        .eq("id", signal.id)
        .eq("workspace_id", workspaceId);
    }
    setNotice(`Resolved: ${signal.title}`);
  }

  const warningCount = signals.filter((signal) => signal.severity === "warning").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_12%_0%,rgba(124,58,237,.23),transparent_32%),linear-gradient(135deg,rgba(124,58,237,.11),rgba(59,130,246,.07),rgba(255,255,255,.025))] p-6 sm:p-9 xl:grid-cols-[1fr_420px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-100">
            <Sparkles className="h-3.5 w-3.5" /> AI Chief of Staff
          </div>
          <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
            Quietly watching the work, clearly surfacing the next move.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/52">
            Your private briefing for {workspaceName}, built from tasks, boards,
            deadlines, and reminders already inside Bloomboard.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            {[
              [Eye, "Always watching"],
              [BellRing, "Signals what matters"],
              [ShieldCheck, "Private to you"],
            ].map(([Icon, label]) => (
              <span key={label as string} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-white/60">
                <Icon className="h-4 w-4 text-violet-200" /> {label as string}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-violet-300/20 bg-black/35 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/65">Current briefing</p>
          <p className="mt-4 text-5xl font-black">{signals.length}</p>
          <p className="mt-1 text-sm text-white/40">active signals · {warningCount} critical</p>
          <button
            type="button"
            onClick={() => void refreshSignals()}
            disabled={refreshing}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:opacity-60"
          >
            {refreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh signals
          </button>
          <p className="mt-3 text-center text-xs text-white/30">{notice}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {signals.length ? signals.map((signal) => (
          <article key={signal.id} className={`rounded-[30px] border p-5 sm:p-6 ${severityStyle[signal.severity]}`}>
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-current/20 bg-black/20">
                {signal.severity === "warning" ? <AlertTriangle className="h-5 w-5" /> : signal.severity === "opportunity" ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
              </span>
              <span className="rounded-full border border-current/20 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                {signal.severity}
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-black text-white">{signal.title}</h3>
            <p className="mt-3 min-h-12 text-sm leading-6 text-white/50">{signal.detail}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={signal.href} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90">
                Open context <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button type="button" onClick={() => void resolveSignal(signal)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-4 py-2.5 text-xs font-black text-white/65 transition hover:bg-black/35 hover:text-white">
                <Check className="h-3.5 w-3.5" /> Resolve
              </button>
            </div>
          </article>
        )) : (
          <div className="col-span-full rounded-[30px] border border-emerald-300/20 bg-emerald-300/[0.07] p-10 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-200" />
            <h3 className="mt-4 text-2xl font-black">Briefing cleared</h3>
            <p className="mt-2 text-sm text-white/45">Refresh whenever you want Bloomboard to scan the workspace again.</p>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [Target, "Actionable insights", "Every signal points to a concrete task, board, or reminder you can act on."],
          [FolderKanban, "Full workspace context", "Priorities are read alongside board momentum instead of in isolation."],
          [ShieldCheck, "Your private briefing", "Signals are designed to support decisions, not monitor people publicly."],
        ].map(([Icon, title, description]) => (
          <div key={title as string} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <Icon className="h-5 w-5 text-violet-200" />
            <h3 className="mt-5 font-bold">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">{description as string}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
