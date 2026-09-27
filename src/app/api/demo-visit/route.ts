import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

/**
 * One live-demo visit (public/bloomboard-demo/demo-convert.js): where the visitor
 * came from, what they said they are here for, what they opened, searched for
 * and asked Bloom. The browser sends the whole visit each time; the id is a
 * random per-tab value. No names, emails, IPs or cookies are stored.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9_:.-]{1,60}$/;
const INTERESTS = ["own_work", "team", "freelance", "exploring", "dismissed"];
const DATA_FILE = path.join(process.cwd(), "data", "demo-visits.json");

function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim();
  return t ? t.slice(0, max) : null;
}

function slugs(v: unknown, maxItems: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((s): s is string => typeof s === "string" && SLUG.test(s)).slice(0, maxItems);
}

function texts(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((s) => text(s, maxLen)).filter((s): s is string => !!s).slice(0, maxItems);
}

function int(v: unknown, max: number): number {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
}

/* Netlify passes the visitor's country in x-nf-geo (base64 JSON). Only the code is kept. */
function country(request: Request): string | null {
  const geo = request.headers.get("x-nf-geo");
  if (geo) {
    try {
      const code = JSON.parse(Buffer.from(geo, "base64").toString("utf8"))?.country?.code;
      if (typeof code === "string" && /^[A-Z]{2}$/.test(code)) return code;
    } catch {}
  }
  const plain = request.headers.get("x-country");
  return plain && /^[A-Z]{2}$/.test(plain) ? plain : null;
}

export type DemoVisit = {
  id: string;
  seconds: number;
  actions: number;
  entry: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
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

function sanitize(body: Record<string, unknown>, request: Request): DemoVisit | null {
  if (typeof body.id !== "string" || !UUID.test(body.id)) return null;
  const interest = typeof body.interest === "string" && INTERESTS.includes(body.interest) ? body.interest : null;
  const device = typeof body.device === "string" && SLUG.test(body.device) ? body.device.slice(0, 20) : null;
  return {
    id: body.id.toLowerCase(),
    seconds: int(body.seconds, 6 * 3600),
    actions: int(body.actions, 5000),
    entry: typeof body.entry === "string" && SLUG.test(body.entry) ? body.entry.slice(0, 40) : null,
    source: text(body.source, 120),
    utm_source: text(body.utm_source, 80),
    utm_medium: text(body.utm_medium, 80),
    utm_campaign: text(body.utm_campaign, 80),
    device,
    country: country(request),
    interest,
    workspaces: slugs(body.workspaces, 5),
    features: slugs(body.features, 60),
    searches: texts(body.searches, 20, 80),
    bloom_asks: texts(body.bloom_asks, 10, 200),
    gates: slugs(body.gates, 20),
    downloaded: body.downloaded === true,
    download_source: text(body.download_source, 40),
  };
}

/* Local development without the service key: keep visits in data/demo-visits.json. */
async function writeLocal(visit: DemoVisit) {
  let all: Record<string, DemoVisit & { started_at: string; updated_at: string }> = {};
  try {
    all = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {}
  const now = new Date().toISOString();
  const prev = all[visit.id];
  all[visit.id] = {
    ...visit,
    interest: visit.interest ?? prev?.interest ?? null,
    downloaded: visit.downloaded || !!prev?.downloaded,
    started_at: prev?.started_at ?? now,
    updated_at: now,
  };
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf8");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const visit = body && typeof body === "object" ? sanitize(body as Record<string, unknown>, request) : null;
  if (!visit) return new NextResponse(null, { status: 204 });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.rpc("upsert_demo_visit", { p: visit });
    if (!error) return new NextResponse(null, { status: 204 });
    console.warn("[demo-visit] rpc failed", error.message);
  }

  if (process.env.NODE_ENV === "development") await writeLocal(visit);

  /* Tracking is best-effort; never surface an error to the demo. */
  return new NextResponse(null, { status: 204 });
}
