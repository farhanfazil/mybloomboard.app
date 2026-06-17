import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = payload.type ?? payload.event ?? "unknown";

  return NextResponse.json({
    ok: true,
    stored: false,
    reason: "Supabase service credentials are not configured yet.",
    eventType,
  });
}
