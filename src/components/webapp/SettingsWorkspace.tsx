"use client";

import {
  Bell,
  Check,
  Cloud,
  Laptop,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Smartphone,
  Sun,
} from "lucide-react";
import { useState } from "react";

type Theme = "dark" | "light" | "system";

const notificationOptions = [
  ["Task reminders", "Deadlines, snoozed reminders, and upcoming work."],
  ["Team activity", "Mentions, assignments, comments, and chat requests."],
  ["AI briefings", "Daily Recaps and Chief of Staff attention signals."],
  ["Billing updates", "Receipts, renewals, plan changes, and trial status."],
] as const;

export function SettingsWorkspace() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    "Task reminders": true,
    "Team activity": true,
    "AI briefings": true,
    "Billing updates": false,
  });
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(77,159,255,.10),rgba(255,255,255,.025)_58%,rgba(124,58,237,.08))] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-200/75">
          Workspace settings
        </p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Make Bloomboard yours.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/48">
              Personalize appearance, notifications, devices, privacy, and sync behavior.
              These preferences will follow your account across web and desktop.
            </p>
          </div>
          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black transition hover:scale-[1.03] hover:bg-blue-50"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-violet-200" />
            <div>
              <h3 className="text-xl font-bold">Appearance</h3>
              <p className="text-sm text-white/38">Choose how your workspace feels.</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              ["dark", "Dark", Moon],
              ["light", "Light", Sun],
              ["system", "System", Laptop],
            ].map(([value, label, Icon]) => (
              <button
                key={value as string}
                type="button"
                onClick={() => setTheme(value as Theme)}
                className={`flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border text-sm font-semibold transition ${
                  theme === value
                    ? "border-violet-300/35 bg-violet-400/12 text-white"
                    : "border-white/10 bg-black/20 text-white/42 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label as string}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Cloud className="h-5 w-5 text-blue-200" />
            <div>
              <h3 className="text-xl font-bold">Cloud sync</h3>
              <p className="text-sm text-white/38">Web and desktop share one source of truth.</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-emerald-100">Sync foundation ready</p>
                <p className="mt-1 text-sm leading-6 text-white/42">
                  Connect Supabase credentials to enable live workspace sync and device history.
                </p>
              </div>
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.7)]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <Laptop className="h-5 w-5 text-white/55" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">This browser</p>
              <p className="text-xs text-white/35">Web app · Active now</p>
            </div>
            <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-200">Current</span>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-amber-200" />
          <div>
            <h3 className="text-xl font-bold">Notifications</h3>
            <p className="text-sm text-white/38">Stay informed without turning your day into noise.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {notificationOptions.map(([title, description]) => {
            const enabled = notifications[title];
            return (
              <button
                key={title}
                type="button"
                onClick={() =>
                  setNotifications((current) => ({ ...current, [title]: !current[title] }))
                }
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:bg-white/[0.055]"
              >
                <span
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    enabled ? "bg-blue-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                      enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-sm leading-5 text-white/38">{description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Privacy",
            text: "Control account sessions, data exports, and workspace security.",
          },
          {
            icon: Smartphone,
            title: "Mobile",
            text: "Core workflows are designed for responsive use on iOS and Android.",
          },
          {
            icon: Laptop,
            title: "Desktop",
            text: "Desktop device sync will use the same Supabase workspace and entitlements.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
            <Icon className="h-5 w-5 text-blue-200" />
            <h3 className="mt-5 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/40">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
