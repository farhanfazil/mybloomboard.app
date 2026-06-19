"use client";

import {
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  ClipboardPlus,
  FileText,
  Lightbulb,
  Mail,
  Plus,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

type ToolId = "email" | "meeting" | "plan" | "stuck";

type ConversationItem = {
  role: "assistant" | "user";
  text: string;
};

type GeneratedResult = {
  eyebrow: string;
  title: string;
  body: string;
  actions: string[];
};

const tools = [
  {
    id: "email" as const,
    title: "Email & Messages",
    detail: "Write, fix, or reshape any message.",
    placeholder: "Describe the message and who it is for...",
    icon: Mail,
    color: "text-blue-200 bg-blue-400/10",
  },
  {
    id: "meeting" as const,
    title: "Meeting Notes → Tasks",
    detail: "Turn conversations into clear actions.",
    placeholder: "Paste meeting notes or action points...",
    icon: FileText,
    color: "text-emerald-200 bg-emerald-400/10",
  },
  {
    id: "plan" as const,
    title: "Plan My Day",
    detail: "Build a realistic time-blocked schedule.",
    placeholder: "Add any timing, energy, or priority preferences...",
    icon: CalendarClock,
    color: "text-violet-200 bg-violet-400/10",
  },
  {
    id: "stuck" as const,
    title: "I Am Stuck",
    detail: "Break difficult work into a first step.",
    placeholder: "What are you avoiding or finding difficult?",
    icon: Lightbulb,
    color: "text-amber-200 bg-amber-400/10",
  },
];

function buildResult(
  tool: ToolId,
  prompt: string,
  taskTitles: string[],
): GeneratedResult {
  const context = prompt.trim();
  const firstTask = taskTitles[0] ?? "Review your highest-priority task";

  if (tool === "email") {
    return {
      eyebrow: "Polished message",
      title: context || "Project progress update",
      body:
        "Hi, I wanted to share a concise progress update. The work is moving forward, the remaining priorities are clear, and I will send the next confirmed milestone as soon as it is ready. Please let me know if you would like any additional detail in the meantime.",
      actions: ["Review tone and recipient", "Add the confirmed deadline", "Send when ready"],
    };
  }

  if (tool === "meeting") {
    const source = context || "Review launch status, confirm owners, and resolve remaining blockers.";
    return {
      eyebrow: "Action items extracted",
      title: "Meeting follow-up",
      body: `Bloom reviewed: “${source}”`,
      actions: [
        "Confirm owners for every open decision",
        "Resolve the highest-priority blocker",
        "Share a written progress update",
      ],
    };
  }

  if (tool === "plan") {
    const scheduleTasks = taskTitles.slice(0, 3);
    return {
      eyebrow: "Focused day plan",
      title: "A realistic schedule for today",
      body: context || "Built from your active Bloomboard tasks, with space between focus blocks.",
      actions: scheduleTasks.length
        ? scheduleTasks.map((title, index) => `${index === 0 ? "09:00" : index === 1 ? "11:00" : "14:00"} · ${title}`)
        : ["09:00 · Choose today's priority", "11:00 · Focus block", "14:00 · Review progress"],
    };
  }

  return {
    eyebrow: "Momentum plan",
    title: `Start smaller: ${context || firstTask}`,
    body:
      "The goal is not to finish everything now. Reduce the work until the first move feels almost too easy, then use that momentum to continue.",
    actions: [
      "Open the task and write the next visible action",
      "Work on it for ten focused minutes",
      "Decide whether to continue, delegate, or reschedule",
    ],
  };
}

export function AIHubWorkspace() {
  const { addReminder, addTask, tasks } = useWorkspace();
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolId>("plan");
  const [toolPrompt, setToolPrompt] = useState("");
  const [savedActions, setSavedActions] = useState<string[]>([]);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [conversation, setConversation] = useState<ConversationItem[]>([
    {
      role: "assistant",
      text: "Good afternoon. I found one task that needs your attention before tomorrow.",
    },
  ]);

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.done),
    [tasks],
  );
  const activeTool = tools.find((tool) => tool.id === selectedTool) ?? tools[0];

  function sendMessage() {
    const text = message.trim();
    if (!text) return;

    const asksForPlan = /plan|schedule|today/i.test(text);
    const asksForTask = /task|todo|to-do|remember/i.test(text);
    let response =
      "I have added that to your working context. Choose a specialist tool and I will turn it into a clear result.";

    if (asksForPlan) {
      setSelectedTool("plan");
      setToolPrompt(text);
      response = `I can build that plan from your ${activeTasks.length} active tasks. I have opened Plan My Day for you.`;
    } else if (asksForTask) {
      addTask(text.replace(/^(add|create|remember)\s+/i, ""));
      response = "Done. I added that to your task list so it stays connected across the workspace.";
    }

    setConversation((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", text: response },
    ]);
    setMessage("");
  }

  function generateResult() {
    setResult(
      buildResult(
        selectedTool,
        toolPrompt,
        activeTasks.map((task) => task.title),
      ),
    );
    setSavedActions([]);
  }

  function saveAction(action: string) {
    if (savedActions.includes(action)) return;

    if (selectedTool === "plan") {
      addReminder(action, "Reminder");
    } else {
      addTask(action);
    }
    setSavedActions((current) => [...current, action]);
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/65">
          Bloom intelligence
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Your AI layer, ready.
        </h2>
        <p className="mt-3 max-w-2xl text-white/45">
          Ask naturally, use a specialist tool, or let your Chief of Staff surface what matters first.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <div className="flex min-h-[560px] flex-col overflow-hidden rounded-[32px] border border-violet-300/20 bg-[linear-gradient(145deg,rgba(124,58,237,.12),rgba(255,255,255,.025)_42%,rgba(77,159,255,.08))]">
          <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/25 text-violet-100">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold">Bloom</h3>
                <p className="text-xs text-white/35">AI coworker</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Always ready
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {conversation.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  item.role === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "border border-white/10 bg-black/30 text-white/72"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessage("Plan my day around my active tasks");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/48 transition hover:border-white/20 hover:text-white"
              >
                Plan my day
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessage("Create task Review the web app progress");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/48 transition hover:border-white/20 hover:text-white"
              >
                Create a task
              </button>
            </div>
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                placeholder="Ask Bloom anything..."
                className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm outline-none focus:border-violet-300/30"
              />
              <button
                type="button"
                onClick={sendMessage}
                aria-label="Send message"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 transition hover:scale-105 hover:bg-violet-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-violet-200" />
              <div>
                <h3 className="text-xl font-bold">AI Assistant Hub</h3>
                <p className="mt-1 text-xs text-white/35">
                  {activeTasks.length} active tasks available as context
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const active = selectedTool === tool.id;
                return (
                  <button
                    key={tool.title}
                    type="button"
                    onClick={() => {
                      setSelectedTool(tool.id);
                      setResult(null);
                      setSavedActions([]);
                    }}
                    className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      active
                        ? "border-violet-300/35 bg-violet-400/[0.11]"
                        : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.055]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <h4 className="mt-5 font-bold">{tool.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-white/38">{tool.detail}</p>
                    <ArrowRight className="mt-5 h-4 w-4 text-white/25 transition group-hover:translate-x-1 group-hover:text-white" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                {activeTool.title}
              </label>
              <textarea
                value={toolPrompt}
                onChange={(event) => setToolPrompt(event.target.value)}
                placeholder={activeTool.placeholder}
                className="mt-3 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-6 outline-none transition focus:border-violet-300/35"
              />
              <button
                type="button"
                onClick={generateResult}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-violet-100"
              >
                <WandSparkles className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>

          {result ? (
            <div className="rounded-[30px] border border-violet-300/20 bg-violet-400/[0.07] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/70">
                {result.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-bold">{result.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/48">{result.body}</p>
              <div className="mt-5 space-y-2">
                {result.actions.map((action) => {
                  const saved = savedActions.includes(action);
                  return (
                    <div
                      key={action}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-violet-200">
                        {saved ? <Check className="h-3.5 w-3.5" /> : <ClipboardPlus className="h-3.5 w-3.5" />}
                      </span>
                      <p className="min-w-0 flex-1 text-sm leading-6 text-white/70">{action}</p>
                      <button
                        type="button"
                        onClick={() => saveAction(action)}
                        disabled={saved}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white disabled:cursor-default disabled:text-emerald-200"
                      >
                        {saved ? "Saved" : (
                          <>
                            <Plus className="h-3 w-3" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-[30px] border border-blue-300/15 bg-blue-400/[0.06] p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/15 text-blue-200">
                  <WandSparkles className="h-4 w-4" />
                </span>
                <span className="text-xs text-white/32">1 critical signal</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                AI Chief of Staff
              </p>
              <h3 className="mt-2 text-xl font-bold">Your launch review is at risk.</h3>
              <p className="mt-2 text-sm leading-6 text-white/43">
                Two decisions are still unresolved with less than 24 hours remaining.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
