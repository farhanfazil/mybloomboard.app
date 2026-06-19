"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";

const clients = [
  { name: "Northstar Studio", project: "Brand website", value: "$4,800", status: "In progress" },
  { name: "Mira Wellness", project: "Product campaign", value: "$2,350", status: "Awaiting approval" },
  { name: "Craft & Co.", project: "Monthly retainer", value: "$1,900", status: "Active" },
];

export function FreelanceWorkspace() {
  const [activeView, setActiveView] = useState<"Overview" | "Clients" | "Invoices">("Overview");

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-200/65">Freelance suite</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Run the business side.</h2>
          <p className="mt-3 max-w-2xl text-white/45">
            Clients, projects, revisions, assets, contracts, proposals, and invoices in one operating view.
          </p>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
          <Plus className="h-4 w-4" />
          New client
        </button>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {(["Overview", "Clients", "Invoices"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeView === view
                ? "border-fuchsia-300/30 bg-fuchsia-400/15 text-white"
                : "border-white/10 text-white/42 hover:text-white"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["$9,050", "Pipeline value", CircleDollarSign, "text-emerald-200"],
          ["3", "Active clients", Users, "text-blue-200"],
          ["5", "Open projects", BriefcaseBusiness, "text-violet-200"],
          ["2", "Awaiting approval", FileCheck2, "text-amber-200"],
        ].map(([value, label, Icon, color]) => (
          <div key={label as string} className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="mt-5 text-3xl font-black">{value as string}</p>
            <p className="mt-1 text-sm text-white/38">{label as string}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">{activeView}</p>
              <h3 className="mt-2 text-2xl font-bold">Client work</h3>
            </div>
            <button type="button" className="text-sm font-bold text-fuchsia-200 hover:text-white">View all</button>
          </div>
          <div className="mt-5 space-y-3">
            {clients.map((client) => (
              <article key={client.name} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-400/10 font-bold text-fuchsia-200">
                  {client.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold">{client.name}</h4>
                  <p className="mt-1 text-xs text-white/36">{client.project} · {client.status}</p>
                </div>
                <p className="font-bold">{client.value}</p>
                <button type="button" className="text-white/30 hover:text-white"><ArrowUpRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border border-emerald-300/15 bg-emerald-400/[0.055] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/65">Business health</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-5xl font-black">86</p>
                <p className="mt-1 text-sm text-white/38">Healthy and improving</p>
              </div>
              <div className="h-20 w-20 rounded-full border-[8px] border-emerald-300/20 border-t-emerald-300" />
            </div>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-200" />
              <h3 className="font-bold">Invoice activity</h3>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-white/45">Paid this month</span><strong>$5,100</strong></div>
              <div className="flex justify-between"><span className="text-white/45">Pending</span><strong>$2,350</strong></div>
              <div className="flex justify-between"><span className="text-white/45">Overdue</span><strong className="text-red-300">$0</strong></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
