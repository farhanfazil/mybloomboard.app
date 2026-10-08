/* Free board templates. Each one is shown as a board preview on its page and
   can be downloaded as a small board file that BloomBoard imports
   (My Boards, Import). The file uses Trello's board format, which the
   importer already reads. */

export type TemplateCard = { title: string; desc?: string; checklist?: string[] };
export type Template = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  forWho: string;
  columns: { title: string; cards: TemplateCard[] }[];
  tips: { title: string; body: string }[];
};

export const TEMPLATES: Template[] = [
  {
    slug: "weekly-team-planner",
    name: "Weekly team planner",
    title: "Free weekly team planner template · BloomBoard",
    description:
      "A free weekly team planner template: plan the week by day, see what everyone is working on and carry unfinished work forward. Download and import into BloomBoard.",
    h1: "Free weekly team planner template",
    intro: "Plan your team's week by day, keep priorities visible and carry unfinished work into next week without losing track.",
    forWho: "Small teams, team leads and anyone who plans work by the week.",
    columns: [
      { title: "This week's goals", cards: [
        { title: "Ship the new onboarding emails", desc: "The one result that matters most this week." },
        { title: "Close three open support issues" },
      ] },
      { title: "Monday", cards: [
        { title: "Weekly planning meeting (30 min)", checklist: ["Review last week", "Agree this week's goals", "Assign owners"] },
        { title: "Draft onboarding email 1" },
      ] },
      { title: "Tuesday", cards: [{ title: "Draft onboarding emails 2 and 3" }] },
      { title: "Wednesday", cards: [{ title: "Review drafts together" }] },
      { title: "Thursday", cards: [{ title: "Final edits and test sends" }] },
      { title: "Friday", cards: [{ title: "Launch and share results", checklist: ["Send to new sign-ups", "Post a summary in team chat"] }] },
      { title: "Next week", cards: [{ title: "Anything that didn't fit goes here" }] },
    ],
    tips: [
      { title: "Start with the goal", body: "Write one or two results for the week before planning the days. Every card should move a goal forward." },
      { title: "Plan on Monday, review on Friday", body: "A 30-minute planning meeting and a 15-minute review keep the week honest." },
      { title: "Let BloomBoard carry it", body: "Plan My Day brings unfinished work forward, and your weekly report shows what you finished." },
    ],
  },
  {
    slug: "content-calendar",
    name: "Content calendar",
    title: "Free content calendar template for teams · BloomBoard",
    description:
      "A free content calendar template: move posts from idea to draft, review, scheduled and published. Download and import into BloomBoard to plan content with your team.",
    h1: "Free content calendar template",
    intro: "Move every post from idea to published on one board, so writers, designers and reviewers always know what is next.",
    forWho: "Marketing teams, agencies, creators and social media managers.",
    columns: [
      { title: "Ideas", cards: [
        { title: "Customer story: how a team saved 5 hours a week" },
        { title: "Behind the scenes: our weekly planning" },
      ] },
      { title: "Writing", cards: [{ title: "Blog: 5 signs your team needs fewer meetings", checklist: ["Outline", "First draft", "Add images"] }] },
      { title: "In review", cards: [{ title: "LinkedIn post: product update", desc: "Check the tone and the link." }] },
      { title: "Scheduled", cards: [{ title: "Newsletter: monthly roundup", desc: "Goes out on the first Monday of the month." }] },
      { title: "Published", cards: [{ title: "Instagram carousel: team tips" }] },
    ],
    tips: [
      { title: "One card per piece", body: "Put the channel, due date and owner on each card so the board doubles as your calendar." },
      { title: "Use In review", body: "Moving a card to In review tells the reviewer it is ready, with no extra message needed." },
      { title: "Batch the work", body: "Write several posts in one focus block; Plan My Day groups small tasks into quick wins." },
    ],
  },
  {
    slug: "client-project-board",
    name: "Client project board",
    title: "Free client project board template for agencies · BloomBoard",
    description:
      "A free client project board template for agencies and freelancers: brief, in progress, client review, approved and delivered. Download and import into BloomBoard.",
    h1: "Free client project board template",
    intro: "Run each client project from brief to delivery on one board, with a clear place for work that is waiting on the client.",
    forWho: "Agencies, studios and freelancers working with several clients.",
    columns: [
      { title: "Brief", cards: [{ title: "Kick-off call with the client", checklist: ["Goals and audience", "Deliverables and dates", "Who approves"] }] },
      { title: "In progress", cards: [{ title: "Homepage design", desc: "First version for internal review." }, { title: "Brand guidelines" }] },
      { title: "Client review", cards: [{ title: "Logo options", desc: "Sent on Monday; follow up on Thursday." }] },
      { title: "Approved", cards: [{ title: "Colour palette" }] },
      { title: "Delivered", cards: [{ title: "Business cards" }] },
    ],
    tips: [
      { title: "Make waiting visible", body: "A Client review column shows what is blocked on the client, so nobody chases the wrong person." },
      { title: "Hand over before a vacation", body: "Use Handover to pass a client's board to a teammate with notes." },
      { title: "Turn emails into tasks", body: "Client feedback by email becomes a task with the deadline filled in." },
    ],
  },
  {
    slug: "sprint-board",
    name: "Sprint board",
    title: "Free sprint board template (kanban) · BloomBoard",
    description:
      "A free sprint board template for product and development teams: backlog, to do, in progress, in review and done. Download and import into BloomBoard.",
    h1: "Free sprint board template",
    intro: "A simple kanban board for two-week sprints: everything the team committed to, and exactly where each piece of work stands.",
    forWho: "Product, design and development teams working in sprints.",
    columns: [
      { title: "Backlog", cards: [{ title: "Export reports as PDF" }, { title: "Dark mode for settings" }] },
      { title: "To do", cards: [{ title: "Search across boards", checklist: ["Design", "Build", "Test"] }] },
      { title: "In progress", cards: [{ title: "Faster sign-in" }] },
      { title: "In review", cards: [{ title: "New onboarding screens", desc: "Ready for design review." }] },
      { title: "Done", cards: [{ title: "Fix notifications on Windows" }] },
    ],
    tips: [
      { title: "Keep the backlog honest", body: "Only pull work into To do at sprint planning; everything else waits in the backlog." },
      { title: "Limit work in progress", body: "Finish before starting something new. A short In progress column is a healthy sprint." },
      { title: "Daily stand-up in a room", body: "Walk into your team's room for a five-minute stand-up, then back to work." },
    ],
  },
  {
    slug: "product-launch-checklist",
    name: "Product launch checklist",
    title: "Free product launch checklist template · BloomBoard",
    description:
      "A free product launch checklist template: plan the launch from four weeks out to launch day and follow-up. Download and import into BloomBoard.",
    h1: "Free product launch checklist template",
    intro: "Plan a launch week by week, from the first announcement draft to the follow-up after launch day, so nothing is missed.",
    forWho: "Founders, product marketers and small teams launching a product or feature.",
    columns: [
      { title: "4 weeks before", cards: [{ title: "Pick the launch date and goal", checklist: ["Target number of sign-ups", "Main channel", "Owner for each task"] }] },
      { title: "2 weeks before", cards: [{ title: "Write the announcement" }, { title: "Prepare screenshots and a short video" }] },
      { title: "Launch week", cards: [{ title: "Product Hunt page ready" }, { title: "Email to existing users" }] },
      { title: "Launch day", cards: [{ title: "Post on LinkedIn and social", checklist: ["Founder post", "Company page post", "Reply to every comment"] }] },
      { title: "After launch", cards: [{ title: "Share results with the team" }, { title: "Collect feedback and plan fixes" }] },
    ],
    tips: [
      { title: "Work backwards from the date", body: "Every column is a deadline. If a card slips, you see it weeks before launch day." },
      { title: "One owner per card", body: "Assign each task so everyone knows what is theirs." },
      { title: "Celebrate in the lounge", body: "Drop into the lounge on launch day to share the first results together." },
    ],
  },
];

export function template(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug) || null;
}

/* The board as a file BloomBoard can import (Trello's board format). */
export function templateBoardFile(t: Template) {
  const lists: { id: string; name: string; pos: number }[] = [];
  const cards: { id: string; name: string; desc: string; idList: string; pos: number }[] = [];
  const checklists: { id: string; idCard: string; name: string; pos: number; checkItems: { id: string; name: string; state: string; pos: number }[] }[] = [];
  t.columns.forEach((col, i) => {
    const listId = `${t.slug}-list-${i + 1}`;
    lists.push({ id: listId, name: col.title, pos: (i + 1) * 1000 });
    col.cards.forEach((c, j) => {
      const cardId = `${listId}-card-${j + 1}`;
      cards.push({ id: cardId, name: c.title, desc: c.desc || "", idList: listId, pos: (j + 1) * 1000 });
      if (c.checklist?.length) {
        checklists.push({
          id: `${cardId}-checklist`, idCard: cardId, name: "Checklist", pos: 1000,
          checkItems: c.checklist.map((item, k) => ({ id: `${cardId}-item-${k + 1}`, name: item, state: "incomplete", pos: (k + 1) * 1000 })),
        });
      }
    });
  });
  return {
    id: `bloomboard-template-${t.slug}`,
    name: t.name,
    desc: `${t.intro} Free template from mybloomboard.app/templates/${t.slug}`,
    prefs: { background: "blue" },
    lists, cards, checklists, labels: [], members: [], actions: [],
  };
}
