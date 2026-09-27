import { NextResponse, type NextRequest } from "next/server";

/**
 * /demo-insights is private: the browser asks for a password (any user name),
 * checked against DEMO_INSIGHTS_PASSWORD. Without that variable the page is
 * only reachable in local development.
 */
export function middleware(request: NextRequest) {
  const password = process.env.DEMO_INSIGHTS_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("Not found", { status: 404 });
  }

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      if (decoded.slice(decoded.indexOf(":") + 1) === password) return NextResponse.next();
    } catch {}
  }

  return new NextResponse("Password required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="BloomBoard demo insights"' },
  });
}

export const config = { matcher: ["/demo-insights"] };
