import { NextResponse, type NextRequest } from "next/server";

const APP_HOST = "app.mybloomboard.app";
const PASSTHROUGH_PREFIXES = ["/_next", "/api", "/favicon.ico", "/icon.png", "/logo.png"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host")?.split(":")[0];

  if (
    hostname !== APP_HOST ||
    url.pathname.startsWith("/app") ||
    PASSTHROUGH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const rewriteUrl = url.clone();
  rewriteUrl.pathname = `/app${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
