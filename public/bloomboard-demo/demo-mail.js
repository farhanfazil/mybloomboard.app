/**
 * BloomBoard web demo: a connected Outlook account.
 * The desktop app reads mail and calendars through window.electronAPI (main
 * process + Microsoft Graph). Here the visitor's persona (Sam Rivera, Lumen
 * Studio) has Outlook connected, with a seeded inbox, sent folder and this
 * week's Outlook calendar. Actions change the seeded mail; nothing leaves the
 * browser. AI for "Make it a task" and "Write with AI" answers from canned
 * results for the seeded emails and shows the Bloom card for anything else.
 * Loads after demo-boot.js (which creates window.electronAPI) and before the
 * app's own scripts, which check for these functions when they start.
 */
(function () {
  'use strict';

  var api = window.electronAPI;
  if (!api) return;

  var ME = 'Sam Rivera <sam@lumen.studio>';
  var MIN = 60000, HOUR = 3600000, DAY = 86400000;
  var t0 = Date.now();
  function ago(ms) { return new Date(t0 - ms).toISOString(); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* The next Thursday (today if it is Thursday), for "by Thursday". */
  function thursday() {
    var d = new Date(t0);
    d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ── Mail ──────────────────────────────────────────────────────────── */
  var NEWSLETTER_IMG = location.origin + '/backgrounds/hero-bg.jpg';
  var NEWSLETTER =
    '<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937">' +
    '<p style="font-size:12px;color:#6b7280;margin:0 0 12px">Issue 48 · 5 minute read</p>' +
    '<img src="' + NEWSLETTER_IMG + '" alt="" style="width:100%;height:auto;border-radius:10px;display:block">' +
    '<h1 style="font-size:24px;margin:20px 0 8px">Quiet interfaces are winning</h1>' +
    '<p style="font-size:15px;line-height:1.6">This week we look at why the calmest products feel the fastest: fewer colours, stronger type, and one clear action per screen.</p>' +
    '<h2 style="font-size:17px;margin:22px 0 6px">1. One accent, used sparingly</h2>' +
    '<p style="font-size:15px;line-height:1.6">Teams that pick a single accent colour and reserve it for the main action report fewer "where do I click" support tickets.</p>' +
    '<h2 style="font-size:17px;margin:22px 0 6px">2. Type does the heavy lifting</h2>' +
    '<p style="font-size:15px;line-height:1.6">Two weights and three sizes cover almost every screen. Everything else is spacing.</p>' +
    '<h2 style="font-size:17px;margin:22px 0 6px">3. Motion that explains</h2>' +
    '<p style="font-size:15px;line-height:1.6">Short, purposeful transitions (under 250 ms) help people follow what changed without slowing them down.</p>' +
    '<p style="font-size:13px;color:#6b7280;margin-top:28px">You are receiving this because you subscribed to The Design Weekly.</p>' +
    '</div>';

  /* inbox[0] is the newest. `arrives` holds back an email until the simulation drops it in. */
  var INBOX = [
    { id: 'm-acme-banners', subject: 'Spring campaign banners for the launch', from: 'Jordan Blake <jordan@acmeco.example>', date: ago(25 * MIN), unread: true,
      body: 'Hi Sam,\n\nHope the week is going well. Could your team put together the banners for our spring launch by Thursday? We need:\n\n1. A hero banner for the homepage (1920 × 600)\n2. Three social sizes for Instagram and LinkedIn\n3. A short version of the headline for the email header\n\nThe brand guide from last time still applies. Happy to jump on a call if anything is unclear.\n\nThanks,\nJordan\nMarketing Lead, Acme Co.' },
    { id: 'm-maya-checklist', subject: 'Launch checklist, final pass', from: 'Maya Chen <maya@lumen.studio>', date: ago(70 * MIN), unread: true,
      body: 'Hey Sam,\n\nI went through the launch checklist this morning. Two things are still open on our side: the App Store screenshots and the final hero image. Can you confirm both land before the launch sync?\n\nEverything else is green.\n\nMaya' },
    { id: 'm-design-weekly', subject: 'Quiet interfaces are winning', from: 'The Design Weekly <hello@designweekly.example>', date: ago(2 * HOUR), unread: false, isHtml: true,
      snippet: 'This week we look at why the calmest products feel the fastest: fewer colours, stronger type, and one clear action per screen.', body: NEWSLETTER },
    { id: 'm-priya-subjects', subject: 'Launch email: subject line options', from: 'Priya Nair <priya@lumen.studio>', date: ago(3 * HOUR), unread: false,
      body: 'Hi Sam,\n\nHere are three subject lines for the launch email. Which one fits the header image best?\n\nA) Your day, organised\nB) Meet the calmer way to plan\nC) Tasks, boards and your team in one place\n\nI am leaning towards B.\n\nPriya' },
    { id: 'm-leo-staging', subject: 'Staging is up for the pricing page', from: 'Leo Hartmann <leo@lumen.studio>', date: ago(5 * HOUR), unread: false,
      body: 'Sam,\n\nThe new pricing tiers are live on staging. The layout still uses the old card spacing, so it might need a pass from you.\n\nLeo' },
    { id: 'm-northwind', subject: 'Your trip to Lisbon is confirmed', from: 'Northwind Travel <bookings@northwind.example>', date: ago(22 * HOUR), unread: false,
      body: 'Hi Sam,\n\nYour booking is confirmed.\n\nFlight: next Wednesday, 08:40\nHotel: Casa Azul, 3 nights\nReference: NW-48213\n\nHave a great trip,\nNorthwind Travel' },
    { id: 'm-daniel-onboarding', subject: 'Re: Onboarding screens', from: 'Daniel Brooks <daniel@lumen.studio>', date: ago(26 * HOUR), unread: false,
      body: 'Wired up all six screens. The permission prompt still needs the new illustration, otherwise it is ready for QA.\n\nDaniel' },
    { id: 'm-chloe-handover', subject: 'QA handover before my leave', from: 'Chloe Park <chloe@lumen.studio>', date: ago(2 * DAY), unread: false,
      body: 'Hi Sam,\n\nI have handed over the dark mode QA cards on the Mobile App v2 board. The open issues are in the card comments. Back on Thursday!\n\nChloe' },
    { id: 'm-brightlane', subject: 'Invoice #1042 question', from: 'Rina Patel <rina@brightlane.example>', date: ago(2 * DAY + 3 * HOUR), unread: false,
      body: 'Hello Sam,\n\nQuick question on invoice #1042: does the total include the extra revision round from last month, or will that come separately?\n\nThanks,\nRina' },
    { id: 'm-people', subject: 'Office closed on Friday for the offsite', from: 'Lumen Studio People <people@lumen.studio>', date: ago(3 * DAY), unread: false,
      body: 'Hi all,\n\nA reminder that the office is closed on Friday for the company offsite. Details and the agenda are in the calendar invite.\n\nSee you there!' },
    { id: 'm-nora-press', subject: 'Press release draft v2', from: 'Nora Haddad <nora@lumen.studio>', date: ago(3 * DAY + 5 * HOUR), unread: false,
      body: 'Sam,\n\nVersion two of the press release is in the shared doc. I tightened the quotes and moved the pricing line up.\n\nNora' },
    { id: 'm-acme-thanks', subject: 'Thanks for the kickoff', from: 'Jordan Blake <jordan@acmeco.example>', date: ago(4 * DAY), unread: false,
      body: 'Hi Sam,\n\nThanks for a great kickoff call. We will send the brand guide and the copy deck by the end of the week.\n\nBest,\nJordan' },
  ];
  /* Page two, for "Load more emails". */
  var OLDER = [
    { id: 'm-ethan-video', subject: 'Launch video rough cut', from: 'Ethan Cole <ethan@lumen.studio>', date: ago(5 * DAY), unread: false,
      body: 'The rough cut is on the drive. Let me know what you think of the ending.\n\nEthan' },
    { id: 'm-maya-roadmap', subject: 'Q4 roadmap draft', from: 'Maya Chen <maya@lumen.studio>', date: ago(6 * DAY), unread: false,
      body: 'First draft of the Q4 roadmap is on the board. Comments welcome before Friday.\n\nMaya' },
    { id: 'm-brightlane-kick', subject: 'Welcome aboard', from: 'Rina Patel <rina@brightlane.example>', date: ago(8 * DAY), unread: false,
      body: 'Hi Sam,\n\nExcited to start working together. I have shared the brief in the portal.\n\nRina' },
    { id: 'm-people-hours', subject: 'Holiday hours', from: 'Lumen Studio People <people@lumen.studio>', date: ago(9 * DAY), unread: false,
      body: 'Here are the holiday hours for next month. Please add your leave to BloomBoard so the team can plan around it.' },
  ];
  var SENT = [
    { id: 's-acme-kickoff', subject: 'Kickoff agenda', from: ME, to: 'Jordan Blake <jordan@acmeco.example>', date: ago(5 * DAY), unread: false,
      body: 'Hi Jordan,\n\nHere is the agenda for our kickoff: scope, timeline and who owns what on your side.\n\nSam' },
    { id: 's-maya-hero', subject: 'Re: Hero image', from: ME, to: 'Maya Chen <maya@lumen.studio>', date: ago(2 * DAY), unread: false,
      body: 'Final version is on the board. I went with the darker background.\n\nSam' },
  ];
  /* Dropped in about a minute after the visitor first opens Email. */
  var ARRIVING = { id: 'm-maya-quick', subject: 'Quick one before the launch sync', from: 'Maya Chen <maya@lumen.studio>', unread: true,
    body: 'Can you bring the two hero options to the launch sync? I want to pick one with the team.\n\nThanks!\nMaya' };
  var openedAt = 0;

  function snippet(m) {
    if (m.snippet) return m.snippet;
    return String(m.body || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  }
  function listItem(m) {
    return { id: m.id, subject: m.subject, from: m.from, date: m.date, snippet: snippet(m), unread: !!m.unread };
  }
  function inbox() {
    if (openedAt && !ARRIVING.date && Date.now() - openedAt > 55 * 1000) {
      ARRIVING.date = new Date().toISOString();
      INBOX.unshift(ARRIVING);
    }
    return INBOX;
  }
  function find(id) {
    return inbox().concat(OLDER, SENT).filter(function (m) { return m.id === id; })[0] || null;
  }

  /* "Start fresh" is a new download: no account connected yet (Connect shows the
     Mac-app card). */
  api.bbGetOAuthState = function () {
    if (window.__bbDemoFresh) return Promise.resolve({ google: null, microsoft: null });
    return Promise.resolve({ google: null, microsoft: { connected: true, email: 'sam@lumen.studio' } });
  };
  api.bbOAuthConnect = function () {
    if (window.bbDemoGate) window.bbDemoGate('email');
    return Promise.resolve({ ok: false, error: 'demo' });
  };
  api.bbOAuthDisconnect = function () {
    if (window.bbDemoGate) window.bbDemoGate('email');
    return Promise.resolve({ ok: false, error: 'demo' });
  };

  api.bbEmailFetch = function (opts) {
    opts = opts || {};
    if (!openedAt) openedAt = Date.now();
    var sent = opts.folder === 'sent';
    var list = sent ? SENT : opts.pageToken === 'page-2' ? OLDER : inbox();
    return wait(opts.pageToken ? 500 : 350).then(function () {
      return { messages: list.map(listItem), nextPageToken: !sent && !opts.pageToken ? 'page-2' : '' };
    });
  };
  api.bbEmailGet = function (opts) {
    var m = find(opts && opts.messageId);
    return wait(250).then(function () {
      if (!m) return { error: 'Email not found' };
      return { id: m.id, subject: m.subject, from: m.from, to: m.to || ME, date: m.date, body: m.body, isHtml: !!m.isHtml };
    });
  };
  api.bbEmailAction = function (opts) {
    opts = opts || {};
    var m = find(opts.messageId);
    if (m) {
      if (opts.action === 'read') m.unread = false;
      else if (opts.action === 'unread') m.unread = true;
      else if (opts.action === 'archive' || opts.action === 'delete') {
        [INBOX, OLDER].forEach(function (list) {
          var i = list.indexOf(m);
          if (i >= 0) list.splice(i, 1);
        });
      }
    }
    return wait(200).then(function () { return { ok: true }; });
  };
  api.bbEmailSend = function (opts) {
    opts = opts || {};
    SENT.unshift({ id: 's-' + Date.now().toString(36), subject: opts.subject || '(no subject)', from: ME, to: opts.to || '',
      date: new Date().toISOString(), unread: false, body: opts.body || '' });
    try { if (window.bbTrack) window.bbTrack('email', 'send'); } catch (e) {}
    return wait(600).then(function () { return { ok: true }; });
  };

  /* ── Import: Connect Trello needs a real Trello sign-in ───────────────── */
  /* Present, so the import window offers the button; it opens the Mac-app card.
     "cancelled" makes the window go back quietly. Export files still import. */
  api.trelloConnect = function () {
    if (window.bbDemoGate) window.bbDemoGate('import');
    return Promise.resolve({ ok: false, reason: 'cancelled' });
  };
  /* configured: shows Connect Trello; not connected, so it never tries to load boards. */
  api.trelloStatus = function () { return Promise.resolve({ configured: true, connected: false }); };
  api.trelloBoards = function () { return Promise.resolve({ ok: false, reason: 'not_connected' }); };
  api.trelloDisconnect = function () { return Promise.resolve({ ok: true }); };

  /* ── Outlook calendar: this week ──────────────────────────────────────── */
  function at(dayIdx, h, m) {
    var d = new Date(t0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + dayIdx);
    d.setHours(h, m || 0, 0, 0);
    return d;
  }
  function isoDay(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function outlook(id, title, dayIdx, h, m, mins, extra) {
    var s = at(dayIdx, h, m);
    return Object.assign({
      id: 'ms:' + id, rawId: id, provider: 'microsoft', title: title, allDay: false,
      start: s.toISOString(), end: new Date(s.getTime() + mins * MIN).toISOString(),
      joinUrl: '', webLink: 'https://outlook.office.com/calendar/', organizer: 'Sam Rivera', location: '',
    }, extra || {});
  }
  var CALENDAR = [
    outlook('dentist', 'Dentist', 0, 8, 0, 45, { location: 'Harbour Dental' }),
    outlook('vendor-demo', 'Vendor demo: stock photos', 1, 15, 30, 30, { organizer: 'Alex Morgan', joinUrl: 'https://teams.microsoft.com/', location: 'Online' }),
    outlook('brightlane-review', 'Brightlane design review', 2, 16, 0, 60, { organizer: 'Rina Patel', joinUrl: 'https://teams.microsoft.com/', location: 'Online' }),
    outlook('gym', 'Gym', 3, 7, 30, 60, { location: 'Studio 5' }),
    outlook('lunch', 'Lunch with Jordan', 4, 12, 30, 60, { organizer: 'Jordan Blake', location: 'Kafe Norte' }),
    { id: 'ms:school', rawId: 'school', provider: 'microsoft', title: 'School holiday', allDay: true,
      start: isoDay(at(5, 0)), end: isoDay(at(6, 0)), joinUrl: '', webLink: 'https://outlook.office.com/calendar/', organizer: 'Sam Rivera', location: '' },
  ];
  api.bbCalendarFetch = function (opts) {
    if (!opts || opts.provider !== 'microsoft') return Promise.resolve({ events: [] });
    return wait(300).then(function () { return { events: clone(CALENDAR) }; });
  };
  /* The app copies BloomBoard meetings into Outlook; in the demo there is nothing to copy to. */
  api.bbOutlookSync = function () { return Promise.resolve({ tagged: [] }); };

  /* ── AI: Make it a task, Write with AI ─────────────────────────────── */
  var TASKS = {
    'Spring campaign banners for the launch': {
      title: 'Design Acme spring launch banners',
      summary: 'Jordan at Acme needs the spring launch banners by Thursday: a 1920 × 600 homepage hero, three social sizes for Instagram and LinkedIn, and a short headline for the email header.',
      deadline: thursday(), priority: 'high', assignees: [],
      subtasks: ['Homepage hero banner (1920 × 600)', 'Three social sizes for Instagram and LinkedIn', 'Short headline for the email header'],
    },
    'Launch checklist, final pass': {
      title: 'Confirm App Store screenshots and final hero image',
      summary: 'Maya needs both the App Store screenshots and the final hero image confirmed before the launch sync. Everything else on the checklist is done.',
      deadline: null, priority: 'high', assignees: [], subtasks: ['Finish the App Store screenshots', 'Export the final hero image'],
    },
    'Launch email: subject line options': {
      title: 'Pick a subject line for the launch email',
      summary: 'Priya shared three subject lines for the launch email and is leaning towards "Meet the calmer way to plan". Choose the one that fits the header image.',
      deadline: null, priority: 'medium', assignees: [], subtasks: [],
    },
    'Staging is up for the pricing page': {
      title: 'Review spacing on the staging pricing page',
      summary: 'Leo put the new pricing tiers on staging. The cards still use the old spacing and need a design pass.',
      deadline: null, priority: 'medium', assignees: [], subtasks: [],
    },
    'Invoice #1042 question': {
      title: 'Answer Rina about invoice #1042',
      summary: 'Rina from Brightlane asks whether invoice #1042 includes last month\'s extra revision round or whether it will be billed separately.',
      deadline: null, priority: 'medium', assignees: [], subtasks: [],
    },
    'Quick one before the launch sync': {
      title: 'Bring both hero options to the launch sync',
      summary: 'Maya wants to pick one of the two hero options with the team at the launch sync.',
      deadline: null, priority: 'high', assignees: [], subtasks: [],
    },
  };
  var REPLIES = {
    'Spring campaign banners for the launch': 'Hi Jordan,\n\nThanks for the brief. We can have all three ready by Thursday: the 1920 × 600 homepage hero, the three social sizes and a short headline for the email header.\n\nI will share a first round on Wednesday so there is time for one set of changes.\n\nBest,\nSam',
    'Launch checklist, final pass': 'Hi Maya,\n\nBoth are on track. The App Store screenshots and the final hero image will be on the board before the launch sync.\n\nSam',
    'Invoice #1042 question': 'Hi Rina,\n\nGood question. Invoice #1042 covers the original scope only; the extra revision round will come as a separate invoice this week.\n\nBest,\nSam',
  };
  function aiText(obj) { return { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj) }] }; }
  function field(prompt, label) {
    var m = String(prompt).match(new RegExp(label + ':\\s*([^\\n]*)'));
    return m ? m[1].trim() : '';
  }
  function notInDemo() {
    if (window.bbDemoGate) window.bbDemoGate('bloom');
    return Promise.reject(new Error('This works in the Mac app. Download BloomBoard to use it.'));
  }

  api.generateEmail = function (prompt) {
    prompt = String(prompt || '');

    /* Overview, "By type of work": group finished items by keywords in their titles
       (the app asks AI for a JSON array of category names, one per numbered line). */
    if (/^Classify each task below into a short category name/.test(prompt)) {
      var titles = (prompt.split(/\n\n/).slice(1).join('\n\n') || '').split('\n')
        .map(function (l) { return l.replace(/^\d+\.\s*/, '').trim(); }).filter(Boolean);
      var KINDS = [
        [/bug|fix|error|crash|broken/i, 'Bug Fix'],
        [/meeting|sync|retro|call|review deck|standup/i, 'Meeting'],
        [/copy|email|newsletter|article|notes|brief|faq|update|write|release notes/i, 'Writing'],
        [/design|logo|icon|banner|visual|mockup|wireframe|moodboard|photo|layout|screens|hero|slides|deck|storyboard/i, 'Design'],
        [/plan|calendar|roadmap|schedule|timeline/i, 'Planning'],
        [/test|research|summary|analysis|survey/i, 'Research'],
        [/build|api|deploy|page|form|signup|checkout|accessibility|prototype|flow/i, 'Development'],
        [/gym|run|health|dentist|groceries/i, 'Personal'],
      ];
      var cats = titles.map(function (t) {
        for (var i = 0; i < KINDS.length; i++) if (KINDS[i][0].test(t)) return KINDS[i][1];
        return 'General';
      });
      return wait(500).then(function () { return { content: [{ type: 'text', text: JSON.stringify(cats) }] }; });
    }

    try { if (window.bbTrack) window.bbTrack('bloom', 'email_ai'); } catch (e) {}

    if (/turn an email into one clear task/i.test(prompt)) {
      var task = TASKS[field(prompt, 'Email subject')];
      return task ? wait(900).then(function () { return aiText(task); }) : notInDemo();
    }

    if (/^Write an email\./.test(prompt)) {
      var replyTo = (prompt.match(/This is a reply to:\nFrom: [^\n]*\nSubject: ([^\n]*)/) || [])[1];
      if (replyTo && REPLIES[replyTo]) {
        return wait(900).then(function () { return aiText({ subject: 'Re: ' + replyTo, body: REPLIES[replyTo] }); });
      }
      var ask = field(prompt, 'What the email should say');
      if (!ask) return notInDemo();
      var clean = ask.replace(/\s+/g, ' ').replace(/[.!]+$/, '');
      var subject = clean.charAt(0).toUpperCase() + clean.slice(1, 60);
      var body = 'Hi,\n\n' + subject + '.\n\nLet me know if you have any questions.\n\nBest,\nSam';
      return wait(900).then(function () { return aiText({ subject: subject, body: body }); });
    }

    /* Meeting Notes, "Tidy with AI": sort the visitor's own pasted notes. A line
       ending in ":" (or a short line on its own) starts a topic; lines that say
       what was decided become decisions, FYI lines become notes, the rest actions. */
    if (/turn rough meeting notes into structured minutes/i.test(prompt)) {
      var raw = (prompt.split(/\nNotes:\n/)[1] || '').trim();
      return wait(1100).then(function () { return aiText(tidyNotes(raw)); });
    }

    return notInDemo();
  };

  function tidyNotes(raw) {
    var topics = [], cur = null;
    function topic(name) { cur = { title: name.slice(0, 40), points: [] }; topics.push(cur); }
    raw.split(/\r?\n/).forEach(function (line) {
      var t = line.replace(/^\s*([-*•·]|\d+[.)])\s*/, '').trim();
      if (!t) return;
      var heading = /:$/.test(t) && t.length <= 40;
      if (heading) { topic(t.replace(/:$/, '')); return; }
      if (!cur) topic('Discussion');
      var kind = /\b(decided|agreed|decision|going with|we will go|approved)\b/i.test(t) ? 'decision'
        : /^(fyi|note|info)\b/i.test(t) ? 'note' : 'action';
      var text = t.charAt(0).toUpperCase() + t.slice(1);
      cur.points.push({ kind: kind, text: text.slice(0, 200) });
    });
    topics = topics.filter(function (x) { return x.points.length; });
    if (!topics.length) topics = [{ title: 'Discussion', points: [{ kind: 'note', text: raw.slice(0, 200) }] }];
    return { title: topics.length > 1 ? 'Team sync' : topics[0].title, topics: topics };
  }
})();
