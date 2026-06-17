import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const feature = body?.feature ?? "unknown";
  const hasAiProvider = Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

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
