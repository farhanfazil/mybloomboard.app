/**
 * Full demo dataset for BloomBoard browser demo.
 * Loaded before demo-boot.js
 */
(function () {
  'use strict';

  var COVERS = [
    'https://picsum.photos/seed/bb-launch-42/800/450',
    'https://picsum.photos/seed/bb-sprint-17/800/450',
    'https://picsum.photos/seed/bb-marketing-88/800/450',
    'https://picsum.photos/seed/bb-design-31/800/450',
  ];

  function isoDate(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
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
            "! 🌱 I'm Bloom, your AI coworker. I can create tasks, schedule meetings, manage your boards, and help you plan your day — just ask. What can I help with?",
          actions: [],
          ts: now,
        },
      ])
    );
    localStorage.setItem('bloom-profile-name', 'You');
  }

  window.bbPurgeNonDemoChats = purgeNonDemoChats;

  /* ── Bloom Personal Productivity ── */
  window.bbSeedPersonalWorkspace = function () {
    var now = Date.now();
    var hour = 3600000;
    var today = isoDate(0);

    try {
      localStorage.setItem(
        'farhan-dash-tasks',
        JSON.stringify([
          {
            id: 'demo-p-task-1',
            title: 'Welcome to BloomBoard',
            desc: 'Try editing this task, adding subtasks, or changing priority.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'high',
            cardColor: 'electric',
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
            cardColor: 'violet',
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
            title: 'File expense report — client dinner',
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
        'farhan-events',
        JSON.stringify([
          {
            id: 'demo-p-ev-standup',
            type: 'meeting',
            title: 'Team standup',
            dateStart: today,
            dateEnd: today,
            time: '09:30',
            notes: 'Daily sync — blockers and priorities.',
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
            title: 'Design review — dashboard v2',
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
            notes: 'Friday deadline — log hours for the week.',
            createdAt: now - hour * 10,
            reminderFreq: '1d',
            reminderTime: '09:00',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-p-ev-vacation',
            type: 'leave',
            title: 'PTO — long weekend',
            dateStart: isoDate(14),
            dateEnd: isoDate(16),
            time: '',
            notes: 'Out of office — set Slack status and delegate inbox.',
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
          { id: 'demo-p-bm-2', name: 'Notion — Work wiki', url: 'https://notion.so', category: 'Docs', note: '', createdAt: now - hour * 2 },
          { id: 'demo-p-bm-3', name: 'Google Calendar', url: 'https://calendar.google.com', category: 'Scheduling', note: '', createdAt: now - hour * 3 },
          { id: 'demo-p-bm-4', name: 'Figma — Design files', url: 'https://figma.com', category: 'Design', note: '', createdAt: now - hour * 4 },
          { id: 'demo-p-bm-5', name: 'GitHub — Repos', url: 'https://github.com', category: 'Engineering', note: '', createdAt: now - hour * 5 },
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
              thumbImage: COVERS[1],
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
        name: 'You',
        businessName: 'Your Studio',
        email: 'you@demo.studio',
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
          notes: 'Retainer client — brand and web design.',
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
          lineItems: [{ desc: 'Website redesign — milestone 1', qty: 1, rate: 2400, amount: 2400 }],
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
          lineItems: [{ desc: 'Brand identity — deposit', qty: 1, rate: 1600, amount: 1600 }],
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
          lineItems: [{ desc: 'Social media kit — deposit', qty: 1, rate: 475, amount: 475 }],
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
          lineItems: [{ desc: 'Logo exploration — prior project', qty: 1, rate: 900, amount: 900 }],
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

  /* ── Team Workspace (spec §16) ──
     Local data the app reads directly, plus the fake Supabase rows the app pulls
     as the signed-in team: roster, conversations, messages, shared leave. */
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

    var PEOPLE = [
      { id: ID.me, name: 'Farhan Fazil', email: 'farhan@mybloomboard.app', role: 'owner', status: 'available', color: '#7c3aed', position: 'Designer', avatar: 'avatars/blooms-arctic/Winking.png' },
      { id: ID.yasmin, name: 'Yasmin Khan', email: 'yasmin@mybloomboard.app', role: 'manager', status: 'available', color: '#14b8a6', position: 'Editor', avatar: '' },
      { id: ID.omar, name: 'Omar Saleh', email: 'omar@mybloomboard.app', role: 'member', status: 'busy', color: '#dc2626', position: 'Motion', avatar: '' },
      { id: ID.lina, name: 'Lina Marker', email: 'lina@mybloomboard.app', role: 'member', status: 'available', color: '#16a34a', position: 'Producer', avatar: '' },
    ];
    var byId = {};
    PEOPLE.forEach(function (p) { byId[p.id] = p; });
    function initials(name) {
      return name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    }

    try {
      /* ── Fake backend: team + roster ── */
      demo.seed('teams', { id: ID.team, name: 'Bloom Studio', owner_id: ID.me, plan: 'team' });
      demo.seed('team_members', PEOPLE.map(function (p, i) {
        return {
          team_id: ID.team, user_id: p.id, email: p.email, name: p.name, role: p.role,
          color: p.color, position: p.position, status: p.status, avatar_url: p.avatar || null,
          joined_at: new Date(now - (40 - i) * 24 * hour).toISOString(),
        };
      }));

      /* Lina's leave next week, visible to the team (spec: back Sep 30). */
      demo.seed('shared_leaves', {
        id: 'demo-leave-lina', team_id: ID.team, owner_id: ID.lina, title: 'Family trip', vac_type: 'Vacation',
        date_start: isoDate(6), date_end: isoDate(9), deleted: false,
      });

      /* Local roster so names render before the first pull lands. */
      localStorage.setItem('bloomboard-team-v1', JSON.stringify({
        currentMemberId: ID.me,
        members: PEOPLE.map(function (p) {
          return {
            id: p.id, name: p.name, email: p.email, role: p.role === 'owner' ? 'admin' : p.role,
            status: p.status, color: p.color, initials: initials(p.name), position: p.position, avatar: p.avatar,
          };
        }),
      }));
      localStorage.setItem('bloom-avatar-v3', 'arctic:blooms-arctic/Winking.png');
      localStorage.setItem('bloom-profile-name', 'Farhan Fazil');

      /* ── Projects & tasks ── */
      localStorage.setItem('farhan-dash-projects', JSON.stringify([
        { id: 'proj-stctv', name: 'stc tv / U21', colorHex: '#4d9fff', emoji: '📺', sortOrder: 0 },
        { id: 'proj-jawwy', name: 'Jawwy TV', colorHex: '#ff9f0a', emoji: '📡', sortOrder: 1 },
        { id: 'proj-serieA', name: 'Serie A', colorHex: '#a78bfa', emoji: '⚽', sortOrder: 2 },
        { id: 'proj-personal', name: 'Personal', colorHex: '#39FF14', emoji: '🌱', sortOrder: 3 },
      ]));

      function task(o) {
        return Object.assign({
          desc: '', notes: '', done: false, status: 'pending', priority: 'medium', deadline: null,
          isRecurring: false, recurrenceRule: '', completedAt: null, moodTag: '', attachmentPaths: [],
          subtasks: [], comments: [], ownerId: ID.me, cardColor: '',
        }, o);
      }
      localStorage.setItem('farhan-dash-tasks', JSON.stringify([
        task({ id: 'demo-t-u21', title: 'U21 fixture posters', project: 'proj-stctv', priority: 'urgent',
          deadline: isoDate(-1), createdAt: now - 30 * hour, iconColorIdx: 0 }),
        task({ id: 'demo-t-jawwy', title: 'Jawwy promo cut-downs', desc: '15s and 6s', project: 'proj-jawwy',
          priority: 'low', cardColor: 'violet', createdAt: now - 28 * hour, iconColorIdx: 4 }),
        task({ id: 'demo-t-serieA', title: 'Serie A Round 12 banners', project: 'proj-serieA', priority: 'high',
          deadline: isoDate(2), createdAt: now - 20 * hour, iconColorIdx: 3,
          assigneeId: ID.yasmin, assigneeIds: [ID.yasmin],
          subtasks: [
            { id: 'demo-st-1', text: 'Key visual', done: true, completedBy: ID.yasmin, completedByName: 'Yasmin Khan' },
            { id: 'demo-st-2', text: 'Social sizes', done: false },
            { id: 'demo-st-3', text: 'Arabic copy', done: false },
          ] }),
        task({ id: 'demo-t-template', title: 'Match graphics template', project: 'proj-serieA', status: 'ongoing',
          priority: 'high', cardColor: 'electric', createdAt: now - 50 * hour, iconColorIdx: 6,
          subtasks: [
            { id: 'demo-st-4', text: 'Scoreboard layout', done: true, completedBy: ID.me, completedByName: 'Farhan Fazil' },
            { id: 'demo-st-5', text: 'Lineup card', done: true, completedBy: ID.omar, completedByName: 'Omar Saleh' },
          ] }),
        task({ id: 'demo-t-weekly', title: 'Weekly planning', project: 'proj-personal', status: 'ongoing',
          priority: 'medium', deadline: today, createdAt: now - 6 * hour, iconColorIdx: 1 }),
        task({ id: 'demo-t-ident', title: 'Channel ident refresh', project: 'proj-stctv', status: 'done', done: true,
          priority: 'medium', createdAt: now - 72 * hour, completedAt: now - 3 * hour, completedBy: ID.me, iconColorIdx: 2 }),
        task({ id: 'demo-t-gym', title: 'Gym', project: 'proj-personal', status: 'done', done: true,
          priority: 'low', createdAt: now - 10 * hour, completedAt: now - 2 * hour, completedBy: ID.me, iconColorIdx: 5 }),
      ]));

      /* ── Boards ── */
      function col(id, title, color, order) { return { id: id, title: title, color: color, order: order }; }
      function card(id, boardId, columnId, title, priority, order, assigneeId, dueOffset) {
        return {
          id: id, boardId: boardId, columnId: columnId, title: title, desc: '', priority: priority,
          dueDate: dueOffset == null ? null : isoDate(dueOffset), order: order, assigneeId: assigneeId || null,
          createdAt: new Date(now - (order + 2) * 5 * hour).toISOString(), comments: [],
        };
      }
      localStorage.setItem('bloombooard-boards-v1', JSON.stringify({
        categories: [],
        boards: [
          { id: 'demo-b-serieA', title: 'Serie A Matchday', desc: 'Round 12 graphics package', icon: '⚽', color: 'bc-blue',
            bgImage: null, categoryId: null, labels: [], createdAt: new Date(now - 120 * hour).toISOString(),
            columns: [col('demo-bc-1', 'To Do', '#6b7280', 0), col('demo-bc-2', 'In Progress', '#3b82f6', 1), col('demo-bc-3', 'Done', '#10b981', 2)] },
          { id: 'demo-b-brand', title: 'Brand Refresh', desc: 'New identity rollout', icon: '🎨', color: 'bc-purple',
            bgImage: null, categoryId: null, labels: [], createdAt: new Date(now - 90 * hour).toISOString(),
            columns: [col('demo-bc-4', 'To Do', '#6b7280', 0), col('demo-bc-5', 'In Progress', '#3b82f6', 1), col('demo-bc-6', 'Done', '#10b981', 2)] },
          { id: 'demo-b-launch', title: 'Launch Plan', desc: 'App launch checklist', icon: '🚀', color: 'bc-green',
            bgImage: null, categoryId: null, labels: [], createdAt: new Date(now - 60 * hour).toISOString(),
            columns: [col('demo-bc-7', 'To Do', '#6b7280', 0), col('demo-bc-8', 'In Progress', '#3b82f6', 1), col('demo-bc-9', 'Done', '#10b981', 2)] },
        ],
        cards: [
          card('demo-c-1', 'demo-b-serieA', 'demo-bc-1', 'Home kit graphics', 'high', 0, ID.yasmin, 2),
          card('demo-c-2', 'demo-b-serieA', 'demo-bc-2', 'Lineup template', 'medium', 0, ID.omar, 1),
          card('demo-c-3', 'demo-b-serieA', 'demo-bc-2', 'Score overlay', 'low', 1, ID.me, 3),
          card('demo-c-4', 'demo-b-serieA', 'demo-bc-3', 'Fixture poster', 'medium', 0, ID.lina, null),
          card('demo-c-5', 'demo-b-brand', 'demo-bc-4', 'Logo lockups', 'high', 0, ID.me, 4),
          card('demo-c-6', 'demo-b-brand', 'demo-bc-5', 'Colour palette', 'medium', 0, ID.yasmin, 2),
          card('demo-c-7', 'demo-b-brand', 'demo-bc-6', 'Moodboard', 'low', 0, ID.omar, null),
          card('demo-c-8', 'demo-b-launch', 'demo-bc-7', 'App Store screenshots', 'high', 0, ID.lina, 5),
          card('demo-c-9', 'demo-b-launch', 'demo-bc-8', 'Launch video', 'medium', 0, ID.omar, 3),
          card('demo-c-10', 'demo-b-launch', 'demo-bc-9', 'Press kit', 'low', 0, ID.me, null),
        ],
      }));

      /* ── Chat: DMs with Yasmin, Omar, Lina + the Khaleeji Cup room ── */
      function dmId(other) { return 'dm_' + [ID.me, other].sort().join('_'); }
      var ROOM = 'grp_khaleeji_cup';
      var CONVS = [
        { id: dmId(ID.yasmin), type: 'dm', name: null, members: [ID.me, ID.yasmin], unread: 3, script: [
          [ID.yasmin, 'Morning! Did you see the new Serie A brief?'],
          [ID.me, 'Yes — starting the key visual now'],
          [ID.yasmin, 'Amazing 🙌'],
          [ID.me, 'Sending the file now'],
          [ID.yasmin, 'The banner looks great 👏'],
          [ID.me, 'Thanks! Social sizes next'],
          [ID.yasmin, 'Call in 5?'],
          [ID.me, 'Sure'],
          [ID.yasmin, 'Approved 👍'],
          [ID.yasmin, 'Can you check the latest export?'],
          [ID.yasmin, '🔥🔥'],
        ] },
        { id: dmId(ID.omar), type: 'dm', name: null, members: [ID.me, ID.omar], unread: 3, script: [
          [ID.omar, 'Motion pass on the lineup card is up'],
          [ID.me, 'Looks smooth 😍'],
          [ID.omar, 'Need the logo in white please'],
          [ID.me, 'Sending the file now'],
          [ID.omar, 'Got it, thanks'],
          [ID.me, 'Can we tighten the intro to 2s?'],
          [ID.omar, 'On it'],
          [ID.omar, 'Done ✅'],
          [ID.omar, '🎉'],
          [ID.omar, 'Updated the sheet'],
        ] },
        { id: dmId(ID.lina), type: 'dm', name: null, members: [ID.me, ID.lina], unread: 0, script: [
          [ID.lina, "Heads up — I'm off next week"],
          [ID.me, 'Enjoy! Hand the Launch Plan cards over before you go?'],
          [ID.lina, "Will do. I'll send a hand-over Thursday"],
          [ID.me, 'Perfect 👍'],
          [ID.lina, 'Fixture poster is final'],
          [ID.me, 'Approved 👍'],
          [ID.lina, '❤️'],
          [ID.me, 'Thanks!'],
          [ID.lina, 'Uploading the stills to the board'],
          [ID.me, '🚀'],
        ] },
        { id: ROOM, type: 'group', name: 'Khaleeji Cup', members: [ID.me, ID.yasmin, ID.omar, ID.lina], unread: 0, script: [
          [ID.lina, 'Khaleeji Cup schedule just dropped'],
          [ID.yasmin, "Let's get the poster series going"],
          [ID.omar, "I'll take the animated teasers"],
          [ID.me, "I'll do the key art 🎨"],
          [ID.yasmin, 'Call in 5?'],
          [ID.lina, '👀'],
          [ID.omar, 'The banner looks great 👏'],
          [ID.me, 'Sending the file now'],
          [ID.yasmin, 'Approved 👍'],
          [ID.lina, '🎉'],
        ] },
      ];

      var lastRead = {};
      var localConvs = [];
      CONVS.forEach(function (c, ci) {
        var n = c.script.length;
        var start = now - (6 + ci * 3) * hour;
        var step = Math.floor((5 * hour) / n);
        var msgs = c.script.map(function (line, i) {
          var who = byId[line[0]];
          var ts = start + i * step + Math.floor(Math.random() * 4 * min);
          return {
            id: demo.uuid(), conversation_id: c.id, sender_id: who.id, sender_name: who.name,
            html: line[1], text_content: line[1], ts: ts, reactions: {},
            created_at: new Date(ts).toISOString(), updated_at: new Date(ts).toISOString(),
          };
        });
        var last = msgs[msgs.length - 1];
        demo.seed('conversations', {
          id: c.id, type: c.type, name: c.name, members: c.members,
          last_msg_text: last.text_content, last_msg_ts: last.ts,
          created_at: new Date(start - hour).toISOString(),
        });
        demo.seed('messages', msgs);
        lastRead[c.id] = c.unread ? msgs[n - c.unread - 1].ts + 1 : last.ts + 1;

        localConvs.push({
          id: c.id, type: c.type, name: c.name, members: c.members,
          createdAt: start - hour, lastMsgTime: last.ts, lastMsgText: last.text_content,
        });
        localStorage.setItem('bloom_chat_msgs_' + c.id, JSON.stringify(msgs.map(function (m) {
          return {
            id: m.id, senderId: m.sender_id, senderName: m.sender_name, html: m.html, text: m.text_content,
            ts: m.ts, reactions: {}, edited: false, deleted: false, pinned: false, parentId: null,
          };
        })));
      });
      localStorage.setItem('bloom_chat_convs', JSON.stringify(localConvs));
      localStorage.setItem('bloom_chat_last_read', JSON.stringify(lastRead));

      /* ── Meetings & reminders ── */
      function ev(o) {
        return Object.assign({ dateEnd: o.dateStart, time: '', notes: '', createdAt: now - 24 * hour,
          reminderFreq: '', reminderTime: '', reminderNextFire: 0, reminderSnoozedUntil: 0 }, o);
      }
      localStorage.setItem('farhan-events', JSON.stringify([
        ev({ id: 'demo-ev-review', type: 'meeting', title: 'Serie A graphics review', dateStart: today, time: '15:00' }),
        ev({ id: 'demo-ev-kickoff', type: 'meeting', title: 'Khaleeji Cup kickoff', dateStart: isoDate(2), time: '11:00' }),
        ev({ id: 'demo-ev-export', type: 'reminder', title: 'Export Round 12 social sizes', dateStart: isoDate(1), reminderFreq: '1h', reminderTime: '10:00' }),
      ]));

      seedBloomWelcome(now);
      localStorage.setItem('bloom-profile-name', 'Farhan Fazil');
      localStorage.setItem('bb-demo-seeded-v1', '1');
    } catch (e) {
      console.warn('[BB Demo] team seed failed', e);
    }
  };

  /* backward compat */
  window.bbSeedFullDemoData = window.bbSeedTeamWorkspace;
})();
