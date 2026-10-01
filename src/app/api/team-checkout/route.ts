import { NextRequest } from "next/server";
import { GET as checkout } from "../checkout/route";

/** Older address for the Team checkout (the app and old links use it). Same as /api/checkout?plan=team. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.searchParams.set("plan", "team");
  return checkout(new NextRequest(url));
}
