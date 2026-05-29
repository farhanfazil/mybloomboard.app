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
    icon: "🦋",
    title: "Bloom & AI Assistant",
    description:
      "Your full AI layer — Bloom, your always-on AI coworker, plus four specialist tools for email, tasks, planning, and breakthroughs. All powered by Claude AI, all 100% local.",
    accentColor: "#a78bfa",
    mockupType: "ai-all",
    highlight: true,
  },
  {
    icon: "📋",
    title: "Boards",
    description:
      "Dedicated boards for each project with real-time progress tracking on the main dashboard, team notifications, comments, images, and member tagging.",
    accentColor: "#a78bfa",
    mockupType: "boards",
  },
  {
    icon: "👥",
    title: "Teams",
    description:
      "Managers and members can collaborate in one workspace, add teammates, track performance, monitor progress, review tasks, and generate reports.",
    accentColor: "#39FF14",
    mockupType: "teams",
  },
  {
    icon: "💬",
    title: "Team Chat",
    description:
      "Create group chats, message teammates individually, send voice notes, share images, and keep ideas connected to the work that matters.",
    accentColor: "#4d9fff",
    mockupType: "team-chat",
  },
  {
    icon: "🎙️",
    title: "Voice Messages",
    description:
      "Add voice messages directly inside board comments so teammates can explain decisions, updates, and feedback without typing everything out.",
    accentColor: "#ff9f0a",
    mockupType: "voice",
  },
  {
    icon: "🙂",
    title: "Mood Avatars",
    description:
      "Choose an avatar that matches your mood, energy, or focus state, giving your workspace a more personal and expressive daily feel.",
    accentColor: "#f472b6",
    mockupType: "avatar",
  },
  {
    icon: "☁️",
    title: "Cloud Data",
    description:
      "Your app data stays securely backed up in the cloud, so your tasks, boards, notes, and reports remain protected if your device changes.",
    accentColor: "#4d9fff",
    mockupType: "cloud",
  },
  {
    icon: "🔐",
    title: "Security",
    description:
      "Built with protected access, secure data handling, and privacy-minded workflows so teams can manage important work with confidence.",
    accentColor: "#39FF14",
    mockupType: "security",
  },
  {
    icon: "📌",
    title: "Quick Sticky Notes",
    description:
      "Create multiple sticky notes that stay visible on top of your workspace, highlighted for reminders, ideas, follow-ups, and urgent details.",
    accentColor: "#ff9f0a",
    mockupType: "sticky-notes",
  },
  {
    icon: "🧑‍💼",
    title: "Unlimited Team Members",
    description:
      "Invite members to join your workspace, keep everyone connected, and collaborate across boards, comments, tasks, reports, and shared updates.",
    accentColor: "#a78bfa",
    mockupType: "team-members",
  },
  {
    icon: "🌓",
    title: "Dark & Light Mode",
    description:
      "Switch between dark and light mode, tune board colors, and shape each workspace around the way your team likes to focus.",
    accentColor: "#4d9fff",
    mockupType: "themes",
  },
  {
    icon: "🔔",
    title: "Notification Bell",
    description:
      "Never miss a task, request, board update, or team mention. Members receive timely notifications so work keeps moving.",
    accentColor: "#ff9f0a",
    mockupType: "notifications",
  },
  {
    icon: "✉️",
    title: "AI Email & Messages",
    description:
      "Fix, rewrite, and generate professional emails plus casual messages for WhatsApp and Slack in seconds.",
    accentColor: "#4d9fff",
    mockupType: "ai-email",
  },
  {
    icon: "📝",
    title: "AI Meeting Notes to Tasks",
    description:
      "Paste meeting notes and AI extracts every action item, then adds the tasks directly into your daily workflow.",
    accentColor: "#a78bfa",
    mockupType: "ai-notes",
  },
  {
    icon: "🗓️",
    title: "AI Plan My Day",
    description:
      "AI reads your tasks, priorities, due dates, and workload to build a smart time-blocked schedule for today.",
    accentColor: "#39FF14",
    mockupType: "ai-plan",
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
    id: "ai-all",
    label: "AI",
    headline: "Bloom + AI Assistant. Your full AI layer.",
    description:
      "Two AI experiences, one app. Bloom is your always-on AI coworker — chat naturally to create tasks, schedule meetings, and plan your day. The AI Assistant Hub gives you four specialist tools: email writing, meeting notes to tasks, daily scheduling, and breaking through procrastination.",
    bullets: [
      "🦋 Bloom — chat to create tasks, meetings, emails by voice or text",
      "✨ AI Assistant Hub — Email, Meeting Notes, Plan My Day, I am Stuck",
      "⚡ All powered by Claude AI · Nothing leaves your device",
    ],
    mockupType: "ai-all",
    accentColor: "#a78bfa",
  },
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
    label: "Feature 05",
    headline: "Watch your day unfold in real time.",
    description:
      "Tasks due today appear as numbered dots on a timeline. Pending is grey, ongoing pulses blue, done glows green. Hit 100% and get a personalised celebration message.",
    mockupType: "screenshot",
    screenshot: "/screenshots/milestone-complete.png",
    accentColor: "#39FF14",
  },
  {
    id: "new-task",
    label: "Feature 07",
    headline: "Add tasks in seconds.",
    description:
      "The task creation modal is fast and frictionless. Set a title, description, priority, deadline, project, and mood tag — all in one clean form. Voice input supported for title and description.",
    mockupType: "screenshot",
    screenshot: "/screenshots/new-task-modal.png",
    accentColor: "#4d9fff",
  },
  {
    id: "reminders-meetings",
    label: "Feature 08",
    headline: "Never miss a meeting or reminder.",
    description:
      "The Reminders & Meetings panel surfaces everything upcoming — meetings with 5-min alerts, leave dates with countdowns, and time-sensitive reminders glowing amber when due. Full-screen reminder popups for critical items.",
    mockupType: "screenshot",
    screenshot: "/screenshots/reminders-meetings.png",
    accentColor: "#a78bfa",
  },
  {
    id: "add-event",
    label: "Feature 09",
    headline: "Log events with full context.",
    description:
      "Add Leave, Meeting, or Reminder events with a start date, optional end date, time, and notes. Meeting time triggers an automatic 5-minute native macOS alert so you're never caught off-guard.",
    mockupType: "screenshot",
    screenshot: "/screenshots/add-event.png",
    accentColor: "#4d9fff",
  },
  {
    id: "streak",
    label: "Feature 10",
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
    label: "Feature 11",
    headline: "Track KPIs. Measure what matters.",
    description:
      "Set yearly KPI targets with weightings, log your actual results, and get an auto-calculated performance score. View a full breakdown — weekly, monthly, quarterly, or yearly.",
    mockupType: "screenshot",
    screenshot: "/screenshots/performance-eval.png",
    accentColor: "#a78bfa",
  },
  {
    id: "manage-projects",
    label: "Feature 12",
    headline: "Colour-coded projects. Zero chaos.",
    description:
      "Create custom projects with a name, colour, and emoji. Tasks group automatically under their project with colour-coded left borders. The project manager makes renaming and reordering effortless.",
    mockupType: "screenshot",
    screenshot: "/screenshots/manage-projects.png",
    accentColor: "#39FF14",
  },
  {
    id: "daily-quote",
    label: "Feature 13",
    headline: "Start every session with perspective.",
    description:
      "Each session opens with a curated quote or Hadith on a deep ocean-gradient card. Tap Refresh to cycle to a new one. A quiet, daily nudge to keep perspective on what truly matters.",
    mockupType: "screenshot",
    screenshot: "/screenshots/daily-quote.png",
    accentColor: "#4d9fff",
  },
];

export const STATS = [
  { value: "40+", label: "Features" },
  { value: "100%", label: "Local storage" },
  { value: "None", label: "Cloud required" },
  { value: "Zero", label: "Accounts needed" },
  { value: "macOS", label: "Platform" },
  { value: "Free", label: "To start" },
];

export const FAQS = [
  {
    question: "What is Bloombooard?",
    answer:
      "Bloombooard is a macOS productivity app that brings tasks, reminders, milestones, streaks, hydration, boards, KPIs, reports, and AI planning into one focused dashboard.",
  },
  {
    question: "Is Bloombooard free to start?",
    answer:
      "Yes. The Free plan is available forever and includes the core task workflow, reminders, meetings, and limited boards so you can try the app before upgrading.",
  },
  {
    question: "Does Bloombooard work offline?",
    answer:
      "Bloombooard is designed as a local-first desktop app. Your everyday workflow is built around fast access on your Mac without requiring a browser tab or cloud account.",
  },
  {
    question: "Is the dashboard customizable?",
    answer:
      "Yes. You can customize the dashboard around the way you work, including boards, projects, priorities, reminders, task details, health tracking, and the views you rely on most.",
  },
  {
    question: "What do Pro and Pro Max unlock?",
    answer:
      "Pro adds more power for daily work, including unlimited tasks, boards, AI task automation, email and message tools, meeting notes, and PDF report export. Pro Max expands the app with unlimited AI generations, KPI tools, advanced planning, and priority features.",
  },
  {
    question: "Can teams use Bloombooard together?",
    answer:
      "Yes. The Team plan is built for managers and members who need shared boards, task assignment, member progress, reports, notifications, comments, and team performance tracking.",
  },
  {
    question: "Can Bloombooard create reports?",
    answer:
      "Yes. Paid plans include PDF report export, and Pro Max adds deeper KPI tracking and work summary evaluation for people who need a clearer performance view.",
  },
  {
    question: "What can the AI features do?",
    answer:
      "Bloom AI can help write emails and messages, turn meeting notes into tasks, plan your day, automate tasks, and support you when you are stuck or need a clearer next step.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "Bloombooard is designed for macOS 11 and later, including Apple Silicon and Intel Macs.",
  },
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
          { text: "Reminders & Meetings", included: true },
          { text: "Boards - 5 boards", included: true },
          { text: "Bloom AI Task Automation", included: false },
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
          { text: "🦋 Bloom AI Coworker", included: false },
          { text: "Email & Messages (5 / month)", included: true },
          { text: "Meeting Notes → Tasks (5 / month)", included: true },
          { text: "I am Stuck", included: false },
          { text: "Plan My Day", included: false, badge: "Pro Max" },
        ],
      },
      {
        category: "Team",
        items: [
          { text: "Team members reports and progress", included: false },
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
    highlighted: false,
    cta: "7 days trial",
    ctaHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_TQSyTPGy63wMNw0r31v3GtyYNvU6YFgOmO7Rz3I5phX/redirect",
    yearlyHref: "https://buy.stripe.com/eVqbJ1fZM9AL3PL4527bW06",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Unlimited tasks", included: true },
          { text: "Basic task management", included: true },
          { text: "Due date & priority tracking", included: true },
          { text: "Reminders & Meetings", included: true },
          { text: "Boards - 10 boards", included: true },
          { text: "Bloom AI Task Automation", included: true },
        ],
      },
      {
        category: "Goals & KPIs",
        items: [
          { text: "Goals & KPIs tracking", included: false, badge: "Pro Max" },
          { text: "Work Summary & KPI Evaluation", included: false, badge: "Pro Max" },
          { text: "Detailed KPI AI evaluation", included: false },
          { text: "PDF report export", included: true },
        ],
      },
      {
        category: "AI Assistant Hub",
        items: [
          { text: "🦋 Bloom AI Coworker (50 tasks / month)", included: true },
          { text: "Email & Messages (50 / month)", included: true },
          { text: "Meeting Notes → Tasks (20 / month)", included: true },
          { text: "I am Stuck (20 / month)", included: true },
          { text: "Plan My Day", included: false, badge: "Pro Max" },
        ],
      },
      {
        category: "Team",
        items: [
          { text: "Team members reports and progress", included: false, badge: "Team" },
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
    highlighted: true,
    badgeLabel: "Best Value",
    cta: "7 days trial",
    ctaHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_tZmnylGTB2b9OizlujPnaSQe0y0HJRqG9IVfn0X241v/redirect",
    yearlyHref: "https://buy.stripe.com/28E4gz00OeV58618li7bW08",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Unlimited tasks", included: true },
          { text: "Basic task management", included: true },
          { text: "Due date & priority tracking", included: true },
          { text: "Reminders & Meetings", included: true },
          { text: "Boards - Unlimited", included: true },
          { text: "Bloom AI Task Automation", included: true },
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
          { text: "AI Assistance (Unlimited)", included: true },
          { text: "🦋 Bloom AI Coworker (Unlimited)", included: true },
          { text: "Email & Messages (Unlimited)", included: true },
          { text: "Meeting Notes → Tasks (Unlimited)", included: true },
          { text: "I am Stuck (Unlimited)", included: true },
          { text: "Plan My Day", included: true, badge: "Pro Max" },
        ],
      },
      {
        category: "Team",
        items: [
          { text: "Team members reports and progress", included: false, badge: "Team" },
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
  {
    name: "Team",
    price: "$14.99",
    subtext: "/ user / month",
    accentColor: "#a78bfa",
    highlighted: false,
    cta: "Start Team Plan",
    ctaHref: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_2p9qjn127usEg6vCfEv6kgUVatpK4wzKHMcXF2GU9K2/redirect",
    featureGroups: [
      {
        category: "Tasks & Planning",
        items: [
          { text: "Unlimited tasks", included: true },
          { text: "Task assignment by managers", included: true },
          { text: "Shared project workspaces", included: true },
          { text: "Reminders & Meetings", included: true },
          { text: "Boards - Unlimited", included: true },
          { text: "Bloom AI Task Automation", included: true },
        ],
      },
      {
        category: "Goals & KPIs",
        items: [
          { text: "Team KPI tracking", included: true },
          { text: "Team performance reports", included: true },
          { text: "Shared PDF report exports", included: true },
          { text: "KPI leaderboard", included: true },
        ],
      },
      {
        category: "AI Assistant Hub",
        items: [
          { text: "Unlimited AI generations", included: true },
          { text: "🦋 Bloom AI Coworker", included: true },
          { text: "Email & Messages", included: true },
          { text: "Meeting Notes → Tasks", included: true },
          { text: "I am Stuck", included: true },
          { text: "Plan My Day", included: true, badge: "Pro Max" },
        ],
      },
      {
        category: "Team",
        items: [
          { text: "Team members reports and progress", included: true },
          { text: "Voice messages in board comments", included: true },
          { text: "Team chat for every workspace", included: true },
          { text: "Group-based team conversations", included: true },
          { text: "Member tagging in cards and comments", included: true },
        ],
      },
      {
        category: "Support & Extras",
        items: [
          { text: "Admin dashboard & controls", included: true },
          { text: "Real-time task sync", included: true },
          { text: "In-task comments & feedback", included: true },
          { text: "Up to 50 seats", included: true },
          { text: "Custom plans for enterprises and large organizations", included: true },
        ],
      },
    ],
  },
];
