export const FEATURES = [
  {
    icon: "✅",
    title: "Smart Task Management",
    description:
      "Rich task cards with priority, mood tags, deadlines, subtasks, and status evolution icons. Cycle Pending → Ongoing → Done with one click.",
    accentColor: "#4d9fff",
    mockupType: "task",
  },
  {
    icon: "🎯",
    title: "Daily Milestone Tracker",
    description:
      "Tasks due today appear as a visual dot timeline. Hit 100% and get a personalised completion message — great work today!",
    accentColor: "#39FF14",
    mockupType: "milestone",
  },
  {
    icon: "📊",
    title: "KPI Goals & PDF Reports",
    description:
      "Set business KPI targets, log actuals, and generate a professional PDF performance report — weekly, monthly, or yearly.",
    accentColor: "#a78bfa",
    mockupType: "stats",
  },
  {
    icon: "🔥",
    title: "Streak & Reward System",
    description:
      "Build daily consistency. Earn badges at 3, 7, 14, 30, 60, and 100 days. Miss a day and it resets — so stay sharp.",
    accentColor: "#ff9f0a",
    mockupType: "streak",
  },
  {
    icon: "✨",
    title: "AI Assistant Hub",
    description:
      "Four AI tools in one place — write emails, extract tasks from meeting notes, plan your day with time blocks, and break through procrastination. All powered by Claude AI, all 100% local.",
    accentColor: "#a78bfa",
    mockupType: "ai-hub",
    highlight: true,
  },
  {
    icon: "📅",
    title: "Reminders & Meetings",
    description:
      "Log leave, meetings, and custom reminders with countdown timers. Get a 5-minute alert before meetings start automatically.",
    accentColor: "#a78bfa",
    mockupType: "events",
  },
  {
    icon: "💧",
    title: "Health & Hydration",
    description:
      "A configurable hydration timer lives in your sidebar. Tap to log it or snooze 10 minutes. Stay focused, stay healthy.",
    accentColor: "#4d9fff",
    mockupType: "hydration",
  },
];

export const WALKTHROUGH_ITEMS = [
  {
    id: "greeting-stats",
    label: "Feature 01",
    headline: "Your personal command center.",
    description:
      "A professional split-panel layout built for macOS. The sidebar holds your day's context — personalised greeting with avatar, live stats, upcoming events, health, and streak. The main area is your workspace.",
    mockupType: "screenshot",
    screenshot: "/screenshots/greeting-stats.png",
    accentColor: "#4d9fff",
  },
  {
    id: "task-list",
    label: "Feature 02",
    headline: "Task cards that tell the full story.",
    description:
      "Each task card shows title, description, priority badge, deadline, mood tag, project, and a glowing status evolution icon. Click to expand notes, subtasks, and attachments. Drag the handle to reorder.",
    bullets: [
      "Priority: 🔴 High / 🟡 Medium / 🟢 Low",
      "Status: Purple (Pending) → Amber (Ongoing) → Green (Done)",
      "Mood tags: 🎨 Creative · 😤 Stressed · ⚡ Motivated · 🧠 Deep Thinking",
      "Drag ⠿ handle to reorder tasks",
    ],
    mockupType: "screenshot",
    screenshot: "/screenshots/task-list.png",
    accentColor: "#4d9fff",
  },
  {
    id: "subtasks",
    label: "Feature 03",
    headline: "Break big tasks into milestones.",
    description:
      "Expand any task to reveal subtasks, notes, and mood tracking. A progress bar shows % completion. Add notes up to 500 characters, attach files, and select your current mood — all auto-saved.",
    bullets: [
      "🚀 Subtasks with checkbox + progress bar",
      "📝 500-character notes area",
      "📎 File attachments",
      "🧠 Mood selector per task",
    ],
    mockupType: "screenshot",
    screenshot: "/screenshots/subtasks-complete.png",
    accentColor: "#39FF14",
  },
  {
    id: "milestone-tracker",
    label: "Feature 04",
    headline: "Watch your day unfold in real time.",
    description:
      "Tasks due today appear as numbered dots on a timeline. Pending is grey, ongoing pulses blue, done glows green. Hit 100% and get a personalised celebration message.",
    mockupType: "screenshot",
    screenshot: "/screenshots/milestone-complete.png",
    accentColor: "#39FF14",
  },
  {
    id: "ai-hub",
    label: "AI",
    headline: "Your personal AI assistant. Built in.",
    description:
      "One entry point. Four powerful tools — all powered by Claude AI, all running securely through the app. No API key setup. Nothing leaves your device except the prompt.",
    bullets: [
      "📧 Email & Messages — generate, rewrite, or fix emails and Slack/WhatsApp messages",
      "📋 Meeting Notes → Tasks — paste notes, AI extracts every action item instantly",
      "🗓️ Plan My Day — AI reads your tasks and builds a smart time-blocked schedule",
      "🛟 I am Stuck — pick a task you're avoiding, get a personalised breakthrough plan",
    ],
    mockupType: "ai-hub",
    accentColor: "#a78bfa",
  },
  {
    id: "new-task",
    label: "Feature 06",
    headline: "Add tasks in seconds.",
    description:
      "The task creation modal is fast and frictionless. Set a title, description, priority, deadline, project, and mood tag — all in one clean form. Voice input supported for title and description.",
    mockupType: "screenshot",
    screenshot: "/screenshots/new-task-modal.png",
    accentColor: "#4d9fff",
  },
  {
    id: "reminders-meetings",
    label: "Feature 07",
    headline: "Never miss a meeting or reminder.",
    description:
      "The Reminders & Meetings panel surfaces everything upcoming — meetings with 5-min alerts, leave dates with countdowns, and time-sensitive reminders glowing amber when due. Full-screen reminder popups for critical items.",
    mockupType: "screenshot",
    screenshot: "/screenshots/reminders-meetings.png",
    accentColor: "#a78bfa",
  },
  {
    id: "add-event",
    label: "Feature 08",
    headline: "Log events with full context.",
    description:
      "Add Leave, Meeting, or Reminder events with a start date, optional end date, time, and notes. Meeting time triggers an automatic 5-minute native macOS alert so you're never caught off-guard.",
    mockupType: "screenshot",
    screenshot: "/screenshots/add-event.png",
    accentColor: "#4d9fff",
  },
  {
    id: "streak",
    label: "Feature 09",
    headline: "Build a habit. Earn your badge.",
    description:
      "Complete at least one task per day to keep your streak alive. The streak card shows your count, a progress bar to the next badge, and a Milestones panel with all earned achievements.",
    bullets: [
      "🥉 3 days · 🥈 7 days · 🥇 14 days",
      "🏆 30 days · ⭐ 60 days · 👑 100 days",
    ],
    mockupType: "screenshot",
    screenshot: "/screenshots/streak.png",
    accentColor: "#ff9f0a",
  },
  {
    id: "kpi-goals",
    label: "Feature 10",
    headline: "Track KPIs. Measure what matters.",
    description:
      "Set yearly KPI targets with weightings, log your actual results, and get an auto-calculated performance score. View a full breakdown — weekly, monthly, quarterly, or yearly.",
    mockupType: "screenshot",
    screenshot: "/screenshots/performance-eval.png",
    accentColor: "#a78bfa",
  },
  {
    id: "manage-projects",
    label: "Feature 11",
    headline: "Colour-coded projects. Zero chaos.",
    description:
      "Create custom projects with a name, colour, and emoji. Tasks group automatically under their project with colour-coded left borders. The project manager makes renaming and reordering effortless.",
    mockupType: "screenshot",
    screenshot: "/screenshots/manage-projects.png",
    accentColor: "#39FF14",
  },
  {
    id: "daily-quote",
    label: "Feature 12",
    headline: "Start every session with perspective.",
    description:
      "Each session opens with a curated quote or Hadith on a deep ocean-gradient card. Tap Refresh to cycle to a new one. A quiet, daily nudge to keep perspective on what truly matters.",
    mockupType: "screenshot",
    screenshot: "/screenshots/daily-quote.png",
    accentColor: "#4d9fff",
  },
];

export const STATS = [
  { value: "16+", label: "Features" },
  { value: "100%", label: "Local storage" },
  { value: "None", label: "Cloud required" },
  { value: "Zero", label: "Accounts needed" },
  { value: "macOS", label: "Platform" },
  { value: "Free", label: "To start" },
];

export const TECH_STACK = [
  { icon: "⚡", label: "Electron 29", color: "#4d9fff" },
  { icon: "🟨", label: "Vanilla JS", color: "#ff9f0a" },
  { icon: "💾", label: "localStorage", color: "#39FF14" },
  { icon: "🔔", label: "macOS Notifications", color: "#a78bfa" },
  { icon: "🍎", label: "Apple Silicon", color: "#ff453a" },
  { icon: "∅", label: "Zero Runtime Deps", color: "#607080" },
];

export const TICKER_ITEMS = [
  "Smart Tasks",
  "Daily Milestones",
  "🔥 Streaks",
  "Hydration Reminders",
  "KPI Goals",
  "PDF Reports",
  "Leave Planner",
  "Project Colours",
  "Mood Tags",
  "Subtasks",
  "Recurring Tasks",
  "Daily Quote",
  "Auto-Cleanup",
  "Search & Filter",
  "Meeting Alerts",
  "Offline First",
  "Zero Accounts",
  "Free to Start",
];

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    subtext: "forever, no card needed",
    accentColor: "#607080",
    highlighted: false,
    cta: "Download Free",
    ctaHref: "#download",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Up to 7 tasks", included: true },
          { text: "Basic task management", included: true },
          { text: "Due date & priority tracking", included: true },
        ],
      },
      {
        category: "Goals & KPIs",
        items: [
          { text: "Goals & KPIs tracking", included: false },
          { text: "Work Summary & KPI Evaluation", included: false },
          { text: "Detailed KPI AI evaluation", included: false },
          { text: "PDF report export", included: false },
        ],
      },
      {
        category: "AI Assistant Hub",
        items: [
          { text: "5 free trial generations", included: true },
          { text: "Email & Messages", included: false },
          { text: "Meeting Notes → Tasks", included: false },
          { text: "I am Stuck", included: false },
          { text: "Plan My Day", included: false, badge: "Pro Max" },
        ],
      },
      {
        category: "Support & Extras",
        items: [
          { text: "Priority support", included: false },
          { text: "Early access to new features", included: false },
        ],
      },
    ],
  },
  {
    name: "Pro",
    price: "$7.99",
    subtext: "/ month",
    yearlyPrice: "$66.99",
    yearlySubtext: "/ year",
    accentColor: "#4d9fff",
    highlighted: true,
    cta: "Start Pro",
    ctaHref: "https://buy.stripe.com/14AfZh00O28j5XT8li7bW05",
    yearlyHref: "https://buy.stripe.com/eVqbJ1fZM9AL3PL4527bW06",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Unlimited tasks", included: true },
          { text: "Basic task management", included: true },
          { text: "Due date & priority tracking", included: true },
        ],
      },
      {
        category: "Goals & KPIs",
        items: [
          { text: "Goals & KPIs tracking", included: true },
          { text: "Work Summary & KPI Evaluation", included: true },
          { text: "Detailed KPI AI evaluation", included: false },
          { text: "PDF report export", included: true },
        ],
      },
      {
        category: "AI Assistant Hub",
        items: [
          { text: "50 AI generations / month", included: true },
          { text: "Email & Messages", included: true },
          { text: "Meeting Notes → Tasks", included: true },
          { text: "I am Stuck", included: true },
          { text: "Plan My Day", included: false, badge: "Pro Max" },
        ],
      },
      {
        category: "Support & Extras",
        items: [
          { text: "Priority support", included: false },
          { text: "Early access to new features", included: false },
        ],
      },
    ],
  },
  {
    name: "Pro Max",
    price: "$15.99",
    subtext: "/ month",
    yearlyPrice: "$132.99",
    yearlySubtext: "/ year",
    accentColor: "#a78bfa",
    highlighted: false,
    cta: "Start Pro Max",
    ctaHref: "https://buy.stripe.com/4gM7sL3d0fZ95XTdFC7bW07",
    yearlyHref: "https://buy.stripe.com/28E4gz00OeV58618li7bW08",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Unlimited tasks", included: true },
          { text: "Basic task management", included: true },
          { text: "Due date & priority tracking", included: true },
        ],
      },
      {
        category: "Goals & KPIs",
        items: [
          { text: "Goals & KPIs tracking", included: true },
          { text: "Work Summary & KPI Evaluation", included: true },
          { text: "Detailed KPI AI evaluation", included: true },
          { text: "PDF report export", included: true },
        ],
      },
      {
        category: "AI Assistant Hub",
        items: [
          { text: "200 AI generations / month", included: true },
          { text: "Email & Messages", included: true },
          { text: "Meeting Notes → Tasks", included: true },
          { text: "I am Stuck", included: true },
          { text: "Plan My Day", included: true, badge: "Pro Max" },
        ],
      },
      {
        category: "Support & Extras",
        items: [
          { text: "Priority support", included: true },
          { text: "Early access to new features", included: true },
        ],
      },
    ],
  },
];
