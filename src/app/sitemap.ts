import type { MetadataRoute } from "next";

const SITE = "https://mybloomboard.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-29");
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/start", priority: 0.9 },
    { path: "/demo", priority: 0.8 },
    { path: "/office", priority: 0.7 },
    { path: "/handover", priority: 0.7 },
    { path: "/chat", priority: 0.7 },
    { path: "/work", priority: 0.7 },
    { path: "/refund", priority: 0.4 },
    { path: "/security", priority: 0.5 },
    { path: "/privacy.html", priority: 0.3 },
    { path: "/terms.html", priority: 0.3 },
    { path: "/no-tracking.html", priority: 0.3 },
    { path: "/local-first.html", priority: 0.3 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
