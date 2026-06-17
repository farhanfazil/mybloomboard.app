import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const eventType = payload.type ?? payload.event ?? "unknown";

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      stored: false,
      reason: "Supabase service credentials are not configured yet.",
      eventType,
    });
  }

  const { error } = await supabase.from("polar_events").insert({
    event_type: eventType,
    payload,
    processed_at: null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true, eventType });
}
