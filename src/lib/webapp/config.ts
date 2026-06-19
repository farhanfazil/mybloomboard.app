export const WEB_APP_URL =
  process.env.NEXT_PUBLIC_WEB_APP_URL ?? "https://app.mybloomboard.app";

export const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL ?? "https://mybloomboard.app";

export const POLAR_CUSTOMER_PORTAL_URL =
  process.env.NEXT_PUBLIC_POLAR_CUSTOMER_PORTAL_URL ??
  "https://polar.sh/daily-dashboard/portal";

export const planNames = ["Free", "Flow", "Bloom", "Team"] as const;

export type PlanName = (typeof planNames)[number];

export const planEntitlements: Record<PlanName, string[]> = {
  Free: [
    "Core tasks and reminders",
    "Limited boards and AI usage",
    "Basic freelance limits",
    "Desktop and web account access",
  ],
  Flow: [
    "Synced dashboard, tasks, boards, and reminders",
    "Freelance Flow limits",
    "AI email, meeting notes, and planning allowances",
    "7-day trial",
  ],
  Bloom: [
    "Unlimited personal AI assistant usage where plan allows",
    "Full freelance power",
    "AI Chief of Staff and Daily Recap history",
    "Best value for solo power users",
  ],
  Team: [
    "Team workspace, roles, and reports",
    "Team chat, group chat, tagging, and voice messages",
    "Workload Health private manager signals",
    "Up to 50 seats",
  ],
};

export const webAppModules = [
  {
    title: "Dashboard",
    description:
      "A synced command center for tasks, streaks, reminders, KPIs, boards, health, and daily focus.",
    phase: "Phase 1",
  },
  {
    title: "Tasks",
    description:
      "Create, prioritize, tag, schedule, comment, attach files, and sync status across desktop and web.",
    phase: "Phase 1",
  },
  {
    title: "Boards",
    description:
      "Project-specific boards with cards, comments, attachments, progress, and team tagging.",
    phase: "Phase 1",
  },
  {
    title: "AI Assistant Hub",
    description:
      "Bloom, email/messages, meeting notes to tasks, Plan My Day, I Am Stuck, and usage limits by plan.",
    phase: "Phase 1",
  },
  {
    title: "Team Workspace",
    description:
      "Members, managers, roles, performance snapshots, reports, team chat, group chat, and voice notes.",
    phase: "Phase 2",
  },
  {
    title: "Team Chat",
    description:
      "Direct messages, group conversations, image sharing, voice notes, and team context in one synced workspace.",
    phase: "Phase 2",
  },
  {
    title: "Team Reports",
    description:
      "Manager-ready views for member progress, completed work, blockers, workload trends, and performance snapshots.",
    phase: "Phase 2",
  },
  {
    title: "Workload Health",
    description:
      "Private manager signals that help teams spot overload, lower activity, and support needs early.",
    phase: "Phase 2",
  },
  {
    title: "Freelance Suite",
    description:
      "Clients, projects, proposals, contracts, revisions, assets, invoices, and client portals.",
    phase: "Phase 3",
  },
  {
    title: "AI Chief of Staff",
    description:
      "Quietly monitors priority signals and suggests what deserves attention next.",
    phase: "Phase 4",
  },
  {
    title: "Daily Recap",
    description:
      "End-of-day summaries for completed work, blockers, notes, and manager-ready updates.",
    phase: "Phase 4",
  },
];

export const phaseTwoHighlights = [
  {
    title: "Members and roles",
    description:
      "Invite teammates, assign managers, control workspace access, and keep every member tied to the right team context.",
  },
  {
    title: "Team reporting",
    description:
      "Track completed work, open tasks, overdue items, workload balance, and individual progress without manual reporting.",
  },
  {
    title: "Collaboration inside work",
    description:
      "Comment on cards, tag teammates, attach assets, add voice notes, and keep decisions connected to the task or board.",
  },
  {
    title: "Private workload signals",
    description:
      "Surface supportive manager-only signals for lower activity, overload, overdue clusters, and team health patterns.",
  },
];

export const teamRoles = [
  {
    label: "Owner",
    access: "Billing, workspace settings, members, reports, and all projects.",
  },
  {
    label: "Manager",
    access: "Team reporting, task assignment, workload health, and board oversight.",
  },
  {
    label: "Member",
    access: "Assigned tasks, boards, comments, chat, files, and personal progress.",
  },
  {
    label: "Client",
    access: "Client portal access only when freelance workspaces expose shared assets.",
  },
];

export const collaborationChannels = [
  "Direct messages",
  "Group-based conversations",
  "Board and card comments",
  "Voice messages",
  "Image and file sharing",
  "Member tagging",
];
