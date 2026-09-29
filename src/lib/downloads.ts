"use client";

import { useEffect, useState } from "react";

// One place for every BloomBoard download link.
//
// macOS: the newest Mac release (also what the in-app updater reads).
// Windows: the Microsoft Store page (approved 2026-09-29). The Store installs the right
// version for Intel/AMD and ARM PCs, shows no security warning and keeps the app updated.
// iPhone: the App Store page. Empty until the app is public; iPhone visitors then see
// "coming soon" instead of an App Store button.
const RELEASES = "https://github.com/farhanfazil/bloombooard-releases/releases";

export const MAC_DOWNLOAD_URL = `${RELEASES}/latest/download/BloomBoard-Installer.dmg`;
export const WINDOWS_DOWNLOAD_URL = "https://apps.microsoft.com/detail/9MX9BDKM26VP";
export const IOS_APP_STORE_URL = "";

export type DesktopOS = "mac" | "windows";
export type DeviceOS = DesktopOS | "iphone" | "android";

function detectDevice(): DeviceOS {
  if (typeof navigator === "undefined") return "mac";
  const ua = navigator.userAgent || "";
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    "";
  if (/iPhone|iPod/i.test(ua) || /iPhone/i.test(platform)) return "iphone";
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  if (/iPad/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1)) return "iphone";
  if (/Android/i.test(ua)) return "android";
  if (/win/i.test(platform) || /Windows NT/i.test(ua)) return "windows";
  return "mac";
}

export type DownloadChoice = { url: string; label: string; icon: "apple" | "windows" | "appstore" };

export const MAC_CHOICE: DownloadChoice = { url: MAC_DOWNLOAD_URL, label: "Download for Mac", icon: "apple" };
export const WINDOWS_CHOICE: DownloadChoice = { url: WINDOWS_DOWNLOAD_URL, label: "Download for Windows", icon: "windows" };
export const APP_STORE_CHOICE: DownloadChoice = { url: IOS_APP_STORE_URL, label: "Download on the App Store", icon: "appstore" };

/**
 * What to offer this visitor: one main button for their own system, plus the other
 * desktop platform as a quiet "Also available for" link. The server and the first paint
 * use the Mac layout; the real system takes over right after.
 */
export function useDevice(): { os: DeviceOS; primary: DownloadChoice; alternate: DownloadChoice | null; note: string | null } {
  const [os, setOs] = useState<DeviceOS>("mac");
  useEffect(() => setOs(detectDevice()), []);
  if (os === "windows") return { os, primary: WINDOWS_CHOICE, alternate: MAC_CHOICE, note: null };
  if (os === "iphone") {
    return IOS_APP_STORE_URL
      ? { os, primary: APP_STORE_CHOICE, alternate: MAC_CHOICE, note: null }
      : { os, primary: MAC_CHOICE, alternate: WINDOWS_CHOICE, note: "The iPhone app is coming soon to the App Store." };
  }
  return { os, primary: MAC_CHOICE, alternate: WINDOWS_CHOICE, note: null };
}

/**
 * The desktop installer for the visitor's computer (Mac or Windows). Kept for places that
 * only ever offer a desktop download, like the demo page's header.
 */
export function useDownload(): { os: DesktopOS; url: string; label: string } {
  const { os } = useDevice();
  return os === "windows"
    ? { os: "windows", url: WINDOWS_DOWNLOAD_URL, label: "Windows" }
    : { os: "mac", url: MAC_DOWNLOAD_URL, label: "Mac" };
}
