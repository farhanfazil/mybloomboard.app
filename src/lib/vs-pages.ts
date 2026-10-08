/* "BloomBoard vs …" pages: one per tool people switch from. Honest on purpose:
   each page says where the other tool is the better pick. Feature rows come
   from the shared comparison table (src/lib/compare-data.ts). */

export type VsPage = {
  slug: string;
  name: string;            // column name in the comparison table
  title: string;           // <title>
  description: string;     // meta description
  h1: string;
  intro: string;
  pickThem: string[];      // when the other tool is the better choice
  pickUs: string[];        // when BloomBoard is
  switching: string;
  faqs: { question: string; answer: string }[];
};

const COMMON_FAQ = {
  free: {
    question: "Is BloomBoard really free?",
    answer:
      "Yes, for one person: the Free plan has no time limit and no card is needed. Teams use the Team plan, from $8 per person a month billed yearly, with shared boards, chat, calls, the live office, handovers, a manager overview and Bloom AI. Bloom, from $6 a month, is for individuals who want Bloom AI.",
  },
  platforms: {
    question: "Which devices does it work on?",
    answer:
      "Mac and Windows apps, plus a web app at app.mybloomboard.app that works in any browser, so everyone on the team can join from their own computer.",
  },
};

export const VS_PAGES: VsPage[] = [
  {
    slug: "trello",
    name: "Trello",
    title: "BloomBoard vs Trello: a Trello alternative with chat, calls and AI",
    description:
      "Compare BloomBoard and Trello. Kanban boards like Trello, plus built-in team chat, calls, a live team office and an AI that plans your day. Free plan, imports your Trello boards.",
    h1: "The Trello alternative with your team built in",
    intro:
      "Trello made kanban boards simple. BloomBoard keeps that simplicity and adds what teams usually bolt on with other apps: chat, voice and video calls, a live office where you can see who is free, and an AI that turns your list into a plan for the day.",
    pickThem: [
      "Your team only needs simple boards and nothing else.",
      "You rely on a large library of Power-Ups and integrations.",
      "Your company already runs on Atlassian tools like Jira.",
    ],
    pickUs: [
      "Your team switches between a board, Slack and Zoom all day.",
      "Managers want to see progress, workload and a daily recap without chasing people.",
      "You want AI that plans each person's day, included in the price.",
    ],
    switching:
      "Bring your Trello boards over in about a minute: connect Trello in the app, or import a board's JSON export. Lists, cards, labels and checklists come with them.",
    faqs: [
      {
        question: "Can I import my Trello boards?",
        answer:
          "Yes. In BloomBoard open My Boards, then Import, and connect Trello or drop in a board's JSON export. Lists become columns and cards keep their labels, checklists and due dates.",
      },
      {
        question: "Does BloomBoard have kanban boards like Trello?",
        answer:
          "Yes: boards with columns and cards, drag and drop, labels, due dates, assignees and comments. Your tasks also have their own board with To do, In progress, In review and Done.",
      },
      COMMON_FAQ.free,
      COMMON_FAQ.platforms,
    ],
  },
  {
    slug: "clickup",
    name: "ClickUp",
    title: "BloomBoard vs ClickUp: a simpler ClickUp alternative",
    description:
      "Compare BloomBoard and ClickUp. Tasks, boards, chat, calls and a live team office in a calm app you can learn in minutes, with AI included. Free plan, Mac, Windows and web.",
    h1: "The calmer ClickUp alternative",
    intro:
      "ClickUp can do almost anything, which is also why many teams find it heavy. BloomBoard covers what most teams use every day, tasks, boards, chat, calls and planning, in an app you can learn in minutes, with Bloom AI included instead of sold as an add-on.",
    pickThem: [
      "You need deep custom fields, docs and automations across many departments.",
      "You run large programmes with dashboards for dozens of teams.",
      "You want one tool to replace a long list of specialised apps.",
    ],
    pickUs: [
      "Your team should be productive on day one, without training or a setup project.",
      "You want a live office to see who is free and drop in, not just chat.",
      "Managers want a daily recap and workload view included, not sold as add-ons.",
    ],
    switching:
      "Start free and set up a board in minutes. Trello boards import today; importers for ClickUp and other tools are on the way.",
    faqs: [
      {
        question: "Is BloomBoard easier than ClickUp?",
        answer:
          "That is the idea. BloomBoard has fewer settings and one clear place for each thing: your day, your tasks, your boards and your team. Most people are productive in the first ten minutes.",
      },
      {
        question: "Does BloomBoard have chat and calls like ClickUp?",
        answer:
          "Yes, on the Team plan: team chat, voice and video calls with screen sharing, and a live office with rooms you can walk into.",
      },
      COMMON_FAQ.free,
      COMMON_FAQ.platforms,
    ],
  },
  {
    slug: "notion",
    name: "Notion",
    title: "BloomBoard vs Notion: a task and team app, not a blank page",
    description:
      "Compare BloomBoard and Notion. Ready-made tasks, boards, calendar, chat and calls with AI planning, instead of building your own system. Free plan for individuals.",
    h1: "The Notion alternative for getting work done",
    intro:
      "Notion is a blank page you can turn into anything, if you have the time to build it. BloomBoard comes ready: tasks, boards, calendar, notes, team chat and calls, with an AI that plans your day from what you already have.",
    pickThem: [
      "Your team mainly writes docs, wikis and knowledge bases.",
      "Someone on your team enjoys building and maintaining your own system.",
      "You rely on a large community template gallery.",
    ],
    pickUs: [
      "You want task management that works for the whole team from the first day.",
      "You want chat, calls and a live office in the same app as the work.",
      "Managers want progress, workload and recaps without building dashboards.",
    ],
    switching:
      "Keep Notion for your docs if you like, and run your tasks and team in BloomBoard. A Notion importer is on the way.",
    faqs: [
      {
        question: "Can BloomBoard replace Notion?",
        answer:
          "For tasks, projects, meetings and team communication, yes. For long-form docs and wikis, many teams keep Notion and use BloomBoard for the daily work.",
      },
      {
        question: "Does BloomBoard have notes?",
        answer:
          "Yes: notes with pinning and an optional PIN lock, sticky notes, and meeting notes that Bloom AI can turn into tasks.",
      },
      COMMON_FAQ.free,
      COMMON_FAQ.platforms,
    ],
  },
  {
    slug: "monday",
    name: "Monday",
    title: "BloomBoard vs monday.com: an alternative with chat and calls built in",
    description:
      "Compare BloomBoard and monday.com. Boards and tasks plus team chat, calls, a live office and AI planning, with a free plan and simple pricing from $8 per person.",
    h1: "The monday.com alternative for small teams",
    intro:
      "monday.com is a flexible work platform built for companies of every size. BloomBoard is built for small and growing teams that want their tasks, boards and conversations in one calm place, with simple pricing and AI included.",
    pickThem: [
      "You need highly customised workflows, automations and reporting.",
      "Many departments must run on one heavily configured platform.",
      "You have someone to administer and configure it full time.",
    ],
    pickUs: [
      "Your team wants chat, calls and a live office without adding Slack and Zoom.",
      "You want simple per-person pricing with AI included.",
      "Managers want a daily recap and workload view out of the box.",
    ],
    switching:
      "Start free in minutes. A spreadsheet importer for monday.com exports is on the way.",
    faqs: [
      {
        question: "Is BloomBoard cheaper than monday.com?",
        answer:
          "BloomBoard has a free plan with no time limit, Bloom from $6 a month and Team from $8 per person a month, billed yearly, with Bloom AI included. Compare with monday.com's current prices on their site, since plans change.",
      },
      {
        question: "Does BloomBoard have boards like monday.com?",
        answer:
          "Yes: boards with columns, cards, assignees, due dates and priorities, plus a task board for your own work and a manager overview.",
      },
      COMMON_FAQ.free,
      COMMON_FAQ.platforms,
    ],
  },
  {
    slug: "asana",
    name: "Asana",
    title: "BloomBoard vs Asana: an Asana alternative with chat, calls and AI",
    description:
      "Compare BloomBoard and Asana. Tasks and boards plus team chat, calls, a live team office and AI that plans your day. Free plan, Mac, Windows and web.",
    h1: "The Asana alternative with your team in one place",
    intro:
      "Asana is strong at planning projects across a company. BloomBoard focuses on the day-to-day of a team: your tasks, shared boards, chat, calls and a live office, with an AI that plans your day and writes your recap.",
    pickThem: [
      "You manage portfolios, goals and timelines across many teams.",
      "You need advanced reporting and admin controls for a large company.",
      "Your organisation has already standardised on it.",
    ],
    pickUs: [
      "Your team wants conversations and tasks in the same app.",
      "You want to see who is free right now and drop into a room.",
      "You want AI planning and a daily recap included, not a paid add-on.",
    ],
    switching:
      "Start free and set up your first board in minutes. An Asana importer is on the way.",
    faqs: [
      {
        question: "Does BloomBoard have projects like Asana?",
        answer:
          "Yes: projects group your tasks, boards hold your team's work, and each task has priorities, due dates, subtasks, reminders and notes.",
      },
      {
        question: "Can managers see the team's workload?",
        answer:
          "Yes. The Team plan includes a manager overview, Workload Health and a Daily Recap of what everyone finished.",
      },
      COMMON_FAQ.free,
      COMMON_FAQ.platforms,
    ],
  },
];

export function vsPage(slug: string) {
  return VS_PAGES.find((p) => p.slug === slug) || null;
}
