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

  /* ── Team Workspace ── */
  window.bbSeedTeamWorkspace = function (M) {
    var now = Date.now();
    var hour = 3600000;
    var today = isoDate(0);
    var me = M.me;

    try {
      localStorage.setItem(
        'bloomboard-team-v1',
        JSON.stringify({
          currentMemberId: me,
          members: [
            {
              id: me,
              name: 'You',
              email: 'you@demo.app',
              role: 'admin',
              status: 'available',
              color: '#3b82f6',
              initials: 'YO',
              position: 'Product Lead',
              avatar: '',
            },
            {
              id: M.sarah,
              name: 'Sarah Chen',
              email: 'sarah@demo.app',
              role: 'manager',
              status: 'available',
              color: '#10b981',
              initials: 'SC',
              position: 'Design Lead',
              avatar: '',
            },
            {
              id: M.marcus,
              name: 'Marcus Lee',
              email: 'marcus@demo.app',
              role: 'member',
              status: 'busy',
              color: '#f59e0b',
              initials: 'ML',
              position: 'Engineering',
              avatar: '',
            },
            {
              id: M.priya,
              name: 'Priya Patel',
              email: 'priya@demo.app',
              role: 'member',
              status: 'available',
              color: '#8b5cf6',
              initials: 'PP',
              position: 'Marketing',
              avatar: '',
            },
            {
              id: M.james,
              name: 'James Okonkwo',
              email: 'james@demo.app',
              role: 'member',
              status: 'available',
              color: '#06b6d4',
              initials: 'JO',
              position: 'QA',
              avatar: '',
            },
            {
              id: M.elena,
              name: 'Elena Vasquez',
              email: 'elena@demo.app',
              role: 'member',
              status: 'away',
              color: '#ec4899',
              initials: 'EV',
              position: 'Customer Success',
              avatar: '',
            },
            {
              id: M.david,
              name: 'David Kim',
              email: 'david@demo.app',
              role: 'manager',
              status: 'available',
              color: '#6366f1',
              initials: 'DK',
              position: 'Data & Analytics',
              avatar: '',
            },
            {
              id: M.rachel,
              name: 'Rachel Brooks',
              email: 'rachel@demo.app',
              role: 'member',
              status: 'busy',
              color: '#14b8a6',
              initials: 'RB',
              position: 'Operations',
              avatar: '',
            },
            {
              id: M.tom,
              name: 'Tom Nguyen',
              email: 'tom@demo.app',
              role: 'member',
              status: 'available',
              color: '#f97316',
              initials: 'TN',
              position: 'DevOps',
              avatar: '',
            },
            {
              id: M.aisha,
              name: 'Aisha Rahman',
              email: 'aisha@demo.app',
              role: 'member',
              status: 'available',
              color: '#a855f7',
              initials: 'AR',
              position: 'Content',
              avatar: '',
            },
          ],
        })
      );

      localStorage.setItem(
        'farhan-dash-tasks',
        JSON.stringify([
          {
            id: 'demo-task-1',
            title: 'Welcome to BloomBoard',
            desc: 'Try editing this task, adding subtasks, or changing priority.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'high',
            deadline: today,
            project: null,
            subtasks: [
              { id: 'demo-st-1', text: 'Click + Add Task to create another', done: false },
              { id: 'demo-st-2', text: 'Open My Boards to try kanban', done: false },
            ],
            createdAt: now - hour * 2,
            comments: [],
          },
          {
            id: 'demo-task-2',
            title: 'Plan your week',
            desc: 'Drag tasks, set deadlines, and track your milestone bar.',
            notes: '',
            done: false,
            status: 'ongoing',
            priority: 'medium',
            deadline: isoDate(1),
            project: null,
            subtasks: [],
            createdAt: now - hour * 5,
            comments: [],
          },
          {
            id: 'demo-task-3',
            title: 'Review launch checklist',
            desc: 'Sign off on the Product Launch board before Friday.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'high',
            deadline: isoDate(2),
            project: null,
            subtasks: [],
            createdAt: now - hour * 8,
            comments: [],
          },
          {
            id: 'demo-task-4',
            title: 'Prep Q3 marketing brief',
            desc: 'Share draft with Priya for feedback.',
            notes: '',
            done: false,
            status: 'ongoing',
            priority: 'medium',
            deadline: isoDate(5),
            project: null,
            subtasks: [],
            createdAt: now - hour * 12,
            comments: [],
          },
          {
            id: 'demo-task-5',
            title: 'Ship analytics events',
            desc: 'PostHog funnel for onboarding.',
            notes: '',
            done: true,
            status: 'done',
            priority: 'low',
            deadline: isoDate(-3),
            project: null,
            subtasks: [],
            createdAt: now - hour * 72,
            comments: [],
          },
          {
            id: 'demo-task-6',
            title: 'Client demo dry run',
            desc: 'Walk through the dashboard with Sarah.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'medium',
            deadline: isoDate(7),
            project: null,
            subtasks: [],
            createdAt: now - hour * 6,
            comments: [],
          },
          {
            id: 'demo-task-7',
            title: 'Update hiring pipeline',
            desc: 'Review engineering candidates.',
            notes: '',
            done: false,
            status: 'pending',
            priority: 'low',
            deadline: isoDate(10),
            project: null,
            subtasks: [],
            createdAt: now - hour * 20,
            comments: [],
          },
          {
            id: 'demo-task-8',
            title: 'Quarterly OKR check-in',
            desc: 'Update progress on team goals.',
            notes: '',
            done: false,
            status: 'ongoing',
            priority: 'high',
            deadline: isoDate(14),
            project: null,
            subtasks: [],
            createdAt: now - hour * 30,
            comments: [],
          },
        ])
      );

      localStorage.setItem(
        'farhan-events',
        JSON.stringify([
          {
            id: 'demo-ev-standup',
            type: 'meeting',
            title: 'Daily standup',
            dateStart: today,
            dateEnd: today,
            time: '09:30',
            notes: 'Zoom link in calendar invite.',
            createdAt: now - hour * 48,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-sync',
            type: 'meeting',
            title: 'Design review',
            dateStart: isoDate(1),
            dateEnd: isoDate(1),
            time: '14:00',
            notes: 'Review launch hero and onboarding flow.',
            createdAt: now - hour * 24,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-client',
            type: 'meeting',
            title: 'Client kickoff',
            dateStart: isoDate(3),
            dateEnd: isoDate(3),
            time: '11:00',
            notes: 'Acme Corp — product walkthrough.',
            createdAt: now - hour * 36,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-reminder',
            type: 'reminder',
            title: 'Send invoice to client',
            dateStart: isoDate(2),
            dateEnd: isoDate(2),
            time: '',
            notes: 'Q2 consulting milestone.',
            createdAt: now - hour * 10,
            reminderFreq: '1h',
            reminderTime: '09:00',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-followup',
            type: 'reminder',
            title: 'Follow up with Marcus on API docs',
            dateStart: isoDate(1),
            dateEnd: isoDate(1),
            time: '',
            notes: '',
            createdAt: now - hour * 8,
            reminderFreq: '2h',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-vacation',
            type: 'leave',
            title: 'Summer break',
            dateStart: isoDate(21),
            dateEnd: isoDate(28),
            time: '',
            notes: 'Coverage: Sarah leads standup. Marcus on-call for eng.',
            createdAt: now - hour * 96,
            reminderFreq: '',
            reminderTime: '',
            reminderNextFire: 0,
            reminderSnoozedUntil: 0,
          },
          {
            id: 'demo-ev-vacation2',
            type: 'leave',
            title: 'Long weekend',
            dateStart: isoDate(12),
            dateEnd: isoDate(14),
            time: '',
            notes: 'Out of office — limited email.',
            createdAt: now - hour * 72,
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
          { id: 'demo-bm-1', name: 'BloomBoard', url: 'https://mybloomboard.app', category: 'Project Links', note: '', createdAt: now - hour },
          { id: 'demo-bm-2', name: 'Figma — Launch designs', url: 'https://figma.com', category: 'Design', note: '', createdAt: now - hour * 2 },
          { id: 'demo-bm-3', name: 'GitHub Releases', url: 'https://github.com', category: 'Project Links', note: '', createdAt: now - hour * 3 },
          { id: 'demo-bm-4', name: 'Notion wiki', url: 'https://notion.so', category: 'Operations', note: '', createdAt: now - hour * 4 },
          { id: 'demo-bm-5', name: 'Stripe Dashboard', url: 'https://dashboard.stripe.com', category: 'Finance', note: '', createdAt: now - hour * 5 },
          { id: 'demo-bm-6', name: 'PostHog analytics', url: 'https://posthog.com', category: 'Operations', note: '', createdAt: now - hour * 6 },
          { id: 'demo-bm-7', name: 'Loom — Demo recording', url: 'https://loom.com', category: 'Design', note: '', createdAt: now - hour * 7 },
          { id: 'demo-bm-8', name: 'Linear roadmap', url: 'https://linear.app', category: 'Project Links', note: '', createdAt: now - hour * 8 },
        ])
      );

      localStorage.setItem(
        'bloomboard-notif-v1',
        JSON.stringify({
          items: [
            {
              id: 'demo-notif-1',
              fromName: 'Sarah Chen',
              fromColor: '#10b981',
              fromInitials: 'SC',
              toId: me,
              toName: 'You',
              text: 'commented on Draft launch checklist',
              linkType: 'card',
              linkId: 'demo-card-1',
              linkName: 'Product Launch',
              read: false,
              ts: now - hour,
            },
            {
              id: 'demo-notif-2',
              fromName: 'Marcus Lee',
              fromColor: '#f59e0b',
              fromInitials: 'ML',
              toId: me,
              toName: 'You',
              text: 'mentioned you in Engineering chat',
              linkType: 'chat',
              linkId: 'demo-conv-grp-2',
              linkName: 'Engineering',
              read: false,
              ts: now - hour * 3,
            },
          ],
        })
      );

      var convs = [
        {
          id: 'demo-conv-dm-1',
          type: 'dm',
          name: null,
          members: [me, M.sarah],
          createdAt: now - hour * 48,
          lastMsgTime: now - hour * 2,
          lastMsgText: 'Can you review the launch checklist before standup?',
        },
        {
          id: 'demo-conv-dm-2',
          type: 'dm',
          name: null,
          members: [me, M.marcus],
          createdAt: now - hour * 36,
          lastMsgTime: now - hour * 5,
          lastMsgText: 'API docs are ready — pushed to staging.',
        },
        {
          id: 'demo-conv-dm-3',
          type: 'dm',
          name: null,
          members: [me, M.priya],
          createdAt: now - hour * 24,
          lastMsgTime: now - hour * 8,
          lastMsgText: 'Blog draft is ready for your review.',
        },
        {
          id: 'demo-conv-grp-1',
          type: 'group',
          name: 'Product Launch',
          members: [me, M.sarah, M.marcus, M.priya],
          createdAt: now - hour * 72,
          lastMsgTime: now - hour,
          lastMsgText: '@You can you confirm the launch date?',
        },
        {
          id: 'demo-conv-grp-2',
          type: 'group',
          name: 'Engineering',
          members: [me, M.marcus, M.tom],
          createdAt: now - hour * 96,
          lastMsgTime: now - hour * 4,
          lastMsgText: 'Staging deploy finished — ready for QA.',
        },
        {
          id: 'demo-conv-dm-4',
          type: 'dm',
          name: null,
          members: [me, M.james],
          createdAt: now - hour * 20,
          lastMsgTime: now - hour * 6,
          lastMsgText: 'QA sign-off done — checklist is all green.',
        },
        {
          id: 'demo-conv-dm-5',
          type: 'dm',
          name: null,
          members: [me, M.elena],
          createdAt: now - hour * 30,
          lastMsgTime: now - hour * 9,
          lastMsgText: 'Customer loved the onboarding flow update!',
        },
        {
          id: 'demo-conv-dm-6',
          type: 'dm',
          name: null,
          members: [me, M.david],
          createdAt: now - hour * 44,
          lastMsgTime: now - hour * 12,
          lastMsgText: 'Dashboard retention numbers look great this week.',
        },
        {
          id: 'demo-conv-dm-7',
          type: 'dm',
          name: null,
          members: [me, M.tom],
          createdAt: now - hour * 52,
          lastMsgTime: now - hour * 15,
          lastMsgText: 'CI pipeline is green — all checks passed.',
        },
        {
          id: 'demo-conv-grp-3',
          type: 'group',
          name: 'Design Team',
          members: [me, M.sarah, M.priya],
          createdAt: now - hour * 60,
          lastMsgTime: now - hour * 7,
          lastMsgText: 'New component library is live in Figma!',
        },
        {
          id: 'demo-conv-grp-4',
          type: 'group',
          name: 'Marketing & Content',
          members: [me, M.priya, M.aisha],
          createdAt: now - hour * 80,
          lastMsgTime: now - hour * 11,
          lastMsgText: 'Launch post is scheduled for Thursday.',
        },
        {
          id: 'demo-conv-grp-5',
          type: 'group',
          name: 'All Hands',
          members: [me, M.sarah, M.marcus, M.priya, M.james, M.elena, M.david, M.rachel, M.tom, M.aisha],
          createdAt: now - hour * 120,
          lastMsgTime: now - hour * 2,
          lastMsgText: 'Great sprint everyone — ship it! 🚀',
        },
      ];
      localStorage.setItem('bloom_chat_convs', JSON.stringify(convs));

      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-1',
        JSON.stringify([
          { id: 'dm1-1',  senderId: M.sarah, senderName: 'Sarah Chen', text: 'Morning! Working on the new hero section mockups — should have them ready by noon.', html: 'Morning! Working on the new hero section mockups — should have them ready by noon.', ts: now - hour * 9 },
          { id: 'dm1-2',  senderId: me,      senderName: 'You',        text: 'Perfect timing. The current version feels a bit heavy on the left — can you try a more centered layout too?', html: 'Perfect timing. The current version feels a bit heavy on the left — can you try a more centered layout too?', ts: now - hour * 8.5 },
          { id: 'dm1-3',  senderId: M.sarah, senderName: 'Sarah Chen', text: 'Good call — I will mock up a centered version alongside the current one and share both.', html: 'Good call — I will mock up a centered version alongside the current one and share both.', ts: now - hour * 8 },
          { id: 'dm1-4',  senderId: M.sarah, senderName: 'Sarah Chen', text: 'Also dropping the updated onboarding screens in Figma now. The empty state illustrations are new.', html: 'Also dropping the updated onboarding screens in Figma now. The empty state illustrations are new.', ts: now - hour * 7 },
          { id: 'dm1-5',  senderId: me,      senderName: 'You',        text: "Love it — the illustrations make a big difference. I'll review after standup.", html: "Love it — the illustrations make a big difference. I'll review after standup.", ts: now - hour * 6.5 },
          { id: 'dm1-6',  senderId: M.sarah, senderName: 'Sarah Chen', text: 'Hey! I updated the hero section mockups. Centered version is in the Figma file under "Hero v3".', html: 'Hey! I updated the hero section mockups. Centered version is in the Figma file under "Hero v3".', ts: now - hour * 4 },
          { id: 'dm1-7',  senderId: me,      senderName: 'You',        text: "Nice — I'll take a look after standup.", html: "Nice — I'll take a look after standup.", ts: now - hour * 3.5 },
          { id: 'dm1-8',  senderId: me,      senderName: 'You',        text: 'Just reviewed both. The centered layout is the one. Sending it to Marcus for dev handoff.', html: 'Just reviewed both. The centered layout is the one. Sending it to Marcus for dev handoff.', ts: now - hour * 3 },
          { id: 'dm1-9',  senderId: M.sarah, senderName: 'Sarah Chen', text: 'Great! One more thing — what should the CTA button say? "Get started" or "Start for free"?', html: 'Great! One more thing — what should the CTA button say? "Get started" or "Start for free"?', ts: now - hour * 2.5 },
          { id: 'dm1-10', senderId: me,      senderName: 'You',        text: '"Start for free" — it sets expectations clearly. Let\'s lock that in.', html: '"Start for free" — it sets expectations clearly. Let\'s lock that in.', ts: now - hour * 2.2 },
          { id: 'dm1-11', senderId: M.sarah, senderName: 'Sarah Chen', text: 'Can you review the launch checklist before standup? I added the design sign-off items.', html: 'Can you review the launch checklist before standup? I added the design sign-off items.', ts: now - hour * 2 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-2',
        JSON.stringify([
          { id: 'dm2-1',  senderId: M.marcus, senderName: 'Marcus Lee', text: 'Hey — found a bug in the auth refresh token flow. Users are getting logged out after 30 min.', html: 'Hey — found a bug in the auth refresh token flow. Users are getting logged out after 30 min.', ts: now - hour * 11 },
          { id: 'dm2-2',  senderId: me,       senderName: 'You',        text: "That's a critical one. Can you prioritize it today?", html: "That's a critical one. Can you prioritize it today?", ts: now - hour * 10.5 },
          { id: 'dm2-3',  senderId: M.marcus, senderName: 'Marcus Lee', text: 'Already on it — root cause is the token expiry check ignoring clock skew. Fix is straightforward.', html: 'Already on it — root cause is the token expiry check ignoring clock skew. Fix is straightforward.', ts: now - hour * 10 },
          { id: 'dm2-4',  senderId: me,       senderName: 'You',        text: 'Nice detective work. Let me know when it is on staging.', html: 'Nice detective work. Let me know when it is on staging.', ts: now - hour * 9 },
          { id: 'dm2-5',  senderId: M.marcus, senderName: 'Marcus Lee', text: 'Pushed the auth fix to staging. Also added retry logic for network timeouts while I was in there.', html: 'Pushed the auth fix to staging. Also added retry logic for network timeouts while I was in there.', ts: now - hour * 7 },
          { id: 'dm2-6',  senderId: me,       senderName: 'You',        text: "Perfect, I'll test this afternoon. Great catch on the timeout handling.", html: "Perfect, I'll test this afternoon. Great catch on the timeout handling.", ts: now - hour * 6.5 },
          { id: 'dm2-7',  senderId: M.marcus, senderName: 'Marcus Lee', text: 'Token refresh interval is now 25 min with a 5-min buffer. Should be bulletproof.', html: 'Token refresh interval is now 25 min with a 5-min buffer. Should be bulletproof.', ts: now - hour * 6 },
          { id: 'dm2-8',  senderId: me,       senderName: 'You',        text: 'Tested — auth is solid. Logging out works cleanly too. Ship it.', html: 'Tested — auth is solid. Logging out works cleanly too. Ship it.', ts: now - hour * 5.5 },
          { id: 'dm2-9',  senderId: M.marcus, senderName: 'Marcus Lee', text: 'API docs are ready — pushed to staging. Covers all the new endpoints from this sprint.', html: 'API docs are ready — pushed to staging. Covers all the new endpoints from this sprint.', ts: now - hour * 5 },
          { id: 'dm2-10', senderId: me,       senderName: 'You',        text: 'Great. Can you share the link with Priya so she can reference it for the blog post?', html: 'Great. Can you share the link with Priya so she can reference it for the blog post?', ts: now - hour * 4.5 },
          { id: 'dm2-11', senderId: M.marcus, senderName: 'Marcus Lee', text: 'Done — sent her the staging URL. Docs will auto-sync to prod on deploy.', html: 'Done — sent her the staging URL. Docs will auto-sync to prod on deploy.', ts: now - hour * 4 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-3',
        JSON.stringify([
          { id: 'dm3-1',  senderId: me,      senderName: 'You',        text: "Hey Priya — how's the launch blog post coming along?", html: "Hey Priya — how's the launch blog post coming along?", ts: now - hour * 14 },
          { id: 'dm3-2',  senderId: M.priya, senderName: 'Priya Patel', text: 'Going really well! Intro and feature highlights are done. Working on the "why BloomBoard" section now.', html: 'Going really well! Intro and feature highlights are done. Working on the "why BloomBoard" section now.', ts: now - hour * 13.5 },
          { id: 'dm3-3',  senderId: me,      senderName: 'You',        text: 'Make sure to lead with the privacy-first angle — that resonates a lot with our audience.', html: 'Make sure to lead with the privacy-first angle — that resonates a lot with our audience.', ts: now - hour * 13 },
          { id: 'dm3-4',  senderId: M.priya, senderName: 'Priya Patel', text: "Already in there! Also adding a competitor comparison table — thoughts? I'm keeping it to 4 rows.", html: "Already in there! Also adding a competitor comparison table — thoughts? I'm keeping it to 4 rows.", ts: now - hour * 12.5 },
          { id: 'dm3-5',  senderId: me,      senderName: 'You',        text: 'Love that idea — keep it simple and factual. Lead with our strengths, not their weaknesses.', html: 'Love that idea — keep it simple and factual. Lead with our strengths, not their weaknesses.', ts: now - hour * 12 },
          { id: 'dm3-6',  senderId: M.priya, senderName: 'Priya Patel', text: 'First draft of the launch blog is in Notion. Link in the shared workspace doc.', html: 'First draft of the launch blog is in Notion. Link in the shared workspace doc.', ts: now - hour * 10 },
          { id: 'dm3-7',  senderId: me,      senderName: 'You',        text: "Great — I'll add comments tonight. It's looking clean from a quick scan.", html: "Great — I'll add comments tonight. It's looking clean from a quick scan.", ts: now - hour * 9 },
          { id: 'dm3-8',  senderId: M.priya, senderName: 'Priya Patel', text: "Also drafted the launch day email newsletter — want me to share that too? It's a 3-part drip sequence.", html: "Also drafted the launch day email newsletter — want me to share that too? It's a 3-part drip sequence.", ts: now - hour * 8.5 },
          { id: 'dm3-9',  senderId: me,      senderName: 'You',        text: "Yes please — let's align the messaging across both so everything feels consistent.", html: "Yes please — let's align the messaging across both so everything feels consistent.", ts: now - hour * 8.2 },
          { id: 'dm3-10', senderId: M.priya, senderName: 'Priya Patel', text: "Will do! I'll link them all in the Notion doc so everything is in one place.", html: "Will do! I'll link them all in the Notion doc so everything is in one place.", ts: now - hour * 8.1 },
          { id: 'dm3-11', senderId: M.priya, senderName: 'Priya Patel', text: 'Blog draft is ready for your review. Added your comments — all addressed. 🙌', html: 'Blog draft is ready for your review. Added your comments — all addressed. 🙌', ts: now - hour * 8 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-grp-1',
        JSON.stringify([
          { id: 'grp1-1',  senderId: M.priya,  senderName: 'Priya Patel',  text: 'Blog post draft is in the shared doc — everyone please take a quick look before Thursday.', html: 'Blog post draft is in the shared doc — everyone please take a quick look before Thursday.', ts: now - hour * 10 },
          { id: 'grp1-2',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Read it — solid work Priya. The comparison table is a nice touch.', html: 'Read it — solid work Priya. The comparison table is a nice touch.', ts: now - hour * 9.5 },
          { id: 'grp1-3',  senderId: M.sarah,  senderName: 'Sarah Chen',   text: 'Agreed! Also — hero animation is looking smooth in the latest build. Really happy with how it turned out.', html: 'Agreed! Also — hero animation is looking smooth in the latest build. Really happy with how it turned out.', ts: now - hour * 9 },
          { id: 'grp1-4',  senderId: me,       senderName: 'You',          text: "Nice. Let's lock designs by end of today so Marcus can do final dev handoff. Sound good?", html: "Nice. Let's lock designs by end of today so Marcus can do final dev handoff. Sound good?", ts: now - hour * 8.5 },
          { id: 'grp1-5',  senderId: M.sarah,  senderName: 'Sarah Chen',   text: 'Works for me — designs are 95% there. Just need sign-off on the mobile nav.', html: 'Works for me — designs are 95% there. Just need sign-off on the mobile nav.', ts: now - hour * 8 },
          { id: 'grp1-6',  senderId: M.priya,  senderName: 'Priya Patel',  text: 'Email sequence is also ready — 3-part drip for launch week. Kicking off with the blog announcement.', html: 'Email sequence is also ready — 3-part drip for launch week. Kicking off with the blog announcement.', ts: now - hour * 6 },
          { id: 'grp1-7',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Backend is stable on staging. 24 hours, zero errors in the logs.', html: 'Backend is stable on staging. 24 hours, zero errors in the logs.', ts: now - hour * 5 },
          { id: 'grp1-8',  senderId: me,       senderName: 'You',          text: "That's what I want to hear. We're looking good for Thursday.", html: "That's what I want to hear. We're looking good for Thursday.", ts: now - hour * 4 },
          { id: 'grp1-9',  senderId: M.sarah,  senderName: 'Sarah Chen',   text: 'Landing page copy looks good to me ✅ Mobile nav signed off too.', html: 'Landing page copy looks good to me ✅ Mobile nav signed off too.', ts: now - hour * 3 },
          { id: 'grp1-10', senderId: me,       senderName: 'You',          text: '@Priya can you confirm the blog goes live at 9am Thursday? Want to sync the email and social posts to that.', html: '@Priya can you confirm the blog goes live at 9am Thursday? Want to sync the email and social posts to that.', ts: now - hour * 2 },
          { id: 'grp1-11', senderId: M.priya,  senderName: 'Priya Patel',  text: 'Confirmed — 9am Thursday. Email goes out at 9:05, social posts at 9:10. 🚀', html: 'Confirmed — 9am Thursday. Email goes out at 9:05, social posts at 9:10. 🚀', ts: now - hour * 1.5 },
          { id: 'grp1-12', senderId: M.marcus, senderName: 'Marcus Lee',   text: '@You can you confirm the launch date? Need to schedule the prod deploy window.', html: '@You can you confirm the launch date? Need to schedule the prod deploy window.', ts: now - hour },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-grp-2',
        JSON.stringify([
          { id: 'grp2-1',  senderId: M.tom,    senderName: 'Tom Nguyen',   text: 'Infrastructure is prepped for the release — bumped server capacity by 20% ahead of launch traffic.', html: 'Infrastructure is prepped for the release — bumped server capacity by 20% ahead of launch traffic.', ts: now - hour * 10 },
          { id: 'grp2-2',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Nice. I will make sure the build artifacts are clean before we push to prod.', html: 'Nice. I will make sure the build artifacts are clean before we push to prod.', ts: now - hour * 9.5 },
          { id: 'grp2-3',  senderId: me,       senderName: 'You',          text: "Good. Let's do a staged rollout — 10% first, monitor for 30 min, then go full.", html: "Good. Let's do a staged rollout — 10% first, monitor for 30 min, then go full.", ts: now - hour * 9 },
          { id: 'grp2-4',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Agreed. Feature flags are already set up for that. Kicked off the staging deploy.', html: 'Agreed. Feature flags are already set up for that. Kicked off the staging deploy.', ts: now - hour * 7 },
          { id: 'grp2-5',  senderId: me,       senderName: 'You',          text: 'Thanks — ping me when it is green.', html: 'Thanks — ping me when it is green.', ts: now - hour * 6.5 },
          { id: 'grp2-6',  senderId: M.tom,    senderName: 'Tom Nguyen',   text: 'Logs look clean so far — no errors in the past hour. P95 latency is under 180ms.', html: 'Logs look clean so far — no errors in the past hour. P95 latency is under 180ms.', ts: now - hour * 6 },
          { id: 'grp2-7',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Running final smoke tests now — auth, payments, notifications all passing.', html: 'Running final smoke tests now — auth, payments, notifications all passing.', ts: now - hour * 5.5 },
          { id: 'grp2-8',  senderId: me,       senderName: 'You',          text: 'How are the performance metrics looking on the dashboard feature? That one had a heavy query.', html: 'How are the performance metrics looking on the dashboard feature? That one had a heavy query.', ts: now - hour * 5.2 },
          { id: 'grp2-9',  senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Added an index for that query — response time dropped from 800ms to 42ms. Should be fine.', html: 'Added an index for that query — response time dropped from 800ms to 42ms. Should be fine.', ts: now - hour * 5 },
          { id: 'grp2-10', senderId: M.tom,    senderName: 'Tom Nguyen',   text: 'Everything looks solid from the infra side. CDN cache is warm, DB connections stable.', html: 'Everything looks solid from the infra side. CDN cache is warm, DB connections stable.', ts: now - hour * 4.5 },
          { id: 'grp2-11', senderId: M.marcus, senderName: 'Marcus Lee',   text: 'Staging deploy finished — ready for QA. Handing off to James.', html: 'Staging deploy finished — ready for QA. Handing off to James.', ts: now - hour * 4 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-4',
        JSON.stringify([
          { id: 'dm4-1',  senderId: M.james, senderName: 'James Okonkwo', text: 'Starting the regression run for the new auth changes Marcus pushed. Will cover all critical paths.', html: 'Starting the regression run for the new auth changes Marcus pushed. Will cover all critical paths.', ts: now - hour * 12 },
          { id: 'dm4-2',  senderId: me,      senderName: 'You',           text: 'Thanks James. Let me know if anything looks off.', html: 'Thanks James. Let me know if anything looks off.', ts: now - hour * 11.5 },
          { id: 'dm4-3',  senderId: M.james, senderName: 'James Okonkwo', text: 'Found a minor issue — on very small screens (320px) the login button overlaps the input field.', html: 'Found a minor issue — on very small screens (320px) the login button overlaps the input field.', ts: now - hour * 11 },
          { id: 'dm4-4',  senderId: me,      senderName: 'You',           text: "Good catch. I'll flag it to Sarah — she can fix the padding in the next design pass.", html: "Good catch. I'll flag it to Sarah — she can fix the padding in the next design pass.", ts: now - hour * 10.5 },
          { id: 'dm4-5',  senderId: M.james, senderName: 'James Okonkwo', text: 'The notification badge fix is solid though — badge clears instantly on read now. Big improvement.', html: 'The notification badge fix is solid though — badge clears instantly on read now. Big improvement.', ts: now - hour * 10 },
          { id: 'dm4-6',  senderId: me,      senderName: 'You',           text: 'James, can you run through the full QA checklist before we ship? Targeting Thursday launch.', html: 'James, can you run through the full QA checklist before we ship? Targeting Thursday launch.', ts: now - hour * 9 },
          { id: 'dm4-7',  senderId: M.james, senderName: 'James Okonkwo', text: 'On it — running regression tests now. Should take about 2 hours for the full suite.', html: 'On it — running regression tests now. Should take about 2 hours for the full suite.', ts: now - hour * 8 },
          { id: 'dm4-8',  senderId: M.james, senderName: 'James Okonkwo', text: 'Auth flow ✅  Onboarding ✅  Settings ✅  Notifications ✅  Boards ✅', html: 'Auth flow ✅  Onboarding ✅  Settings ✅  Notifications ✅  Boards ✅', ts: now - hour * 7 },
          { id: 'dm4-9',  senderId: me,      senderName: 'You',           text: 'Excellent. Any blockers or edge cases I should know about?', html: 'Excellent. Any blockers or edge cases I should know about?', ts: now - hour * 6.5 },
          { id: 'dm4-10', senderId: M.james, senderName: 'James Okonkwo', text: 'All clear! The 320px overlap is cosmetic and low-risk for launch. Can be patched in a hotfix.', html: 'All clear! The 320px overlap is cosmetic and low-risk for launch. Can be patched in a hotfix.', ts: now - hour * 6.2 },
          { id: 'dm4-11', senderId: M.james, senderName: 'James Okonkwo', text: 'QA sign-off done — checklist is all green. Ready to ship! ✅', html: 'QA sign-off done — checklist is all green. Ready to ship! ✅', ts: now - hour * 6 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-5',
        JSON.stringify([
          { id: 'dm5-1',  senderId: M.elena, senderName: 'Elena Vasquez', text: 'Had a call with a new enterprise prospect today — they are very excited about the team workspace features.', html: 'Had a call with a new enterprise prospect today — they are very excited about the team workspace features.', ts: now - hour * 16 },
          { id: 'dm5-2',  senderId: me,      senderName: 'You',           text: "That's exciting! What features caught their attention the most?", html: "That's exciting! What features caught their attention the most?", ts: now - hour * 15.5 },
          { id: 'dm5-3',  senderId: M.elena, senderName: 'Elena Vasquez', text: 'KPI tracking and the local-first data approach. They have strict IT security policies — no cloud storage.', html: 'KPI tracking and the local-first data approach. They have strict IT security policies — no cloud storage.', ts: now - hour * 15 },
          { id: 'dm5-4',  senderId: me,      senderName: 'You',           text: 'Perfect fit for us. Did they raise any concerns or blockers?', html: 'Perfect fit for us. Did they raise any concerns or blockers?', ts: now - hour * 14.5 },
          { id: 'dm5-5',  senderId: M.elena, senderName: 'Elena Vasquez', text: 'They asked about SSO — specifically SAML/Okta integration. Is that on the roadmap?', html: 'They asked about SSO — specifically SAML/Okta integration. Is that on the roadmap?', ts: now - hour * 14 },
          { id: 'dm5-6',  senderId: me,      senderName: 'You',           text: "SSO is planned for Q4. I'll make sure you have the right talking points — should not be a dealbreaker.", html: "SSO is planned for Q4. I'll make sure you have the right talking points — should not be a dealbreaker.", ts: now - hour * 13.5 },
          { id: 'dm5-7',  senderId: M.elena, senderName: 'Elena Vasquez', text: 'Got feedback from the onboarding call this morning — users love the new simplified flow.', html: 'Got feedback from the onboarding call this morning — users love the new simplified flow.', ts: now - hour * 11 },
          { id: 'dm5-8',  senderId: me,      senderName: 'You',           text: "That's great to hear! Anything we should improve or that confused them?", html: "That's great to hear! Anything we should improve or that confused them?", ts: now - hour * 10.5 },
          { id: 'dm5-9',  senderId: M.elena, senderName: 'Elena Vasquez', text: "Some users weren't sure where to start after signing up. A guided 'first board' template could help.", html: "Some users weren't sure where to start after signing up. A guided 'first board' template could help.", ts: now - hour * 10 },
          { id: 'dm5-10', senderId: me,      senderName: 'You',           text: "Good insight — I'll add a 'starter template' to the product backlog. That's a quick win.", html: "Good insight — I'll add a 'starter template' to the product backlog. That's a quick win.", ts: now - hour * 9.5 },
          { id: 'dm5-11', senderId: M.elena, senderName: 'Elena Vasquez', text: 'Customer loved the onboarding flow update! NPS from this cohort is 9.2 — best we have ever seen.', html: 'Customer loved the onboarding flow update! NPS from this cohort is 9.2 — best we have ever seen.', ts: now - hour * 9 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-6',
        JSON.stringify([
          { id: 'dm6-1',  senderId: M.david, senderName: 'David Kim', text: 'Pulling together the weekly metrics dashboard now — anything specific you want to highlight for the all-hands?', html: 'Pulling together the weekly metrics dashboard now — anything specific you want to highlight for the all-hands?', ts: now - hour * 18 },
          { id: 'dm6-2',  senderId: me,      senderName: 'You',        text: 'Focus on retention and activation rate — those are our core Q2 goals. And session length if it is trending well.', html: 'Focus on retention and activation rate — those are our core Q2 goals. And session length if it is trending well.', ts: now - hour * 17.5 },
          { id: 'dm6-3',  senderId: M.david, senderName: 'David Kim', text: "Session length is trending great — average up 4 minutes week-over-week. I'll include it.", html: "Session length is trending great — average up 4 minutes week-over-week. I'll include it.", ts: now - hour * 17 },
          { id: 'dm6-4',  senderId: me,      senderName: 'You',        text: "That's a strong signal. What's driving it?", html: "That's a strong signal. What's driving it?", ts: now - hour * 16.5 },
          { id: 'dm6-5',  senderId: M.david, senderName: 'David Kim', text: 'Users who set up a board in their first session are staying 3x longer on average. Boards are the activation hook.', html: 'Users who set up a board in their first session are staying 3x longer on average. Boards are the activation hook.', ts: now - hour * 16 },
          { id: 'dm6-6',  senderId: me,      senderName: 'You',        text: 'Interesting — we should make board setup more prominent in the onboarding flow. I will flag it to the team.', html: 'Interesting — we should make board setup more prominent in the onboarding flow. I will flag it to the team.', ts: now - hour * 15.5 },
          { id: 'dm6-7',  senderId: M.david, senderName: 'David Kim', text: 'Week-over-week retention jumped 8% since the last release. Highest single-week lift we have recorded.', html: 'Week-over-week retention jumped 8% since the last release. Highest single-week lift we have recorded.', ts: now - hour * 14 },
          { id: 'dm6-8',  senderId: me,      senderName: 'You',        text: "Impressive! Can you pull together a slide for the all-hands? The team will love seeing this.", html: "Impressive! Can you pull together a slide for the all-hands? The team will love seeing this.", ts: now - hour * 13.5 },
          { id: 'dm6-9',  senderId: M.david, senderName: 'David Kim', text: "Already on it — deck will be ready by 4pm. I'll share in All Hands chat so everyone has it.", html: "Already on it — deck will be ready by 4pm. I'll share in All Hands chat so everyone has it.", ts: now - hour * 13 },
          { id: 'dm6-10', senderId: me,      senderName: 'You',        text: "Perfect. One more thing — can you track how many users hit our 'aha moment' in under 5 minutes?", html: "Perfect. One more thing — can you track how many users hit our 'aha moment' in under 5 minutes?", ts: now - hour * 12.5 },
          { id: 'dm6-11', senderId: M.david, senderName: 'David Kim', text: 'Dashboard retention numbers look great this week. Will add the aha-moment funnel to next week\'s report.', html: 'Dashboard retention numbers look great this week. Will add the aha-moment funnel to next week\'s report.', ts: now - hour * 12 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-dm-7',
        JSON.stringify([
          { id: 'dm7-1',  senderId: M.tom, senderName: 'Tom Nguyen', text: 'CI runs have been averaging 18 min this week — too slow. I want to look into optimizing the pipeline.', html: 'CI runs have been averaging 18 min this week — too slow. I want to look into optimizing the pipeline.', ts: now - hour * 22 },
          { id: 'dm7-2',  senderId: me,    senderName: 'You',        text: '18 min is too long. What is slowing it down?', html: '18 min is too slow. What is slowing it down?', ts: now - hour * 21.5 },
          { id: 'dm7-3',  senderId: M.tom, senderName: 'Tom Nguyen', text: 'The test suite has grown a lot — lots of redundant setup steps and no caching. I can fix both.', html: 'The test suite has grown a lot — lots of redundant setup steps and no caching. I can fix both.', ts: now - hour * 21 },
          { id: 'dm7-4',  senderId: me,    senderName: 'You',        text: "Please do — fast CI is critical for our shipping cadence. Let's target under 10 min.", html: "Please do — fast CI is critical for our shipping cadence. Let's target under 10 min.", ts: now - hour * 20.5 },
          { id: 'dm7-5',  senderId: M.tom, senderName: 'Tom Nguyen', text: 'Updated the deployment config — added node_modules caching and parallelized the test jobs. Should cut times by 30%.', html: 'Updated the deployment config — added node_modules caching and parallelized the test jobs. Should cut times by 30%.', ts: now - hour * 18 },
          { id: 'dm7-6',  senderId: me,    senderName: 'You',        text: 'Nice work! Did all the checks pass with the new config?', html: 'Nice work! Did all the checks pass with the new config?', ts: now - hour * 17.5 },
          { id: 'dm7-7',  senderId: M.tom, senderName: 'Tom Nguyen', text: "Yes — just ran it. Build time is now 11 min 20 sec. Not quite 10 but we're close.", html: "Yes — just ran it. Build time is now 11 min 20 sec. Not quite 10 but we're close.", ts: now - hour * 17 },
          { id: 'dm7-8',  senderId: me,    senderName: 'You',        text: "11 min is great — what's left to squeeze out the extra minute?", html: "11 min is great — what's left to squeeze out the extra minute?", ts: now - hour * 16.5 },
          { id: 'dm7-9',  senderId: M.tom, senderName: 'Tom Nguyen', text: "The e2e tests are the bottleneck. I'll parallelize those next sprint — should get us to 8-9 min.", html: "The e2e tests are the bottleneck. I'll parallelize those next sprint — should get us to 8-9 min.", ts: now - hour * 16 },
          { id: 'dm7-10', senderId: me,    senderName: 'You',        text: "Perfect. Add it to the sprint backlog and let's tackle it after launch.", html: "Perfect. Add it to the sprint backlog and let's tackle it after launch.", ts: now - hour * 15.5 },
          { id: 'dm7-11', senderId: M.tom, senderName: 'Tom Nguyen', text: 'CI pipeline is green — all checks passed. Latest build: 11 min 18 sec. 🟢', html: 'CI pipeline is green — all checks passed. Latest build: 11 min 18 sec. 🟢', ts: now - hour * 15 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-grp-3',
        JSON.stringify([
          { id: 'grp3-1',  senderId: M.sarah, senderName: 'Sarah Chen',   text: 'Starting the Q3 design system refresh today. Goal: tighten spacing, update color tokens, and clean up the type scale.', html: 'Starting the Q3 design system refresh today. Goal: tighten spacing, update color tokens, and clean up the type scale.', ts: now - hour * 14 },
          { id: 'grp3-2',  senderId: me,      senderName: 'You',          text: 'Sounds great. Can we schedule a short review Thursday to walk through it together?', html: 'Sounds great. Can we schedule a short review Thursday to walk through it together?', ts: now - hour * 13.5 },
          { id: 'grp3-3',  senderId: M.priya, senderName: 'Priya Patel',  text: "I'd love to join — want to make sure the marketing templates stay aligned with any token changes.", html: "I'd love to join — want to make sure the marketing templates stay aligned with any token changes.", ts: now - hour * 13 },
          { id: 'grp3-4',  senderId: M.sarah, senderName: 'Sarah Chen',   text: 'Thursday 2pm works for me! I will share a preview doc beforehand so everyone can come prepared.', html: 'Thursday 2pm works for me! I will share a preview doc beforehand so everyone can come prepared.', ts: now - hour * 12.5 },
          { id: 'grp3-5',  senderId: me,      senderName: 'You',          text: "Done — calendar invite sent. Let's keep it focused: just spacing, colors, and typography today.", html: "Done — calendar invite sent. Let's keep it focused: just spacing, colors, and typography today.", ts: now - hour * 12 },
          { id: 'grp3-6',  senderId: M.sarah, senderName: 'Sarah Chen',   text: 'Shared the token updates in Figma — the blues are slightly warmer now. Should feel more premium.', html: 'Shared the token updates in Figma — the blues are slightly warmer now. Should feel more premium.', ts: now - hour * 10 },
          { id: 'grp3-7',  senderId: M.priya, senderName: 'Priya Patel',  text: 'Looks great! The warmer blue is much better. Feels more brand-aligned now.', html: 'Looks great! The warmer blue is much better. Feels more brand-aligned now.', ts: now - hour * 9.5 },
          { id: 'grp3-8',  senderId: me,      senderName: 'You',          text: "Agreed. Let's apply the new tokens to the landing page while we are at it — consistent everywhere.", html: "Agreed. Let's apply the new tokens to the landing page while we are at it — consistent everywhere.", ts: now - hour * 9 },
          { id: 'grp3-9',  senderId: M.sarah, senderName: 'Sarah Chen',   text: 'Already done it — landing page components are updated. Just pushed the icon set refresh too.', html: 'Already done it — landing page components are updated. Just pushed the icon set refresh too.', ts: now - hour * 8 },
          { id: 'grp3-10', senderId: M.priya, senderName: 'Priya Patel',  text: "Love the new icons — the stroke weight feels much more balanced. Can we use these in the email templates too?", html: "Love the new icons — the stroke weight feels much more balanced. Can we use these in the email templates too?", ts: now - hour * 7.5 },
          { id: 'grp3-11', senderId: M.sarah, senderName: 'Sarah Chen',   text: 'New component library is live in Figma! All tokens, components, and icons in one place. 🎨', html: 'New component library is live in Figma! All tokens, components, and icons in one place. 🎨', ts: now - hour * 7 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-grp-4',
        JSON.stringify([
          { id: 'grp4-1',  senderId: M.aisha, senderName: 'Aisha Rahman',  text: "Finished the product walkthrough video script — it's about 90 seconds. Ready for review.", html: "Finished the product walkthrough video script — it's about 90 seconds. Ready for review.", ts: now - hour * 18 },
          { id: 'grp4-2',  senderId: me,      senderName: 'You',           text: "Great — I'll read through it this afternoon. What tone did you go for?", html: "Great — I'll read through it this afternoon. What tone did you go for?", ts: now - hour * 17.5 },
          { id: 'grp4-3',  senderId: M.aisha, senderName: 'Aisha Rahman',  text: 'Confident but approachable — same vibe as the website copy. No corporate speak.', html: 'Confident but approachable — same vibe as the website copy. No corporate speak.', ts: now - hour * 17 },
          { id: 'grp4-4',  senderId: M.priya, senderName: 'Priya Patel',   text: 'Perfect. I will coordinate the social post schedule around the blog publish date.', html: 'Perfect. I will coordinate the social post schedule around the blog publish date.', ts: now - hour * 16.5 },
          { id: 'grp4-5',  senderId: me,      senderName: 'You',           text: "Let's aim for Thursday morning — peak engagement time for our audience.", html: "Let's aim for Thursday morning — peak engagement time for our audience.", ts: now - hour * 16 },
          { id: 'grp4-6',  senderId: M.priya, senderName: 'Priya Patel',   text: 'LinkedIn carousel is ready too — 8 slides covering all the key features. Looks sharp.', html: 'LinkedIn carousel is ready too — 8 slides covering all the key features. Looks sharp.', ts: now - hour * 14 },
          { id: 'grp4-7',  senderId: M.aisha, senderName: 'Aisha Rahman',  text: "Blog post is drafted — ready for a final review before we schedule. Link is in the Notion doc.", html: "Blog post is drafted — ready for a final review before we schedule. Link is in the Notion doc.", ts: now - hour * 13 },
          { id: 'grp4-8',  senderId: me,      senderName: 'You',           text: "Looks solid! Let's go Thursday for max impact — 9am publish.", html: "Looks solid! Let's go Thursday for max impact — 9am publish.", ts: now - hour * 12 },
          { id: 'grp4-9',  senderId: M.aisha, senderName: 'Aisha Rahman',  text: "I'll also prep a Twitter/X thread version for extra reach. Should drive good traffic back to the blog.", html: "I'll also prep a Twitter/X thread version for extra reach. Should drive good traffic back to the blog.", ts: now - hour * 11.5 },
          { id: 'grp4-10', senderId: M.priya, senderName: 'Priya Patel',   text: "Great idea — thread format does really well for our audience. I'll cross-post on our company LinkedIn too.", html: "Great idea — thread format does really well for our audience. I'll cross-post on our company LinkedIn too.", ts: now - hour * 11.2 },
          { id: 'grp4-11', senderId: M.priya, senderName: 'Priya Patel',   text: 'Launch post is scheduled for Thursday 9am. Email, social, and blog are all locked and ready. 📅', html: 'Launch post is scheduled for Thursday 9am. Email, social, and blog are all locked and ready. 📅', ts: now - hour * 11 },
        ])
      );
      localStorage.setItem(
        'bloom_chat_msgs_demo-conv-grp-5',
        JSON.stringify([
          { id: 'grp5-1',  senderId: M.elena,  senderName: 'Elena Vasquez',  text: 'Customer satisfaction score is at 4.8 out of 5 this month — highest we have ever had! 🎉', html: 'Customer satisfaction score is at 4.8 out of 5 this month — highest we have ever had! 🎉', ts: now - hour * 8 },
          { id: 'grp5-2',  senderId: M.rachel, senderName: 'Rachel Brooks',   text: 'Ops update: new customer onboarding SLA is now under 2 days. Down from 5. Big improvement for the team.', html: 'Ops update: new customer onboarding SLA is now under 2 days. Down from 5. Big improvement for the team.', ts: now - hour * 7.5 },
          { id: 'grp5-3',  senderId: M.tom,    senderName: 'Tom Nguyen',      text: 'Zero unplanned downtime this sprint. CI/CD is running smoothly, infra is healthy. 🟢', html: 'Zero unplanned downtime this sprint. CI/CD is running smoothly, infra is healthy. 🟢', ts: now - hour * 7 },
          { id: 'grp5-4',  senderId: M.aisha,  senderName: 'Aisha Rahman',    text: 'Content is 100% ready for Thursday launch — blog, email, and social all scheduled. 🚀', html: 'Content is 100% ready for Thursday launch — blog, email, and social all scheduled. 🚀', ts: now - hour * 6.5 },
          { id: 'grp5-5',  senderId: M.james,  senderName: 'James Okonkwo',   text: 'QA has cleared all launch blockers. Checklist is all green. We are good to go! ✅', html: 'QA has cleared all launch blockers. Checklist is all green. We are good to go! ✅', ts: now - hour * 6 },
          { id: 'grp5-6',  senderId: M.marcus, senderName: 'Marcus Lee',      text: 'Build is clean, staging is green, performance metrics are all within targets. Engineering is ready.', html: 'Build is clean, staging is green, performance metrics are all within targets. Engineering is ready.', ts: now - hour * 5.5 },
          { id: 'grp5-7',  senderId: M.sarah,  senderName: 'Sarah Chen',      text: 'Designs are signed off. Final assets exported and handed off to Marcus. 🎨', html: 'Designs are signed off. Final assets exported and handed off to Marcus. 🎨', ts: now - hour * 5 },
          { id: 'grp5-8',  senderId: M.priya,  senderName: 'Priya Patel',     text: 'Email, blog, and social are all scheduled and ready for 9am Thursday. Nothing left to do but launch!', html: 'Email, blog, and social are all scheduled and ready for 9am Thursday. Nothing left to do but launch!', ts: now - hour * 4.5 },
          { id: 'grp5-9',  senderId: M.david,  senderName: 'David Kim',       text: 'Sharing the weekly metrics — DAUs up 14%, churn down to 2.1%, retention up 8%. 📈 Best sprint ever.', html: 'Sharing the weekly metrics — DAUs up 14%, churn down to 2.1%, retention up 8%. 📈 Best sprint ever.', ts: now - hour * 4 },
          { id: 'grp5-10', senderId: M.sarah,  senderName: 'Sarah Chen',      text: "Amazing numbers — team absolutely crushed it this sprint. So proud of everyone. 🙌", html: "Amazing numbers — team absolutely crushed it this sprint. So proud of everyone. 🙌", ts: now - hour * 3 },
          { id: 'grp5-11', senderId: M.rachel, senderName: 'Rachel Brooks',   text: "This is what happens when everyone is aligned and working well together. Let's keep this energy!", html: "This is what happens when everyone is aligned and working well together. Let's keep this energy!", ts: now - hour * 2.5 },
          { id: 'grp5-12', senderId: me,       senderName: 'You',             text: 'Great sprint everyone — ship it! 🚀', html: 'Great sprint everyone — ship it! 🚀', ts: now - hour * 2 },
        ])
      );

      localStorage.setItem(
        'bloom_chat_last_read',
        JSON.stringify({
          'demo-conv-dm-1':  now - hour * 4,
          'demo-conv-dm-2':  now - hour * 6,
          'demo-conv-dm-3':  now - hour * 10,
          'demo-conv-grp-2': now - hour * 7,
          'demo-conv-dm-5':  now - hour * 11,
          'demo-conv-grp-5': now - hour * 4,
        })
      );

      localStorage.setItem(
        'bloombooard-boards-v1',
        JSON.stringify({
          boards: [
            {
              id: 'demo-board-1',
              title: 'Product Launch',
              desc: 'Ship v2 — design, eng, and marketing',
              icon: '🚀',
              color: 'bc-blue',
              thumbImage: COVERS[0],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 120).toISOString(),
              labels: [
                { id: 'demo-label-1', title: 'Launch', color: '#4d9fff' },
                { id: 'demo-label-2', title: 'Blocked', color: '#ef4444' },
              ],
              columns: [
                { id: 'demo-col-1', title: 'To Do', color: '#6b7280', order: 0 },
                { id: 'demo-col-2', title: 'In Progress', color: '#3b82f6', order: 1 },
                { id: 'demo-col-3', title: 'Done', color: '#10b981', order: 2 },
              ],
            },
            {
              id: 'demo-board-2',
              title: 'Sprint Backlog',
              desc: 'Current sprint — eng team',
              icon: '⚡',
              color: 'bc-purple',
              thumbImage: COVERS[1],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 48).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-col-4', title: 'Backlog', color: '#6b7280', order: 0 },
                { id: 'demo-col-5', title: 'This Week', color: '#3b82f6', order: 1 },
                { id: 'demo-col-6', title: 'Shipped', color: '#10b981', order: 2 },
              ],
            },
            {
              id: 'demo-board-3',
              title: 'Marketing Q3',
              desc: 'Campaigns, content, and launch assets',
              icon: '📣',
              color: 'bc-orange',
              thumbImage: COVERS[2],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 96).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-col-7', title: 'Ideas', color: '#6b7280', order: 0 },
                { id: 'demo-col-8', title: 'In Progress', color: '#3b82f6', order: 1 },
                { id: 'demo-col-9', title: 'Published', color: '#10b981', order: 2 },
              ],
            },
            {
              id: 'demo-board-4',
              title: 'Design System',
              desc: 'Components, tokens, and patterns',
              icon: '🎨',
              color: 'bc-green',
              thumbImage: COVERS[3],
              bgImage: null,
              categoryId: null,
              createdAt: new Date(now - hour * 200).toISOString(),
              labels: [],
              columns: [
                { id: 'demo-col-10', title: 'Backlog', color: '#6b7280', order: 0 },
                { id: 'demo-col-11', title: 'Building', color: '#3b82f6', order: 1 },
                { id: 'demo-col-12', title: 'Ready', color: '#10b981', order: 2 },
              ],
            },
          ],
          cards: [
            { id: 'demo-card-1', boardId: 'demo-board-1', columnId: 'demo-col-2', title: 'Draft launch checklist', desc: 'Final checklist for go-live.', order: 0, assigneeId: me, createdAt: new Date(now - hour * 24).toISOString(), comments: [{ id: 'demo-cmt-1', text: 'Added design sign-off items.', authorName: 'Sarah Chen', createdAt: new Date(now - hour * 2).toISOString() }] },
            { id: 'demo-card-2', boardId: 'demo-board-1', columnId: 'demo-col-1', title: 'Write release notes', desc: 'Summarize features for the blog.', order: 1, assigneeId: M.priya, createdAt: new Date(now - hour * 20).toISOString(), comments: [] },
            { id: 'demo-card-3', boardId: 'demo-board-1', columnId: 'demo-col-3', title: 'Set up analytics', desc: 'PostHog events for launch funnel.', order: 0, assigneeId: M.marcus, createdAt: new Date(now - hour * 48).toISOString(), comments: [] },
            { id: 'demo-card-4', boardId: 'demo-board-2', columnId: 'demo-col-5', title: 'Fix notification badge', desc: 'Badge count not clearing on read.', order: 0, assigneeId: me, createdAt: new Date(now - hour * 8).toISOString(), comments: [] },
            { id: 'demo-card-5', boardId: 'demo-board-2', columnId: 'demo-col-4', title: 'Dark mode polish', desc: 'Contrast pass on sidebar and cards.', order: 0, assigneeId: M.sarah, createdAt: new Date(now - hour * 12).toISOString(), comments: [] },
            { id: 'demo-card-6', boardId: 'demo-board-2', columnId: 'demo-col-6', title: 'OAuth reconnect flow', desc: 'Shipped last sprint.', order: 0, assigneeId: M.marcus, createdAt: new Date(now - hour * 72).toISOString(), comments: [] },
            { id: 'demo-card-7', boardId: 'demo-board-3', columnId: 'demo-col-8', title: 'Launch blog post', desc: 'Coordinate with Priya on publish date.', order: 0, assigneeId: me, createdAt: new Date(now - hour * 16).toISOString(), comments: [] },
            { id: 'demo-card-8', boardId: 'demo-board-3', columnId: 'demo-col-7', title: 'Social media kit', desc: 'Assets for Twitter and LinkedIn.', order: 1, assigneeId: M.priya, createdAt: new Date(now - hour * 18).toISOString(), comments: [] },
            { id: 'demo-card-9', boardId: 'demo-board-4', columnId: 'demo-col-11', title: 'Button component refresh', desc: 'Align with new brand tokens.', order: 0, assigneeId: M.sarah, createdAt: new Date(now - hour * 40).toISOString(), comments: [] },
            { id: 'demo-card-10', boardId: 'demo-board-4', columnId: 'demo-col-12', title: 'Icon set v2', desc: 'Shipped to Figma library.', order: 0, assigneeId: me, createdAt: new Date(now - hour * 80).toISOString(), comments: [] },
          ],
        })
      );

      purgeNonDemoChats();
      seedBloomWelcome(now);
      localStorage.setItem('bb-demo-seeded-v1', '1');
      localStorage.setItem('bb-demo-collab-v1', '1');
    } catch (e) {
      console.warn('[BB Demo] team seed failed', e);
    }
  };

  /* backward compat */
  window.bbSeedFullDemoData = window.bbSeedTeamWorkspace;
})();
