import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-server";

/* Private report on live-demo visits (/api/demo-visit). Password-gated in src/middleware.ts. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Demo insights", robots: { index: false, follow: false } };

type Visit = {
  id: string;
  started_at: string;
  seconds: number;
  actions: number;
  entry: string | null;
  source: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  device: string | null;
  country: string | null;
  interest: string | null;
  workspaces: string[];
  features: string[];
  searches: string[];
  bloom_asks: string[];
  gates: string[];
  downloaded: boolean;
  download_source: string | null;
};

const INTEREST_LABEL: Record<string, string> = {
  own_work: "Organising my own work",
  team: "Working with my team",
  freelance: "Managing freelance clients",
  exploring: "Just looking around",
  dismissed: "Closed the question",
};

const GATE_LABEL: Record<string, string> = {
  calls: "Calls",
  email: "Email",
  invite: "Inviting teammates",
  account: "Sign in / account",
  pdf: "PDF export",
  portal: "Client portal",
  bloom: "Bloom AI (second question)",
  feature: "Other Mac-only feature",
};

const KIND_LABEL: Record<string, string> = {
  nav: "Opened",
  workspace: "Switched to",
  theme: "Theme",
  create: "Created a",
  chat: "Chat",
  knock: "Knock",
  office: "Team Space",
  bloom: "Bloom",
  gate: "Hit the Mac-app card for",
  nudge: "Save-your-work nudge",
  interest: "Answered",
  data: "Demo data:",
};

const RANGES = [7, 30, 90];

function words(s: string) {
  return s.replace(/_/g, " ");
}

function featureLabel(key: string) {
  const i = key.indexOf(":");
  const kind = key.slice(0, i);
  const name = key.slice(i + 1);
  if (kind === "gate") return `${KIND_LABEL.gate} ${GATE_LABEL[name] ?? words(name)}`;
  if (kind === "interest") return `${KIND_LABEL.interest}: ${INTEREST_LABEL[name] ?? words(name)}`;
  return `${KIND_LABEL[kind] ?? words(kind)} ${words(name)}`;
}

function countBy<T>(items: T[], key: (item: T) => string | string[] | null | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    const list = Array.isArray(k) ? Array.from(new Set(k)) : k ? [k] : [];
    for (const one of list) counts.set(one, (counts.get(one) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function pct(part: number, whole: number) {
  return whole ? `${Math.round((100 * part) / whole)}%` : "0%";
}

function duration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m}m ${seconds % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function loadVisits(days: number): Promise<{ visits: Visit[]; from: string }> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("demo_visits")
      .select("*")
      .gte("started_at", since)
      .order("started_at", { ascending: false })
      .limit(5000);
    if (!error) return { visits: (data ?? []) as Visit[], from: "Supabase" };
  }
  try {
    const raw = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "demo-visits.json"), "utf8"));
    const visits = (Object.values(raw) as Visit[])
      .filter((v) => v.started_at >= since)
      .sort((a, b) => b.started_at.localeCompare(a.started_at));
    return { visits, from: "local file (development)" };
  } catch {
    return { visits: [], from: supabase ? "Supabase (query failed)" : "nothing (no service key)" };
  }
}

/* Daily counts for one kind of event, e.g. "mobile:" (phone chat taps) or "useful:" (the
   "Was this demo useful?" answers). */
async function loadEventCounts(days: number, prefix: string): Promise<Record<string, number>> {
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const out: Record<string, number> = {};
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("demo_event_counts")
      .select("event, count")
      .like("event", `${prefix}%`)
      .gte("day", since);
    if (!error) {
      for (const row of data ?? []) out[row.event] = (out[row.event] ?? 0) + Number(row.count);
      return out;
    }
  }
  try {
    const raw = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "demo-events.json"), "utf8"));
    for (const [k, v] of Object.entries(raw)) if (k.startsWith(prefix)) out[k] = Number(v);
  } catch {}
  return out;
}

function Card({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      {note ? <p className="mt-1 text-xs text-neutral-600">{note}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bars({ rows, total, label = (k: string) => k, empty = "Nothing yet." }: {
  rows: [string, number][];
  total: number;
  label?: (k: string) => string;
  empty?: string;
}) {
  if (!rows.length) return <p className="text-sm text-neutral-600">{empty}</p>;
  const max = rows[0][1];
  return (
    <ul className="space-y-2">
      {rows.map(([k, n]) => (
        <li key={k} className="text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-neutral-800">{label(k)}</span>
            <span className="shrink-0 tabular-nums text-neutral-600">
              {n} <span className="text-neutral-500">· {pct(n, total)}</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 bg-neutral-100">
            <div className="h-1.5 bg-neutral-800" style={{ width: `${Math.max(3, (100 * n) / max)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function DemoInsightsPage({ searchParams }: { searchParams: { days?: string } }) {
  const days = RANGES.includes(Number(searchParams.days)) ? Number(searchParams.days) : 30;
  const { visits, from } = await loadVisits(days);
  /* Phone visitors never load the demo; the chat on the homepage counts what they tap. */
  const phone = await loadEventCounts(days, "mobile:");
  const useful = await loadEventCounts(days, "useful:");
  const usefulYes = useful["useful:yes"] ?? 0;
  const usefulNo = useful["useful:no"] ?? 0;
  const phoneShown = phone["mobile:shown"] ?? 0;
  const total = visits.length;
  const engaged = visits.filter((v) => v.seconds >= 30 || v.actions >= 5);
  const answered = visits.filter((v) => v.interest && v.interest !== "dismissed");
  const downloads = visits.filter((v) => v.downloaded);

  const interestRows = countBy(answered, (v) => v.interest);
  const interestDownload = new Map(
    interestRows.map(([k]) => {
      const group = answered.filter((v) => v.interest === k);
      return [k, pct(group.filter((v) => v.downloaded).length, group.length)];
    })
  );

  const featureRows = countBy(visits, (v) => v.features.filter((f) => !f.startsWith("interest:") && !f.startsWith("gate:"))).slice(0, 25);
  const gateRows = countBy(visits, (v) => v.gates);
  const searchRows = countBy(visits, (v) => v.searches.map((s) => s.toLowerCase())).slice(0, 30);
  const asks = visits.flatMap((v) => v.bloom_asks.map((q) => ({ q, at: v.started_at }))).slice(0, 40);
  const sourceRows = countBy(visits, (v) => v.utm_source ? `${v.source ?? "direct"} (utm: ${v.utm_source})` : v.source ?? "direct").slice(0, 15);
  const deviceRows = countBy(visits, (v) => v.device ?? "unknown");
  const countryRows = countBy(visits, (v) => v.country ?? "unknown").slice(0, 15);
  const entryRows = countBy(visits, (v) => v.entry ?? "unknown");
  const workspaceRows = countBy(visits, (v) => v.workspaces);
  const downloadSourceRows = countBy(downloads, (v) => v.download_source ?? "unknown");

  const ENTRY_LABEL: Record<string, string> = {
    home_embed: "Homepage demo",
    demo_page: "/demo page",
    standalone: "Demo opened on its own",
  };

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-10 text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Live demo insights</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Last {days} days · {total} visits · data from {from}
            </p>
          </div>
          <nav className="flex gap-1 text-sm">
            {RANGES.map((d) => (
              <Link
                key={d}
                href={`/demo-insights?days=${d}`}
                className={`border px-3 py-1.5 ${d === days ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500"}`}
              >
                {d} days
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Visits", String(total)],
            ["Really tried it", `${engaged.length} · ${pct(engaged.length, total)}`],
            ["Typical time spent", duration(median(engaged.map((v) => v.seconds)))],
            ["Told us why", `${answered.length} · ${pct(answered.length, total)}`],
            ["Clicked download", `${downloads.length} · ${pct(downloads.length, total)}`],
          ].map(([label, value]) => (
            <div key={label} className="border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-600">{label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Card title="What brings them here" note="Their answer to the one-tap question, and how many of each group clicked download.">
            <Bars
              rows={interestRows}
              total={answered.length}
              label={(k) => `${INTEREST_LABEL[k] ?? k} · ${interestDownload.get(k)} downloaded`}
              empty="No answers yet. The question appears after about 40 seconds of use."
            />
          </Card>
          <Card title="Which Mac-only features they wanted" note="Each time they hit the 'this works in the Mac app' card.">
            <Bars rows={gateRows} total={total} label={(k) => GATE_LABEL[k] ?? words(k)} />
          </Card>
          <Card title="What they searched for" note="Anything typed into a search box in the demo.">
            <Bars rows={searchRows} total={total} empty="No searches yet." />
          </Card>
          <Card title="What they asked Bloom" note="Most recent first.">
            {asks.length ? (
              <ul className="space-y-2 text-sm text-neutral-800">
                {asks.map((a, i) => (
                  <li key={i} className="border-l-2 border-neutral-300 pl-3">
                    {a.q}
                    <span className="ml-2 text-xs text-neutral-500">{new Date(a.at).toLocaleDateString("en-GB")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-600">No questions yet.</p>
            )}
          </Card>
          <Card title="What they did in the demo" note="Share of visits that did each thing at least once.">
            <Bars rows={featureRows} total={total} label={featureLabel} />
          </Card>
          <div className="grid gap-3">
            <Card title="Where they came from">
              <Bars rows={sourceRows} total={total} label={(k) => words(k)} />
            </Card>
            <Card title="Where they opened the demo">
              <Bars rows={entryRows} total={total} label={(k) => ENTRY_LABEL[k] ?? k} />
            </Card>
          </div>
          <Card
            title="Was the demo useful?"
            note={usefulYes + usefulNo ? `${usefulYes + usefulNo} ${usefulYes + usefulNo === 1 ? "answer" : "answers"} · ${pct(usefulYes, usefulYes + usefulNo)} said yes` : "The Yes / No question under the demo."}
          >
            <Bars
              rows={usefulYes + usefulNo ? [["Yes", usefulYes], ["No", usefulNo]] : []}
              total={usefulYes + usefulNo}
              empty="No answers yet."
            />
          </Card>
          <Card
            title="Phone visitors"
            note="Phones get a chat instead of the demo. How many saw it, and what they tapped."
          >
            <Bars
              rows={
                phoneShown
                  ? [
                      ["Saw the chat", phoneShown],
                      ["Tapped: get the iPhone app", phone["mobile:app_store"] ?? 0],
                      ["Tapped: send me the link", phone["mobile:send_link"] ?? 0],
                    ]
                  : []
              }
              total={phoneShown}
              empty="No phone visitors yet."
            />
          </Card>
          <Card title="Devices">
            <Bars rows={deviceRows} total={total} />
          </Card>
          <Card title="Countries">
            <Bars rows={countryRows} total={total} />
          </Card>
          <Card title="Workspaces tried">
            <Bars rows={workspaceRows} total={total} />
          </Card>
          <Card title="Where they clicked download">
            <Bars rows={downloadSourceRows} total={downloads.length} label={(k) => words(k)} empty="No downloads yet." />
          </Card>
        </div>

        <div className="mt-3">
        <Card title="Latest visits" note="The 50 most recent, newest first.">
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs text-neutral-600">
                <tr className="border-b border-neutral-200">
                  {["When", "From", "Device", "Here for", "Time", "What they did", "Searched / asked", "Download"].map((h) => (
                    <th key={h} className="px-5 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visits.slice(0, 50).map((v) => (
                  <tr key={v.id} className="border-b border-neutral-100 align-top">
                    <td className="whitespace-nowrap px-5 py-2 text-neutral-700">
                      {new Date(v.started_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-2 text-neutral-700">{v.source ?? "direct"}{v.country ? ` · ${v.country}` : ""}</td>
                    <td className="px-5 py-2 text-neutral-700">{v.device ?? ""}</td>
                    <td className="px-5 py-2 text-neutral-700">{v.interest ? INTEREST_LABEL[v.interest] ?? v.interest : ""}</td>
                    <td className="whitespace-nowrap px-5 py-2 tabular-nums text-neutral-700">{duration(v.seconds)}</td>
                    <td className="px-5 py-2 text-neutral-700">
                      {v.features.filter((f) => !f.startsWith("interest:")).slice(0, 8).map(featureLabel).join(", ")}
                      {v.features.length > 8 ? ` +${v.features.length - 8} more` : ""}
                    </td>
                    <td className="px-5 py-2 text-neutral-700">{[...v.searches, ...v.bloom_asks.map((q) => `Bloom: ${q}`)].join(" · ")}</td>
                    <td className="px-5 py-2 text-neutral-700">{v.downloaded ? `Yes (${words(v.download_source ?? "")})` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </div>
      </div>
    </main>
  );
}
