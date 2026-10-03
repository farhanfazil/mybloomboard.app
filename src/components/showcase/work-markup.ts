// The Tasks & Boards page body. work-run.js animates the sorter and the comparison rows.
const ROW = (id: string, title: string, sub: string, tTitle: string, tText: string, bTitle: string, bText: string) => `
<section class="row rv" id="${id}">
  <div class="row-hd"><h2>${title}</h2><p>${sub}</p></div>
  <div class="pair">
    <div class="side t"><div class="scr" id="${id}-t"></div><div class="cap"><b>${tTitle}</b><span>${tText}</span></div></div>
    <div class="side b"><div class="scr" id="${id}-b"></div><div class="cap"><b>${bTitle}</b><span>${bText}</span></div></div>
  </div>
</section>`;

export const MARKUP = `
<div class="hero">
  <h1 class="tw-h" aria-label="Tasks for your day. Boards for your team."><span id="tw" aria-hidden="true"></span><span class="tcaret" aria-hidden="true"></span></h1>
  <p class="lead">Tasks are your work, day by day. Assign them, tag teammates and send them for review. Boards are where the whole team works on one project together.</p>
</div>

<div class="sorter" id="sorter" aria-hidden="true">
  <div class="bin t"><div class="bin-hd"><span class="bin-ic"><i data-lucide="list-checks"></i></span><div><b>My tasks</b><small>Your work today</small></div></div><div class="bin-list" id="bin-t"></div></div>
  <div class="drop" id="drop"></div>
  <div class="bin b"><div class="bin-hd"><span class="bin-ic"><i data-lucide="kanban"></i></span><div><b>Team boards</b><small>One project, the whole team</small></div></div><div class="bin-list" id="bin-b"></div></div>
</div>

<div data-hide-header>
<div class="split-hd">
  <div class="sh t"><b>Tasks</b><small>Your work, day by day</small></div>
  <div class="sh b"><b>Boards</b><small>Team projects, together</small></div>
</div>

<div class="rows">
${ROW("r1", "Who's in it", "The first difference, and the biggest.",
  "You, and who you bring in", "Your list for the day at work. Assign a task to a teammate and it lands on their list too.",
  "The whole team", "Everyone on the board sees every card, and who is working on it.")}
${ROW("r2", "Adding things", "Both are quick, in different ways.",
  "Type it like you'd say it", "Dates become deadlines and @names assign teammates. Every line becomes a task.",
  "Add a card to a column", "Drop a card into any column. Name columns your own way, like Waiting on client.")}
${ROW("r3", "Moving forward", "How work gets from started to finished.",
  "Tap to move it along", "To Do, In Progress, In Review, Done. Send it for review and the person who gave it to you is told.",
  "Drag it across", "Pick up a card and drop it in the next column. The team sees it move.")}
${ROW("r4", "Working together", "Both are made for teams.",
  "Assign, tag, follow along", "Add teammates to a task, @mention them in a comment, and see who ticked off which subtask.",
  "Checklist, labels, comments, files", "Talk about the card on the card, with @mentions, voice notes and attachments.")}
${ROW("r5", "Seeing progress", "Two kinds of done.",
  "Today's milestone and your streak", "Your progress bar fills as you finish. Keep it going for a streak.",
  "The board's progress", "Every board shows how much is done, with a cover so it's easy to spot.")}
</div>

</div>

<div class="close rv">
  <div class="close-pair"><span class="cp t"><i data-lucide="list-checks"></i>Tasks for your day.</span><span class="cp b"><i data-lucide="kanban"></i>Boards for your team's projects.</span></div>
</div>
`;
