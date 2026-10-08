/* Guides: practical articles that answer what teams search for. Plain, useful
   advice first; BloomBoard is mentioned where it genuinely helps. */

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export type Guide = {
  slug: string;
  title: string;          // <title>
  description: string;
  h1: string;
  intro: string;
  published: string;      // ISO date
  readMinutes: number;
  body: GuideBlock[];
  related: { title: string; href: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "remote-team-without-endless-meetings",
    title: "How to run a remote team without endless meetings · BloomBoard",
    description:
      "A practical guide to running a remote or hybrid team with fewer meetings: written updates, office hours, quick drop-ins, focus time and a weekly rhythm that keeps everyone aligned.",
    h1: "How to run a remote team without endless meetings",
    intro:
      "Remote teams often replace the quick chat at someone's desk with a 30-minute video call. Multiply that by every question and the calendar fills up. Here is a simple rhythm that keeps a remote team aligned with far fewer meetings.",
    published: "2026-10-08",
    readMinutes: 6,
    body: [
      { type: "h2", text: "1. Decide what actually needs a meeting" },
      { type: "p", text: "Most meetings fall into three groups: sharing status, making a decision, or solving a problem together. Only the last two really need everyone at the same time. Status can almost always be written down." },
      { type: "ul", items: [
        "Status update: write it, don't meet.",
        "Decision with a few people: a short call with only the people who decide.",
        "Problem solving or creative work: meet, ideally with a shared screen.",
      ] },
      { type: "h2", text: "2. Replace the daily stand-up with a written recap" },
      { type: "p", text: "A daily stand-up on video costs every person 15 to 30 minutes, often at an awkward time across time zones. A short written recap does the same job: what I finished yesterday, what I am doing today, and anything blocking me." },
      { type: "tip", text: "In BloomBoard, the Daily Recap writes this for you from the tasks you finished and what is due today. Post it to team chat in one click." },
      { type: "h2", text: "3. Make quick questions quick again" },
      { type: "p", text: "In an office you would lean over and ask. Remotely, the same question becomes a scheduled call. Give people a way to see who is free right now and talk for two minutes without booking anything." },
      { type: "ul", items: [
        "Show availability: free, in a meeting, in focus, back later.",
        "Knock before interrupting, and let people answer \"give me 5\".",
        "Keep a lounge or open room where anyone can drop in.",
      ] },
      { type: "tip", text: "BloomBoard's live office does exactly this: every desk shows who is free, rooms are always open, and a knock waits while someone is in focus." },
      { type: "h2", text: "4. Protect focus time" },
      { type: "p", text: "Fewer meetings only helps if the free time is actually protected. Agree on focus blocks, for example every morning until 11, when the team doesn't expect instant replies. Turn notifications down during those hours." },
      { type: "h2", text: "5. Keep one weekly meeting, and make it count" },
      { type: "p", text: "One 30 to 45 minute weekly meeting is enough for most small teams. Use it for priorities and decisions, not status. Send the agenda the day before and finish with clear owners for every action." },
      { type: "ol", items: [
        "Wins from last week (5 minutes).",
        "This week's priorities and who owns them (15 minutes).",
        "Decisions and blockers (15 minutes).",
        "Actions with an owner and a date (5 minutes).",
      ] },
      { type: "h2", text: "6. Turn meeting notes into tasks immediately" },
      { type: "p", text: "Actions that stay in meeting notes get forgotten. Before you close the call, every action becomes a task with an owner and a due date." },
      { type: "tip", text: "BloomBoard's meeting notes can turn what was agreed into tasks, with owners and deadlines, in one step." },
      { type: "h2", text: "A simple weekly rhythm" },
      { type: "ul", items: [
        "Monday: one weekly planning meeting.",
        "Every day: a written recap instead of a stand-up.",
        "Any time: quick drop-ins through the live office for questions.",
        "Mornings: protected focus time.",
        "Friday: a short written review of what shipped.",
      ] },
      { type: "p", text: "Start with one change, such as replacing the daily stand-up with a written recap, and add the rest over a few weeks. Most teams win back several hours per person every week." },
    ],
    related: [
      { title: "Virtual office for remote teams", href: "/virtual-office" },
      { title: "Free weekly team planner template", href: "/templates/weekly-team-planner" },
      { title: "Roam alternative", href: "/roam-alternative" },
    ],
  },
  {
    slug: "time-blocking",
    title: "Time blocking: how to plan your workday (step by step) · BloomBoard",
    description:
      "Learn time blocking step by step: list your tasks, put meetings first, block focus time for important work, group small tasks, add breaks and buffer time, and review at the end of the day.",
    h1: "Time blocking: how to plan your workday, step by step",
    intro:
      "Time blocking means giving every part of your day a job: this hour for the report, this half hour for email, this block for lunch. It turns a long to-do list into a plan you can actually finish. Here is how to do it well.",
    published: "2026-10-08",
    readMinutes: 5,
    body: [
      { type: "h2", text: "Why time blocking works" },
      { type: "p", text: "A to-do list tells you what to do, but not when. Without a plan, urgent small things fill the day and the important work slips to tomorrow. Blocking time forces you to decide what really fits." },
      { type: "h2", text: "Step 1: List everything for today" },
      { type: "p", text: "Write down every task you want to do today, including small ones. Mark the one or two that matter most. Anything overdue from yesterday goes at the top of the list." },
      { type: "h2", text: "Step 2: Put your meetings in first" },
      { type: "p", text: "Meetings are fixed, so they go on the plan first. Add a few minutes before important meetings to prepare, and avoid starting deep work in a 20-minute gap between two calls." },
      { type: "h2", text: "Step 3: Block your best hours for your most important work" },
      { type: "p", text: "Most people have a time of day when they think best, often the morning. Give that block to the hardest, most important task, and protect it from email and messages." },
      { type: "h2", text: "Step 4: Group small tasks together" },
      { type: "p", text: "Replies, quick approvals and short admin tasks fit well in one 30 to 45 minute block. Doing them together is faster than scattering them through the day." },
      { type: "h2", text: "Step 5: Add breaks, lunch and a buffer" },
      { type: "ul", items: [
        "A short break after 60 to 90 minutes of focus.",
        "A real lunch away from the screen.",
        "About 30 minutes of free buffer for surprises.",
        "Ten minutes at the end to wrap up and plan tomorrow.",
      ] },
      { type: "p", text: "A plan that is 100% full fails at the first interruption. Aim for about 75 to 85% of your day planned." },
      { type: "h2", text: "Step 6: Adjust when the day changes" },
      { type: "p", text: "Things run late. When they do, don't abandon the plan: move the rest of the day forward and push the least important task to tomorrow." },
      { type: "tip", text: "BloomBoard's Plan My Day does all of this for you: meetings first with prep time, important work in your best hours, quick wins grouped, breaks, lunch and a buffer. If you run late, one click moves the rest of the day." },
      { type: "h2", text: "Step 7: Review at the end of the day" },
      { type: "p", text: "Before you finish, tick off what you completed and decide what happens to the rest: tomorrow, later this week, or not at all. Tomorrow's plan starts from there." },
      { type: "h2", text: "A sample time-blocked day" },
      { type: "ul", items: [
        "8:30 Breakfast and plan the day (15 min)",
        "9:00 Team meeting (45 min)",
        "9:45 Most important task (90 min)",
        "11:15 Short break (10 min)",
        "11:25 Quick wins: replies and approvals (35 min)",
        "12:30 Lunch (45 min)",
        "1:15 Second focus block (90 min)",
        "2:45 Short walk (10 min)",
        "2:55 Smaller project work (60 min)",
        "4:15 Buffer for surprises (30 min)",
        "4:45 Wrap up and plan tomorrow (15 min)",
      ] },
    ],
    related: [
      { title: "AI daily planner", href: "/daily-planner-app" },
      { title: "Free weekly team planner template", href: "/templates/weekly-team-planner" },
      { title: "How to run a remote team without endless meetings", href: "/guides/remote-team-without-endless-meetings" },
    ],
  },
  {
    slug: "vacation-handover-checklist",
    title: "Vacation handover checklist: hand over your work before you go · BloomBoard",
    description:
      "A vacation handover checklist for work: what to hand over, who to tell, how to write a handover note, and how to make sure nothing is dropped while you are away.",
    h1: "Vacation handover checklist: how to hand over your work before you go",
    intro:
      "A good handover means you can switch off on vacation and come back to no surprises. This checklist covers what to hand over, how to write the note, and who needs to know.",
    published: "2026-10-08",
    readMinutes: 5,
    body: [
      { type: "h2", text: "Two weeks before" },
      { type: "ul", items: [
        "Put your vacation dates on the team calendar.",
        "Agree who covers each part of your work. Big projects may need different people.",
        "Tell clients or partners who will be their contact while you are away.",
        "Move deadlines that land during your vacation, or hand them over now.",
      ] },
      { type: "h2", text: "One week before" },
      { type: "ul", items: [
        "List every open task and project, with its status and next step.",
        "Finish or close anything small rather than handing it over.",
        "Share access to files, folders and accounts your cover will need.",
        "Walk your cover through anything complicated, ideally with a shared screen.",
      ] },
      { type: "h2", text: "How to write a handover note" },
      { type: "p", text: "For each piece of work, your cover needs to know four things. Keep it short; a few lines per item is enough." },
      { type: "ol", items: [
        "What it is and why it matters.",
        "Where it stands today.",
        "The next step and its deadline.",
        "Who to ask if something goes wrong.",
      ] },
      { type: "tip", text: "BloomBoard's Handover lets you pick your open tasks, add a note to each and hand them to a teammate in one go. When you come back, everything returns to you with what changed." },
      { type: "h2", text: "The day before" },
      { type: "ul", items: [
        "Set your out-of-office reply with the dates and your cover's name.",
        "Set your status to on leave so the team knows not to wait for you.",
        "Send a short message to the team: dates, who covers what, and where the notes are.",
        "Check that nothing urgent is due in your first two days back.",
      ] },
      { type: "h2", text: "While you are away" },
      { type: "p", text: "Agree in advance whether, and how, you want to be contacted for a true emergency. Then trust the handover and switch off." },
      { type: "h2", text: "When you come back" },
      { type: "ul", items: [
        "Read the notes from your cover before your inbox.",
        "Take back your tasks and check what changed.",
        "Thank the people who covered for you.",
      ] },
    ],
    related: [
      { title: "Task app for agencies", href: "/task-app-for-agencies" },
      { title: "Free client project board template", href: "/templates/client-project-board" },
      { title: "Team task manager", href: "/team-task-manager" },
    ],
  },
];

export function guide(slug: string) {
  return GUIDES.find((g) => g.slug === slug) || null;
}
