/**
 * BloomBoard browser demo — loads before app scripts.
 * Provides electronAPI shim, workspace bootstrap, gates, and seed data.
 */
/* Switching sample data / fresh or Personal / Team reloads the page. The old page
   fades to the theme's own background, and the new page opens under a cover of the
   same colour that fades away once the app has drawn, so nothing flashes blank. */
(function () {
  'use strict';
  var c = null;
  try {
    c = JSON.parse(sessionStorage.getItem('bb-demo-switch-cover') || 'null');
    sessionStorage.removeItem('bb-demo-switch-cover');
  } catch (e) {}
  if (!c || !c.bg) return;
  var safe = function (v) { return String(v || '').replace(/[^#(),.%\w\s-]/g, ''); };
  var label = String(c.label || '').replace(/[^\w\s]/g, '');
  var st = document.createElement('style');
  st.textContent =
    'html{background:' + safe(c.bg) + '}' +
    'html::after{content:"' + label + '";position:fixed;inset:0;z-index:49999;background:' + safe(c.bg) + ';color:' + safe(c.fg) +
    ';display:flex;align-items:center;justify-content:center;font:500 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
    'opacity:1;transition:opacity .35s ease;pointer-events:none}' +
    'html.bb-cover-off::after{opacity:0}';
  (document.head || document.documentElement).appendChild(st);
  var done = false;
  function off() {
    if (done) return;
    done = true;
    document.documentElement.classList.add('bb-cover-off');
    setTimeout(function () {
      st.remove();
      document.documentElement.classList.remove('bb-cover-off');
    }, 400);
  }
  window.addEventListener('load', function () {
    setTimeout(off, 200);
  });
  setTimeout(off, 4000);
})();

(function () {
  'use strict';

  window.BB_WEB_DEMO = true;

  window.isDeveloperWorkspaceBypass = function () {
    return true;
  };

  var DOWNLOAD_URL =
    '/download/mac';

  var GATED_SELECTORS = ['#sb-email-nav-btn'].join(',');
  var DEMO_WS_KEY = 'bb-demo-workspace-mode';

  var DEMO_MEMBERS = {
    me: 'demo-me',
    sarah: 'demo-m2',
    marcus: 'demo-m3',
    priya: 'demo-m4',
    james: 'demo-m5',
    elena: 'demo-m6',
    david: 'demo-m7',
    rachel: 'demo-m8',
    tom: 'demo-m9',
    aisha: 'demo-m10',
  };

  var DEMO_MAC_MSG =
    'Download the Mac app to generate AI insights from your real data.';

  /* ── In-memory bbStore for freelance data ── */
  var _demoBbStore = {};

  window._bbDemoFlStoreClear = function () {
    _demoBbStore = {};
  };

  window._bbDemoFlStoreWrite = function (key, data) {
    _demoBbStore['bb-fl-' + key] = JSON.stringify(data);
  };

  function getDemoWorkspaceMode() {
    var allowed = window.__bbDemoWorkspaces || ['personal', 'freelance', 'team'];
    try {
      var m = sessionStorage.getItem(DEMO_WS_KEY);
      if (allowed.indexOf(m) >= 0) return m;
    } catch (e) {}
    return allowed.indexOf('team') >= 0 ? 'team' : allowed[0];
  }

  window.getDemoWorkspaceMode = getDemoWorkspaceMode;

  function getDemoLicense() {
    var mode = getDemoWorkspaceMode();
    if (mode === 'team') {
      return { tier: 'owner', category: 'team', freshInstall: false };
    }
    if (mode === 'freelance') {
      return { tier: 'promax', category: 'freelance', freshInstall: false };
    }
    return { tier: 'promax', category: 'personal', freshInstall: false };
  }

  function wipeDemoLocalStorage() {
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      keys.forEach(function (k) {
        if (k) localStorage.removeItem(k);
      });
    } catch (e) {
      console.warn('[BB Demo] storage wipe failed', e);
    }
  }

  /* "Sample data | Start fresh": the visitor can swap the sample workspace for an
     empty one, like a new download. Kept for this tab (a refresh keeps the mode,
     the data still resets). ?data=fresh opens it directly. */
  var DEMO_DATA_KEY = 'bb-demo-data';
  function getDemoDataMode() {
    try {
      var asked = new URLSearchParams(location.search).get('data');
      if (asked === 'fresh' || asked === 'sample') return asked;
      return sessionStorage.getItem(DEMO_DATA_KEY) === 'fresh' ? 'fresh' : 'sample';
    } catch (e) { return 'sample'; }
  }
  window.getDemoDataMode = getDemoDataMode;
  window.__bbDemoFresh = getDemoDataMode() === 'fresh';

  /* Empty the visitor's own work. Teammates stay in the Team workspace (the
     roster, their chats, Team Live and their time off), because the team
     features only make sense with people in them. */
  function clearSampleData() {
    localStorage.setItem('bbd-dash-tasks', '[]');
    localStorage.setItem('bloombooard-boards-v1', JSON.stringify({ boards: [], cards: [], categories: [] }));
    localStorage.setItem('bbd-events', '[]');
    localStorage.setItem('bloom-bookmarks-v1', '[]');
    ['bb-meetings-history-v1', 'bloombooard-stickies-v1', 'bb-board-columns-v1', 'bbd-dash-projects',
      'bbd-dash-history', 'bbd-streak', 'bloombooard-bloom-history-v1', 'bb-extcal-v1',
      'bb-worklog-v1', 'bb-bloom-threads-v1', 'bb-bloom-thread-cur'].forEach(function (k) {
      localStorage.removeItem(k);
    });
    var demo = window.__bbDemo;
    if (demo && demo.rows) {
      ['events', 'boards', 'board_cards', 'tasks', 'notifications'].forEach(function (t) { demo.rows(t).length = 0; });
    }
  }

  function ensureDemoData() {
    try {
      var mode = getDemoWorkspaceMode();
      wipeDemoLocalStorage();
      window._bbDemoFlStoreClear();

      if (mode === 'personal' && typeof window.bbSeedPersonalWorkspace === 'function') {
        window.bbSeedPersonalWorkspace(DEMO_MEMBERS);
      } else if (mode === 'freelance' && typeof window.bbSeedFreelanceWorkspace === 'function') {
        window.bbSeedFreelanceWorkspace();
      } else if (typeof window.bbSeedTeamWorkspace === 'function') {
        window.bbSeedTeamWorkspace(DEMO_MEMBERS);
        mode = 'team';
      }

      if (window.__bbDemoFresh) clearSampleData();

      /* The demo opens in the Black theme, to sit with the dark website. A workspace
         switch reloads the page, so the theme the visitor picked is carried over instead. */
      var carried = sessionStorage.getItem('bb-demo-carry-theme');
      sessionStorage.removeItem('bb-demo-carry-theme');
      localStorage.setItem('bb-theme', carried || 'black');

      /* Dashboard Assignments start minimized; visitors can expand them. */
      localStorage.setItem('bloomboard-board-assignments-collapsed-v1', '1');
      localStorage.setItem('bb-workspace-mode', mode);
      localStorage.setItem('bb-workspace-onboarded', '1');
      localStorage.removeItem('bb-workspace-locked');
      localStorage.removeItem('bb-workspace-category');
      localStorage.removeItem('bb-dev-preview-product');
    } catch (e) {
      console.warn('[BB Demo] ensureDemoData failed', e);
    }
  }

  ensureDemoData();

  /* ── Avatar manifest cache ── */
  var _avatarManifest = null;
  function loadAvatarManifest() {
    if (_avatarManifest) return Promise.resolve(_avatarManifest);
    return fetch('avatar-manifest.json')
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        _avatarManifest = j || {};
        return _avatarManifest;
      })
      .catch(function () {
        _avatarManifest = {};
        return _avatarManifest;
      });
  }

  /* Ask Bloom has no AI in the browser demo. Questions about the visitor's own tasks
     are answered by the app itself; anything else gets a short, friendly answer
     here. The app expects { content: [{ type: "text", text: '{"message":…,"actions":[]}' }] }. */
  var BLOOM_REPLIES = [
    [/\b(plan|schedule|focus|priorit|today|afternoon|morning)\b/i,
      'Start with your most urgent task while your energy is high, then fit the smaller ones between meetings. Open My Day, then Plan My Day, and BloomBoard lays it out as a timeline around your meetings, with breaks.'],
    [/\b(email|reply|write|draft|message|update)\b/i,
      'Happy to draft that. In the app I write it in your tone and you can make it shorter, more formal or friendlier with one click. Try Email & Messages in the AI Hub for a ready-made version.'],
    [/\b(meeting|notes|minutes|action items?)\b/i,
      'Paste your meeting notes into Thought to Task and I turn them into tasks, with owners and due dates where the notes mention them.'],
    [/\b(stuck|blocked|overwhelm|stress|too much)\b/i,
      'Pick the one task that unblocks the most, and give it 25 focused minutes. If it is still stuck after that, tell a teammate what you tried. The I am Stuck tool in the AI Hub walks you through it.'],
    [/\b(team|who|overload|workload|manager)\b/i,
      'Workload Health in My Day shows who is overloaded and who has room, with a suggestion for what to move. It is private to owners and managers.'],
    [/\b(hi|hello|hey|thanks|thank you)\b/i,
      'Hi! I am Bloom. Ask me about your tasks, what is overdue, or what to focus on today, and I can create tasks and meetings for you.'],
  ];
  function demoBloomChat(opts) {
    if (typeof window.bbDemoOnBloomAsk === 'function') window.bbDemoOnBloomAsk();
    return new Promise(function (resolve) {
      setTimeout(function () {
        var msgs = (opts && opts.messages) || [];
        var last = msgs.length ? msgs[msgs.length - 1] : null;
        var q = last && last.content ? String(typeof last.content === 'string' ? last.content : '').trim() : '';
        var answer = 'Good question. In this browser demo I can answer about your tasks, what is overdue and what to focus on today, and create tasks and meetings. Download BloomBoard to ask me anything about your real work.';
        for (var i = 0; i < BLOOM_REPLIES.length; i++) {
          if (BLOOM_REPLIES[i][0].test(q)) { answer = BLOOM_REPLIES[i][1]; break; }
        }
        resolve({ content: [{ type: 'text', text: JSON.stringify({ message: answer, actions: [] }) }] });
      }, 700);
    });
  }

  function noop() {}
  function rejectDemo() {
    return Promise.reject(new Error(DEMO_MAC_MSG));
  }

  window.electronAPI = {
    setBadgeCount: noop,
    transcribeAudio: rejectDemo,
    exportPDF: rejectDemo,
    generateEmail: rejectDemo,
    uploadPage: rejectDemo,
    uploadAssetFile: rejectDemo,
    deleteAssetFile: rejectDemo,
    pickAssetFile: rejectDemo,
    pickTaskAttachment: function () {
      return new Promise(function (resolve) {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = function () {
          var f = input.files && input.files[0];
          if (!f) {
            resolve(null);
            return;
          }
          resolve({ name: f.name, path: f.name, size: f.size });
        };
        input.click();
      });
    },
    openTaskAttachment: noop,
    checkFileExists: function () {
      return Promise.resolve(false);
    },
    openExternal: function (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return Promise.resolve();
    },
    copyToClipboard: function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return Promise.resolve();
    },
    bounceDock: noop,
    bloomChat: demoBloomChat,
    activateLicense: function () {
      return Promise.resolve({ ok: false, error: 'Demo mode' });
    },
    validateLicense: function () {
      return Promise.resolve(getDemoLicense());
    },
    getLicenseStatus: function () {
      return Promise.resolve(getDemoLicense());
    },
    deactivateLicense: function () {
      return Promise.resolve(getDemoLicense());
    },
    markWorkspaceDone: function () {
      return Promise.resolve();
    },
    isDev: function () {
      return Promise.resolve(false);
    },
    winDragStart: noop,
    winDragEnd: noop,
    bbStoreGetAllSync: function () {
      return Object.assign({}, _demoBbStore);
    },
    bbStoreSet: function (key, val) {
      _demoBbStore[key] = val;
      return Promise.resolve();
    },
    bbStoreDel: function (key) {
      delete _demoBbStore[key];
      return Promise.resolve();
    },
    onDeepLink: noop,
    bbOAuthConnect: rejectDemo,
    bbOAuthDisconnect: noop,
    bbGetOAuthState: function () {
      return Promise.resolve({ google: {}, microsoft: {} });
    },
    onOAuthResult: noop,
    bbEmailFetch: rejectDemo,
    bbEmailGet: rejectDemo,
    bbEmailSend: rejectDemo,
    readAvatarDir: function (folder) {
      return loadAvatarManifest().then(function (m) {
        return m[folder] || [];
      });
    },
    flGetPort: function () {
      return Promise.resolve(0);
    },
    flSavePage: rejectDemo,
    flGetActions: function () {
      return Promise.resolve([]);
    },
    flClearActions: noop,
    /* Chat attachments stay in memory as data URLs — gone on refresh, like every demo edit. */
    uploadChatImage: function (p) {
      return Promise.resolve({ url: (p && p.dataUrl) || null });
    },
    uploadChatFile: function (p) {
      return Promise.resolve({ url: (p && p.dataUrl) || null });
    },
    downloadChatImage: function (p) {
      var a = document.createElement('a');
      a.href = (p && p.src) || '';
      a.download = ((p && p.suggestedName) || 'bloomboard-image') + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return Promise.resolve({ ok: true });
    },
    readTaskImage: function () {
      return Promise.resolve(null);
    },
    getAppVersion: function () {
      return Promise.resolve(window.BB_APP_VERSION || '');
    },
    checkForUpdates: function () {
      return Promise.resolve({ state: 'idle' });
    },
    getUpdateStatus: function () {
      return Promise.resolve({ state: 'idle' });
    },
    installUpdate: noop,
    moveToApplications: noop,
    onUpdateStatus: function () {
      return noop;
    },
  };

  /* ── Demo UI helpers ── */
  function showWebDemoGate(featureName) {
    var overlay = document.getElementById('upgrade-overlay');
    var title = document.getElementById('upgrade-title');
    var desc = document.getElementById('upgrade-desc');
    var btns = overlay && overlay.querySelector('.upgrade-btns');
    if (!overlay || !title || !desc || !btns) return;

    title.textContent = 'Download BloomBoard for Mac';
    desc.textContent =
      (featureName ? featureName + ' is ' : '') +
      'available in the full desktop app. Download free, try everything locally, and upgrade when you are ready.';
    btns.innerHTML =
      '<button class="upgrade-btn-primary" onclick="window.bbDemoDownload()">Download for Mac</button>' +
      '<button class="upgrade-btn-secondary" onclick="document.getElementById(\'upgrade-overlay\').classList.remove(\'open\')">Keep exploring demo</button>';
    overlay.classList.add('open');
  }

  window.bbDemoDownload = function () {
    window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    var overlay = document.getElementById('upgrade-overlay');
    if (overlay) overlay.classList.remove('open');
  };

  window.showWebDemoGate = showWebDemoGate;

  function featureNameForTarget(el) {
    if (!el) return 'This feature';
    if (el.id === 'bloom-bubble' || (el.closest && el.closest('#bloom-panel'))) return 'Bloom AI Coworker';
    if (el.id === 'sb-email-nav-btn') return 'Email';
    if (el.id === 'sb-team-btn') return 'Teams';
    if (el.id === 'sb-chat-btn') return 'Chat';
    if (el.id === 'sb-notif-bell') return 'Team notifications';
    if (el.classList && el.classList.contains('ai')) return 'AI Assistant';
    return 'This feature';
  }

  /* Gated features open a download card on click (demo-convert.js) rather than
     wearing padlocks; this just clears any lock left by an older build. */
  function addLockBadges() {
    document.querySelectorAll('.bb-web-demo-lock').forEach(function (lock) {
      lock.remove();
    });
  }

  var DEMO_WS_OPTIONS = [
    { mode: 'personal', label: 'Personal Plan' },
    { mode: 'freelance', label: 'Freelance Plan' },
    { mode: 'team', label: 'Team Plan' },
  ].filter(function (o) {
    return (window.__bbDemoWorkspaces || ['personal', 'freelance', 'team']).indexOf(o.mode) >= 0;
  });

  var _demoWsBooted = false;
  var _demoWsBootStarted = false;
  var _demoWsSwitching = false;

  function ensureWsTransitionOverlay() {
    var overlay = document.getElementById('bb-demo-ws-transition');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'bb-demo-ws-transition';
    overlay.className = 'bb-demo-ws-transition';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    return overlay;
  }

  /* The site frames the demo (homepage section, /demo page). There a switch never
     reloads in view: the frame loads the new version out of sight and fades it in
     over this one once it has drawn (src/components/sections/DemoIframe.tsx).
     Opened on its own, the page reloads under a matching cover (top of file). */
  var _demoHosted = false;
  window.addEventListener('message', function (e) {
    if (e.source === window.parent && e.data && e.data.type === 'bb-demo-host') _demoHosted = true;
  });

  var _demoReadySent = false;
  function signalDemoReady() {
    if (_demoReadySent || !_demoWsBooted || document.readyState !== 'complete' || window.parent === window) return;
    _demoReadySent = true;
    setTimeout(function () {
      try { window.parent.postMessage({ type: 'bb-demo-ready' }, location.origin); } catch (e) {}
    }, 250);
  }
  window.addEventListener('load', signalDemoReady);

  function demoSwitchReload(go, label) {
    try {
      var theme = localStorage.getItem('bb-theme');
      if (theme) sessionStorage.setItem('bb-demo-carry-theme', theme);
    } catch (e) {}
    if (_demoHosted) {
      /* Both versions share this browser's storage while the new one loads; this one
         stops writing so it cannot overwrite what the new one just set up. */
      try {
        var noop = function () {};
        Storage.prototype.setItem = noop;
        Storage.prototype.removeItem = noop;
        Storage.prototype.clear = noop;
      } catch (e) {}
      document.documentElement.classList.add('bb-demo-switching');
      try { window.parent.postMessage({ type: 'bb-demo-switch' }, location.origin); } catch (e) {}
      /* The site did not answer: fall back to a reload. */
      setTimeout(go, 8000);
      return;
    }
    var bg = '#ffffff', fg = '#64748b';
    try {
      bg = getComputedStyle(document.body).backgroundColor || bg;
      if (!document.body.classList.contains('light-mode')) fg = 'rgba(230,237,243,.72)';
      sessionStorage.setItem('bb-demo-switch-cover', JSON.stringify({ bg: bg, fg: fg, label: label }));
    } catch (e) {}
    var overlay = ensureWsTransitionOverlay();
    overlay.classList.add('solid');
    overlay.style.background = bg;
    overlay.style.color = fg;
    overlay.textContent = label;
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { overlay.classList.add('visible'); });
    setTimeout(go, 220);
  }

  window.bbDemoSwitchWorkspace = function (mode) {
    if (['personal', 'freelance', 'team'].indexOf(mode) < 0) return;
    if (_demoWsSwitching || mode === getDemoWorkspaceMode()) return;
    _demoWsSwitching = true;

    var switcher = document.getElementById('bb-demo-ws-switcher');
    var pills = switcher ? switcher.querySelectorAll('.bb-demo-ws-pill[data-mode]') : [];
    pills.forEach(function (btn) {
      btn.disabled = true;
      btn.classList.add('switching');
    });

    var overlay = ensureWsTransitionOverlay();
    var safetyTimer;

    function finishSwitch() {
      clearTimeout(safetyTimer);
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      _demoWsSwitching = false;
      pills.forEach(function (btn) {
        btn.disabled = false;
        btn.classList.remove('switching');
      });
      updateSwitcherActiveState();
    }

    try {
      sessionStorage.setItem(DEMO_WS_KEY, mode);
    } catch (e) {}

    document.querySelectorAll('.bb-demo-ws-pill[data-mode]').forEach(function (btn) {
      var on = btn.getAttribute('data-mode') === mode;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    safetyTimer = setTimeout(finishSwitch, 4000);

    /* A full reload is the only clean switch: the team workspace is signed in
       to the fake backend (realtime channels, simulation), the others are not. */
    demoSwitchReload(function () { location.reload(); },
      mode === 'team' ? 'Opening Team Plan' : 'Opening Personal Plan');
  };

  window.bbDemoSwitchData = function (value) {
    if ((value !== 'fresh' && value !== 'sample') || value === getDemoDataMode() || _demoWsSwitching) return;
    _demoWsSwitching = true;
    document.querySelectorAll('.bb-demo-ws-pill, .bb-demo-data-btn').forEach(function (btn) { btn.disabled = true; });
    try { sessionStorage.setItem(DEMO_DATA_KEY, value); } catch (e) {}
    try { if (window.bbTrack) window.bbTrack('data', value); } catch (e) {}
    var dataBtn = document.querySelector('.bb-demo-data-btn');
    if (dataBtn) dataBtn.lastChild.textContent = value === 'fresh' ? 'Starting fresh' : 'Opening live demo';
    /* Drop ?data= so the choice just made is the one that loads. */
    var url = new URL(location.href);
    url.searchParams.delete('data');
    demoSwitchReload(function () { location.replace(url.toString()); },
      value === 'fresh' ? 'Starting fresh' : 'Opening live demo');
  };

  function updateSwitcherActiveState() {
    var current = getDemoWorkspaceMode();
    document.querySelectorAll('.bb-demo-ws-pill[data-mode]').forEach(function (btn) {
      var on = btn.getAttribute('data-mode') === current;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function buildWorkspaceSwitcherElement() {
    var current = getDemoWorkspaceMode();
    var el = document.createElement('div');
    el.id = 'bb-demo-ws-switcher';
    el.className = 'bb-demo-ws-switcher bb-demo-ws-fixed';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', 'Switch demo workspace');

    var pills = DEMO_WS_OPTIONS.map(function (opt) {
      var active = opt.mode === current ? ' active' : '';
      var pressed = opt.mode === current ? 'true' : 'false';
      return (
        '<button type="button" class="bb-demo-ws-pill' +
        active +
        '" data-mode="' +
        opt.mode +
        '" aria-pressed="' +
        pressed +
        '">' +
        opt.label +
        '</button>'
      );
    }).join('');

    /* Sample workspace or an empty app: one plain button, so it never reads as a
       third plan next to Personal / Team. */
    var fresh = getDemoDataMode() === 'fresh';
    var dataBtn = '<button type="button" class="bb-demo-data-btn" data-data="' + (fresh ? 'sample' : 'fresh') + '">' +
      (fresh
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>') +
      '<span>' + (fresh ? 'Back to live demo' : 'Start fresh') + '</span></button>';

    el.innerHTML =
      '<div class="bb-demo-ws-switcher-inner">' +
      '<div class="bb-demo-ws-switcher-head">' +
      '<span class="bb-demo-ws-title">' + (fresh ? 'Fresh start' : 'Live demo') + '</span>' +
      '<span class="bb-demo-ws-hint">' + (fresh
        ? 'An empty app, just like a new download.'
        : (current === 'team' ? 'A sample team. Click anything, nothing you do is saved.' : 'A sample workspace. Click anything, nothing you do is saved.')) + '</span>' +
      '</div>' +
      '<div class="bb-demo-ws-right-group">' + dataBtn +
      (DEMO_WS_OPTIONS.length > 1 ? '<div class="bb-demo-ws-pills" role="tablist">' + pills + '</div>' : '') +
      '</div>' +
      '</div>';

    /* The theme switch stays where the app puts it: in its own top bar (vendor/bb-topbar.js). */

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('.bb-demo-ws-pill, .bb-demo-data-btn');
      if (!btn || btn.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (btn.hasAttribute('data-data')) window.bbDemoSwitchData(btn.getAttribute('data-data'));
      else window.bbDemoSwitchWorkspace(btn.getAttribute('data-mode'));
    });

    return el;
  }

  function syncDemoSwitcherOffset() {
    var switcher = document.getElementById('bb-demo-ws-switcher');
    if (!switcher) {
      document.documentElement.style.setProperty('--bb-demo-ws-offset', '88px');
      document.documentElement.style.setProperty('--bb-demo-ws-total-offset', '88px');
      return;
    }
    var rect = switcher.getBoundingClientRect();
    var h = Math.ceil(rect.height) || 88;
    var bottom = Math.ceil(rect.bottom) || h;
    document.documentElement.style.setProperty('--bb-demo-ws-offset', h + 'px');
    document.documentElement.style.setProperty('--bb-demo-ws-total-offset', bottom + 'px');
  }

  function ensureWorkspaceSwitcher() {
    document.querySelectorAll('#bb-demo-ws-switcher').forEach(function (node, i) {
      if (i > 0) node.remove();
    });
    var existing = document.getElementById('bb-demo-ws-switcher');
    if (existing) {
      updateSwitcherActiveState();
      syncDemoSwitcherOffset();
      return existing;
    }
    var switcher = buildWorkspaceSwitcherElement();
    document.body.appendChild(switcher);
    document.body.classList.add('bb-has-ws-switcher');
    syncDemoSwitcherOffset();
    if (typeof ResizeObserver !== 'undefined' && !switcher._bbDemoRo) {
      var ro = new ResizeObserver(syncDemoSwitcherOffset);
      ro.observe(switcher);
      switcher._bbDemoRo = ro;
    }
    return switcher;
  }

  function bootDemoWorkspaceOnce() {
    if (_demoWsBooted) {
      ensureWorkspaceSwitcher();
      return true;
    }

    var mode = getDemoWorkspaceMode();
    window.isDeveloperWorkspaceBypass = function () {
      return true;
    };

    if (typeof window.closeWorkspaceChooser === 'function') {
      window.closeWorkspaceChooser();
    }

    if (mode === 'freelance') {
      if (typeof window.enterFreelanceWorkspace === 'function') {
        window.enterFreelanceWorkspace();
      } else if (typeof window.openFreelance === 'function') {
        if (typeof window.applyWorkspaceShell === 'function') {
          window.applyWorkspaceShell('freelance');
        }
        window.openFreelance();
      } else {
        return false;
      }
    } else if (mode === 'personal') {
      if (typeof window.closeFreelance === 'function') {
        window.closeFreelance(true);
      }
      if (typeof window.applyWorkspaceShell === 'function') {
        window.applyWorkspaceShell('personal');
      }
      var layout = document.querySelector('.layout');
      if (layout) layout.style.display = '';
      if (typeof window.switchMainTab === 'function') {
        window.switchMainTab('tasks');
      }
    } else {
      if (typeof window.closeFreelance === 'function') {
        window.closeFreelance(true);
      }
      if (typeof window.applyWorkspaceShell === 'function') {
        window.applyWorkspaceShell('team');
      }
      var teamLayout = document.querySelector('.layout');
      if (teamLayout) teamLayout.style.display = '';
    }

    _demoWsBooted = true;
    signalDemoReady();
    installDemoWorkspaceAuthority();
    if (typeof window.syncWorkspaceModeUI === 'function') {
      window.syncWorkspaceModeUI();
    }
    ensureWorkspaceSwitcher();
    applyDemoPlanLabel();
    fixBloomBubble();
    return true;
  }

  function startDemoWorkspaceBoot() {
    if (_demoWsBootStarted) return;
    _demoWsBootStarted = true;

    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (bootDemoWorkspaceOnce()) {
        clearInterval(timer);
        return;
      }
      if (tries > 120) {
        ensureWorkspaceSwitcher();
        clearInterval(timer);
      }
    }, 100);
  }

  function applyDemoPlanLabel() {
    var mode = getDemoWorkspaceMode();
    var name = document.getElementById('sb-plan-name');
    if (!name) return;
    if (mode === 'team') {
      name.textContent = 'Team';
      name.className = 'sb-plan-name promax';
    } else if (mode === 'freelance') {
      name.textContent = 'Freelance Bloom';
      name.className = 'sb-plan-name promax';
    } else {
      name.textContent = 'Bloom';
      name.className = 'sb-plan-name promax';
    }
  }

  function refreshDemoUI() {
    if (typeof window.syncTeamDashboardButtons === 'function') {
      window.syncTeamDashboardButtons();
    }
    if (getDemoWorkspaceMode() === 'team') {
      if (typeof window.updateBellBadge === 'function') {
        window.updateBellBadge();
      }
      if (typeof window.chatUpdateUnreadBadge === 'function') {
        window.chatUpdateUnreadBadge();
      }
    }
    applyDemoPlanLabel();
    addLockBadges();
    fixBloomBubble();
    if (_demoWsBooted) {
      ensureWorkspaceSwitcher();
    }
  }

  function hideDemoDeveloperTools() {
    if (!document.getElementById('bb-demo-no-dev-styles')) {
      var style = document.createElement('style');
      style.id = 'bb-demo-no-dev-styles';
      style.textContent =
        '#dev-switcher,#owner-only-section,.dev-switcher,#fl-dev-preview-select{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important;}' +
        '#license-overlay .dev-switcher{display:none!important}';
      document.head.appendChild(style);
    }

    window.canUseDeveloperPreview = function () {
      return false;
    };

    if (typeof window.devSetTier === 'function' && !window.devSetTier._demoBlocked) {
      window.devSetTier = function () {};
      window.devSetTier._demoBlocked = true;
    }
    if (typeof window.devSetProductPreview === 'function' && !window.devSetProductPreview._demoBlocked) {
      window.devSetProductPreview = function () {};
      window.devSetProductPreview._demoBlocked = true;
    }
    if (typeof window.devClearProductPreview === 'function' && !window.devClearProductPreview._demoBlocked) {
      window.devClearProductPreview = function () {};
      window.devClearProductPreview._demoBlocked = true;
    }
    if (typeof window.devPreviewFrontDoor === 'function' && !window.devPreviewFrontDoor._demoBlocked) {
      window.devPreviewFrontDoor = function () {};
      window.devPreviewFrontDoor._demoBlocked = true;
    }

    var devSwitcher = document.getElementById('dev-switcher');
    if (devSwitcher) devSwitcher.style.display = 'none';
    var ownerSection = document.getElementById('owner-only-section');
    if (ownerSection) ownerSection.style.display = 'none';
    var flDevSelect = document.getElementById('fl-dev-preview-select');
    if (flDevSelect) flDevSelect.style.display = 'none';

    try {
      localStorage.removeItem('bb-dev-preview-product');
    } catch (e) {}
  }

  function lockDemoWorkspaceBypass() {
    window.isDeveloperWorkspaceBypass = function () {
      return true;
    };
  }

  function installDemoWorkspaceAuthority() {
    lockDemoWorkspaceBypass();
    hideDemoDeveloperTools();

    if (typeof window.getWorkspaceMode === 'function' && !window.getWorkspaceMode._demoPatched) {
      window.getWorkspaceMode = function () {
        return getDemoWorkspaceMode();
      };
      window.getWorkspaceMode._demoPatched = true;
    }

    if (typeof window.getEffectiveWorkspaceMode === 'function' && !window.getEffectiveWorkspaceMode._demoPatched) {
      window.getEffectiveWorkspaceMode = function () {
        return getDemoWorkspaceMode();
      };
      window.getEffectiveWorkspaceMode._demoPatched = true;
    }

    if (typeof window.syncWorkspaceModeUI === 'function' && !window.syncWorkspaceModeUI._demoPatched) {
      window.syncWorkspaceModeUI = function () {
        var mode = getDemoWorkspaceMode();
        try {
          /* A workspace switch reloads the page; keep the theme the visitor picked. */
      var carried = sessionStorage.getItem('bb-demo-carry-theme');
      if (carried) {
        sessionStorage.removeItem('bb-demo-carry-theme');
        localStorage.setItem('bb-theme', carried);
      }

      localStorage.setItem('bb-workspace-mode', mode);
          localStorage.setItem('bb-workspace-onboarded', '1');
        } catch (e) {}

        if (typeof window.applyWorkspaceShell === 'function') {
          window.applyWorkspaceShell(mode);
        }

        var freelanceBtn = document.getElementById('sb-freelance-btn');
        var hiveGroup = document.getElementById('sb-hive-group');
        if (freelanceBtn) freelanceBtn.style.display = 'none';
        if (hiveGroup) hiveGroup.style.display = 'none';

        var licenseMode = document.getElementById('lic-workspace-mode');
        if (licenseMode && typeof window.getWorkspaceModeLabel === 'function') {
          licenseMode.textContent = window.getWorkspaceModeLabel(mode);
        }

        if (mode === 'freelance') {
          if (_demoWsBooted) {
            var fl = document.getElementById('fl-overlay');
            var canF = typeof window.flCanUseFreelance === 'function' ? window.flCanUseFreelance() : true;
            if (canF && fl && !fl.classList.contains('open') && typeof window.openFreelance === 'function') {
              window.openFreelance();
            }
          }
        } else if (typeof window.closeFreelance === 'function') {
          window.closeFreelance(true);
        }

        updateSwitcherActiveState();
        applyDemoPlanLabel();
        fixBloomBubble();
      };
      window.syncWorkspaceModeUI._demoPatched = true;
    }

    if (window.flSyncFreelanceAccess && !window.flSyncFreelanceAccess._demoPatched) {
      window.flSyncFreelanceAccess = function () {
        if (_demoWsBooted) return;
      };
      window.flSyncFreelanceAccess._demoPatched = true;
    }
  }

  function patchDemoWorkspaceChooser() {
    lockDemoWorkspaceBypass();

    if (typeof window.setWorkspaceMode === 'function' && !window.setWorkspaceMode._demoPatched) {
      window.setWorkspaceMode = function (mode) {
        window.bbDemoSwitchWorkspace(mode);
      };
      window.setWorkspaceMode._demoPatched = true;
    }

    if (typeof window.openWorkspaceChooser === 'function' && !window.openWorkspaceChooser._demoPatched) {
      var origChooser = window.openWorkspaceChooser;
      window.openWorkspaceChooser = function () {
        origChooser.apply(this, arguments);
        if (typeof window._wsClearLockUI === 'function') {
          window._wsClearLockUI();
        }
        var keySection = document.getElementById('ws-key-section');
        if (keySection) keySection.style.display = 'none';
        var lockNote = document.getElementById('ws-lock-note');
        if (lockNote) lockNote.style.display = 'none';
        var footNote = document.getElementById('ws-foot-note');
        if (footNote) {
          footNote.textContent =
            'Switch workspaces to preview Bloom Personal, Freelance, or Team.';
        }
        var defBtn = document.getElementById('ws-default-btn');
        if (defBtn) defBtn.style.display = 'none';
        var personalTitle = document.querySelector('.workspace-option.personal .workspace-option-title');
        if (personalTitle) personalTitle.textContent = 'Bloom: Personal Productivity';
        var freelanceTitle = document.querySelector('.workspace-option.freelance .workspace-option-title');
        if (freelanceTitle) freelanceTitle.textContent = 'Bloom: Freelance Business';
      };
      window.openWorkspaceChooser._demoPatched = true;
    }
  }

  function patchLicenseAndPlanUI() {
    patchDemoWorkspaceChooser();
    installDemoWorkspaceAuthority();
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      installDemoWorkspaceAuthority();
      if (typeof window.updatePlanUI === 'function' && !window.updatePlanUI._demoPatched) {
        var origPlan = window.updatePlanUI;
        window.updatePlanUI = function () {
          var lic = getDemoLicense();
          origPlan(lic.tier);
          applyDemoPlanLabel();
          hideDemoDeveloperTools();
        };
        window.updatePlanUI._demoPatched = true;
        window.updatePlanUI(getDemoLicense().tier);
      }
      if (_demoWsBooted) {
        refreshDemoUI();
      }
      if (tries > 40 || window.updatePlanUI._demoPatched) {
        clearInterval(timer);
      }
    }, 150);
  }

  function isBloomPanelOpen() {
    var panel = document.getElementById('bloom-panel');
    return !!(panel && panel.classList.contains('open'));
  }

  function fixBloomBubble() {
    var bubble = document.getElementById('bloom-bubble');
    if (!bubble) return false;

    if (bubble.parentElement !== document.body) {
      document.body.appendChild(bubble);
    }

    bubble.style.setProperty('position', 'fixed', 'important');
    bubble.style.setProperty('bottom', '28px', 'important');
    bubble.style.setProperty('right', '28px', 'important');
    bubble.style.setProperty('left', 'auto', 'important');
    bubble.style.setProperty('top', 'auto', 'important');
    bubble.style.setProperty('z-index', '2500', 'important');
    bubble.style.setProperty('margin', '0', 'important');

    /* The app no longer shows the floating butterfly (Ask Bloom lives in the AI Hub). */
    bubble.style.setProperty('display', 'none', 'important');

    return true;
  }

  function watchBloomBubble() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      fixBloomBubble();
      if (tries > 100) clearInterval(timer);
    }, 200);
    window.addEventListener('resize', fixBloomBubble);
    window.addEventListener('load', fixBloomBubble);

    var obs = new MutationObserver(function () {
      fixBloomBubble();
    });
    var bubble = document.getElementById('bloom-bubble');
    if (bubble) {
      obs.observe(bubble, { attributes: true, attributeFilter: ['style', 'class'] });
      if (bubble.parentElement) {
        obs.observe(bubble.parentElement, { childList: true });
      }
    }
    var panel = document.getElementById('bloom-panel');
    if (panel) {
      obs.observe(panel, { attributes: true, attributeFilter: ['class'] });
    }

    var shellTries = 0;
    var shellTimer = setInterval(function () {
      shellTries++;
      if (typeof window.applyWorkspaceShell === 'function' && !window.applyWorkspaceShell._demoPatched) {
        var orig = window.applyWorkspaceShell;
        window.applyWorkspaceShell = function (mode) {
          orig(mode);
          fixBloomBubble();
        };
        window.applyWorkspaceShell._demoPatched = true;
      }
      if (shellTries > 80) clearInterval(shellTimer);
    }, 100);
  }

  function injectDemoStyles() {
    if (document.getElementById('bb-web-demo-styles')) return;
    var style = document.createElement('style');
    style.id = 'bb-web-demo-styles';
    var embedHome = /[?&]embed=home/.test(location.search);
    style.textContent =
      /* The app's top bar (vendor/bb-topbar.js) sits under the demo's own bar. The
         macOS window buttons it leaves room for are not drawn here. */
      '#drag-strip{position:fixed!important;top:var(--bb-demo-ws-total-offset,88px)!important;left:0!important;right:0!important;padding-left:20px!important}' +
      /* Sits beside the macOS window buttons; the workspace pills replace it in the browser. */
      '#global-home-btn{display:none!important}' +
      /* Sticky notes can't pop out onto the computer's desktop from a browser. */
      '.sticky-note .sn-pop-btn{display:none!important}' +
      /* Dashboard knock row: no banner, the answer buttons sit right after the name. */
      '#tl-strip .tl-knock{background:none!important;border:none!important;padding:2px 0!important;justify-content:flex-start;gap:10px}' +
      '#tl-strip .tl-knock-main{flex:0 0 auto}' +
      '#tl-strip .tl-knock-acts{justify-content:flex-start;flex-wrap:nowrap}' +
      '.bb-web-demo-lock{margin-left:auto;font-size:10px;opacity:.85;flex-shrink:0}' +
      '.bb-web-demo-lock-bubble{position:absolute;top:-4px;right:-4px;font-size:11px;pointer-events:none}' +
      '.layout{position:relative!important}' +
      /* No reward pop-up ("First task done!", streaks) while the demo plays its own story. */
      '#reward-toast{display:none!important}' +
      /* The website shows the demo scaled down, so the sidebar reads a size up. */
      '.sb-nav-item .sb-nav-label{font-size:14.5px!important}' +
      '.sb-nav-item > svg,.sb-nav-item .sb-nav-icon svg{width:18px!important;height:18px!important}' +
      '.sb-nav-heading{font-size:10.5px!important}' +
      'body.bb-web-demo-embed .layout{padding-top:52px!important;height:100%!important}' +
      'body.bb-web-demo-active .layout{padding-top:52px!important;min-height:100vh!important}' +
      '.main-area{position:relative!important}' +
      '#bloom-bubble{position:fixed!important;bottom:28px!important;right:28px!important;left:auto!important;top:auto!important;z-index:2500!important}' +
      'body:has(.bloom-panel.open) #bloom-bubble{display:none!important}' +
      (embedHome
        ? 'html.bb-web-demo-embed,body.bb-web-demo-embed{height:100%;overflow:hidden;box-sizing:border-box}' +
          'body.bb-web-demo-embed{padding:0!important}'
        : '') +
      /* Flat, in the app's own colours: blue in Blue, light grey in Light, grey in Black. */
      '.bb-web-demo-banner{position:fixed;top:0;left:0;right:0;z-index:99999;background:#123e5a;color:#cfe3f3;font-size:11px;text-align:center;padding:6px 12px;border-bottom:1px solid rgba(255,255,255,.1)}' +
      '.bb-web-demo-banner a{color:#fff;font-weight:700;margin-left:6px}' +
      'body.light-mode .bb-web-demo-banner{background:#eef2f6;color:#334155;border-bottom-color:#dde3ea}' +
      'body.light-mode .bb-web-demo-banner a{color:#0f172a}' +
      'body.black-mode .bb-web-demo-banner{background:#1c1c1c;color:#d4d4d4;border-bottom-color:rgba(255,255,255,.1)}' +
      'body.black-mode .bb-web-demo-banner a{color:#fff}' +
      ':root{--bb-demo-ws-offset:88px;--bb-demo-ws-total-offset:88px}' +
      '.bb-demo-ws-switcher{margin:0;padding:0;flex-shrink:0;width:100%}' +
      '.bb-demo-ws-switcher.bb-demo-ws-fixed{position:fixed;left:0;right:0;top:0;z-index:50000;margin:0;padding:6px 16px;pointer-events:none;background:transparent;border:none;box-shadow:none;isolation:isolate}' +
      'body.bb-web-demo-active .bb-demo-ws-switcher.bb-demo-ws-fixed{top:32px}' +
      'body.bb-has-ws-switcher.bb-web-demo-embed .layout{margin-top:var(--bb-demo-ws-total-offset,88px)!important;min-height:0!important;height:calc(100% - var(--bb-demo-ws-total-offset,88px))!important}' +
      'body.bb-has-ws-switcher.bb-web-demo-active .layout{margin-top:var(--bb-demo-ws-total-offset,120px)!important;min-height:0!important;height:calc(100vh - var(--bb-demo-ws-total-offset,120px))!important}' +
      'body.bb-has-ws-switcher #fl-overlay{top:calc(var(--bb-demo-ws-total-offset,88px) + 52px);right:0;bottom:0;left:0;height:auto;z-index:3500}' +
      'body.bb-has-ws-switcher #fl-overlay.open{z-index:3500}' +
      'body.bb-has-ws-switcher .chat-overlay,' +
      'body.bb-has-ws-switcher #chat-overlay,' +
      'body.bb-has-ws-switcher .team-overlay,' +
      'body.bb-has-ws-switcher #team-overlay,' +
      'body.bb-has-ws-switcher .boards-overlay,' +
      'body.bb-has-ws-switcher #boards-overlay,' +
      'body.bb-has-ws-switcher .bookmarks-overlay,' +
      'body.bb-has-ws-switcher .overview-overlay,' +
      'body.bb-has-ws-switcher .bb-email-overlay{top:calc(var(--bb-demo-ws-total-offset,88px) + 52px)!important;left:0!important;right:0!important;bottom:0!important;height:auto!important}' +
      'body.bb-has-ws-switcher .chat-topbar,' +
      'body.bb-has-ws-switcher .team-topbar,' +
      'body.bb-has-ws-switcher .boards-topbar{padding-top:14px!important}' +
      /* Flat bar, matching the app's own controls: one segmented switch, no glows. */
      '.bb-demo-ws-switcher-inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 14px;position:relative;z-index:1;pointer-events:auto}' +
      '.bb-demo-ws-switcher-head{display:flex;align-items:baseline;gap:10px;min-width:0;flex:1}' +
      '.bb-demo-ws-title{font-size:13px;font-weight:600;color:#e6edf3}' +
      '.bb-demo-ws-hint{font-size:12px;color:rgba(230,237,243,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.bb-demo-ws-right-group{display:flex;align-items:center;gap:10px}' +
      '.bb-demo-ws-pills{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}' +
      '.bb-demo-ws-pill{appearance:none;border:0;background:transparent;color:rgba(230,237,243,.7);font:inherit;font-size:13px;font-weight:500;height:28px;padding:0 14px;border-radius:6px;cursor:pointer;white-space:nowrap;pointer-events:auto;transition:background .15s ease,color .15s ease}' +
      '.bb-demo-ws-pill:hover:not(:disabled):not(.active){color:#fff}' +
      '.bb-demo-ws-pill:disabled{cursor:wait}' +
      '.bb-demo-ws-pill.active{background:rgba(255,255,255,.16);color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25)}' +
      '.bb-demo-data-btn{appearance:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:7px;border:1px solid rgba(255,255,255,.22);background:transparent;color:#e6edf3;font:inherit;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s ease,border-color .15s ease}' +
      '.bb-demo-data-btn:hover:not(:disabled){background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.34)}' +
      '.bb-demo-data-btn:disabled{cursor:wait;opacity:.75}' +
      '.bb-demo-data-btn svg{width:14px;height:14px;flex-shrink:0}' +
      'body.light-mode .bb-demo-data-btn{border-color:#cbd5e1;color:#0f172a}' +
      'body.black-mode .bb-demo-data-btn{border-color:rgba(255,255,255,.24)!important;color:#e6e6e6}' +
      'body.black-mode .bb-demo-data-btn:hover:not(:disabled){background:rgba(255,255,255,.07)!important;border-color:rgba(255,255,255,.36)!important}' +
      'body.light-mode .bb-demo-data-btn:hover:not(:disabled){background:#f1f5f9;border-color:#94a3b8}' +
      'html.bb-demo-switching .bb-demo-ws-pill,html.bb-demo-switching .bb-demo-data-btn{cursor:wait}' +
      'body.light-mode .bb-demo-ws-title{color:#0f172a}' +
      'body.light-mode .bb-demo-ws-hint{color:#64748b}' +
      'body.light-mode .bb-demo-ws-pills{background:#eef0f3;border-color:rgba(15,23,42,.08)}' +
      'body.light-mode .bb-demo-ws-pill{color:#475569}' +
      'body.light-mode .bb-demo-ws-pill:hover:not(:disabled):not(.active){color:#0f172a}' +
      'body.light-mode .bb-demo-ws-pill.active{background:#fff;color:#0f172a;box-shadow:0 1px 2px rgba(15,23,42,.12)}' +
      /* Urgent cards get a red wash in the app; in the demo every card keeps the same colour. */
      '.task-card.priority-urgent{background-image:none!important}' +
      /* In the freelance workspace the page behind the bar matches the freelance hub. */
      'body.bb-has-ws-switcher.bb-workspace-freelance:not(.light-mode){background:#0d0f14!important}' +
      'body.bb-has-ws-switcher.bb-workspace-freelance:not(.light-mode) .bb-demo-ws-switcher.bb-demo-ws-fixed{border-bottom:1px solid rgba(255,255,255,.06)}' +
      '.bb-demo-ws-transition{position:fixed;inset:0;z-index:49999;background:rgba(8,12,20,.5);opacity:0;pointer-events:none;transition:opacity .28s ease;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}' +
      '.bb-demo-ws-transition.visible{opacity:1;pointer-events:auto}' +
      'body.light-mode .bb-demo-ws-transition{background:rgba(248,250,252,.78)}' +
      '.bb-demo-ws-transition.solid{backdrop-filter:none;-webkit-backdrop-filter:none;transition:opacity .2s ease;display:flex;align-items:center;justify-content:center;font:500 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
      'body.bb-has-ws-switcher .sidebar,body.bb-has-ws-switcher .main-area{position:relative;z-index:1}' +
      'body.bb-workspace-personal .sb-section:has(#sb-hydration){display:none!important}' +
      'body.bb-has-ws-switcher #hydration-popup{display:none!important}';
    document.head.appendChild(style);
  }

  function injectDemoBanner() {
    if (/[?&]embed=home/.test(location.search)) return;
    if (document.getElementById('bb-web-demo-banner')) return;
    var bar = document.createElement('div');
    bar.id = 'bb-web-demo-banner';
    bar.className = 'bb-web-demo-banner';
    bar.innerHTML =
      'Browser demo. Use the <strong>Switch workspace</strong> bar at the top of the dashboard. ' +
      '<a href="' +
      DOWNLOAD_URL +
      '" target="_blank" rel="noopener noreferrer">Download Mac app →</a>';
    document.body.classList.add('bb-web-demo-active');
    document.body.insertBefore(bar, document.body.firstChild);
    syncDemoSwitcherOffset();
  }

  function interceptGatedClicks() {
    document.addEventListener(
      'click',
      function (e) {
        var gated = e.target.closest(GATED_SELECTORS);
        if (!gated) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.showWebDemoGate(featureNameForTarget(gated));
      },
      true
    );
  }

  function patchDemoToast() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (typeof window.showToast === 'function' && !window.showToast._demoPatched) {
        var orig = window.showToast;
        window.showToast = function (msg, dur) {
          var text = String(msg == null ? '' : msg);
          if (
            text.indexOf('Available in the Mac app') !== -1 ||
            text.indexOf(DEMO_MAC_MSG) !== -1
          ) {
            text = '💻 ' + DEMO_MAC_MSG;
          } else if (/^❌\s*/.test(text) && /mac app/i.test(text)) {
            text = '💻 ' + DEMO_MAC_MSG;
          }
          return orig(text, dur);
        };
        window.showToast._demoPatched = true;
      }
      if (tries > 150) clearInterval(timer);
    }, 100);
  }

  function initDemoUI() {
    injectDemoStyles();
    if (!/[?&]embed=home/.test(location.search)) {
      injectDemoBanner();
    }
    if (/[?&]embed=home/.test(location.search)) {
      document.documentElement.classList.add('bb-web-demo-embed');
      document.body.classList.add('bb-web-demo-embed');
    }
    installDemoWorkspaceAuthority();
    hideDemoDeveloperTools();
    patchLicenseAndPlanUI();
    startDemoWorkspaceBoot();
    patchDemoToast();
    watchBloomBubble();
    /* Email opens the seeded inbox (demo-mail.js); only connecting a real account shows the Mac-app card. */
    fixBloomBubble();
    syncDemoSwitcherOffset();
    window.addEventListener('resize', syncDemoSwitcherOffset);
    window.addEventListener('load', function () {
      syncDemoSwitcherOffset();
      installDemoWorkspaceAuthority();
      if (_demoWsBooted && typeof window.syncWorkspaceModeUI === 'function') {
        window.syncWorkspaceModeUI();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoUI);
  } else {
    initDemoUI();
  }
})();


/* No weekly report in the demo: it is a personal Sunday-evening summary with
   nothing to show a visitor. Mark this week as seen (the app's own key) and keep
   the popup hidden if anything opens it anyway. */
(function () {
  'use strict';
  try {
    var d = new Date();
    var mon = new Date(d);
    mon.setDate(d.getDate() - (d.getDay() || 7) + 1);
    localStorage.setItem('bbd-weekly-' + mon.toISOString().split('T')[0], '1');
  } catch (e) {}
  var st = document.createElement('style');
  st.textContent = '#weekly-modal{display:none!important}';
  (document.head || document.documentElement).appendChild(st);
})();

/* "Type your tasks" opens folded in the app. In the demo it starts open, so
   visitors see its examples typing themselves in (the app's own animation). */
(function () {
  'use strict';
  function open() {
    var card = document.getElementById('t2t-dashboard-card');
    if (!card) return false;
    card.classList.remove('collapsed');
    return true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
  else open();
})();

/* No saved logins in the demo. The app's sign-in and licence windows have
   password fields, so browsers treat the page as a login page and fill the
   visitor's saved email into the first text box (the top bar search) or offer
   it there. Nobody signs in to the demo, so those fields become plain text
   drawn as dots, and anything put into the search box without typing is
   cleared. */
(function () {
  'use strict';
  var st = document.createElement('style');
  st.textContent = '.bb-demo-pw,input[data-bb-pw]{-webkit-text-security:disc}';
  (document.head || document.documentElement).appendChild(st);

  function tidy(root) {
    if (root.matches && root.matches('input[type="password"]')) root = root.parentNode || document;
    (root.querySelectorAll ? root : document).querySelectorAll('input[type="password"]').forEach(function (i) {
      i.type = 'text';
      i.classList.add('bb-demo-pw');
      i.setAttribute('autocomplete', 'off');
    });
    (root.querySelectorAll ? root : document).querySelectorAll('input[type="email"], input[autocomplete="email"], input[autocomplete="username"]').forEach(function (i) {
      i.setAttribute('autocomplete', 'off');
    });
    var q = document.getElementById('search-input');
    if (q && !q.getAttribute('data-bb-demo')) {
      q.setAttribute('data-bb-demo', '1');
      q.setAttribute('name', 'bb-demo-search');
      q.setAttribute('autocomplete', 'off');
      q.setAttribute('data-lpignore', 'true');
      q.setAttribute('data-1p-ignore', 'true');
      /* Browsers never autofill a read-only box; it opens up the moment it is used. */
      q.readOnly = true;
      function unlock() { q.readOnly = false; }
      q.addEventListener('pointerdown', unlock);
      q.addEventListener('focus', unlock);
      /* Whatever sits in the box must be what the visitor typed. Typing (any
         keyboard, phones and other languages too) is an input of type insertText /
         insertCompositionText / paste / delete; autofill arrives without one. Chrome
         even shows a saved login before the page can read it, so keep checking. */
      var typed = '';
      q.addEventListener('input', function (e) {
        if (e.isTrusted && /^(insertText|insertCompositionText|insertFromPaste|deleteContent)/.test(e.inputType || '')) typed = q.value;
      });
      setInterval(function () {
        if (!q.value || q.value === typed) return;
        q.value = typed;
        try { if (!typed && typeof window.clearSearch === 'function') window.clearSearch(); } catch (e) {}
      }, 700);
    }
  }

  function start() {
    tidy(document);
    /* Windows the app builds later (sign-in, licence) get the same treatment. */
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        m.addedNodes.forEach(function (n) { if (n.nodeType === 1) tidy(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* Demo only: "Type your tasks" and Team Live fold away now and then and come back,
   so visitors notice they can be folded to give the task board more room. About 30 s
   in, both fold; about 12 s later they open again; then every 45 s. It waits while the
   visitor is typing, hovering over either panel or has another window open, and stops
   for good the moment the visitor folds or opens either panel themselves. */
(function () {
  'use strict';
  var stopped = false, hovering = false, timer = null;
  function t2t() { return document.getElementById('t2t-dashboard-card'); }
  function tlStrip() { return document.getElementById('tl-strip'); }
  function busy() {
    if (document.visibilityState !== 'visible') return true;
    if (hovering) return true;
    var ta = document.getElementById('t2t-input');
    if (ta && (document.activeElement === ta || ta.value)) return true;
    /* Something else is open over the dashboard (Boards, a task, Email, the office…). */
    var big = Array.prototype.some.call(document.querySelectorAll('.open, .visible'), function (el) {
      if (el.id === 'bb-demo-welcome' || el.closest('#bb-demo-ws-switcher')) return false;
      var cs = getComputedStyle(el);
      return (cs.position === 'fixed' || cs.position === 'absolute') && el.offsetWidth > window.innerWidth * 0.4 && el.offsetHeight > window.innerHeight * 0.4;
    });
    return big;
  }
  function fold(on) {
    var c = t2t();
    if (c && c.classList.contains('collapsed') !== on && typeof window.toggleT2T === 'function') window.toggleT2T();
    var strip = tlStrip();
    /* Team Live's toggle only flips, so compare with its current state first. */
    if (strip && !strip.hidden && strip.classList.contains('tl-collapsed') !== on &&
        window.bbTeamLive && typeof window.bbTeamLive.toggleCollapsed === 'function') window.bbTeamLive.toggleCollapsed();
  }
  function cycle(delay) {
    clearTimeout(timer);
    timer = setTimeout(function tick() {
      if (stopped) return;
      if (busy()) { timer = setTimeout(tick, 3000); return; }
      fold(true);
      timer = setTimeout(function back() {
        if (stopped) return;
        if (busy() && !hovering) { timer = setTimeout(back, 2000); return; }
        fold(false);
        cycle(45000);
      }, 12000);
    }, delay);
  }
  function start() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* The visitor's own click on either fold control ends the demo of it. */
    document.addEventListener('click', function (e) {
      if (!e.isTrusted || !e.target.closest) return;
      if (e.target.closest('#t2t-dashboard-card .t2t-card-hd, #tl-collapse, .tl-mini')) { stopped = true; clearTimeout(timer); }
    }, true);
    ['t2t-dashboard-card', 'tl-strip'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('mouseenter', function () { hovering = true; });
      el.addEventListener('mouseleave', function () { hovering = false; });
    });
    cycle(30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 2000); });
  else setTimeout(start, 2000);
})();

/* ── Sticky notes pop out of the demo onto the website ──
   The demo runs in a frame, so a note can't be dragged straight out of it.
   Instead, dragging a note to the edge of the demo window (or clicking the
   pop-out button on the note) hands it to the website page (LiveDemoFrame's
   StickyPopouts), which takes over the same note and the same drag. The note
   then leaves the demo, like the Mac app's "pop out onto your desktop". */
(function () {
  'use strict';
  if (window.parent === window) return;
  var SK = 'bloombooard-stickies-v1';
  var drag = null;      /* { id, offX, offY } while a note is held */
  var handed = false;   /* the note has gone to the page; forward the drag */

  function noteData(el) {
    var id = el.id.replace(/^sn-/, '');
    var stored = [];
    try { stored = JSON.parse(localStorage.getItem(SK) || '[]') || []; } catch (e) {}
    var n = stored.filter(function (x) { return String(x.id) === id; })[0] || {};
    var ta = el.querySelector('.sn-textarea');
    var color = (el.className.match(/sn-(yellow|pink|blue|green|purple)/) || [])[0] || n.color || 'sn-yellow';
    return { id: id, text: ta ? ta.value : (n.text || ''), color: color, fontSize: n.fontSize || 14, ts: n.ts || '' };
  }
  function popOut(el, x, y, offX, offY, dragging) {
    var r = el.getBoundingClientRect();
    window.parent.postMessage({
      type: 'bb-sticky-pop', note: noteData(el), x: x, y: y,
      offX: offX, offY: offY, w: r.width, dragging: !!dragging,
    }, location.origin);
    /* gone from the demo: the app's own delete keeps its data tidy */
    var del = el.querySelector('.sn-del-btn');
    if (del) del.click();
  }

  /* a pop-out button on every note, beside the close button */
  var POP_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><rect x="12" y="13" width="10" height="7" rx="1.5" fill="currentColor" fill-opacity=".25"/></svg>';
  function addButton(el) {
    if (!el.classList || !el.classList.contains('sticky-note') || el.querySelector('.bbd-sn-pop')) return;
    var del = el.querySelector('.sn-del-btn');
    if (!del) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bbd-sn-pop';
    b.title = 'Pop out onto the page';
    b.setAttribute('aria-label', 'Pop out onto the page');
    b.innerHTML = POP_SVG;
    b.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var r = el.getBoundingClientRect();
      popOut(el, r.left + 20, r.top + 14, 20, 14, false);
    });
    del.parentNode.insertBefore(b, del);
  }
  var css = document.createElement('style');
  css.textContent =
    '.sticky-note .bbd-sn-pop{width:22px;height:22px;padding:0;border:0;border-radius:6px;background:transparent;color:rgba(0,0,0,.5);display:grid;place-items:center;cursor:pointer;margin-left:auto}' +
    '.sticky-note .bbd-sn-pop:hover{background:rgba(0,0,0,.07);color:rgba(0,0,0,.85)}';
  (document.head || document.documentElement).appendChild(css);

  function watch() {
    [].forEach.call(document.querySelectorAll('.sticky-note'), addButton);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) addButton(n); }); });
    }).observe(document.body, { childList: true });
  }
  if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);

  /* dragging a note out through the edge */
  document.addEventListener('mousedown', function (e) {
    var hd = e.target.closest && e.target.closest('.sticky-note .sn-header');
    if (!hd || e.button !== 0 || e.target.closest('button, .sn-color-dot')) return;
    var el = hd.closest('.sticky-note'), r = el.getBoundingClientRect();
    drag = { el: el, offX: e.clientX - r.left, offY: e.clientY - r.top };
    handed = false;
  }, true);
  document.addEventListener('mousemove', function (e) {
    if (!drag) return;
    if (handed) {
      window.parent.postMessage({ type: 'bb-sticky-move', x: e.clientX, y: e.clientY }, location.origin);
      return;
    }
    var edge = 3;
    if (e.clientX <= edge || e.clientY <= edge || e.clientX >= window.innerWidth - edge || e.clientY >= window.innerHeight - edge) {
      handed = true;
      /* let the app's own drag go first, then hand the note over */
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: e.clientX, clientY: e.clientY }));
      popOut(drag.el, e.clientX, e.clientY, drag.offX, drag.offY, true);
    }
  }, true);
  /* if the pointer leaves the frame without passing the edge (a fast flick) */
  document.addEventListener('mouseout', function (e) {
    if (!drag || handed || e.relatedTarget) return;
    handed = true;
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: e.clientX, clientY: e.clientY }));
    popOut(drag.el, e.clientX, e.clientY, drag.offX, drag.offY, true);
  }, true);
  document.addEventListener('mouseup', function (e) {
    if (!drag) return;
    if (handed && e.isTrusted) {
      window.parent.postMessage({ type: 'bb-sticky-drop', x: e.clientX, y: e.clientY }, location.origin);
      drag = null; handed = false;
    } else if (!handed) {
      drag = null;
    }
  }, true);
})();
