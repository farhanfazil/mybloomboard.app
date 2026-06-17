import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const hasR2Config =
    Boolean(process.env.R2_ACCOUNT_ID) &&
    Boolean(process.env.R2_BUCKET_NAME) &&
    Boolean(process.env.R2_ACCESS_KEY_ID) &&
    Boolean(process.env.R2_SECRET_ACCESS_KEY);

  if (!hasR2Config) {
    return NextResponse.json(
      {
        error: "Cloudflare R2 is not configured yet.",
        expected: ["R2_ACCOUNT_ID", "R2_BUCKET_NAME", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"],
        requestedFile: body?.fileName ?? null,
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    {
      error: "Signed upload URL generation is ready for implementation once the R2 SDK/client is added.",
      requestedFile: body?.fileName ?? null,
    },
    { status: 501 },
  );
}
