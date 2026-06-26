import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  EMPTY_DEMO_REACTION_COUNTS,
  type DemoReactionCounts,
  type DemoReactionId,
  isDemoReactionId,
} from "@/lib/demo-reactions";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const DATA_FILE = path.join(process.cwd(), "data", "demo-reactions.json");

async function readLocalCounts(): Promise<DemoReactionCounts> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DemoReactionCounts>;
    return { ...EMPTY_DEMO_REACTION_COUNTS, ...parsed };
  } catch {
    return { ...EMPTY_DEMO_REACTION_COUNTS };
  }
}

async function writeLocalCounts(counts: DemoReactionCounts) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(counts, null, 2), "utf8");
}

async function fetchSupabaseCounts(): Promise<DemoReactionCounts | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("demo_emoji_reactions")
    .select("emoji_id, count");

  if (error) return null;

  const counts = { ...EMPTY_DEMO_REACTION_COUNTS };
  for (const row of data ?? []) {
    if (isDemoReactionId(row.emoji_id)) {
      counts[row.emoji_id] = Number(row.count) || 0;
    }
  }
  return counts;
}

async function incrementSupabaseCount(emojiId: DemoReactionId): Promise<DemoReactionCounts | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { error: rpcError } = await supabase.rpc("increment_demo_emoji_reaction", {
    p_emoji_id: emojiId,
  });

  if (rpcError) {
    const { data: existing } = await supabase
      .from("demo_emoji_reactions")
      .select("count")
      .eq("emoji_id", emojiId)
      .maybeSingle();

    const next = (existing?.count ?? 0) + 1;
    const { error: upsertError } = await supabase
      .from("demo_emoji_reactions")
      .upsert({ emoji_id: emojiId, count: next });

    if (upsertError) return null;
  }

  return fetchSupabaseCounts();
}

export async function GET() {
  const supabaseCounts = await fetchSupabaseCounts();
  if (supabaseCounts) {
    return NextResponse.json({ counts: supabaseCounts, source: "supabase" });
  }

  if (process.env.NODE_ENV === "development") {
    const counts = await readLocalCounts();
    return NextResponse.json({ counts, source: "local" });
  }

  return NextResponse.json({ counts: EMPTY_DEMO_REACTION_COUNTS, source: "default" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const emojiId = typeof body?.emojiId === "string" ? body.emojiId : "";

  if (!isDemoReactionId(emojiId)) {
    return NextResponse.json({ error: "Invalid emojiId" }, { status: 400 });
  }

  const supabaseCounts = await incrementSupabaseCount(emojiId);
  if (supabaseCounts) {
    return NextResponse.json({ counts: supabaseCounts, source: "supabase" });
  }

  if (process.env.NODE_ENV === "development") {
    const counts = await readLocalCounts();
    counts[emojiId] += 1;
    await writeLocalCounts(counts);
    return NextResponse.json({ counts, source: "local" });
  }

  return NextResponse.json(
    { error: "Reaction storage is not configured. Add Supabase env vars in production." },
    { status: 503 },
  );
}
