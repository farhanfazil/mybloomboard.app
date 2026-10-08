import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/guides";
import { TEMPLATES } from "@/lib/templates";

const SITE = "https://mybloomboard.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-08");
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
    { path: "/vs/trello", priority: 0.8 },
    { path: "/vs/clickup", priority: 0.8 },
    { path: "/vs/notion", priority: 0.8 },
    { path: "/vs/monday", priority: 0.8 },
    { path: "/vs/asana", priority: 0.8 },
    { path: "/roam-alternative", priority: 0.8 },
    { path: "/virtual-office", priority: 0.8 },
    { path: "/team-task-manager", priority: 0.8 },
    { path: "/kanban-board-app", priority: 0.8 },
    { path: "/task-app-for-agencies", priority: 0.8 },
    { path: "/daily-planner-app", priority: 0.8 },
    { path: "/templates", priority: 0.7 },
    ...TEMPLATES.map((t) => ({ path: `/templates/${t.slug}`, priority: 0.6 })),
    { path: "/guides", priority: 0.7 },
    ...GUIDES.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.6 })),
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
