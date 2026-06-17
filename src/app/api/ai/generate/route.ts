import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const feature = body?.feature ?? "unknown";
  const workspaceId = body?.workspaceId ?? null;
  const hasAiProvider = Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

  const supabase = createServiceSupabaseClient();
  if (supabase && workspaceId) {
    await supabase.from("ai_usage_events").insert({
      workspace_id: workspaceId,
      feature,
      input_tokens: 0,
      output_tokens: 0,
      status: hasAiProvider ? "queued" : "blocked_missing_provider",
      metadata: { source: "web_app_api" },
    });
  }

  if (!hasAiProvider) {
    return NextResponse.json(
      {
        error: "AI provider credentials are not configured yet.",
        feature,
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    {
      error: "AI generation endpoint scaffold is ready. Connect the selected provider before enabling production use.",
      feature,
    },
    { status: 501 },
  );
}
