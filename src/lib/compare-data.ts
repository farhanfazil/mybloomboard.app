/* The team comparison table (homepage section and the /vs pages share it).
   Compared October 2026. */
export const TEAMS_HEADERS = ["Feature", "BloomBoard", "Notion", "Trello", "ClickUp", "Asana", "Monday"];

export const TEAMS_ROWS: (string[] | { section: string })[] = [
  { section: "Platform" },
  ["Works offline",               "✅ Your own tasks and notes\nTeam features need a connection",                              "⚠️ Limited",     "❌",          "⚠️ View only",  "⚠️ View only",  "❌"],
  ["Data location",               "✅ Your computer\nCloud backup when signed in", "❌ Cloud only",   "❌ Cloud only","❌ Cloud only",  "❌ Cloud only",  "❌ Cloud only"],
  ["Works without an account",    "✅ Free plan\nPaid plans need an account", "❌",              "❌",          "❌",            "❌",            "❌"],

  { section: "Tasks & Projects" },
  ["Create several boards at once", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Type to Task", "✅", "❌", "⚠️ Paste a list", "⚠️ Paste a list", "⚠️ Paste a list", "❌"],
  ["KPI tracking + PDF reports",  "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "Workspace" },
  ["Notes with PIN lock",         "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Bookmarks for links & resources", "✅", "✅", "❌", "⚠️ Via extension", "❌", "❌"],
  ["Performance overview",        "✅", "❌", "❌", "⚠️ Paid dashboards", "⚠️ Paid reporting", "⚠️ Paid dashboards"],

  { section: "Email & Calendar" },
  ["Gmail and Outlook inbox",       "✅ Built-in", "⚠️ Separate app", "❌", "⚠️ Paid plans", "❌", "⚠️ Via app"],
  ["Turn an email into a task",     "✅", "❌", "⚠️ Forward to a board", "⚠️ Email to task", "⚠️ Forward to Asana", "⚠️ Via app"],
  ["Reply to emails with AI",       "✅", "⚠️ Separate app", "❌", "⚠️ Paid add-on", "❌", "❌"],
  ["Outlook & Google Calendar sync", "✅", "⚠️ Separate app", "⚠️ Power-Up", "✅", "⚠️ One-way", "⚠️ Via app"],

  { section: "Team & Collaboration" },
  ["Voice & video calls",         "✅ Built-in", "❌ Via add-on", "❌ Via add-on", "✅", "❌ Via add-on", "❌ Via add-on"],
  ["Built-in team chat",          "✅", "❌", "❌", "✅", "❌", "❌"],
  ["Live team office",            "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Handovers before a vacation", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Team vacation calendar",      "✅", "❌", "❌", "❌", "⚠️ Out-of-office only", "⚠️ Via template"],
  ["Voice messages in boards",    "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Meetings + 5-min alerts",     "✅", "❌", "❌", "✅", "✅", "✅"],
  ["Daily Recap",                 "✅", "❌", "❌", "⚠️ Paid add-on", "⚠️ Paid", "❌"],

  { section: "Team insights" },
  ["Team overview",           "✅", "❌", "⚠️ Paid", "⚠️ Limited", "⚠️ Paid", "⚠️ Paid"],
  ["Workload Health",             "✅", "❌", "❌", "⚠️ Capacity view", "⚠️ Capacity view", "⚠️ Capacity view"],

  { section: "Wellbeing & Personal" },
  ["Wellbeing: mood, hydration and avatars", "✅", "❌", "❌", "❌", "❌", "❌"],
  ["Sticky notes",                "✅", "❌", "❌", "❌", "❌", "❌"],

  { section: "AI Features" },
  ["AI assistant built-in",       "✅ Included",        "⚠️ Paid add-on", "❌", "⚠️ Paid add-on", "⚠️ Paid add-on", "⚠️ Paid add-on"],
  ["AI planning: plan my day, meeting notes to tasks, risk alerts", "✅", "⚠️ Meeting notes, paid", "❌", "❌", "❌", "❌"],

  { section: "Pricing" },
  ["Free plan",                   "✅ Free\nBloom from $6/mo, Team from $8/person/mo\n(billed yearly)", "✅", "✅", "✅", "✅", "✅"],
];
