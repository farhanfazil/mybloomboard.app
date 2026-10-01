import { NextResponse } from "next/server";

/**
 * mybloomboard.app/download/mac → the newest Mac installer.
 *
 * Every Mac download button points here, so pages never show where the file is
 * hosted. To move the installer (another GitHub account, R2, …) set MAC_DMG_URL
 * on Netlify; no code change needed.
 */
const FALLBACK = "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.redirect(process.env.MAC_DMG_URL || FALLBACK, 302);
}
