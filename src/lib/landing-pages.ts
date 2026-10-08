/* Solution pages: one per thing people search for ("virtual office software",
   "team task manager", …). Every feature named here exists in the app today. */

export type LandingPage = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  featuresTitle: string;
  features: { title: string; body: string }[];
  stepsTitle: string;
  steps: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  related: { title: string; href: string }[];
};

const PRICE_FAQ = {
  question: "How much does it cost?",
  answer:
    "Start free. The Team plan, with shared boards, chat, calls, the live office and Bloom AI, is from $8 per person a month, billed yearly. One person can use BloomBoard free with no time limit.",
};
const DEVICES_FAQ = {
  question: "Which devices does it work on?",
  answer: "Mac and Windows apps, plus a web app at app.mybloomboard.app that works in any browser.",
};

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "virtual-office",
    kicker: "Virtual office",
    title: "Virtual office software for remote and hybrid teams · BloomBoard",
    description:
      "A live virtual office for remote and hybrid teams: see who is around, walk into rooms without links, knock before you interrupt, plus tasks, boards and AI in the same app.",
    h1: "A virtual office that feels like working side by side",
    intro:
      "See who is around, walk into a room and start talking, no links to send. BloomBoard gives remote and hybrid teams the easy, spontaneous conversations of a real office, with the team's tasks and boards in the same place.",
    featuresTitle: "Everything a real office gives you",
    features: [
      { title: "See who is around", body: "Every desk shows if someone is free, in a room, back later, in focus or on leave, and what they are working on." },
      { title: "Walk into a room", body: "Rooms are always open. Walk in and you are talking, with voice, video and screen sharing." },
      { title: "Knock first", body: "Knock on a busy room or person. They answer Come in, Give me 5 or Not now, so nobody is interrupted mid-thought." },
      { title: "Focus is respected", body: "Start a focus timer and knocks wait until you are done. Your calendar can set you busy during meetings." },
      { title: "Lounge and all hands", body: "An audio-only lounge for a quick chat, and one big room for the weekly update." },
      { title: "The work is right there", body: "Tasks, shared boards, calendar and team chat live next to the office, so a conversation turns into a task in seconds." },
    ],
    stepsTitle: "Set up your office in minutes",
    steps: [
      { title: "Invite your team", body: "Send an invite link. Each person gets a desk in your office." },
      { title: "Rooms appear for each team", body: "Every department gets its own room, plus a lounge, an all-hands room and a focus zone." },
      { title: "Walk in", body: "Click a room or an empty chair and you are in. Share your screen and draw on it to explain." },
    ],
    faqs: [
      { question: "What is a virtual office?", answer: "A shared space online where a remote or hybrid team can see who is around and talk instantly, like walking over to a desk, instead of booking a call for every question." },
      { question: "Do we still need Zoom or Slack?", answer: "Most teams don't. BloomBoard includes voice and video calls with screen sharing, team chat and the live office. Calendar meetings with outside people can stay in your usual tool." },
      PRICE_FAQ,
      DEVICES_FAQ,
    ],
    related: [
      { title: "Roam alternative", href: "/roam-alternative" },
      { title: "Team task manager", href: "/team-task-manager" },
      { title: "How to run a remote team without endless meetings", href: "/guides/remote-team-without-endless-meetings" },
    ],
  },
  {
    slug: "team-task-manager",
    kicker: "Team task manager",
    title: "Team task manager with chat, calls and AI built in · BloomBoard",
    description:
      "A team task manager that keeps tasks, shared boards, chat and calls in one place. Priorities, subtasks, reminders, a daily team recap and AI that plans each person's day.",
    h1: "The team task manager where the conversation happens too",
    intro:
      "Assign work, track progress and talk about it in the same app. BloomBoard keeps your team's tasks, shared boards, chat and calls together, so nothing gets lost between tools.",
    featuresTitle: "Built for how teams really work",
    features: [
      { title: "Tasks with priorities", body: "Urgent, High, Medium and Low, with due dates, subtasks, reminders and notes. The most important work rises to the top on its own." },
      { title: "Shared boards", body: "Boards with columns and cards for every project, with assignees, labels, comments and voice messages." },
      { title: "Type to Task", body: "Type a list in plain words. Dates become deadlines and @names assign teammates." },
      { title: "Everyone stays in the loop", body: "A daily recap of what the team finished and Workload Health that shows when someone has too much on." },
      { title: "Chat and calls", body: "Team chat, voice and video calls with screen sharing, and a live office to drop in on teammates." },
      { title: "AI included", body: "Bloom AI plans each person's day, turns emails and meeting notes into tasks, and writes the recap." },
    ],
    stepsTitle: "Up and running today",
    steps: [
      { title: "Start free", body: "Create your workspace in a minute. No card needed." },
      { title: "Bring your work", body: "Add tasks, create boards or import your Trello boards." },
      { title: "Invite the team", body: "Teammates join with a link and see the boards and tasks assigned to them." },
    ],
    faqs: [
      { question: "Can I assign tasks to teammates?", answer: "Yes. Assign a task or card to anyone on your team. They see it on their own board, and when they move it, you see the change straight away." },
      { question: "Can we import from Trello?", answer: "Yes. Connect Trello or import a board's JSON export, with lists, cards, labels, checklists and due dates." },
      PRICE_FAQ,
      DEVICES_FAQ,
    ],
    related: [
      { title: "BloomBoard vs Asana", href: "/vs/asana" },
      { title: "Kanban board app", href: "/kanban-board-app" },
      { title: "Free weekly team planner template", href: "/templates/weekly-team-planner" },
    ],
  },
  {
    slug: "kanban-board-app",
    kicker: "Kanban board app",
    title: "Kanban board app for teams, with chat and AI · BloomBoard",
    description:
      "A kanban board app for teams on Mac, Windows and the web. Drag-and-drop boards, cards with checklists and due dates, plus team chat, calls and AI in the same app.",
    h1: "A kanban board app your whole team will actually use",
    intro:
      "Simple drag-and-drop boards for every project, with your team's chat, calls and an AI assistant right next to them. Start in a minute, or bring your Trello boards with you.",
    featuresTitle: "Kanban, without the extra apps",
    features: [
      { title: "Drag-and-drop boards", body: "Columns and cards for any workflow, from To do to Done, with your own columns where you need them." },
      { title: "Rich cards", body: "Assignees, due dates, labels, checklists, comments, attachments and voice messages on every card." },
      { title: "Several boards at once", body: "Describe a project and create several boards in one go, already filled with columns." },
      { title: "Priorities that sort themselves", body: "On your task board, Urgent and High work stays on top, and projects move up when they hold urgent tasks." },
      { title: "Talk next to the board", body: "Team chat, calls and a live office, so a question about a card never needs another app." },
      { title: "Import from Trello", body: "Connect Trello and your boards arrive with their lists, labels, checklists and due dates." },
    ],
    stepsTitle: "Your first board in a minute",
    steps: [
      { title: "Create a board", body: "Pick a name and columns, or start from a free template." },
      { title: "Add cards", body: "Type them in, paste a list or import from Trello." },
      { title: "Invite your team", body: "Everyone on the team sees the same board and every change as it happens." },
    ],
    faqs: [
      { question: "Is BloomBoard a good Trello alternative?", answer: "Yes. It has kanban boards like Trello, plus team chat, calls, a live office and an AI assistant included, so teams need fewer apps." },
      { question: "Are there free kanban templates?", answer: "Yes. Download a free template, such as a sprint board or content calendar, and import it into BloomBoard in one step." },
      PRICE_FAQ,
      DEVICES_FAQ,
    ],
    related: [
      { title: "BloomBoard vs Trello", href: "/vs/trello" },
      { title: "Free sprint board template", href: "/templates/sprint-board" },
      { title: "Team task manager", href: "/team-task-manager" },
    ],
  },
  {
    slug: "task-app-for-agencies",
    kicker: "For agencies",
    title: "Project and task app for creative and marketing agencies · BloomBoard",
    description:
      "Run client projects, content calendars and campaigns in one app: client boards, tasks with deadlines, team chat and calls, handovers before a vacation and AI that plans the day.",
    h1: "Run every client project in one calm place",
    intro:
      "Client boards, campaign deadlines, quick reviews and handovers when someone is away. BloomBoard keeps your agency's work and conversations together, so deadlines don't slip between apps.",
    featuresTitle: "Made for client work",
    features: [
      { title: "A board per client", body: "Every client and campaign gets its own board, with briefs, deliverables and due dates on the cards." },
      { title: "In review, built in", body: "Move work to In review when it is ready, so the team sees what is waiting for feedback." },
      { title: "Handovers before a vacation", body: "Hand your projects to a teammate with notes, so clients never notice someone is away." },
      { title: "Email to task", body: "Gmail and Outlook built in. Turn a client email into a task with the deadline and subtasks filled in." },
      { title: "Quick reviews", body: "Walk into a room, share your screen and draw on the design while you talk it through." },
      { title: "Weekly report", body: "See what the team finished, top projects and what carries into next week, every Sunday." },
    ],
    stepsTitle: "How agencies set it up",
    steps: [
      { title: "Create client boards", body: "Start from the free client project board template or import from Trello." },
      { title: "Plan the content", body: "Use the content calendar template to plan posts and campaigns by week." },
      { title: "Bring in the team", body: "Designers, writers and account managers each see their own tasks and the shared boards." },
    ],
    faqs: [
      { question: "Can clients see our boards?", answer: "Boards are shared with people on your team. Many agencies keep internal work in BloomBoard and share finished deliverables with clients as usual." },
      { question: "What happens when someone goes on vacation?", answer: "Use Handover to pass their projects to a teammate with notes, and the team vacation calendar shows who is away and when." },
      PRICE_FAQ,
      DEVICES_FAQ,
    ],
    related: [
      { title: "Free content calendar template", href: "/templates/content-calendar" },
      { title: "Free client project board template", href: "/templates/client-project-board" },
      { title: "Vacation handover checklist", href: "/guides/vacation-handover-checklist" },
    ],
  },
  {
    slug: "daily-planner-app",
    kicker: "AI daily planner",
    title: "AI daily planner app for Mac and Windows · BloomBoard",
    description:
      "An AI daily planner that builds your day around your meetings: focus time for important work, quick wins grouped together, breaks and lunch, and unfinished work from yesterday brought forward.",
    h1: "An AI daily planner that plans your day like an assistant",
    intro:
      "Plan My Day looks at your tasks, deadlines and meetings and builds a realistic day: important work in your best hours, quick wins grouped together, breaks and lunch, and nothing forgotten from yesterday.",
    featuresTitle: "A smarter plan, every morning",
    features: [
      { title: "Around your meetings", body: "Your calendar comes first, with a few minutes to prepare before each meeting." },
      { title: "Best hours for hard work", body: "It learns when you usually get things done and puts the important work there." },
      { title: "Nothing left behind", body: "Unfinished work from yesterday is brought forward, and you choose today, tomorrow or no date." },
      { title: "Breaks and lunch", body: "Short breaks after long focus, and lunch that moves to fit around your meetings." },
      { title: "Never overfilled", body: "A load bar shows how full your day is and keeps time free for surprises." },
      { title: "Adjust in one click", body: "Running late? Move the rest of the day forward. Mark tasks done or push them to tomorrow." },
    ],
    stepsTitle: "Your day, planned in seconds",
    steps: [
      { title: "Add your tasks", body: "Type them in, paste a list with Type to Task, or turn emails into tasks." },
      { title: "Connect your calendar", body: "Google and Outlook calendars sync, so meetings are always in the plan." },
      { title: "Press Plan My Day", body: "Get a realistic timeline for today, with a short summary of what matters most." },
    ],
    faqs: [
      { question: "Does it work with Google Calendar and Outlook?", answer: "Yes. Connect Google or Outlook and your meetings are part of the plan automatically." },
      { question: "Can my team use it too?", answer: "Yes. Every teammate gets their own plan from their own tasks and meetings, and the daily recap keeps the team up to date." },
      PRICE_FAQ,
      DEVICES_FAQ,
    ],
    related: [
      { title: "Time blocking: how to plan your workday", href: "/guides/time-blocking" },
      { title: "Team task manager", href: "/team-task-manager" },
      { title: "Free weekly team planner template", href: "/templates/weekly-team-planner" },
    ],
  },
];

export function landingPage(slug: string) {
  return LANDING_PAGES.find((p) => p.slug === slug)!;
}
