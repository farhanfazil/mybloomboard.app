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
 */
(function () {
  'use strict';

  var DOWNLOAD_URL =
    'https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg';

  /* ── 4. Anonymous event counts ─────────────────────────────────────── */
  var pending = {};
  function slug(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'unknown';
  }
  function track(kind, name) {
    var key = kind + ':' + slug(name);
    pending[key] = (pending[key] || 0) + 1;
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

  function mode() {
    return typeof window.getDemoWorkspaceMode === 'function' ? window.getDemoWorkspaceMode() : 'team';
  }
  track('demo_loaded', mode());

  /* ── 1. Download cards ──────────────────────────────────────────────── */
  var FEATURES = {
    email: { title: 'Email lives in the Mac app', desc: 'Connect Gmail or Outlook, read and reply without leaving BloomBoard, and turn any email into a task.' },
    calls: { title: 'Calls need your real team', desc: 'Voice and video call teammates in one click, right from Team Live or chat.' },
    invite: { title: 'Bring your own team', desc: 'Invite teammates with a code and work together live: shared boards, chat, knocks and hand-overs.' },
    account: { title: 'Your account lives in the Mac app', desc: 'Sign in to sync tasks, boards and chats across your devices.' },
    pdf: { title: 'PDF export is in the Mac app', desc: 'Export reports, invoices and overviews as polished PDFs.' },
    portal: { title: 'Client portals are in the Mac app', desc: 'Share a branded portal where clients see progress, files and invoices.' },
    bloom: { title: 'Bloom works best with your data', desc: 'In the Mac app, Bloom plans your day from your real tasks, boards and calendar, and takes action for you.' },
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
      '<button class="upgrade-btn-primary" type="button" data-bb-dl="gate_' + key + '">Download for Mac</button>' +
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
     every button that leads there (sidebar, Team Live, Stations, chat headers). */
  var GATED_FNS = {
    calls: ['callPerson', 'stationStartCall', 'tlStartCall'],
    invite: ['supaInviteMember', 'copyInviteCode'],
    account: ['supaSignOut', 'supaSignIn'],
    email: ['openEmailInbox'],
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
    task: function () { return listLen('farhan-dash-tasks'); },
    card: function () {
      try { return (JSON.parse(localStorage.getItem('bloombooard-boards-v1') || '{}').cards || []).length; } catch (e) { return 0; }
    },
    note: function () { return listLen('bloomboard-notes-v1'); },
    event: function () { return listLen('farhan-events'); },
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

  /* ── 3. Download button beside the workspace pills ──────────────────── */
  function addSwitcherButton() {
    var group = document.querySelector('#bb-demo-ws-switcher .bb-demo-ws-right-group');
    if (!group || group.querySelector('.bb-demo-ws-dl')) return !!group;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bb-demo-ws-dl';
    btn.setAttribute('data-bb-dl', 'switcher');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Download for Mac';
    group.appendChild(btn);
    return true;
  }
  var dlTries = 0;
  var dlTimer = setInterval(function () {
    if (addSwitcherButton() || ++dlTries > 80) clearInterval(dlTimer);
  }, 250);

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
      if (topic.indexOf('team_live_') === 0 && (event === 'knock' || event === 'knock_reply')) track('knock', event);
    });
  }

  /* ── Styles ──────────────────────────────────────────────────────────── */
  var css =
    '.bb-demo-ws-dl{appearance:none;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(96,165,250,.7);' +
    'background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font:inherit;font-size:11px;font-weight:700;padding:8px 13px;' +
    'border-radius:999px;cursor:pointer;white-space:nowrap;box-shadow:0 6px 18px rgba(37,99,235,.3);transition:filter .2s,transform .2s}' +
    '.bb-demo-ws-dl:hover{filter:brightness(1.1);transform:translateY(-1px)}' +
    '.bb-demo-ws-dl svg{width:13px;height:13px}' +
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
    '@media (prefers-reduced-motion:reduce){#bb-demo-nudge{transition:none}}';
  function injectCss() {
    if (document.getElementById('bb-demo-convert-css')) return;
    var st = document.createElement('style');
    st.id = 'bb-demo-convert-css';
    st.textContent = css;
    document.head.appendChild(st);
  }
  if (document.head) injectCss(); else document.addEventListener('DOMContentLoaded', injectCss);
})();
