import { NextResponse } from "next/server";

/**
 * mybloomboard.app/download/mac → the newest Mac installer.
 *
 * Every Mac download button points here, so pages never show where the file is
 * hosted. To move the installer set MAC_DMG_URL
 * on Netlify; no code change needed.
 */
/* The installer lives in Cloudflare R2 (bucket bloomboard-downloads) under our own domain. */
const FALLBACK = "https://downloads.mybloomboard.app/BloomBoard-Installer.dmg";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.redirect(process.env.MAC_DMG_URL || FALLBACK, 302);
}
