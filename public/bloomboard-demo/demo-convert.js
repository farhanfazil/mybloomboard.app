/**
 * BloomBoard web demo — turning exploration into downloads.
 *
 *  1. Download cards on features that need the real app (email, calls, invites,
 *     account, PDF export, client portal, Bloom AI after the first answer).
 *  2. A one-time nudge once the visitor has created a couple of things:
 *     demo changes vanish on refresh, the Mac app keeps them.
 *  3. A download button beside the workspace pills.
 *  4. Anonymous usage counts (which features get used, where downloads come
 *     from) sent to /api/demo-events. No ids, no personal data.
 *  5. One record per visit (/api/demo-visit): where the visitor came from, what
 *     they are here for (a one-tap question), what they opened, searched for
 *     and asked Bloom. A random per-tab id; no names, emails or cookies.
 */
(function () {
  'use strict';

  /* The installer for the visitor's computer: Windows PCs get the Windows one. */
  var IS_WINDOWS = /win/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '') ||
    /Windows NT/i.test(navigator.userAgent);
  var DOWNLOAD_URL = IS_WINDOWS
    ? 'https://get.microsoft.com/installer/download/9MX9BDKM26VP?cid=website_cta_psi'
    : '/download/mac';
  var DOWNLOAD_LABEL = IS_WINDOWS ? 'Download for Windows' : 'Download for Mac';

  /* ── 4. Anonymous event counts ─────────────────────────────────────── */
  var pending = {};
  function slug(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'unknown';
  }
  function track(kind, name) {
    var key = kind + ':' + slug(name);
    pending[key] = (pending[key] || 0) + 1;
    visitNote(kind, name);
  }
  function flush(useBeacon) {
    var events = pending;
    if (!Object.keys(events).length) return;
    pending = {};
    var body = JSON.stringify({ events: events });
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon('/api/demo-events', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/demo-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true })
          .catch(function () {});
      }
    } catch (e) {}
  }
  setInterval(function () { flush(false); }, 15000);
  window.addEventListener('pagehide', function () { flush(true); });
  window.bbTrack = track;

  /* ── 5. The visit ───────────────────────────────────────────────────── */
  /* Kept in sessionStorage so a workspace switch (which reloads) stays one visit. */
  var VISIT_KEY = 'bb-demo-visit';
  var visitDirty = true;
  var visit = loadVisit();

  function newId() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); });
  }
  function loadVisit() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(VISIT_KEY) || 'null');
      if (saved && saved.id && Array.isArray(saved.features)) return saved;
    } catch (e) {}
    return startVisit();
  }
  function startVisit() {
    var params = new URLSearchParams(location.search);
    /* The homepage and /demo embed the demo in a same-site frame; their URL and
       referrer are the real entry point. */
    var outer = null;
    try { if (window.parent !== window && window.parent.location.origin === location.origin) outer = window.parent; } catch (e) {}
    var ref = outer ? outer.document.referrer : document.referrer;
    var entryParams = outer ? new URLSearchParams(outer.location.search) : params;
    var source = 'direct';
    try {
      if (ref) {
        var host = new URL(ref).hostname.replace(/^www\./, '');
        source = host === location.hostname.replace(/^www\./, '') ? 'bloomboard_site' : host;
      }
    } catch (e) {}
    var ua = navigator.userAgent || '';
    return {
      id: newId(),
      entry: params.get('embed') === 'home' ? 'home_embed' : outer ? 'demo_page' : 'standalone',
      source: source,
      utm_source: entryParams.get('utm_source'),
      utm_medium: entryParams.get('utm_medium'),
      utm_campaign: entryParams.get('utm_campaign'),
      device: /iPhone|iPad|Android|Mobile/i.test(ua) ? 'mobile' : IS_WINDOWS ? 'windows' : /Mac/i.test(ua) ? 'mac' : 'other',
      interest: null,
      workspaces: [], features: [], searches: [], bloom_asks: [], gates: [],
      seconds: 0, actions: 0, downloaded: false, download_source: null,
    };
  }
  function saveVisit() {
    visitDirty = true;
    try { sessionStorage.setItem(VISIT_KEY, JSON.stringify(visit)); } catch (e) {}
  }
  function addUnique(list, item, max) {
    if (list.indexOf(item) >= 0 || list.length >= max) return;
    list.push(item);
  }
  /* Every tracked event also lands on the visit, in the order it first happened. */
  function visitNote(kind, name) {
    var s = slug(name);
    if (kind === 'demo_loaded' || kind === 'workspace') addUnique(visit.workspaces, s, 5);
    if (kind === 'gate') addUnique(visit.gates, s, 20);
    if (kind === 'download') {
      visit.downloaded = true;
      if (!visit.download_source) visit.download_source = s;
    }
    if (kind !== 'demo_loaded' && kind !== 'download') addUnique(visit.features, kind + ':' + s, 60);
    saveVisit();
  }
  function sendVisit(useBeacon) {
    if (!visitDirty) return;
    visitDirty = false;
    var body = JSON.stringify(visit);
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon('/api/demo-visit', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/demo-visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true })
          .catch(function () {});
      }
    } catch (e) {}
  }
  setTimeout(function () { sendVisit(false); }, 4000);
  setInterval(function () { sendVisit(false); }, 15000);
  window.addEventListener('pagehide', function () { sendVisit(true); });

  /* Active time: seconds with the tab showing and some input in the last minute. */
  var lastInput = Date.now();
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      lastInput = Date.now();
      if (type === 'pointerdown' && e.isTrusted) { visit.actions++; saveVisit(); }
    }, { capture: true, passive: true });
  });
  setInterval(function () {
    if (document.visibilityState !== 'visible' || Date.now() - lastInput > 60000) return;
    visit.seconds++;
    if (visit.seconds % 15 === 0) saveVisit();
  }, 1000);

  /* What they look for: any search box in the app, once they stop typing. */
  var searchTimer = null;
  function isSearchBox(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    return /search|find/i.test((el.placeholder || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.type || ''));
  }
  function noteSearch(el) {
    var q = String(el.value || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (q.length < 2) return;
    var list = visit.searches;
    var last = list[list.length - 1];
    /* "boa" then "board" is one search: keep the longer one. */
    if (last && (q.indexOf(last) === 0 || last.indexOf(q) === 0)) list[list.length - 1] = q.length > last.length ? q : last;
    else if (list.indexOf(q) < 0 && list.length < 20) list.push(q);
    saveVisit();
  }
  document.addEventListener('input', function (e) {
    if (!e.isTrusted || !isSearchBox(e.target)) return;
    var el = e.target;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { noteSearch(el); }, 1500);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && isSearchBox(e.target)) noteSearch(e.target);
  }, true);

  /* What they ask Bloom, read from the Bloom box as it is sent (Enter or the send
     button). Simple requests never reach the AI, so this is the one place to see them. */
  function isBloomBox(el) {
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') &&
      (/bloom/i.test(el.id || '') || /ask bloom/i.test(el.placeholder || ''));
  }
  function noteBloomAsk(el) {
    var q = String((el && el.value) || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    var list = visit.bloom_asks;
    if (q.length < 2 || list[list.length - 1] === q || list.length >= 10) return;
    list.push(q);
    saveVisit();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && isBloomBox(e.target)) noteBloomAsk(e.target);
  }, true);
  document.addEventListener('click', function (e) {
    var send = e.target.closest && e.target.closest('[onclick*="bloomSend"]');
    if (send) noteBloomAsk(document.getElementById('bloom-input'));
  }, true);

  function mode() {
    return typeof window.getDemoWorkspaceMode === 'function' ? window.getDemoWorkspaceMode() : 'team';
  }
  track('demo_loaded', mode());

  /* ── 1. Download cards ──────────────────────────────────────────────── */
  var FEATURES = {
    email: { title: 'Email lives in the Mac app', desc: 'Connect Gmail or Outlook, read and reply without leaving BloomBoard, and turn any email into a task.' },
    calls: { title: 'Calls need your real team', desc: 'Walk into a room, join a live call or ring a teammate in one click, right from Team Space, Team Live or chat.' },
    invite: { title: 'Bring your own team', desc: 'Invite teammates with a code and work together live: shared boards, chat, knocks and hand-overs.' },
    account: { title: 'Your account lives in the Mac app', desc: 'Sign in to sync tasks, boards and chats across your devices.' },
    pdf: { title: 'PDF export is in the Mac app', desc: 'Export reports, invoices and overviews as polished PDFs.' },
    portal: { title: 'Client portals are in the Mac app', desc: 'Share a branded portal where clients see progress, files and invoices.' },
    bloom: { title: 'Bloom works best with your data', desc: 'In the Mac app, Bloom plans your day from your real tasks, boards and calendar, and takes action for you.' },
    import: { title: 'Connect Trello in the Mac app', desc: 'Sign in to Trello and bring your boards across in a few clicks. Asana, Jira, ClickUp, Notion and Monday.com exports work too.' },
    feature: { title: 'This works in the Mac app', desc: 'Download BloomBoard to use everything with your own data.' },
  };

  function showCard(key) {
    var f = FEATURES[key] || FEATURES.feature;
    var overlay = document.getElementById('upgrade-overlay');
    var title = document.getElementById('upgrade-title');
    var desc = document.getElementById('upgrade-desc');
    var btns = overlay && overlay.querySelector('.upgrade-btns');
    track('gate', key);
    if (!overlay || !title || !desc || !btns) return;
    title.textContent = f.title;
    desc.textContent = f.desc + ' Free to download.';
    btns.innerHTML =
      '<button class="upgrade-btn-primary" type="button" data-bb-dl="gate_' + key + '">' + DOWNLOAD_LABEL + '</button>' +
      '<button class="upgrade-btn-secondary" type="button" data-bb-close>Keep exploring</button>';
    overlay.classList.add('open');
  }

  /* Older call sites pass a display name ("Email"); map it to a card. */
  window.showWebDemoGate = function (name) {
    var n = String(name || '').toLowerCase();
    showCard(/email/.test(n) ? 'email' : /bloom|ai/.test(n) ? 'bloom' : 'feature');
  };
  window.bbDemoGate = showCard;

  function download(source) {
    track('download', source);
    flush(true);
    window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    var overlay = document.getElementById('upgrade-overlay');
    if (overlay) overlay.classList.remove('open');
  }
  window.bbDemoDownload = function () { download('gate'); };

  document.addEventListener('click', function (e) {
    var dl = e.target.closest && e.target.closest('[data-bb-dl]');
    if (dl) { e.preventDefault(); download(dl.getAttribute('data-bb-dl')); return; }
    if (e.target.closest && e.target.closest('[data-bb-close]')) {
      var overlay = document.getElementById('upgrade-overlay');
      if (overlay) overlay.classList.remove('open');
    }
  });

  /* The app's own global entry points for these features. Wrapping them catches
     every button that leads there (sidebar, Team Live, Team Space, chat headers). */
  var GATED_FNS = {
    calls: ['callPerson', 'stationStartCall', 'tlStartCall', 'officeWalkIn'],
    invite: ['supaInviteMember', 'copyInviteCode'],
    account: ['supaSignOut', 'supaSignIn'],
    pdf: ['generatePDF', 'flExportInvoicePDF'],
    portal: ['flCreatePortal', 'flCreatePortalFromInputs', 'flOpenClientPortal', 'flOpenPortalLink', 'flShareInvoiceLink'],
  };
  function wrapGates() {
    Object.keys(GATED_FNS).forEach(function (key) {
      GATED_FNS[key].forEach(function (fn) {
        var orig = window[fn];
        if (typeof orig !== 'function' || orig._bbGated) return;
        var gate = function () { showCard(key); };
        gate._bbGated = true;
        window[fn] = gate;
      });
    });

    /* Joining a live room needs a real call. A locked room still lets the visitor
       knock (that is only a broadcast), so those clicks go through to the app. */
    var join = window.officeJoin;
    if (typeof join === 'function' && !join._bbGated) {
      var gatedJoin = function (convId) {
        var live = null;
        try { live = window.bbRooms && window.bbRooms.liveFor ? window.bbRooms.liveFor(convId) : null; } catch (e) {}
        if (live && live.locked) return join.apply(this, arguments);
        showCard('calls');
      };
      gatedJoin._bbGated = true;
      window.officeJoin = gatedJoin;
    }

    /* Room calls also start from Team Live and "Happening now" through bbCalls. */
    var calls = window.bbCalls;
    if (calls && typeof calls === 'object') {
      /* start: a meeting's Start call / Join call (vendor/bb-meetings.js). */
      ['walkIn', 'joinRoom', 'start'].forEach(function (m) {
        if (typeof calls[m] !== 'function' || calls[m]._bbGated) return;
        var gate = function () { showCard('calls'); };
        gate._bbGated = true;
        calls[m] = gate;
      });
    }
  }
  var wrapTries = 0;
  var wrapTimer = setInterval(function () {
    wrapGates();
    if (++wrapTries > 40) clearInterval(wrapTimer);
  }, 250);

  /* Bloom answers the first question from the demo script; the second opens the card. */
  var bloomAsks = 0;
  window.bbDemoOnBloomAsk = function () {
    bloomAsks++;
    track('bloom', 'ask');
    if (bloomAsks === 2) setTimeout(function () { showCard('bloom'); }, 1600);
  };

  /* ── 2. "Your changes vanish" nudge ─────────────────────────────────── */
  var NUDGE_KEY = 'bb-demo-nudged';
  var COUNTED = {
    task: function () { return listLen('bbd-dash-tasks'); },
    card: function () {
      try { return (JSON.parse(localStorage.getItem('bloombooard-boards-v1') || '{}').cards || []).length; } catch (e) { return 0; }
    },
    note: function () { return listLen('bloomboard-notes-v1'); },
    event: function () { return listLen('bbd-events'); },
  };
  function listLen(key) {
    try { var v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v.length : 0; } catch (e) { return 0; }
  }
  var baseline = null;
  var created = 0;

  function watchCreations() {
    var now = {};
    Object.keys(COUNTED).forEach(function (k) { now[k] = COUNTED[k](); });
    if (!baseline) { baseline = now; return; }
    Object.keys(now).forEach(function (k) {
      var grew = now[k] - baseline[k];
      for (var i = 0; i < grew; i++) { track('create', k); created++; }
    });
    baseline = now;
    if (created >= 2) showNudge();
  }
  /* Start after the app has hydrated, so seeding and the first sync don't count. */
  setTimeout(function () {
    watchCreations();
    setInterval(watchCreations, 1500);
  }, 5000);

  function nudged() { try { return sessionStorage.getItem(NUDGE_KEY) === '1'; } catch (e) { return false; } }
  function showNudge() {
    if (nudged() || document.getElementById('bb-demo-nudge')) return;
    try { sessionStorage.setItem(NUDGE_KEY, '1'); } catch (e) {}
    track('nudge', 'shown');
    var el = document.createElement('div');
    el.id = 'bb-demo-nudge';
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="bb-nudge-text">Nice! Heads-up: demo changes vanish when you leave. <b>Download BloomBoard to keep your work.</b></span>' +
      '<button type="button" class="bb-nudge-dl" data-bb-dl="nudge">Download free</button>' +
      '<button type="button" class="bb-nudge-x" aria-label="Dismiss">✕</button>';
    el.querySelector('.bb-nudge-x').addEventListener('click', function () {
      track('nudge', 'dismissed');
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 300);
    });
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
  }

  /* ── 5b. "What brings you here?" once the visitor has clearly engaged ── */
  var INTERESTS = [
    ['own_work', 'Organising my own work'],
    ['team', 'Working with my team'],
    ['exploring', 'Just looking around'],
  ];
  function maybeAskInterest() {
    if (visit.interest || document.getElementById('bb-demo-interest')) return;
    if (visit.seconds < 40 && visit.actions < 6) return;
    var overlay = document.getElementById('upgrade-overlay');
    if (overlay && overlay.classList.contains('open')) return;
    if (document.getElementById('bb-demo-nudge')) return;
    showInterest();
  }
  setInterval(maybeAskInterest, 2000);

  function showInterest() {
    var el = document.createElement('div');
    el.id = 'bb-demo-interest';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'What brings you here?');
    el.innerHTML =
      '<div class="bb-int-hd"><span>Quick question: what brings you here?</span>' +
      '<button type="button" class="bb-int-x" aria-label="Close">✕</button></div>' +
      '<div class="bb-int-opts">' +
      INTERESTS.map(function (o) {
        return '<button type="button" class="bb-int-opt" data-interest="' + o[0] + '">' + o[1] + '</button>';
      }).join('') +
      '</div>';
    function close() {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 250);
    }
    function answer(key) {
      visit.interest = key;
      track('interest', key);
      saveVisit();
      sendVisit(false);
    }
    el.addEventListener('click', function (e) {
      var opt = e.target.closest && e.target.closest('[data-interest]');
      if (opt) {
        answer(opt.getAttribute('data-interest'));
        el.innerHTML = '<div class="bb-int-thanks">Thanks, that helps us build the right things.</div>';
        setTimeout(close, 2200);
        return;
      }
      if (e.target.closest && e.target.closest('.bb-int-x')) {
        answer('dismissed');
        close();
      }
    });
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
  }

  /* ── Usage: navigation, workspace, theme, team interactions ─────────── */
  document.addEventListener('click', function (e) {
    var t = e.target;
    /* Only real visitor clicks; the app fires synthetic ones while booting. */
    if (!e.isTrusted || !t || !t.closest) return;
    var pill = t.closest('.bb-demo-ws-pill');
    if (pill) { track('workspace', pill.getAttribute('data-mode')); return; }
    var theme = t.closest('[id^="theme-opt-"]');
    if (theme) { track('theme', theme.id.replace('theme-opt-', '')); return; }
    var nav = t.closest('.sidebar [onclick], .sb-nav-item, .main-tab, [data-tab]');
    if (nav) {
      var label = nav.getAttribute('data-tab') || nav.getAttribute('aria-label') || nav.title || nav.textContent;
      track('nav', String(label).trim().split('\n')[0]);
    }
  }, true);

  var demo = window.__bbDemo;
  if (demo && demo.onChange) {
    demo.onChange(function (table, type, row) {
      if (table === 'messages' && type === 'INSERT' && row && row.sender_id === demo.IDS.me) track('chat', 'send');
    });
    demo.onBroadcast(function (topic, event) {
      if (topic.indexOf('team_live_') !== 0) return;
      if (event === 'knock' || event === 'knock_reply') track('knock', event);
      else if (event === 'wave' || event === 'room_knock') track('office', event);
    });
  }

  /* ── Styles ──────────────────────────────────────────────────────────── */
  var css =
    '.bb-demo-ws-dl{appearance:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;' +
    'border-radius:6px;background:#fff;color:#0b1220;font:inherit;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;' +
    'box-shadow:0 1px 2px rgba(0,0,0,.2);transition:background .15s ease}' +
    '.bb-demo-ws-dl:hover{background:#e8edf2}' +
    '.bb-demo-ws-dl svg{width:14px;height:14px}' +
    'body.light-mode .bb-demo-ws-dl{background:#123e5a;color:#fff}' +
    'body.light-mode .bb-demo-ws-dl:hover{background:#0d2f45}' +
    '#bb-demo-nudge{position:fixed;left:50%;bottom:78px;z-index:60000;display:flex;align-items:center;gap:10px;max-width:min(640px,92vw);' +
    'padding:10px 10px 10px 16px;border-radius:14px;background:rgba(15,28,46,.96);border:1px solid rgba(96,165,250,.35);color:#dbeafe;' +
    'font-size:12.5px;line-height:1.4;box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:0;transform:translate(-50%,12px);' +
    'transition:opacity .3s ease,transform .3s cubic-bezier(.2,.9,.3,1)}' +
    '#bb-demo-nudge.show{opacity:1;transform:translate(-50%,0)}' +
    '#bb-demo-nudge b{color:#fff}' +
    '.bb-nudge-dl{appearance:none;border:0;border-radius:10px;background:#3b82f6;color:#fff;font:inherit;font-weight:700;font-size:12px;' +
    'padding:8px 12px;cursor:pointer;white-space:nowrap}' +
    '.bb-nudge-dl:hover{background:#2563eb}' +
    '.bb-nudge-x{appearance:none;border:0;background:transparent;color:#94a3b8;font-size:13px;cursor:pointer;padding:4px 6px;border-radius:8px}' +
    '.bb-nudge-x:hover{color:#fff;background:rgba(255,255,255,.08)}' +
    'body.light-mode #bb-demo-nudge{background:#fff;border-color:rgba(37,99,235,.3);color:#1e293b;box-shadow:0 18px 40px rgba(15,23,42,.18)}' +
    'body.light-mode #bb-demo-nudge b{color:#0f172a}' +
    'body.light-mode .bb-nudge-x{color:#475569}' +
    'body.light-mode .bb-nudge-x:hover{color:#0f172a;background:rgba(15,23,42,.06)}' +
    '#bb-demo-interest{position:fixed;left:16px;bottom:16px;z-index:3000;width:300px;max-width:calc(100vw - 32px);box-sizing:border-box;' +
    'padding:12px;border-radius:14px;background:rgba(15,28,46,.97);border:1px solid rgba(148,163,184,.25);color:#e2e8f0;' +
    'font-size:13px;line-height:1.4;box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:0;transform:translateY(10px);' +
    'transition:opacity .25s ease,transform .25s ease}' +
    '#bb-demo-interest.show{opacity:1;transform:none}' +
    '.bb-int-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:600;color:#fff;margin:0 0 8px 2px}' +
    '.bb-int-x{appearance:none;border:0;background:transparent;color:#94a3b8;font-size:12px;cursor:pointer;padding:4px 6px;border-radius:8px}' +
    '.bb-int-x:hover{color:#fff;background:rgba(255,255,255,.08)}' +
    '.bb-int-opts{display:flex;flex-direction:column;gap:6px}' +
    '.bb-int-opt{appearance:none;text-align:left;border:1px solid rgba(148,163,184,.25);background:rgba(255,255,255,.04);color:#e2e8f0;' +
    'font:inherit;font-size:13px;padding:8px 10px;border-radius:9px;cursor:pointer;transition:background .15s ease,border-color .15s ease}' +
    '.bb-int-opt:hover{background:rgba(255,255,255,.1);border-color:rgba(148,163,184,.45);color:#fff}' +
    '.bb-int-thanks{padding:6px 2px;color:#e2e8f0}' +
    'body.light-mode #bb-demo-interest{background:#fff;border-color:rgba(15,23,42,.14);color:#1e293b;box-shadow:0 18px 40px rgba(15,23,42,.18)}' +
    'body.light-mode .bb-int-hd{color:#0f172a}' +
    'body.light-mode .bb-int-x{color:#475569}' +
    'body.light-mode .bb-int-x:hover{color:#0f172a;background:rgba(15,23,42,.06)}' +
    'body.light-mode .bb-int-opt{background:#f8fafc;border-color:rgba(15,23,42,.14);color:#1e293b}' +
    'body.light-mode .bb-int-opt:hover{background:#eef2f7;border-color:rgba(15,23,42,.28);color:#0f172a}' +
    'body.light-mode .bb-int-thanks{color:#1e293b}' +
    /* Black theme: greys like the app's own windows (#1c1c1c panels, #242424 cards), never navy. */
    'body.black-mode #bb-demo-interest,body.black-mode #bb-demo-nudge{background:#1c1c1c;border-color:rgba(255,255,255,.12)}' +
    'body.black-mode .bb-int-opt{background:#242424;border-color:rgba(255,255,255,.12)}' +
    'body.black-mode .bb-int-opt:hover{background:#2a2a2a;border-color:rgba(255,255,255,.24)}' +
    'body.black-mode #bb-demo-nudge{color:#e5e5e5}' +
    'body.black-mode .bb-nudge-dl{background:#f5f5f5;color:#171717}' +
    'body.black-mode .bb-nudge-dl:hover{background:#e5e5e5}' +
    '@media (prefers-reduced-motion:reduce){#bb-demo-nudge,#bb-demo-interest{transition:none}}';
  function injectCss() {
    if (document.getElementById('bb-demo-convert-css')) return;
    var st = document.createElement('style');
    st.id = 'bb-demo-convert-css';
    st.textContent = css;
    document.head.appendChild(st);
  }
  if (document.head) injectCss(); else document.addEventListener('DOMContentLoaded', injectCss);
})();
