import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

/**
 * Anonymous usage counts from the live web demo (public/bloomboard-demo/demo-convert.js).
 * The body is { events: { "kind:name": count } }; rows are aggregated per day,
 * with no visitor ids, IPs or free text stored.
 */

const EVENT_NAME = /^(demo_loaded|nav|gate|download|nudge|create|workspace|theme|chat|knock|bloom):[a-z0-9_]{1,40}$/;
const MAX_KEYS = 40;
const MAX_COUNT = 50;
const DATA_FILE = path.join(process.cwd(), "data", "demo-events.json");

function sanitize(input: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!input || typeof input !== "object") return out;
  for (const [name, raw] of Object.entries(input as Record<string, unknown>).slice(0, MAX_KEYS)) {
    const count = Math.floor(Number(raw));
    if (EVENT_NAME.test(name) && count > 0) out[name] = Math.min(count, MAX_COUNT);
  }
  return out;
}

async function writeLocal(events: Record<string, number>) {
  let totals: Record<string, number> = {};
  try {
    totals = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {}
  for (const [name, count] of Object.entries(events)) totals[name] = (totals[name] ?? 0) + count;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(totals, null, 2), "utf8");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const events = sanitize(body?.events);
  if (!Object.keys(events).length) return new NextResponse(null, { status: 204 });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.rpc("increment_demo_events", { p_events: events });
    if (!error) return new NextResponse(null, { status: 204 });
    console.warn("[demo-events] rpc failed", error.message);
  }

  if (process.env.NODE_ENV === "development") {
    await writeLocal(events);
    return new NextResponse(null, { status: 204 });
  }

  /* Tracking is best-effort; never surface an error to the demo. */
  return new NextResponse(null, { status: 204 });
}
