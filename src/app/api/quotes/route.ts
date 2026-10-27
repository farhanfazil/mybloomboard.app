import { NextResponse } from "next/server";
import { QUOTES, type ProofQuote } from "@/lib/proof";
import { getSupabaseAdmin } from "@/lib/supabase-server";

/**
 * The quotes the home page shows (src/components/sections/Proof.tsx): the hand-picked ones
 * in src/lib/proof.ts, then the ones sent from the app (public.app_testimonials) that the
 * person agreed to share AND that were approved on /quotes-review. Cached for a few
 * minutes, so a newly approved quote shows up within about five.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  let live: ProofQuote[] = [];
  const db = getSupabaseAdmin();
  if (db) {
    const { data } = await db
      .from("app_testimonials")
      .select("quote, name, role, team_name")
      .eq("status", "published")
      .eq("consent_publish", true)
      .order("created_at", { ascending: false })
      .limit(6);
    live = (data ?? []).map((q) => ({ quote: q.quote, name: q.name || "", role: q.role || "", team: q.team_name || "" }));
  }
  return NextResponse.json(
    { quotes: [...QUOTES, ...live].slice(0, 6) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  );
}
