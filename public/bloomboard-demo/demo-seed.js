/**
 * Full demo dataset for BloomBoard browser demo.
 * Loaded before demo-boot.js
 */
(function () {
  'use strict';

  /* Board covers: photos from the app's own picker (STOCK_PHOTOS), so they look like
     a visitor's own choice. Boards without one show their colour instead. */
  var COVERS = [
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=250&fit=crop&auto=format&q=60', // Lake
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=400&h=250&fit=crop&auto=format&q=60', // Desert Sunset
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&auto=format&q=60', // Mountains
    'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=250&fit=crop&auto=format&q=60', // Workspace
  ];

  /* Chat pictures and files must be https links (the app drops anything else), so on
     a local preview they come from the live site. Brief.pdf lives in demo-files/. */
  var DEMO_SITE = location.protocol === 'https:' ? location.origin : 'https://mybloomboard.app';
  var DEMO_BRIEF_SIZE = 1532;
  /* Sam Rivera, the visitor: a real photo, set as the app's own uploaded profile photo. */
  var SAM_PHOTO = 'https://randomuser.me/api/portraits/women/79.jpg';

  /* The visitor's local date (toISOString would give UTC, a day early after midnight in UTC+ zones). */
  function isoDate(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* Features added in app v1.2.42, shared by the Personal and Team workspaces:
     In Review, a custom "Waiting on client" column, Meeting Notes
     history, time off next month and a board with a background colour. */
  function seedBoardAndNotesExtras(o) {
    var now = Date.now();
    var hour = 3600000;

    /* Tasks: two in In Review, one of them in the custom column, plus the tasks a
       past meeting turned into. */
    var tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('bbd-dash-tasks') || '[]') || []; } catch (e) { tasks = []; }
    function task(x) {
      return Object.assign({
        desc: '', notes: '', done: false, status: 'pending', priority: 'medium', deadline: null, project: null,
        isRecurring: false, recurrenceRule: '', completedAt: null, moodTag: '', attachmentPaths: [],
        subtasks: [], comments: [], ownerId: o.me, cardColor: '', createdAt: now - 20 * hour,
      }, x);
    }
    function subs(prefix, texts) {
      return texts.map(function (t, i) { return { id: prefix + '-' + i, text: t, done: false }; });
    }
    tasks.push(
      task(Object.assign({ id: o.prefix + 'review', title: 'Spring campaign posters', status: 'review', priority: 'high',
        deadline: isoDate(1), desc: 'Final versions for sign-off before they go to print.', project: o.project || null }, o.reviewExtra || {})),
      task({ id: o.prefix + 'client', title: o.clientTitle, status: 'review', col: 'c_demo1', priority: 'medium',
        deadline: isoDate(4), desc: 'Sent to the client on Monday. Waiting for their feedback.', project: o.project || null }),
      task({ id: o.prefix + 'mtg-marketing', title: 'Marketing: launch plan', status: 'pending', priority: 'high', deadline: isoDate(5),
        desc: 'From the Q4 launch sync.\n\nDecision: launch on a Thursday, with the email going out at 9 AM.',
        subtasks: subs(o.prefix + 'mtg-m', ['Write the launch email', 'Schedule the social posts']) }),
      task({ id: o.prefix + 'mtg-website', title: 'Website: launch fixes', status: 'pending', priority: 'medium', deadline: isoDate(6),
        desc: 'From the Q4 launch sync.', subtasks: subs(o.prefix + 'mtg-w', ['Update the pricing page', 'Fix the mobile menu']) })
    );
    localStorage.setItem('bbd-dash-tasks', JSON.stringify(tasks));

    /* Board columns: the four main ones plus "Waiting on client" just before Done. */
    localStorage.setItem('bb-board-columns-v1', JSON.stringify({
      order: ['pending', 'ongoing', 'review', 'c_demo1', 'done'],
      custom: [{ id: 'c_demo1', name: 'Waiting on client' }],
      names: {},
    }));

    /* No sticky note is seeded: the dashboard is busy enough, and the sticky
       launcher on the right edge shows the feature. Clear any from an earlier visit. */
    localStorage.removeItem('bloombooard-stickies-v1');

    /* Meeting Notes history: one meeting turned into tasks, one kept as private notes. */
    localStorage.setItem('bb-meetings-history-v1', JSON.stringify([
      { id: 'mtg-demo-q4', title: 'Q4 launch sync', date: isoDate(-2), attendees: o.attendees, attendeeNames: o.attendeeNames,
        topics: [
          { title: 'Marketing', points: [
            { text: 'Write the launch email' + (o.owner ? ' @' + o.owner : '') + ' by Thursday', kind: 'action' },
            { text: 'Schedule the social posts for launch week', kind: 'action' },
            { text: 'Launch on a Thursday, with the email going out at 9 AM', kind: 'decision' },
          ] },
          { title: 'Website', points: [
            { text: 'Update the pricing page before launch', kind: 'action' },
            { text: 'Fix the mobile menu on small phones', kind: 'action' },
          ] },
        ],
        topicTasks: { '0': o.prefix + 'mtg-marketing', '1': o.prefix + 'mtg-website' },
        taskIds: [o.prefix + 'mtg-marketing', o.prefix + 'mtg-website'], createdAt: now - 2 * 24 * hour },
      { id: 'mtg-demo-private', title: 'Brightlane design review', date: isoDate(-4), attendees: [], attendeeNames: [],
        topics: [
          { title: 'Feedback', points: [
            { text: 'They like the darker palette', kind: 'note' },
            { text: 'Keep the logo on the left in the header', kind: 'decision' },
            { text: 'Send two more hero options by Friday', kind: 'action' },
          ] },
        ],
        topicTasks: {}, taskIds: [], createdAt: now - 4 * 24 * hour, private: true },
    ]));

    /* Time off: a five-day vacation next month. */
    var events = [];
    try { events = JSON.parse(localStorage.getItem('bbd-events') || '[]') || []; } catch (e) { events = []; }
    events.push({ id: 'demo-leave-next-month', type: 'leave', title: 'Vacation', vacType: 'Vacation',
      dateStart: isoDate(30), dateEnd: isoDate(34), time: '', notes: 'Family trip.', createdAt: now - 6 * 24 * hour,
      reminderFreq: '', reminderTime: '', reminderNextFire: 0, reminderSnoozedUntil: 0 });
    localStorage.setItem('bbd-events', JSON.stringify(events));

    /* A board with its own background colour (only inside that board, never on the list). */
    try {
      var bd = JSON.parse(localStorage.getItem('bloombooard-boards-v1') || '{}');
      var b = (bd.boards || []).filter(function (x) { return x.id === o.plumBoard; })[0];
      if (b) { b.bgColor = 'g-plum'; localStorage.setItem('bloombooard-boards-v1', JSON.stringify(bd)); }
    } catch (e) {}

    seedWorkLog(o, now);
    seedBloomThreads(now);
    localStorage.removeItem('bloom-avatar-v3');
    localStorage.setItem('bloom-avatar-custom-v1', SAM_PHOTO);
  }

  /* Overview and Daily Recap read the work log (bb-worklog-v1): everything finished,
     kept even after the task or card is deleted. About 25 items over the last six
     weeks, three of them yesterday, across the projects and the boards. */
  function seedWorkLog(o, now) {
    var day = 86400000;
    var boards = [];
    try { boards = (JSON.parse(localStorage.getItem('bloombooard-boards-v1') || '{}').boards || []); } catch (e) {}
    /* Overview groups by project id, so use the workspace's own projects (Team seeds
       its list; Personal uses the app's built-in one). */
    var PROJ = [];
    try { PROJ = (JSON.parse(localStorage.getItem('bbd-dash-projects') || '[]') || []).filter(function (p) { return p.id !== 'proj-personal'; }); } catch (e) {}
    if (PROJ.length < 2) PROJ = [
      { id: 'proj-web', name: 'Website Relaunch', emoji: '🌐' },
      { id: 'proj-mobile', name: 'Mobile App v2', emoji: '📱' },
      { id: 'proj-campaign', name: 'Spring Campaign', emoji: '🌸' },
    ];
    var TITLES = [
      'Wireframes for the pricing page', 'Client feedback round 2', 'App icon set', 'Newsletter layout',
      'Landing page copy review', 'Social media calendar', 'Onboarding emails', 'Release notes 2.3',
      'Logo cleanup for print', 'Usability test summary', 'Campaign moodboard', 'Checkout bug fixes',
      'Team retro notes', 'Ad banners, all sizes', 'Product photos retouch', 'FAQ page update',
      'Investor update slides', 'Help center articles', 'Promo video storyboard', 'Accessibility fixes',
      'Partner deck refresh', 'Holiday campaign brief',
    ];
    var me = o.me || 'local_user';
    var items = {};
    function at(daysAgo, h, m) {
      var d = new Date(now - daysAgo * day);
      d.setHours(h, m || 0, 0, 0);
      return d.getTime();
    }
    function add(i, ts, title, pri) {
      var useBoard = boards.length && i % 3 === 2;
      var proj = PROJ[(i + Math.floor(i / 3)) % PROJ.length];
      var e;
      if (useBoard) {
        var bd = boards[Math.floor(i / 3) % boards.length];
        e = { k: 'card:demo-wl-' + i, kind: 'card', id: 'demo-wl-' + i, title: title, boardId: bd.id,
          boardName: bd.title, boardIcon: bd.icon || '', column: 'Done', priority: pri, deadline: '',
          by: String(me), assignees: [String(me)], aiCategory: '' };
      } else {
        e = { k: 'task:demo-wl-' + i, kind: 'task', id: 'demo-wl-' + i, title: title, project: proj.id,
          projectName: proj.name, projectEmoji: proj.emoji || '', priority: pri, deadline: '', by: '',
          assignees: [], subtasks: 0, subtasksDone: 0, aiCategory: '' };
      }
      e.gone = true; e.completedAt = ts; e.approx = false; e.firstSeen = ts;
      items[e.k] = e;
    }
    /* Yesterday, so Daily Recap's "Finished yesterday" has something in it. */
    add(100, at(1, 10, 20), 'Send the homepage copy for review', 'high');
    add(101, at(1, 13, 45), 'Fix the signup form on mobile', 'urgent');
    add(102, at(1, 16, 30), 'Prepare the client review deck', 'medium');
    /* The rest spread over six weeks, weekdays only, busier lately. */
    var n = 0;
    for (var d = 2; d <= 42 && n < TITLES.length; d++) {
      var wd = new Date(now - d * day).getDay();
      if (wd === 0 || wd === 6) continue;
      if (d > 21 && d % 2) continue;
      add(n, at(d, 9 + (n * 3) % 8, (n * 17) % 60), TITLES[n], ['medium', 'high', 'low', 'medium'][n % 4]);
      n++;
    }
    localStorage.setItem('bb-worklog-v1', JSON.stringify({ v: 1, items: items, backfilled: true }));
  }

  /* Ask Bloom keeps past chats in its left rail; two short ones so it isn't empty. */
  function seedBloomThreads(now) {
    var hour = 3600000;
    function thread(id, ago, pairs) {
      var ts = now - ago;
      return { id: id, ts: ts, msgs: pairs.map(function (p, i) { return { role: p[0], text: p[1], ts: ts + i * 40000 }; }) };
    }
    /* The open chat is a fresh one; the app writes the welcome message into whichever
       chat is current, so the two past chats stay as they are. */
    localStorage.setItem('bb-bloom-thread-cur', 'demo-thread-new');
    localStorage.setItem('bb-bloom-threads-v1', JSON.stringify([
      { id: 'demo-thread-new', ts: now, msgs: [] },
      thread('demo-thread-2', 3 * hour, [
        ['user', 'What should I focus on this afternoon?'],
        ['bloom', 'Start with the homepage hero: it is urgent and was due yesterday. After that, the onboarding screens are due Saturday, so an hour on them today keeps you ahead. Weekly planning can wait until tomorrow morning.'],
      ]),
      thread('demo-thread-1', 4 * 24 * hour, [
        ['user', 'Write a short update for the client about the launch date'],
        ['bloom', 'Here is a short update:\n\nHi Sarah, quick update on the launch. The site is on track for the 14th. Design is signed off and we are in final testing this week. I will send the staging link on Thursday so your team can take a last look.\n\nWant me to make it more formal or shorter?'],
      ]),
    ]));
  }

  function purgeNonDemoChats() {
    try {
      var convs = JSON.parse(localStorage.getItem('bloom_chat_convs') || '[]');
      var kept = convs.filter(function (c) {
        return c && c.id && String(c.id).indexOf('demo-conv-') === 0;
      });
      localStorage.setItem('bloom_chat_convs', JSON.stringify(kept));
      var keepIds = {};
      kept.forEach(function (c) {
        keepIds[c.id] = true;
      });
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('bloom_chat_msgs_') !== 0) continue;
        var convId = key.slice('bloom_chat_msgs_'.length);
        if (!keepIds[convId]) localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[BB Demo] chat purge failed', e);
    }
  }

  function seedBloomWelcome(now) {
    var h = new Date().getHours();
    var greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    localStorage.setItem(
      'bloombooard-bloom-history-v1',
      JSON.stringify([
        {
          role: 'bloom',
          text:
            greet +
            "! 🌱 I'm Bloom, your AI coworker. I can create tasks, schedule meetings, manage your boards, and help you plan your day. Just ask. What can I help with?",
          actions: [],
          ts: now,
        },
      ])
    );
    localStorage.setItem('bloom-profile-name', 'Sam Rivera');
  }

  window.bbPurgeNonDemoChats = purgeNonDemoChats;

  /* ── Bloom Personal Productivity ── */
  window.bbSeedPersonalWorkspace = function () {
    var now = Date.now();
    var hour = 3600000;
    var today = isoDate(0);

    try {
      localStorage.setItem(
        'bbd-dash-tasks',
        JSON.stringify([
          {
            id: 'demo-p-task-1',
            title: 'Welcome to BloomBoard',
            desc: 'Try editing this task, adding subtasks, or changing priority.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'high',
           
            deadline: today,
            project: null,
            subtasks: [
              { id: 'demo-p-st-1', text: 'Click + Add Task to create another', done: false },
              { id: 'demo-p-st-2', text: 'Open My Boards to try kanban', done: false },
            ],
            createdAt: now - hour * 2,
            comments: [],
          },
          {
            id: 'demo-p-task-2',
            title: 'Prep for Monday standup',
            desc: 'Summarize progress, blockers, and priorities for the week.',
            notes: 'Flag dependency on design review.',
            done: false,
            status: 'ongoing',
            priority: 'high',
           
            deadline: isoDate(1),
            project: null,
            subtasks: [],
            createdAt: now - hour * 5,
            comments: [],
          },
          {
            id: 'demo-p-task-3',
            title: 'Review Q2 roadmap draft',
            desc: 'Add comments on scope and timeline before EOD.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'high',
            deadline: today,
            project: null,
            subtasks: [],
            createdAt: now - hour * 8,
            comments: [],
          },
          {
            id: 'demo-p-task-4',
            title: 'Send follow-up to stakeholders',
            desc: 'Recap action items from last week’s sync.',
            notes: '',
            done: false,
            status: 'ongoing',
            priority: 'medium',
            deadline: isoDate(2),
            project: null,
            subtasks: [],
            createdAt: now - hour * 12,
            comments: [],
          },
          {
            id: 'demo-p-task-5',
            title: 'File expense report: client dinner',
            desc: 'Attach receipt and submit in finance portal.',
            notes: '',
            done: true,
            status: 'done',
            priority: 'low',
            deadline: isoDate(-2),
            project: null,
            subtasks: [],
            createdAt: now - hour * 48,
            completedAt: now - hour * 3,
            comments: [],
          },
          {
            id: 'demo-p-task-9',
            title: 'Fix onboarding checkout bug',
            desc: 'Resolved payment retry loop.',
            notes: '',
            done: true,
            status: 'done',
            priority: 'high',
            deadline: isoDate(0),
            project: null,
            subtasks: [],
            createdAt: now - hour * 6,
            completedAt: now - hour * 1,
            comments: [],
          },
          {
            id: 'demo-p-task-10',
            title: 'Weekly design review meeting notes',
            desc: 'Summarized feedback for the team.',
            notes: '',
            done: true,
            status: 'done',
            priority: 'medium',
            deadline: isoDate(-1),
            project: null,
            subtasks: [],
            createdAt: now - hour * 30,
            completedAt: now - hour * 26,
            comments: [],
          },
          {
            id: 'demo-p-task-6',
            title: 'Draft product one-pager',
            desc: 'Outline problem, solution, and launch timeline.',
            notes: '',
            done: false,
            status: 'ongoing',
            priority: 'high',
            deadline: isoDate(7),
            project: null,
            subtasks: [],
            createdAt: now - hour * 20,
            comments: [],
          },
          {
            id: 'demo-p-task-7',
            title: 'Schedule 1:1 with manager',
            desc: 'Book 30 minutes to discuss career goals and Q2 focus.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'medium',
            deadline: isoDate(3),
            project: null,
            subtasks: [],
            createdAt: now - hour * 6,
            comments: [],
          },
        ])
      );

      localStorage.setItem(
        'bbd-events',
        JSON.stringify([
          {
            id: 'demo-p-ev-standup',
            type: 'meeting',
            title: 'Team standup',
            dateStart: today,
            dateEnd: today,
            time: '09:30',
            notes: 'Daily sync: blockers and priorities.',
            createdAt: now - hour * 24,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-p-ev-1on1',
            type: 'meeting',
            title: '1:1 with manager',
            dateStart: isoDate(1),
            dateEnd: isoDate(1),
            time: '14:00',
            notes: 'Career goals and Q2 deliverables.',
            createdAt: now - hour * 36,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-p-ev-review',
            type: 'meeting',
            title: 'Design review: dashboard v2',
            dateStart: isoDate(4),
            dateEnd: isoDate(4),
            time: '11:00',
            notes: 'Review Figma mocks with product and eng.',
            createdAt: now - hour * 72,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-p-ev-reminder',
            type: 'reminder',
            title: 'Submit timesheet',
            dateStart: isoDate(2),
            dateEnd: isoDate(2),
            time: '',
            notes: 'Friday deadline. Log hours for the week.',
            createdAt: now - hour * 10,
            reminderFreq: '1d',
            reminderTime: '09:00',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-p-ev-vacation',
            type: 'leave',
            title: 'PTO: long weekend',
            dateStart: isoDate(14),
            dateEnd: isoDate(16),
            time: '',
            notes: 'Out of office. Set Slack status and delegate inbox.',
            createdAt: now - hour * 96,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
        ])
      );

      localStorage.setItem(
        'bloom-bookmarks-v1',
        JSON.stringify([
          { id: 'demo-p-bm-1', name: 'BloomBoard', url: 'https://mybloomboard.app', category: 'Productivity', note: '', createdAt: now - hour },
          { id: 'demo-p-bm-2', name: 'Notion: Work wiki', url: 'https://notion.so', category: 'Docs', note: '', createdAt: now - hour * 2 },
          { id: 'demo-p-bm-3', name: 'Google Calendar', url: 'https://calendar.google.com', category: 'Scheduling', note: '', createdAt: now - hour * 3 },
          { id: 'demo-p-bm-4', name: 'Figma: Design files', url: 'https://figma.com', category: 'Design', note: '', createdAt: now - hour * 4 },
          { id: 'demo-p-bm-5', name: 'GitHub: Repos', url: 'https://github.com', category: 'Engineering', note: '', createdAt: now - hour * 5 },
          { id: 'demo-p-bm-6', name: 'Company intranet', url: 'https://example.com', category: 'Internal', note: '', createdAt: now - hour * 6 },
        ])
      );

      localStorage.setItem(
        'bloombooard-boards-v1',
        JSON.stringify({
          boards: [
            {
              id: 'demo-p-board-1',
              title: 'Work Priorities',
              desc: 'Q2 deliverables, deadlines, and follow-ups',
              icon: '📋',
              color: 'bc-blue',
              thumbImage: COVERS[0],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 120).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-p-col-1', title: 'To Do', color: '#6b7280', order: 0 },
                { id: 'demo-p-col-2', title: 'In Progress', color: '#3b82f6', order: 1 },
                { id: 'demo-p-col-3', title: 'Done', color: '#10b981', order: 2 },
              ],
            },
            {
              id: 'demo-p-board-2',
              title: 'Product Launch',
              desc: 'Specs, design, and go-to-market prep',
              icon: '🚀',
              color: 'bc-purple',
              thumbImage: null,
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 48).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-p-col-4', title: 'Backlog', color: '#6b7280', order: 0 },
                { id: 'demo-p-col-5', title: 'In Progress', color: '#3b82f6', order: 1 },
                { id: 'demo-p-col-6', title: 'Shipped', color: '#10b981', order: 2 },
              ],
            },
            {
              id: 'demo-p-board-3',
              title: 'Admin & Ops',
              desc: 'Expenses, contracts, and paperwork',
              icon: '📁',
              color: 'bc-green',
              thumbImage: COVERS[3],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 96).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-p-col-7', title: 'Backlog', color: '#6b7280', order: 0 },
                { id: 'demo-p-col-8', title: 'This Week', color: '#3b82f6', order: 1 },
                { id: 'demo-p-col-9', title: 'Done', color: '#10b981', order: 2 },
              ],
            },
          ],
          cards: [
            { id: 'demo-p-card-1', boardId: 'demo-p-board-1', columnId: 'demo-p-col-2', title: 'Draft stakeholder update', desc: 'Weekly progress email for leadership.', order: 0, createdAt: new Date(now - hour * 24).toISOString(), comments: [] },
            { id: 'demo-p-card-2', boardId: 'demo-p-board-1', columnId: 'demo-p-col-1', title: 'Review PRD feedback', desc: 'Comments from product and engineering.', order: 1, createdAt: new Date(now - hour * 20).toISOString(), comments: [] },
            { id: 'demo-p-card-3', boardId: 'demo-p-board-1', columnId: 'demo-p-col-3', title: 'Onboard contractor paperwork', desc: 'NDA and access requests completed.', order: 0, createdAt: new Date(now - hour * 72).toISOString(), comments: [] },
            { id: 'demo-p-card-4', boardId: 'demo-p-board-2', columnId: 'demo-p-col-5', title: 'Write launch announcement', desc: 'Internal comms and changelog draft.', order: 0, createdAt: new Date(now - hour * 8).toISOString(), comments: [] },
            { id: 'demo-p-card-5', boardId: 'demo-p-board-2', columnId: 'demo-p-col-4', title: 'Finalize pricing page copy', desc: 'Align with marketing on tiers.', order: 0, createdAt: new Date(now - hour * 16).toISOString(), comments: [] },
            { id: 'demo-p-card-6', boardId: 'demo-p-board-3', columnId: 'demo-p-col-8', title: 'Submit Q2 expense report', desc: 'Receipts from client site visit.', order: 0, createdAt: new Date(now - hour * 12).toISOString(), comments: [] },
          ],
        })
      );

      seedBoardAndNotesExtras({
        prefix: 'demo-p-', me: null, clientTitle: 'Logo lockups for Brightlane',
        stickyText: 'Book the dentist before Friday', owner: '',
        attendees: [], attendeeNames: ['Alex', 'Jordan'],
        plumBoard: 'demo-p-board-2',
      });
      seedBloomWelcome(now);
      localStorage.setItem('bb-demo-seeded-v1', '1');
    } catch (e) {
      console.warn('[BB Demo] personal seed failed', e);
    }
  };

  /* ── Bloom Freelance Business ── */
  window.bbSeedFreelanceWorkspace = function () {
    var now = Date.now();
    var hour = 3600000;
    var today = isoDate(0);
    var write = window._bbDemoFlStoreWrite;
    if (typeof write !== 'function') return;

    try {
      var client1 = 'demo-fl-c1';
      var client2 = 'demo-fl-c2';
      var client3 = 'demo-fl-c3';
      var proj1 = 'demo-fl-p1';
      var proj2 = 'demo-fl-p2';
      var proj3 = 'demo-fl-p3';
      var proj4 = 'demo-fl-p4';

      write('settings', {
        currency: 'USD',
        targetRate: 95,
        experience: 'mid',
        region: 'US',
        name: 'Sam Rivera',
        businessName: 'Rivera Design Co.',
        email: 'hello@riveradesign.co',
        revisions: 3,
        paymentTerms: 14,
      });

      write('clients', [
        {
          id: client1,
          name: 'Acme Corp',
          email: 'billing@acme.example',
          company: 'Acme Corp',
          phone: '+1 555-0101',
          notes: 'Retainer client: brand and web design.',
          createdAt: isoDate(-90),
        },
        {
          id: client2,
          name: 'Bright Studio',
          email: 'hello@brightstudio.example',
          company: 'Bright Studio',
          phone: '+1 555-0102',
          notes: 'Logo refresh and social templates.',
          createdAt: isoDate(-45),
        },
        {
          id: client3,
          name: 'Northwind Agency',
          email: 'projects@northwind.example',
          company: 'Northwind Agency',
          phone: '+1 555-0103',
          notes: 'White-label dev partner.',
          createdAt: isoDate(-20),
        },
      ]);

      write('projects', [
        {
          id: proj1,
          clientId: client1,
          title: 'Website redesign',
          type: 'design',
          complexity: 'medium',
          experience: 'mid',
          deliverables: 'Homepage, 4 inner pages, design system',
          quotedPrice: 4800,
          deadline: isoDate(14),
          progress: 65,
          includedRevisions: 3,
          status: 'active',
          rush: false,
          description: 'Modern marketing site with CMS handoff.',
          createdAt: isoDate(-30),
          timeEntries: [{ hours: 12, date: isoDate(-5), note: 'Wireframes' }],
          expenses: [],
        },
        {
          id: proj2,
          clientId: client2,
          title: 'Brand identity package',
          type: 'branding',
          complexity: 'high',
          experience: 'mid',
          deliverables: 'Logo, color palette, typography guide',
          quotedPrice: 3200,
          deadline: isoDate(7),
          progress: 40,
          includedRevisions: 2,
          status: 'active',
          rush: true,
          description: 'Full rebrand for product launch.',
          createdAt: isoDate(-18),
          timeEntries: [{ hours: 8, date: isoDate(-2), note: 'Concept exploration' }],
          expenses: [],
        },
        {
          id: proj3,
          clientId: client3,
          title: 'Landing page build',
          type: 'development',
          complexity: 'low',
          experience: 'mid',
          deliverables: 'Responsive landing page, form integration',
          quotedPrice: 1800,
          deadline: isoDate(-10),
          progress: 100,
          includedRevisions: 2,
          status: 'completed',
          paid: true,
          paidAmount: 1800,
          paidAt: isoDate(-8),
          rush: false,
          description: 'Shipped on time.',
          createdAt: isoDate(-40),
          timeEntries: [],
          expenses: [],
        },
        {
          id: proj4,
          clientId: client1,
          title: 'Q3 social media kit',
          type: 'design',
          complexity: 'low',
          experience: 'mid',
          deliverables: '12 templates for LinkedIn and Instagram',
          quotedPrice: 950,
          deadline: isoDate(21),
          progress: 10,
          includedRevisions: 2,
          status: 'active',
          rush: false,
          description: 'Template pack for marketing team.',
          createdAt: isoDate(-5),
          timeEntries: [],
          expenses: [],
        },
      ]);

      write('invoices', [
        {
          id: 'demo-fl-inv-1',
          number: 'INV-0001',
          clientId: client3,
          projectId: proj3,
          status: 'paid',
          total: 1800,
          subtotal: 1800,
          tax: 0,
          issueDate: isoDate(-12),
          dueDate: isoDate(-5),
          paidAt: isoDate(-8),
          createdAt: isoDate(-12),
          lineItems: [{ desc: 'Landing page build', qty: 1, rate: 1800, amount: 1800 }],
        },
        {
          id: 'demo-fl-inv-2',
          number: 'INV-0002',
          clientId: client1,
          projectId: proj1,
          status: 'sent',
          total: 2400,
          subtotal: 2400,
          tax: 0,
          issueDate: isoDate(-3),
          dueDate: isoDate(11),
          createdAt: isoDate(-3),
          lineItems: [{ desc: 'Website redesign, milestone 1', qty: 1, rate: 2400, amount: 2400 }],
        },
        {
          id: 'demo-fl-inv-3',
          number: 'INV-0003',
          clientId: client2,
          projectId: proj2,
          status: 'sent',
          total: 1600,
          subtotal: 1600,
          tax: 0,
          issueDate: isoDate(-1),
          dueDate: isoDate(13),
          createdAt: isoDate(-1),
          lineItems: [{ desc: 'Brand identity, deposit', qty: 1, rate: 1600, amount: 1600 }],
        },
        {
          id: 'demo-fl-inv-4',
          number: 'INV-0004',
          clientId: client1,
          projectId: proj4,
          status: 'draft',
          total: 475,
          subtotal: 475,
          tax: 0,
          issueDate: today,
          dueDate: isoDate(14),
          createdAt: today,
          lineItems: [{ desc: 'Social media kit, deposit', qty: 1, rate: 475, amount: 475 }],
        },
        {
          id: 'demo-fl-inv-5',
          number: 'INV-0005',
          clientId: client2,
          status: 'paid',
          total: 900,
          subtotal: 900,
          tax: 0,
          issueDate: isoDate(-45),
          dueDate: isoDate(-30),
          paidAt: isoDate(-32),
          createdAt: isoDate(-45),
          lineItems: [{ desc: 'Logo exploration, prior project', qty: 1, rate: 900, amount: 900 }],
        },
      ]);

      write('proposals', [
        {
          id: 'demo-fl-prop-1',
          clientId: client1,
          projectId: proj1,
          title: 'Website redesign proposal',
          status: 'accepted',
          total: 4800,
          createdAt: isoDate(-35),
        },
      ]);

      seedBloomWelcome(now);
      localStorage.setItem('bb-demo-seeded-v1', '1');
    } catch (e) {
      console.warn('[BB Demo] freelance seed failed', e);
    }
  };

  /* ── Team Workspace ──
     Entirely fictional: Lumen Studio, a small product team. Local data the
     app reads directly, plus the fake Supabase rows it pulls as the signed-in
     team (roster, conversations, messages, shared leave). */
  window.bbSeedTeamWorkspace = function () {
    var now = Date.now();
    var hour = 3600000;
    var min = 60000;
    var today = isoDate(0);
    var demo = window.__bbDemo;
    if (!demo) {
      console.warn('[BB Demo] demo-supabase.js did not load; team seed skipped');
      return;
    }
    var ID = demo.IDS;

    /* Everyone has a real profile photo, Sam (the visitor) included. */
    function face(file) { return 'avatars/dark/' + encodeURIComponent(file); }
    function photo(path) { return 'https://randomuser.me/api/portraits/' + path + '.jpg'; }
    var PEOPLE = [
      { id: ID.me, name: 'Sam Rivera', email: 'sam@lumen.studio', role: 'owner', status: 'available', color: '#7c3aed', position: 'Product Designer', department: 'Design', avatar: SAM_PHOTO },
      { id: ID.maya, name: 'Maya Chen', email: 'maya@lumen.studio', role: 'manager', status: 'available', color: '#14b8a6', position: 'Product Manager', department: 'Product', avatar: photo('women/44') },
      /* Team Space signals: Daniel is "Back at" in an hour, Nora is on Focus, Priya shared her task. */
      { id: ID.daniel, name: 'Daniel Brooks', email: 'daniel@lumen.studio', role: 'member', status: 'brb', statusUntil: now + 62 * min, color: '#dc2626', position: 'Frontend Engineer', department: 'Engineering', avatar: photo('men/32') },
      { id: ID.priya, name: 'Priya Nair', email: 'priya@lumen.studio', role: 'member', status: 'available', focusTask: 'Launch email copy', color: '#f59e0b', position: 'Marketing Lead', department: 'Marketing', avatar: photo('women/68') },
      { id: ID.leo, name: 'Leo Hartmann', email: 'leo@lumen.studio', role: 'member', status: 'available', color: '#3b82f6', position: 'Backend Engineer', department: 'Engineering', avatar: photo('men/75') },
      { id: ID.nora, name: 'Nora Haddad', email: 'nora@lumen.studio', role: 'member', status: 'dnd', statusUntil: now + 41 * min, color: '#ec4899', position: 'Content Writer', department: 'Design', avatar: photo('women/26') },
      { id: ID.ethan, name: 'Ethan Cole', email: 'ethan@lumen.studio', role: 'member', status: 'available', color: '#8b5cf6', position: 'Motion Designer', department: 'Design', avatar: photo('men/86') },
      { id: ID.chloe, name: 'Chloe Park', email: 'chloe@lumen.studio', role: 'member', status: 'away', color: '#16a34a', position: 'QA Lead', department: 'Product', avatar: photo('women/65') },
    ];
    var ME = PEOPLE[0];
    var byId = {};
    PEOPLE.forEach(function (p) { byId[p.id] = p; });
    function initials(name) {
      return name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    }

    try {
      /* ── Fake backend: team + roster ── */
      demo.seed('teams', { id: ID.team, name: 'Lumen Studio', owner_id: ID.me, plan: 'team' });
      demo.seed('team_members', PEOPLE.map(function (p, i) {
        return {
          team_id: ID.team, user_id: p.id, email: p.email, name: p.name, role: p.role,
          color: p.color, position: p.position, status: p.status, avatar_url: p.avatar,
          department: p.department, status_until: p.statusUntil ? new Date(p.statusUntil).toISOString() : null,
          focus_task: p.focusTask || null,
          joined_at: new Date(now - (60 - i * 4) * 24 * hour).toISOString(),
        };
      }));

      /* Chloe is away today and back in a few days, visible to the whole team. */
      demo.seed('shared_leaves', {
        id: 'demo-leave-chloe', team_id: ID.team, owner_id: ID.chloe, title: 'Family trip', vac_type: 'Vacation',
        date_start: isoDate(0), date_end: isoDate(3), deleted: false,
      });
      /* Leo and Priya overlap, so the Time off calendar shows both name pills on those days. */
      demo.seed('shared_leaves', [
        { id: 'demo-leave-leo', team_id: ID.team, owner_id: ID.leo, title: 'Conference', vac_type: 'Other',
          date_start: isoDate(8), date_end: isoDate(11), deleted: false },
        { id: 'demo-leave-priya', team_id: ID.team, owner_id: ID.priya, title: 'Beach week', vac_type: 'Vacation',
          date_start: isoDate(10), date_end: isoDate(14), deleted: false },
      ]);

      /* Local roster so names and faces render before the first pull lands. */
      localStorage.setItem('bloomboard-team-v1', JSON.stringify({
        currentMemberId: ID.me,
        members: PEOPLE.map(function (p) {
          return {
            id: p.id, name: p.name, email: p.email, role: p.role === 'owner' ? 'admin' : p.role,
            status: p.status, color: p.color, initials: initials(p.name), position: p.position, avatar: p.avatar,
            department: p.department, statusUntil: p.statusUntil || 0, focusTask: p.focusTask || '',
          };
        }),
      }));

      /* ── Projects & tasks ── */
      localStorage.setItem('bbd-dash-projects', JSON.stringify([
        { id: 'proj-website', name: 'Website Relaunch', colorHex: '#4d9fff', emoji: '🌐', sortOrder: 0 },
        { id: 'proj-mobile', name: 'Mobile App v2', colorHex: '#ff9f0a', emoji: '📱', sortOrder: 1 },
        { id: 'proj-brand', name: 'Spring Campaign', colorHex: '#a78bfa', emoji: '🌸', sortOrder: 2 },
        { id: 'proj-personal', name: 'Personal', colorHex: '#39FF14', emoji: '🌱', sortOrder: 3 },
      ]));

      function task(o) {
        return Object.assign({
          desc: '', notes: '', done: false, status: 'pending', priority: 'medium', deadline: null,
          isRecurring: false, recurrenceRule: '', completedAt: null, moodTag: '', attachmentPaths: [],
          subtasks: [], comments: [], ownerId: ID.me, cardColor: '',
        }, o);
      }
      localStorage.setItem('bbd-dash-tasks', JSON.stringify([
        task({ id: 'demo-t-hero', title: 'Homepage hero redesign', project: 'proj-website', priority: 'urgent',
          deadline: isoDate(-1), createdAt: now - 30 * hour, iconColorIdx: 0 }),
        task({ id: 'demo-t-screens', title: 'App Store screenshots', desc: '6.7" and 5.5" sizes', project: 'proj-mobile',
          priority: 'low', createdAt: now - 28 * hour, iconColorIdx: 4 }),
        task({ id: 'demo-t-banners', title: 'Spring campaign banners', project: 'proj-brand', priority: 'high',
          deadline: isoDate(2), createdAt: now - 20 * hour, iconColorIdx: 3,
          assigneeId: ID.maya, assigneeIds: [ID.maya],
          subtasks: [
            { id: 'demo-st-1', text: 'Key visual', done: true, completedBy: ID.maya, completedByName: 'Maya Chen' },
            { id: 'demo-st-2', text: 'Social sizes', done: false },
            { id: 'demo-st-3', text: 'Copy review', done: false },
          ] }),
        task({ id: 'demo-t-onboard', title: 'Onboarding flow prototype', project: 'proj-mobile', status: 'ongoing',
          priority: 'high', createdAt: now - 50 * hour, iconColorIdx: 6,
          subtasks: [
            { id: 'demo-st-4', text: 'Welcome screens', done: true, completedBy: ID.me, completedByName: ME.name },
            { id: 'demo-st-5', text: 'Permission prompts', done: true, completedBy: ID.daniel, completedByName: 'Daniel Brooks' },
          ] }),
        task({ id: 'demo-t-weekly', title: 'Weekly planning', project: 'proj-personal', status: 'ongoing',
          priority: 'medium', deadline: today, createdAt: now - 6 * hour, iconColorIdx: 1 }),
        task({ id: 'demo-t-pricing', title: 'Pricing page copy', project: 'proj-website', status: 'done', done: true,
          priority: 'medium', createdAt: now - 72 * hour, completedAt: now - 3 * hour, completedBy: ID.me, iconColorIdx: 2 }),
        task({ id: 'demo-t-gym', title: 'Gym', project: 'proj-personal', status: 'done', done: true,
          priority: 'low', createdAt: now - 10 * hour, completedAt: now - 2 * hour, completedBy: ID.me, iconColorIdx: 5 }),
      ]));

      /* ── Boards ── */
      function cols(prefix) {
        return [
          { id: prefix + '-todo', title: 'To Do', color: '#6b7280', order: 0 },
          { id: prefix + '-doing', title: 'In Progress', color: '#3b82f6', order: 1 },
          { id: prefix + '-done', title: 'Done', color: '#10b981', order: 2 },
        ];
      }
      function board(id, title, desc, icon, color, ageH, cover) {
        return { id: id, title: title, desc: desc, icon: icon, color: color, thumbImage: cover || null, bgImage: null, categoryId: null,
          labels: [], createdAt: new Date(now - ageH * hour).toISOString(), columns: cols(id) };
      }
      var cardN = 0;
      function card(boardId, col, title, priority, order, assigneeId, dueOffset, checklist) {
        cardN++;
        var c = {
          id: 'demo-c-' + cardN, boardId: boardId, columnId: boardId + '-' + col, title: title, desc: '',
          priority: priority, dueDate: dueOffset == null ? null : isoDate(dueOffset), order: order,
          assigneeId: assigneeId || null, createdAt: new Date(now - (cardN + 2) * 5 * hour).toISOString(), comments: [],
        };
        /* [done, total]: the office tile draws its progress ring from this. */
        if (checklist) {
          c.checklists = [{ id: 'demo-cl-' + cardN, title: 'Checklist', items: [] }];
          for (var i = 0; i < checklist[1]; i++) {
            c.checklists[0].items.push({ id: 'demo-cli-' + cardN + '-' + i, text: 'Step ' + (i + 1), done: i < checklist[0] });
          }
        }
        return c;
      }
      localStorage.setItem('bloombooard-boards-v1', JSON.stringify({
        categories: [],
        boards: [
          board('demo-b-launch', 'Product Launch', 'Everything for launch day', '🚀', 'bc-blue', 120, COVERS[1]),
          board('demo-b-brand', 'Brand Refresh', 'New identity rollout', '🎨', 'bc-purple', 90),
          board('demo-b-mobile', 'Mobile App v2', 'iOS & Android release', '📱', 'bc-green', 60),
          board('demo-b-roadmap', 'Q4 Roadmap', 'Planning for next quarter', '🗺️', 'bc-orange', 30, COVERS[2]),
        ],
        cards: [
          card('demo-b-launch', 'todo', 'Landing page', 'high', 0, ID.priya, 2),
          card('demo-b-launch', 'doing', 'Press kit', 'medium', 0, ID.nora, 1, [2, 3]),
          card('demo-b-launch', 'doing', 'Landing hero v3', 'high', 1, ID.ethan, 0, [1, 4]),
          card('demo-b-launch', 'doing', 'Launch video', 'low', 2, ID.ethan, 3),
          card('demo-b-launch', 'done', 'Beta feedback round', 'medium', 0, ID.chloe, null),
          card('demo-b-brand', 'todo', 'Logo lockups', 'high', 0, ID.me, 4),
          card('demo-b-brand', 'doing', 'Colour palette', 'medium', 0, ID.maya, 2),
          card('demo-b-brand', 'done', 'Moodboard', 'low', 0, ID.ethan, null),
          card('demo-b-mobile', 'todo', 'Push notifications', 'high', 0, ID.leo, 5),
          card('demo-b-mobile', 'doing', 'Sync API load test', 'high', 2, ID.leo, 2, [3, 5]),
          card('demo-b-mobile', 'doing', 'Dark mode QA', 'medium', 0, ID.chloe, 3),
          card('demo-b-mobile', 'doing', 'Onboarding screens', 'high', 1, ID.me, 2),
          card('demo-b-mobile', 'done', 'Crash reporting', 'medium', 0, ID.daniel, null),
          card('demo-b-roadmap', 'todo', 'Hiring plan', 'medium', 0, ID.maya, 7),
          card('demo-b-roadmap', 'doing', 'Roadmap draft', 'high', 0, ID.maya, 4, [2, 6]),
          card('demo-b-roadmap', 'done', 'Customer survey', 'low', 0, ID.priya, null),
        ],
      }));

      /* ── Chat: a DM with every teammate + two rooms ── */
      function dmId(other) { return 'dm_' + [ID.me, other].sort().join('_'); }
      var LAUNCH = 'grp_launch_squad';
      var CRIT = 'grp_design_crit';
      var CONVS = [
        { id: dmId(ID.maya), type: 'dm', members: [ID.me, ID.maya], unread: 2, script: [
          [ID.maya, 'Morning! Did you see the new campaign brief?'],
          [ID.maya, '', null, { file: true }],
          [ID.me, 'Yes, starting the key visual now'],
          [ID.maya, 'Amazing 🙌'],
          [ID.me, 'Sending the file now'],
          [ID.me, 'First draft of the key visual', null, { image: true }],
          [ID.maya, 'The banner looks great 👏', { '❤️': [ID.me] }],
          [ID.me, 'Thanks! Social sizes next'],
          [ID.maya, 'Call in 5?'],
          [ID.me, 'Sure'],
          [ID.maya, 'Approved 👍'],
          [ID.maya, 'Can you check the latest export?'],
          [ID.maya, '🔥🔥'],
        ] },
        { id: dmId(ID.daniel), type: 'dm', members: [ID.me, ID.daniel], unread: 0, script: [
          [ID.daniel, 'Onboarding screens are wired up on staging'],
          [ID.me, 'Looks smooth 😍'],
          [ID.daniel, 'Need the icons exported as SVG please'],
          [ID.me, 'Sending the file now'],
          [ID.daniel, 'Got it, thanks'],
          [ID.me, 'Can we shorten the intro animation?'],
          [ID.daniel, 'On it'],
          [ID.daniel, 'Done ✅'],
          [ID.daniel, '🎉'],
          [ID.daniel, 'Pushed the fix to staging'],
        ] },
        { id: dmId(ID.priya), type: 'dm', members: [ID.me, ID.priya], unread: 0, script: [
          [ID.priya, 'Launch email goes out Thursday'],
          [ID.me, "I'll have the header image by Wednesday"],
          [ID.priya, 'Perfect 🙏'],
          [ID.priya, 'Can we A/B the subject line too?'],
          [ID.me, 'Good idea 👍'],
          [ID.priya, 'Thanks!'],
        ] },
        { id: dmId(ID.leo), type: 'dm', members: [ID.me, ID.leo], unread: 0, script: [
          [ID.leo, 'API for the new pricing tiers is live'],
          [ID.me, "Great, I'll hook up the pricing page"],
          [ID.leo, 'Ping me if anything looks off'],
          [ID.me, 'Will do 🙌'],
        ] },
        { id: dmId(ID.nora), type: 'dm', members: [ID.me, ID.nora], unread: 0, script: [
          [ID.nora, 'First draft of the press release is in the doc'],
          [ID.me, 'Reading it now 👀'],
          [ID.me, 'Love the opening line'],
          [ID.nora, '❤️'],
          [ID.nora, "I'll tighten the quotes this afternoon"],
        ] },
        { id: dmId(ID.ethan), type: 'dm', members: [ID.me, ID.ethan], unread: 0, script: [
          [ID.ethan, 'Launch video rough cut is ready'],
          [ID.me, 'Watching now'],
          [ID.me, 'The ending is 🔥'],
          [ID.ethan, "Thanks! I'll polish the transitions"],
          [ID.ethan, 'Polishing now, then back in the Design room'],
        ] },
        { id: dmId(ID.chloe), type: 'dm', members: [ID.me, ID.chloe], unread: 0, script: [
          [ID.chloe, "Heads up, I'm off for a few days from today"],
          [ID.me, 'Enjoy! Hand over the QA cards before you go?'],
          [ID.chloe, 'Done, the hand-over is in your inbox'],
          [ID.me, 'Perfect 👍'],
          [ID.chloe, 'Dark mode pass is 80% done'],
          [ID.me, '🚀'],
        ] },
        { id: LAUNCH, type: 'group', name: 'Launch Squad', members: PEOPLE.map(function (p) { return p.id; }), unread: 1, script: [
          [ID.maya, 'Launch is two weeks out. Status check 👇'],
          [ID.priya, 'Email + socials scheduled'],
          [ID.daniel, 'Web build is green'],
          [ID.leo, 'Backend ready, load test tomorrow'],
          [ID.me, 'Final visuals land Wednesday 🎨'],
          [ID.nora, 'Press kit copy is in review'],
          [ID.chloe, '👀'],
          [ID.ethan, 'The banner looks great 👏', { '👍': [ID.maya, ID.priya] }],
          [ID.maya, 'Approved 👍'],
          [ID.priya, '🎉'],
        ] },
        { id: CRIT, type: 'group', name: 'Design Crit', members: [ID.me, ID.maya, ID.ethan, ID.nora], unread: 0, script: [
          [ID.ethan, 'Crit at 3? Bringing the motion studies'],
          [ID.me, "I'll share the new onboarding screens"],
          [ID.maya, 'Call in 5?'],
          [ID.nora, 'Joining!'],
          [ID.maya, 'Great session today 🙌'],
          [ID.ethan, '🔥🔥'],
        ] },
      ];

      var lastRead = {};
      var localConvs = [];
      CONVS.forEach(function (c, ci) {
        var n = c.script.length;
        var start = now - (6 + ci * 2) * hour;
        var step = Math.floor((5 * hour) / n);
        var msgs = c.script.map(function (line, i) {
          var who = byId[line[0]];
          var ts = start + i * step + Math.floor(Math.random() * 4 * min);
          var row = {
            id: demo.uuid(), conversation_id: c.id, sender_id: who.id, sender_name: who.name,
            html: line[1], text_content: line[1], ts: ts, reactions: line[2] || {},
            created_at: new Date(ts).toISOString(), updated_at: new Date(ts).toISOString(),
          };
          /* A picture and a file, so the chat shows both (the app only loads https links). */
          var extra = line[3] || {};
          if (extra.image) row.image_url = DEMO_SITE + '/screenshots/hero-2-light.jpg';
          if (extra.file) {
            row.file_url = DEMO_SITE + '/bloomboard-demo/demo-files/Brief.pdf';
            row.file_name = 'Brief.pdf'; row.file_size = DEMO_BRIEF_SIZE; row.file_mime = 'application/pdf';
          }
          return row;
        });
        var last = msgs[msgs.length - 1];
        demo.seed('conversations', {
          id: c.id, type: c.type, name: c.name || null, members: c.members,
          last_msg_text: last.text_content, last_msg_ts: last.ts,
          created_at: new Date(start - hour).toISOString(),
        });
        demo.seed('messages', msgs);
        lastRead[c.id] = c.unread ? msgs[n - c.unread - 1].ts + 1 : last.ts + 1;

        localConvs.push({
          id: c.id, type: c.type, name: c.name || null, members: c.members,
          createdAt: start - hour, lastMsgTime: last.ts, lastMsgText: last.text_content,
        });
        localStorage.setItem('bloom_chat_msgs_' + c.id, JSON.stringify(msgs.map(function (m) {
          return {
            id: m.id, senderId: m.sender_id, senderName: m.sender_name, html: m.html, text: m.text_content,
            ts: m.ts, reactions: m.reactions || {}, edited: false, deleted: false, pinned: false, parentId: null,
            image: m.image_url || undefined, fileUrl: m.file_url || undefined, fileName: m.file_name || undefined,
            fileSize: m.file_size || undefined, fileMime: m.file_mime || undefined,
          };
        })));
      });
      localStorage.setItem('bloom_chat_convs', JSON.stringify(localConvs));
      localStorage.setItem('bloom_chat_last_read', JSON.stringify(lastRead));

      /* ── Team Space: shared spaces + a room per department, two of them live ── */
      demo.ensureTeamRooms(ID.team, true);
      var DESIGN_ROOM = 'dept_' + ID.team + '_design';
      var LOUNGE = 'room_' + ID.team + '_lounge';
      function liveCall(convId, roomName, people, startedMinAgo) {
        var state = {};
        people.forEach(function (id) { state[id] = 'joined'; });
        var started = new Date(now - startedMinAgo * min).toISOString();
        return {
          id: demo.uuid(), team_id: ID.team, conversation_id: convId, room_name: roomName,
          caller_id: people[0], participant_ids: people.slice(), mode: 'audio', status: 'active', kind: 'group',
          invite_state: state, created_at: started, answered_at: started, updated_at: started, locked: false,
        };
      }
      demo.seed('bloom_calls', [
        liveCall(DESIGN_ROOM, 'Design room', [ID.maya, ID.ethan], 12),
        liveCall(LOUNGE, 'Lounge', [ID.leo, ID.priya], 7),
      ]);
      /* Room convs locally too, so the office paints before the first pull lands. */
      demo.rows('conversations').forEach(function (c) {
        if (!c.kind) return;
        localConvs.push({ id: c.id, type: 'group', name: c.name, members: c.members, kind: c.kind, department: c.department || '',
          createdAt: now - 24 * hour, lastMsgTime: 0, lastMsgText: '' });
      });
      localStorage.setItem('bloom_chat_convs', JSON.stringify(localConvs));

      /* The simulation (demo-sim.js) talks as these people in these rooms. */
      demo.roster = PEOPLE.slice(1).map(function (p) { return { id: p.id, name: p.name }; });
      demo.rooms = [LAUNCH, CRIT];
      /* Away today: stays quiet in chat and never knocks. */
      demo.onLeave = [ID.chloe];
      /* Who can walk in and out of which live room (demo-sim.js). */
      demo.liveRooms = [
        { conv: DESIGN_ROOM, anchor: ID.maya, guests: [ID.ethan] },
        { conv: LOUNGE, anchor: ID.leo, guests: [ID.priya] },
      ];

      /* ── Meetings & reminders ── */
      function ev(o) {
        return Object.assign({ dateEnd: o.dateStart, time: '', notes: '', createdAt: now - 24 * hour,
          reminderFreq: '', reminderTime: '', reminderNextFire: 0, reminderSnoozedUntil: 0 }, o);
      }
      /* Meetings in the app's own format (vendor/bb-meetings.js, v:2), spread over
         this week so the Week view is full. */
      function pad2(n) { return (n < 10 ? '0' : '') + n; }
      function hhmm(mins) { return pad2(Math.floor(mins / 60) % 24) + ':' + pad2(mins % 60); }
      var weekday = (new Date().getDay() + 6) % 7; /* Monday = 0 */
      function thisWeek(dayIdx) { return isoDate(dayIdx - weekday); }
      function meeting(o) {
        var m = Object.assign({
          v: 2, type: 'meeting', dateEnd: '', time: '09:00', durationMin: 30, allDay: false, repeat: 'none',
          attendeeIds: [], call: 'none', link: '', location: '', alertMin: 5, notes: '',
          ownerId: ID.me, teamId: ID.team, createdAt: now - 3 * 24 * hour, updatedAt: now - 3 * 24 * hour,
          reminderFreq: '', reminderTime: '', reminderNextFire: 0, reminderSnoozedUntil: 0,
        }, o);
        if (m.allDay) { m.time = ''; m.durationMin = 0; m.timeEnd = ''; }
        else {
          var p = m.time.split(':');
          m.timeEnd = hhmm(+p[0] * 60 + +p[1] + m.durationMin);
        }
        if (m.repeat !== 'none') m.seriesStart = m.dateStart;
        return m;
      }
      /* One call starts a few minutes into the visit, so its Join call button unlocks
         (it opens 10 minutes before the start). */
      var soon = new Date(now + 12 * min);
      soon.setMinutes(Math.ceil(soon.getMinutes() / 5) * 5, 0, 0);
      var soonDate = soon.getFullYear() + '-' + pad2(soon.getMonth() + 1) + '-' + pad2(soon.getDate());
      localStorage.setItem('bbd-events', JSON.stringify([
        meeting({ id: 'demo-mtg-design-review', title: 'Weekly design review', dateStart: thisWeek(0), time: '10:00',
          durationMin: 60, repeat: 'weekly', call: 'bloom', attendeeIds: [ID.ethan, ID.nora, ID.maya],
          notes: 'Landing hero v3, onboarding screens and the launch video.' }),
        /* Always two meetings today, so Plan My Day has something to plan around. */
        meeting({ id: 'demo-mtg-today-review', title: 'Design review', dateStart: isoDate(0), time: '11:00',
          durationMin: 45, call: 'bloom', attendeeIds: [ID.maya, ID.priya], notes: 'Homepage hero and the spring banners.' }),
        meeting({ id: 'demo-mtg-today-client', title: 'Client check-in with Acme', dateStart: isoDate(0), time: '15:30',
          durationMin: 30, attendeeIds: [ID.maya], location: 'Google Meet' }),
        meeting({ id: 'demo-mtg-one-on-one', title: '1:1 with Leo', dateStart: thisWeek(2), time: '11:00',
          durationMin: 30, attendeeIds: [ID.leo], location: 'Room 2' }),
        meeting({ id: 'demo-mtg-sprint', title: 'Sprint planning', dateStart: thisWeek(3), time: '14:00',
          durationMin: 90, call: 'bloom', attendeeIds: [ID.maya, ID.daniel, ID.leo, ID.priya, ID.ethan],
          notes: 'Bring your estimates for the Mobile App v2 cards.' }),
        meeting({ id: 'demo-mtg-offsite', title: 'Company offsite', dateStart: thisWeek(4), allDay: true,
          attendeeIds: [ID.maya, ID.daniel, ID.priya, ID.leo, ID.nora, ID.ethan, ID.chloe] }),
        meeting({ id: 'demo-mtg-launch-sync', title: 'Launch sync', dateStart: soonDate, time: hhmm(soon.getHours() * 60 + soon.getMinutes()),
          durationMin: 30, call: 'bloom', attendeeIds: [ID.maya, ID.priya], notes: 'Go / no-go for Thursday.' }),
        ev({ id: 'demo-ev-export', type: 'reminder', title: 'Export launch assets', dateStart: isoDate(1), reminderFreq: '1h', reminderTime: '10:00' }),
      ]));

      /* Maya's meeting reaches Sam as a shared invite (the app pulls the events table). */
      var acmeStart = new Date(thisWeek(1) + 'T09:00:00');
      demo.seed('events', {
        id: 'demo-mtg-acme', team_id: ID.team, owner_id: ID.maya, attendee_ids: [ID.me, ID.priya],
        starts_at: acmeStart.toISOString(), ends_at: new Date(acmeStart.getTime() + 45 * min).toISOString(), deleted: false,
        data: { type: 'meeting', title: 'Client kickoff with Acme', notes: 'Scope, timeline and who owns what on their side.',
          dateStart: thisWeek(1), dateEnd: '', time: '09:00', allDay: false, durationMin: 45, repeat: 'none',
          call: 'link', link: 'https://meet.example.com/acme-kickoff', location: '', alertMin: 10, createdAt: now - 4 * 24 * hour },
        created_at: new Date(now - 4 * 24 * hour).toISOString(), updated_at: new Date(now - 4 * 24 * hour).toISOString(),
      });

      seedBoardAndNotesExtras({
        prefix: 'demo-t-', me: ID.me, project: 'proj-brand', clientTitle: 'Pricing page for Acme',
        reviewExtra: { ownerId: ID.maya, assigneeId: ID.me, assigneeIds: [ID.me] },
        stickyText: 'Call Maya about the posters', owner: 'Priya',
        attendees: [ID.maya, ID.priya, ID.leo], attendeeNames: ['Maya Chen', 'Priya Nair', 'Leo Hartmann'],
        plumBoard: 'demo-b-brand',
      });
      seedBloomWelcome(now);
      localStorage.setItem('bloom-profile-name', ME.name);
      localStorage.setItem('bb-demo-seeded-v1', '1');
    } catch (e) {
      console.warn('[BB Demo] team seed failed', e);
    }
  };

  /* backward compat */
  window.bbSeedFullDemoData = window.bbSeedTeamWorkspace;
})();
