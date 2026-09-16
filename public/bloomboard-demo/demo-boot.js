/**
 * BloomBoard browser demo — loads before app scripts.
 * Provides electronAPI shim, workspace bootstrap, gates, and seed data.
 */
(function () {
  'use strict';

  window.BB_WEB_DEMO = true;

  window.isDeveloperWorkspaceBypass = function () {
    return true;
  };

  var DOWNLOAD_URL =
    'https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg';

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
    try {
      var m = sessionStorage.getItem(DEMO_WS_KEY);
      if (m === 'personal' || m === 'freelance' || m === 'team') return m;
    } catch (e) {}
    return 'team';
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

  function demPersonalizeText(text) {
    if (!text) return text;
    return String(text)
      .replace(/\bFarhan\s+Fazil\b/gi, 'You')
      .replace(/\bFarhan\b/gi, 'there')
      .replace(/, there!/g, '!')
      .replace(/Hey there!/g, 'Hey!')
      .replace(/great work, there/gi, 'great work')
      .replace(/for there\b/gi, 'for you')
      .replace(/Address there by name/gi, 'Address the user warmly');
  }

  function sanitizeBloomHistory() {
    try {
      var key = 'bloombooard-bloom-history-v1';
      var hist = JSON.parse(localStorage.getItem(key) || '[]');
      var changed = false;
      hist = hist.map(function (m) {
        if (m.text) {
          var t = demPersonalizeText(m.text);
          if (t !== m.text) {
            m.text = t;
            changed = true;
          }
        }
        if (m.rawResponse) {
          var r = demPersonalizeText(m.rawResponse);
          if (r !== m.rawResponse) {
            m.rawResponse = r;
            changed = true;
          }
        }
        return m;
      });
      if (changed) localStorage.setItem(key, JSON.stringify(hist));
      return hist;
    } catch (e) {
      return [];
    }
  }

  function seedDemoNotes() {
    var now = Date.now();
    var hour = 3600000;
    try {
      localStorage.setItem(
        'bloomboard-notes-v1',
        JSON.stringify([
          {
            id: 'demo-note-1', title: 'Onboarding checklist ideas',
            body: '• Welcome email with quick-start video\n• Sample workspace pre-loaded with tasks\n• Highlight AI assistant on day 1\n• Follow-up nudge after 3 days if no boards created',
            pinned: true, pinHash: '', createdAt: now - hour * 5, updatedAt: now - hour * 2,
          },
          {
            id: 'demo-note-2', title: 'Client call notes — Acme Corp',
            body: 'Discussed Q3 renewal. They want:\n• Custom reporting export\n• SSO support\n• Dedicated Slack channel\nFollow up with pricing by Friday.',
            pinned: false, pinHash: '', createdAt: now - hour * 30, updatedAt: now - hour * 28,
          },
          {
            id: 'demo-note-3', title: 'Password vault (try locking me)',
            body: 'Server: 10.0.4.12\nAdmin panel creds are in 1Password under "Infra".\n\nClick the lock icon above to set a PIN on this note.',
            pinned: false, pinHash: '', createdAt: now - hour * 50, updatedAt: now - hour * 48,
          },
        ])
      );
      localStorage.setItem(
        'bb-trash-v1',
        JSON.stringify([
          {
            id: 'demo-trash-1', type: 'task', label: 'Old landing page copy draft',
            deletedAt: now - hour * 6,
            restoreData: { task: { id: 'demo-restored-1', title: 'Old landing page copy draft', desc: 'Superseded by v2 messaging.', notes: '', done: false, status: 'pending', priority: 'low', deadline: null, project: null, subtasks: [], createdAt: now - hour * 200, comments: [] } },
          },
          {
            id: 'demo-trash-2', type: 'task', label: 'Duplicate onboarding task',
            deletedAt: now - hour * 30,
            restoreData: { task: { id: 'demo-restored-2', title: 'Duplicate onboarding task', desc: '', notes: '', done: false, status: 'pending', priority: 'medium', deadline: null, project: null, subtasks: [], createdAt: now - hour * 220, comments: [] } },
          },
        ])
      );
    } catch (e) {}
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
      seedDemoNotes();

      localStorage.setItem('bb-workspace-mode', mode);
      localStorage.setItem('bb-workspace-onboarded', '1');
      localStorage.removeItem('bb-workspace-locked');
      localStorage.removeItem('bb-workspace-category');
      localStorage.removeItem('bb-dev-preview-product');
      localStorage.setItem('bloom-profile-name', 'You');
      sanitizeBloomHistory();

      if (mode === 'team' && typeof window.bbPurgeNonDemoChats === 'function') {
        window.bbPurgeNonDemoChats();
      }
    } catch (e) {
      console.warn('[BB Demo] ensureDemoData failed', e);
    }
  }

  function patchChatSupa() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (window._chatSupa && !window._chatSupa._demoPatched) {
        var noopAsync = function () {
          return Promise.resolve();
        };
        window._chatSupa.pullConvs = noopAsync;
        window._chatSupa.pullMsgs = noopAsync;
        window._chatSupa.pushConv = noopAsync;
        window._chatSupa.pushMsg = noopAsync;
        window._chatSupa.subscribeConv = function () {};
        window._chatSupa.sendTyping = function () {};
        window._chatSupa._demoPatched = true;
      }
      if (getDemoWorkspaceMode() === 'team' && typeof window.bbPurgeNonDemoChats === 'function') {
        window.bbPurgeNonDemoChats();
      }
      if (tries > 120) clearInterval(timer);
    }, 100);
  }

  ensureDemoData();
  patchChatSupa();

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

  function demoBloomChat(opts) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var msgs = (opts && opts.messages) || [];
        var last = msgs.length ? msgs[msgs.length - 1] : null;
        var q = last && last.content ? String(last.content).trim() : '';
        var reply =
          '{\n  "message": ' +
          JSON.stringify(
            q
              ? 'Here\'s what I\'d suggest for "' +
                  q.slice(0, 80) +
                  (q.length > 80 ? '…' : '') +
                  '". In this browser demo I handle tasks, meetings, and scheduling instantly. Download the Mac app for full AI with your real data.'
              : 'Hey! I\'m Bloom — ask me to create tasks, schedule meetings, or plan your day. Simple requests work instantly in the demo.',
            null,
            0
          ) +
          ',\n  "actions": []\n}';
        resolve({ content: [{ type: 'text', text: reply }] });
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
    uploadChatImage: rejectDemo,
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

  function addLockBadges() {
    var el = document.querySelector('#sb-email-nav-btn');
    if (el && !el.querySelector('.bb-web-demo-lock')) {
      var badge = document.createElement('span');
      badge.className = 'bb-web-demo-lock';
      badge.textContent = '🔒';
      badge.title = 'Download Mac app for full access';
      el.style.position = 'relative';
      el.appendChild(badge);
    }
    ['#sb-team-btn', '#sb-chat-btn', '.sb-nav-item.ai', '#bloom-bubble'].forEach(function (sel) {
      var node = document.querySelector(sel);
      if (!node) return;
      node.querySelectorAll('.bb-web-demo-lock').forEach(function (lock) {
        lock.remove();
      });
    });
  }

  var DEMO_WS_OPTIONS = [
    { mode: 'personal', label: 'Bloom — Personal Productivity' },
    { mode: 'freelance', label: 'Bloom — Freelance Business' },
    { mode: 'team', label: 'Team Workspace' },
  ];

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

  function applyDemoWorkspaceSwitch(mode) {
    if (mode !== 'freelance' && typeof window.closeFreelance === 'function') {
      window.closeFreelance(true);
    }

    var teamOverlays = ['team-auth-overlay', 'team-dashboard-overlay'];
    teamOverlays.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.remove('open');
        el.style.display = 'none';
      }
    });

    if (typeof window.closeBloom === 'function') {
      var bloomPanel = document.getElementById('bloom-panel');
      if (bloomPanel && bloomPanel.classList.contains('open')) {
        window.closeBloom();
      }
    }

    if (mode === 'freelance') {
      if (typeof window.applyWorkspaceShell === 'function') {
        window.applyWorkspaceShell('freelance');
      }
      if (typeof window.openFreelance === 'function') {
        window.openFreelance();
      }
    } else if (mode === 'team') {
      if (typeof window.applyWorkspaceShell === 'function') {
        window.applyWorkspaceShell('team');
      }
      var teamLayout = document.querySelector('.layout');
      if (teamLayout) teamLayout.style.display = '';
      if (typeof window.switchMainTab === 'function') {
        window.switchMainTab('tasks');
      }
    } else {
      if (typeof window.applyWorkspaceShell === 'function') {
        window.applyWorkspaceShell('personal');
      }
      var layout = document.querySelector('.layout');
      if (layout) layout.style.display = '';
      if (typeof window.switchMainTab === 'function') {
        window.switchMainTab('tasks');
      }
    }

    if (typeof window.syncWorkspaceModeUI === 'function') {
      window.syncWorkspaceModeUI();
    }
  }

  function refreshDemoWorkspaceUI() {
    var mode = getDemoWorkspaceMode();

    if (typeof window.loadTasks === 'function') window.loadTasks();
    if (typeof window.renderTaskList === 'function') window.renderTaskList();
    if (typeof window.loadEvents === 'function') window.loadEvents();
    if (typeof window.renderEvents === 'function') window.renderEvents();
    if (typeof window.renderVacations === 'function') window.renderVacations();

    if (mode === 'team' && typeof window.bbPurgeNonDemoChats === 'function') {
      window.bbPurgeNonDemoChats();
    }

    if (typeof window.updatePlanUI === 'function') {
      window.updatePlanUI(getDemoLicense().tier);
    }
    if (typeof window.syncTeamDashboardButtons === 'function') {
      window.syncTeamDashboardButtons();
    }
    if (mode === 'team') {
      if (typeof window.updateBellBadge === 'function') window.updateBellBadge();
      if (typeof window.chatUpdateUnreadBadge === 'function') window.chatUpdateUnreadBadge();
    }

    applyDemoPlanLabel();
    addLockBadges();
    fixBloomBubble();
    updateSwitcherActiveState();
  }

  window.bbDemoSwitchWorkspace = function (mode) {
    if (['personal', 'freelance', 'team'].indexOf(mode) < 0) return;
    if (_demoWsSwitching || mode === getDemoWorkspaceMode()) return;
    _demoWsSwitching = true;

    var switcher = document.getElementById('bb-demo-ws-switcher');
    var pills = switcher ? switcher.querySelectorAll('.bb-demo-ws-pill') : [];
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

    document.querySelectorAll('.bb-demo-ws-pill').forEach(function (btn) {
      var on = btn.getAttribute('data-mode') === mode;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    safetyTimer = setTimeout(finishSwitch, 1000);

    requestAnimationFrame(function () {
      setTimeout(function () {
        try {
          ensureDemoData();
          applyDemoWorkspaceSwitch(mode);
          refreshDemoWorkspaceUI();
        } catch (e) {
          console.warn('[BB Demo] workspace switch failed', e);
        }
        clearTimeout(safetyTimer);
        setTimeout(function () {
          finishSwitch();
          syncDemoSwitcherOffset();
        }, 220);
      }, 160);
    });
  };

  function updateSwitcherActiveState() {
    var current = getDemoWorkspaceMode();
    document.querySelectorAll('.bb-demo-ws-pill').forEach(function (btn) {
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

    el.innerHTML =
      '<div class="bb-demo-ws-switcher-inner">' +
      '<div class="bb-demo-ws-switcher-head">' +
      '<span class="bb-demo-ws-kicker">Browser demo</span>' +
      '<span class="bb-demo-ws-title">Switch workspace</span>' +
      '<span class="bb-demo-ws-hint">Preview solo productivity, freelance business, or team collaboration.</span>' +
      '</div>' +
      '<div class="bb-demo-ws-right-group">' +
      '<div class="bb-demo-ws-pills">' +
      pills +
      '</div>' +
      '<div id="bb-demo-ws-theme-slot"></div>' +
      '</div>' +
      '</div>';

    // Move the sidebar theme toggle pill into the topbar
    var themeEl = document.getElementById('theme-toggle-pill');
    var slot = el.querySelector('#bb-demo-ws-theme-slot');
    if (themeEl && slot) {
      slot.appendChild(themeEl);
    } else {
      // Sidebar not ready yet — retry once DOM is idle
      requestAnimationFrame(function () {
        var t = document.getElementById('theme-toggle-pill');
        var s = el.querySelector('#bb-demo-ws-theme-slot');
        if (t && s) s.appendChild(t);
      });
    }

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('.bb-demo-ws-pill');
      if (!btn || btn.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      window.bbDemoSwitchWorkspace(btn.getAttribute('data-mode'));
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
        if (personalTitle) personalTitle.textContent = 'Bloom — Personal Productivity';
        var freelanceTitle = document.querySelector('.workspace-option.freelance .workspace-option-title');
        if (freelanceTitle) freelanceTitle.textContent = 'Bloom — Freelance Business';
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

    if (document.body.classList.contains('bb-workspace-freelance') || isBloomPanelOpen()) {
      bubble.style.setProperty('display', 'none', 'important');
    } else {
      bubble.style.setProperty('display', 'flex', 'important');
    }

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
      '#drag-strip{display:none!important}' +
      '.bb-web-demo-lock{margin-left:auto;font-size:10px;opacity:.85;flex-shrink:0}' +
      '.bb-web-demo-lock-bubble{position:absolute;top:-4px;right:-4px;font-size:11px;pointer-events:none}' +
      '.layout{position:relative!important}' +
      'body.bb-web-demo-embed .layout{padding-top:0!important;height:100%!important}' +
      'body.bb-web-demo-active .layout{padding-top:0!important;min-height:100vh!important}' +
      '.main-area{position:relative!important}' +
      '#bloom-bubble{position:fixed!important;bottom:28px!important;right:28px!important;left:auto!important;top:auto!important;z-index:2500!important}' +
      'body:has(.bloom-panel.open) #bloom-bubble{display:none!important}' +
      '.boards-add-category-btn{display:none!important}' +
      '.task-card{border-left-width:4px!important}' +
      '.task-card.status-pending:not(.status-done):not(.priority-high){border-left-color:#a78bfa!important}' +
      '.task-card.status-ongoing:not(.status-done):not(.priority-high){border-left-color:#ffd60a!important}' +
      '.task-card.status-done{border-left-color:#39FF14!important}' +
      '.task-card.priority-high:not(.status-done){border-left-color:#ff453a!important}' +
      '.task-card.overdue:not(.status-done):not(.priority-high){border-left-color:#ff453a!important}' +
      'body.black-mode .task-card.status-pending:not(.status-done):not(.priority-high){border-left-color:#a78bfa!important}' +
      'body.black-mode .task-card.status-ongoing:not(.status-done):not(.priority-high){border-left-color:#ffd60a!important}' +
      'body.black-mode .task-card.status-done{border-left-color:#39FF14!important}' +
      'body.black-mode .task-card.priority-high:not(.status-done){border-left-color:#ff453a!important}' +
      'body.black-mode .task-card.overdue:not(.status-done):not(.priority-high){border-left-color:#ff453a!important}' +
      'body.light-mode .task-card.status-pending:not(.status-done):not(.priority-high){border-left-color:#8b5cf6!important}' +
      'body.light-mode .task-card.status-ongoing:not(.status-done):not(.priority-high){border-left-color:#ca8a04!important;background:rgba(255,255,255,.92)!important}' +
      'body.light-mode .task-card.status-done{border-left-color:#22c55e!important}' +
      'body.light-mode .task-card.priority-high:not(.status-done){border-left-color:#ef4444!important}' +
      'body.light-mode .task-card.overdue:not(.status-done):not(.priority-high){border-left-color:#ef4444!important}' +
      'body.light-mode .ba-section-hd{color:#4a6080!important}' +
      'body.light-mode .ba-section-hd::after{background:rgba(0,0,0,.08)!important}' +
      'body.light-mode .ba-card{background:#fff!important;border-color:rgba(0,0,0,.1)!important;box-shadow:0 1px 4px rgba(0,0,0,.06)!important}' +
      'body.light-mode .ba-card:hover{background:#f8fafc!important;border-color:rgba(37,99,235,.28)!important}' +
      'body.light-mode .ba-card-title{color:#1a2030!important}' +
      'body.light-mode .ba-card-source{color:#5a7088!important}' +
      'body.light-mode .ba-card-assignee-name{color:#059669!important}' +
      'body.light-mode .ba-card-due{color:#5a7088!important}' +
      'body.light-mode .ba-card-due.overdue{color:#dc2626!important}' +
      'body.light-mode .ba-card-priority.high{background:rgba(239,68,68,.12)!important;color:#dc2626!important}' +
      'body.light-mode .ba-card-priority.medium{background:rgba(245,158,11,.15)!important;color:#b45309!important}' +
      'body.light-mode .ba-card-priority.low{background:rgba(16,185,129,.12)!important;color:#059669!important}' +
      'body.light-mode .ba-card-status.todo{background:rgba(100,116,139,.12)!important;color:#475569!important}' +
      'body.light-mode .ba-card-status.inprogress{background:rgba(245,158,11,.15)!important;color:#b45309!important}' +
      'body.light-mode .ba-card-status.done{background:rgba(16,185,129,.12)!important;color:#059669!important}' +
      (embedHome
        ? 'html.bb-web-demo-embed,body.bb-web-demo-embed{height:100%;overflow:hidden;box-sizing:border-box}' +
          'body.bb-web-demo-embed{padding:0!important}'
        : '') +
      '.bb-web-demo-banner{position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(90deg,#0f2a52,#1a3a6a);color:#9dceff;font-size:11px;text-align:center;padding:6px 12px;border-bottom:1px solid rgba(77,159,255,.25)}' +
      ':root{--bb-demo-ws-offset:88px;--bb-demo-ws-total-offset:88px}' +
      '.bb-demo-ws-switcher{margin:0;padding:0;flex-shrink:0;width:100%}' +
      '.bb-demo-ws-switcher.bb-demo-ws-fixed{position:fixed;left:0;right:0;top:0;z-index:50000;margin:0;padding:6px 16px;pointer-events:none;background:transparent;border:none;box-shadow:none;isolation:isolate}' +
      'body.bb-web-demo-active .bb-demo-ws-switcher.bb-demo-ws-fixed{top:32px}' +
      'body.bb-has-ws-switcher.bb-web-demo-embed .layout{margin-top:var(--bb-demo-ws-total-offset,88px)!important;min-height:0!important;height:calc(100% - var(--bb-demo-ws-total-offset,88px))!important}' +
      'body.bb-has-ws-switcher.bb-web-demo-active .layout{margin-top:var(--bb-demo-ws-total-offset,120px)!important;min-height:0!important;height:calc(100vh - var(--bb-demo-ws-total-offset,120px))!important}' +
      'body.bb-has-ws-switcher #fl-overlay{top:var(--bb-demo-ws-total-offset,88px);right:0;bottom:0;left:0;height:auto;z-index:3500}' +
      'body.bb-has-ws-switcher #fl-overlay.open{z-index:3500}' +
      'body.bb-has-ws-switcher .chat-overlay,' +
      'body.bb-has-ws-switcher #chat-overlay,' +
      'body.bb-has-ws-switcher .team-overlay,' +
      'body.bb-has-ws-switcher #team-overlay,' +
      'body.bb-has-ws-switcher .boards-overlay,' +
      'body.bb-has-ws-switcher #boards-overlay{top:var(--bb-demo-ws-total-offset,88px)!important;left:0!important;right:0!important;bottom:0!important;height:auto!important}' +
      'body.bb-has-ws-switcher .chat-topbar,' +
      'body.bb-has-ws-switcher .team-topbar,' +
      'body.bb-has-ws-switcher .boards-topbar{padding-top:14px!important}' +
      'body.bb-web-demo-embed .bb-demo-ws-hint{display:none}' +
      '.bb-demo-ws-switcher-inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 14px;padding:0;border:none;border-radius:0;background:transparent;box-shadow:none;position:relative;z-index:1;pointer-events:auto}' +
      '.bb-demo-ws-switcher-head{display:flex;flex-direction:column;gap:2px;min-width:200px;flex:1}' +
      '.bb-demo-ws-kicker{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4d9fff;opacity:.9}' +
      '.bb-demo-ws-title{font-size:15px;font-weight:800;color:#e8f4ff;letter-spacing:-.02em}' +
      '.bb-demo-ws-hint{font-size:11px;color:rgba(200,220,255,.72);line-height:1.35;max-width:420px}' +
      '.bb-demo-ws-right-group{display:flex;align-items:center;gap:12px}' +
      '.bb-demo-ws-pills{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
      '.bb-demo-ws-pill{appearance:none;border:1px solid rgba(255,255,255,.16);background:#1a2438;color:#dbeafe;font-size:11px;font-weight:650;padding:8px 13px;border-radius:999px;cursor:pointer;white-space:nowrap;pointer-events:auto;position:relative;z-index:3;transition:border-color .22s ease,background .22s ease,color .22s ease,box-shadow .22s ease,opacity .22s ease}' +
      '.bb-demo-ws-pill:hover:not(:disabled){background:#243352;border-color:rgba(77,159,255,.45)}' +
      '.bb-demo-ws-pill:disabled{opacity:.65;cursor:wait}' +
      '.bb-demo-ws-pill.switching{opacity:.75}' +
      '.bb-demo-ws-pill.active{background:linear-gradient(135deg,rgba(77,159,255,.35),rgba(37,99,235,.28));border-color:rgba(96,165,250,.65);color:#fff;box-shadow:0 0 0 1px rgba(77,159,255,.25),0 6px 18px rgba(37,99,235,.22)}' +
      '.bb-demo-ws-pill[data-mode="freelance"].active{background:linear-gradient(135deg,rgba(124,58,237,.38),rgba(96,165,250,.24));border-color:rgba(167,139,250,.6);box-shadow:0 0 0 1px rgba(124,58,237,.22),0 6px 18px rgba(124,58,237,.2)}' +
      '.bb-demo-ws-pill[data-mode="team"].active{background:linear-gradient(135deg,rgba(20,184,166,.35),rgba(15,118,110,.28));border-color:rgba(45,212,191,.6);box-shadow:0 0 0 1px rgba(20,184,166,.22),0 6px 18px rgba(20,184,166,.18)}' +
      'body.light-mode .bb-demo-ws-switcher.bb-demo-ws-fixed{background:transparent;border:none}' +
      'body.light-mode .bb-demo-ws-switcher-inner{background:transparent;border:none}' +
      'body.light-mode .bb-demo-ws-kicker{color:#2563eb;opacity:1}' +
      'body.light-mode .bb-demo-ws-title{color:#0f172a}' +
      'body.light-mode .bb-demo-ws-hint{color:#475569}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill{border:1px solid rgba(15,23,42,.14);box-shadow:0 1px 2px rgba(15,23,42,.06)}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill:not(.active){color:#1e293b!important;background:#fff!important}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill:hover:not(:disabled):not(.active){background:#f1f5f9!important;color:#0f172a!important;border-color:rgba(37,99,235,.35)!important}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill.active{background:linear-gradient(135deg,#2563eb,#1d4ed8)!important;border-color:#1d4ed8!important;color:#fff!important;box-shadow:0 2px 10px rgba(37,99,235,.28)}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill[data-mode="freelance"].active{background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;border-color:#6d28d9!important;color:#fff!important;box-shadow:0 2px 10px rgba(124,58,237,.28)}' +
      'body.light-mode .bb-demo-ws-switcher .bb-demo-ws-pill[data-mode="team"].active{background:linear-gradient(135deg,#0d9488,#0f766e)!important;border-color:#0f766e!important;color:#fff!important;box-shadow:0 2px 10px rgba(13,148,136,.28)}' +
      'body.bb-workspace-freelance:not(.light-mode) .bb-demo-ws-switcher.bb-demo-ws-fixed{background:transparent}' +
      '.bb-demo-ws-transition{position:fixed;inset:0;z-index:49999;background:rgba(8,12,20,.5);opacity:0;pointer-events:none;transition:opacity .28s ease;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}' +
      '.bb-demo-ws-transition.visible{opacity:1;pointer-events:auto}' +
      'body.light-mode .bb-demo-ws-transition{background:rgba(248,250,252,.78)}' +
      'body.bb-has-ws-switcher .sidebar,body.bb-has-ws-switcher .main-area{position:relative;z-index:1}' +
      'body.bb-workspace-personal .sb-section:has(#sb-hydration){display:none!important}' +
      'body.bb-has-ws-switcher #hydration-popup{display:none!important}' +
      'body.bb-workspace-personal #tl-strip,body.bb-workspace-freelance #tl-strip{display:none!important}' +
      /* Chat read receipts */
      '.chat-receipt{display:flex;align-items:center;gap:5px;margin-top:3px;min-height:16px;font-size:10.5px;font-weight:600;color:#7d93b0;user-select:none}' +
      '.chat-receipt:empty{display:none}' +
      '.chat-receipt .rc-ic{width:14px;height:14px;flex:0 0 14px;overflow:visible;color:#7d93b0}' +
      '.chat-receipt .rc-petals circle{fill:#f9a8d4}' +
      '.chat-receipt .rc-core{fill:#fcd34d;transform-box:fill-box;transform-origin:center}' +
      '.chat-receipt .rc-petals{transform-box:fill-box;transform-origin:center}' +
      '.chat-receipt[data-state="part"] .rc-petals circle{fill:#f9a8d4;opacity:.55}' +
      '.chat-receipt[data-state="seen"] .rc-lbl,.chat-receipt[data-state="part"] .rc-lbl{color:#f9a8d4}' +
      '.chat-receipt .rc-avs{display:inline-flex}' +
      '.chat-receipt .rc-av{width:15px;height:15px;border-radius:50%;margin-left:-4px;border:1.5px solid #0f1a2c;background-size:cover;background-position:center;display:inline-grid;place-items:center;font-size:7px;font-weight:800;color:#fff;overflow:hidden}' +
      '.chat-receipt .rc-av:first-child{margin-left:0}' +
      '.chat-receipt.rc-bloom .rc-petals{animation:rcBloom .8s cubic-bezier(.2,.9,.3,1.3)}' +
      '.chat-receipt.rc-bloom .rc-core{animation:rcCore .8s ease-out}' +
      '@keyframes rcBloom{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}' +
      '@keyframes rcCore{0%{transform:scale(0);opacity:0}70%{transform:scale(1.3)}100%{transform:scale(1);opacity:1}}' +
      'body.light-mode .chat-receipt .rc-petals circle{fill:#db2777}' +
      'body.light-mode .chat-receipt .rc-core{fill:#f59e0b}' +
      'body.light-mode .chat-receipt .rc-av{border-color:#fff}' +
      '@media (prefers-reduced-motion:reduce){.chat-receipt.rc-bloom .rc-petals,.chat-receipt.rc-bloom .rc-core{animation:none}}' +
      /* What's New dialog */
      '.bb-whatsnew-list{display:grid;gap:8px;margin:12px 0 0;padding:0;list-style:none}' +
      '.bb-whatsnew-list li{position:relative;padding-left:16px;color:#e8f5ff;font-size:13px;line-height:1.45}' +
      '.bb-whatsnew-list li::before{content:"";position:absolute;left:1px;top:.55em;width:6px;height:6px;border-radius:50%;background:#7dd3fc;box-shadow:0 0 8px rgba(125,211,252,.65)}' +
      'body.light-mode .bb-whatsnew-list li{color:#123e5a}' +
      'body.light-mode .bb-whatsnew-list li::before{background:#0e7490;box-shadow:none}' +
      '.bb-whatsnew-sheet{max-width:440px}' +
      '.bb-whatsnew-emoji{font-size:26px;margin-bottom:2px}' +
      /* Resizable kanban columns */
      '.kanban-col{position:relative}' +
      '.bb-col-resize-handle{position:absolute;top:0;right:-4px;width:8px;height:100%;cursor:col-resize;z-index:5}' +
      '.bb-col-resize-handle::after{content:"";position:absolute;top:0;right:3px;width:2px;height:100%;background:transparent;transition:background .15s}' +
      '.bb-col-resize-handle:hover::after,.bb-col-resize-handle.resizing::after{background:#4d9fff}' +
      /* @mention autocomplete for task notes */
      '.bb-mention-menu{position:fixed;z-index:99999;min-width:200px;max-height:220px;overflow-y:auto;padding:5px;background:#16213a;border:1px solid rgba(255,255,255,.12);border-radius:11px;box-shadow:0 12px 32px rgba(0,0,0,.45)}' +
      '.bb-mention-opt{display:flex;align-items:center;gap:8px;width:100%;padding:7px 9px;border:none;border-radius:7px;background:transparent;text-align:left;font:inherit;font-size:12.5px;font-weight:600;color:#cbd5e1;cursor:pointer}' +
      '.bb-mention-opt:hover,.bb-mention-opt.active{background:rgba(96,165,250,.14);color:#fff}' +
      '.bb-mention-av{width:20px;height:20px;border-radius:50%;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff}' +
      'body.light-mode .bb-mention-menu{background:#fff;border-color:rgba(0,0,0,.1);box-shadow:0 12px 32px rgba(15,23,42,.18)}' +
      'body.light-mode .bb-mention-opt{color:#334155}' +
      'body.light-mode .bb-mention-opt:hover,body.light-mode .bb-mention-opt.active{background:rgba(59,130,246,.12);color:#0f172a}';
    document.head.appendChild(style);
  }

  /* ── @Mention autocomplete in task notes ── */
  var MENTION_PEOPLE = [
    { name: 'Sarah Chen', color: '#ef4444' }, { name: 'Marcus Lee', color: '#f97316' },
    { name: 'Priya Patel', color: '#f59e0b' }, { name: 'James Okonkwo', color: '#10b981' },
    { name: 'Elena Vasquez', color: '#06b6d4' }, { name: 'David Kim', color: '#3b82f6' },
    { name: 'Rachel Brooks', color: '#8b5cf6' }, { name: 'Tom Nguyen', color: '#ec4899' },
    { name: 'Aisha Rahman', color: '#84cc16' },
  ];
  var _mentionState = null; // { textarea, start, end }

  function mentionInitials(name) {
    return name.split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
  }
  function closeMentionMenu() {
    var m = document.getElementById('bb-mention-menu');
    if (m) m.remove();
    _mentionState = null;
  }
  function applyMention(person) {
    if (!_mentionState) return;
    var ta = _mentionState.textarea;
    var val = ta.value;
    var before = val.slice(0, _mentionState.start);
    var after = val.slice(_mentionState.end);
    var insert = '@' + person.name + ' ';
    ta.value = before + insert + after;
    var caret = (before + insert).length;
    ta.setSelectionRange(caret, caret);
    ta.focus();
    closeMentionMenu();
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function openMentionMenu(textarea, query, start, end) {
    closeMentionMenu();
    var matches = MENTION_PEOPLE.filter(function (p) { return p.name.toLowerCase().indexOf(query.toLowerCase()) === 0 || !query; });
    if (!matches.length) return;
    _mentionState = { textarea: textarea, start: start, end: end };
    var menu = document.createElement('div');
    menu.id = 'bb-mention-menu';
    menu.className = 'bb-mention-menu';
    matches.slice(0, 6).forEach(function (p, idx) {
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'bb-mention-opt' + (idx === 0 ? ' active' : '');
      opt.innerHTML = '<span class="bb-mention-av" style="background:' + p.color + '">' + mentionInitials(p.name) + '</span><span>' + p.name + '</span>';
      opt.onmousedown = function (e) { e.preventDefault(); applyMention(p); };
      menu.appendChild(opt);
    });
    document.body.appendChild(menu);
    var r = textarea.getBoundingClientRect();
    menu.style.left = Math.round(r.left) + 'px';
    var top = r.top - menu.offsetHeight - 6;
    menu.style.top = (top > 0 ? top : r.bottom + 6) + 'px';
  }
  function checkMentionTrigger(textarea) {
    var val = textarea.value;
    var caret = textarea.selectionStart;
    var upToCaret = val.slice(0, caret);
    var m = upToCaret.match(/@([a-zA-Z]*)$/);
    if (!m) { closeMentionMenu(); return; }
    openMentionMenu(textarea, m[1], caret - m[1].length - 1, caret);
  }
  function installMentionListeners() {
    document.addEventListener('input', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('task-notes-area')) {
        checkMentionTrigger(e.target);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMentionMenu();
    });
    document.addEventListener('mousedown', function (e) {
      var menu = document.getElementById('bb-mention-menu');
      if (menu && !menu.contains(e.target) && !(e.target.classList && e.target.classList.contains('task-notes-area'))) closeMentionMenu();
    });
  }

  /* ── Resizable kanban columns (pure DOM, works regardless of render internals) ── */
  var COL_WIDTH_KEY = 'bb-demo-col-widths';
  function loadColWidths() {
    try { return JSON.parse(localStorage.getItem(COL_WIDTH_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveColWidth(colId, width) {
    var m = loadColWidths(); m[colId] = width;
    try { localStorage.setItem(COL_WIDTH_KEY, JSON.stringify(m)); } catch (e) {}
  }
  function startColResize(handle, colEl, colId) {
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault(); e.stopPropagation();
      var startX = e.clientX;
      var startWidth = colEl.getBoundingClientRect().width;
      handle.classList.add('resizing');
      document.body.style.userSelect = 'none';
      function onMove(ev) {
        var w = Math.max(220, Math.min(520, startWidth + (ev.clientX - startX)));
        colEl.style.width = w + 'px';
        colEl.style.flexBasis = w + 'px';
      }
      function onUp() {
        handle.classList.remove('resizing');
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveColWidth(colId, parseFloat(colEl.style.width) || startWidth);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }
  /* ── Team Live strip ── */
  var TL_PEOPLE = [
    { name: 'Sarah Chen', role: 'Design Lead', status: 'live', color: '#ef4444' },
    { name: 'Marcus Lee', role: 'Engineering', status: 'live', color: '#f97316' },
    { name: 'Priya Patel', role: 'Marketing', status: 'live', color: '#f59e0b' },
    { name: 'James Okonkwo', role: 'QA', status: 'away', color: '#10b981' },
    { name: 'Elena Vasquez', role: 'Customer Success', status: 'away', color: '#06b6d4' },
    { name: 'David Kim', role: 'Data & Analytics', status: 'off', color: '#3b82f6' },
    { name: 'Rachel Brooks', role: 'Operations', status: 'off', color: '#8b5cf6' },
  ];
  var TL_STATUS_COLOR = { live: '#34d399', away: '#fbbf24', off: '#64748b' };
  function tlInitials(name) {
    return name.split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
  }
  function renderTeamLiveStrip() {
    var strip = document.getElementById('tl-strip');
    var peopleEl = document.getElementById('tl-people');
    var countEl = document.getElementById('tl-count');
    if (!strip || !peopleEl) return;
    var liveCount = TL_PEOPLE.filter(function (p) { return p.status === 'live'; }).length;
    if (countEl) countEl.textContent = liveCount + ' online';
    peopleEl.innerHTML = TL_PEOPLE.map(function (p) {
      return '<div class="tl-person s-' + (p.status === 'live' ? 'live' : p.status === 'off' ? 'off' : '') + '" title="' + p.name + ' — ' + p.role + '">' +
        '<div class="tl-avwrap" style="--tl-c:' + TL_STATUS_COLOR[p.status] + '">' +
        '<div class="tl-av" style="background:' + p.color + '">' + tlInitials(p.name) + '</div>' +
        '<span class="tl-status" style="background:' + TL_STATUS_COLOR[p.status] + '"></span>' +
        '</div>' +
        '<span class="tl-name">' + p.name.split(' ')[0] + '</span>' +
        '<span class="tl-sub">' + (p.status === 'live' ? 'Active now' : p.status === 'away' ? 'Away' : 'Offline') + '</span>' +
        '</div>';
    }).join('');
  }
  window.tlToggleCollapsed = function () {
    var strip = document.getElementById('tl-strip');
    if (!strip) return;
    var collapsed = strip.classList.toggle('tl-collapsed');
    var btn = document.getElementById('tl-collapse');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  };
  window.tlOpenChat = function () {
    if (typeof window.openChat === 'function') window.openChat();
  };
  var TL_CATCHUP_LINES = [
    'Sarah shipped the new onboarding screens — ready for your review.',
    'Marcus merged the API changes for the dashboard refresh.',
    'Priya scheduled the Q3 campaign kickoff for Monday.',
    '2 tasks were marked done since you were last online.',
  ];
  window.tlCatchUp = function () {
    if (typeof showToast !== 'function') return;
    var line = TL_CATCHUP_LINES[Math.floor(Math.random() * TL_CATCHUP_LINES.length)];
    showToast('✨ ' + line, 4200);
  };

  /* ── Handover hub ── */
  var HO_KEY = 'bb-demo-handover-v1';
  function hoEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hoInitials(name) { return name.split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase(); }
  function hoLoad() {
    try {
      var raw = localStorage.getItem(HO_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    var seed = {
      needsYou: [
        {
          id: 'ho-need-1', ownerName: 'Sarah Chen', ownerColor: '#ef4444', range: 'Away Sep 20 – Sep 24',
          items: [
            { id: 'hi-1', title: 'Review launch checklist', priority: 'high', status: 'pending' },
            { id: 'hi-2', title: 'Approve homepage copy', priority: 'medium', status: 'pending' },
            { id: 'hi-3', title: 'Update sprint board', priority: 'low', status: 'pending' },
          ],
        },
      ],
      covering: [
        { ownerName: 'James Okonkwo', ownerColor: '#10b981', count: 2, until: 'Until Sep 18' },
      ],
      sent: [
        { range: 'Away Sep 10 – Sep 12', chips: [{ type: 'cover', name: 'Marcus Lee', n: 2 }, { type: 'pending', name: 'Priya Patel', n: 1 }] },
      ],
    };
    hoSave(seed);
    return seed;
  }
  function hoSave(d) { try { localStorage.setItem(HO_KEY, JSON.stringify(d)); } catch (e) {} }
  function hoUpdateBadge() {
    var d = hoLoad();
    var pending = d.needsYou.reduce(function (n, g) { return n + g.items.filter(function (i) { return i.status === 'pending'; }).length; }, 0);
    var badge = document.getElementById('ho-badge');
    if (badge) badge.textContent = pending ? String(pending) : '';
  }
  window.hoOpenHub = function () {
    renderHoHub();
    document.getElementById('ho-overlay').classList.add('open');
  };
  window.hoCloseSheet = function () {
    document.getElementById('ho-overlay').classList.remove('open');
  };
  function renderHoHub() {
    var d = hoLoad();
    var body = document.getElementById('ho-body');
    if (!body) return;
    var needsYou = d.needsYou.filter(function (g) { return g.items.some(function (i) { return i.status === 'pending'; }); });
    var needsHtml = needsYou.map(function (g) {
      var pendingCount = g.items.filter(function (i) { return i.status === 'pending'; }).length;
      return '<div class="ho-card need"><div class="ho-card-top">' +
        '<span class="ho-av" style="background:' + g.ownerColor + '">' + hoInitials(g.ownerName) + '</span>' +
        '<div class="ho-main"><div class="ho-it-title">' + hoEsc(g.ownerName) + ' · ' + pendingCount + ' item' + (pendingCount === 1 ? '' : 's') + '</div>' +
        '<div class="ho-meta">' + hoEsc(g.range) + '</div></div>' +
        '<button class="ho-btn teal" onclick="hoReviewGroup(\'' + g.id + '\')">Review</button>' +
        '</div></div>';
    }).join('');
    var coveringHtml = d.covering.map(function (c) {
      return '<div class="ho-card"><div class="ho-card-top">' +
        '<span class="ho-av" style="background:' + c.ownerColor + '">' + hoInitials(c.ownerName) + '</span>' +
        '<div class="ho-main"><div class="ho-it-title">Covering for ' + hoEsc(c.ownerName) + ' · ' + c.count + ' item' + (c.count === 1 ? '' : 's') + '</div>' +
        '<div class="ho-meta">' + hoEsc(c.until) + '</div></div>' +
        '</div></div>';
    }).join('');
    var sentHtml = d.sent.map(function (s) {
      var chips = s.chips.map(function (c) {
        var cls = c.type === 'cover' ? 'cover' : c.type === 'pending' ? 'pending' : 'declined';
        var icon = c.type === 'cover' ? '🤝' : c.type === 'pending' ? '⏳' : '✕';
        return '<span class="ho-chip ' + cls + '">' + icon + ' ' + hoEsc(c.name) + ' · ' + c.n + '</span>';
      }).join('');
      return '<div class="ho-card"><div class="ho-it-title">' + hoEsc(s.range) + '</div><div class="ho-meta" style="margin-top:6px">' + chips + '</div></div>';
    }).join('');
    var empty = !needsHtml && !coveringHtml && !sentHtml;
    body.innerHTML =
      (empty ? '<div class="ho-empty">No active hand-overs. Start one from an upcoming leave.</div>' : '') +
      (needsHtml ? '<div class="ho-group">Needs your response</div>' + needsHtml : '') +
      (coveringHtml ? '<div class="ho-group">You’re covering</div>' + coveringHtml : '') +
      (sentHtml ? '<div class="ho-group">You handed over</div>' + sentHtml : '');
    hoUpdateBadge();
  }
  window.hoReviewGroup = function (gid) {
    var d = hoLoad();
    var group = d.needsYou.find(function (g) { return g.id === gid; });
    var body = document.getElementById('ho-body');
    if (!group || !body) return;
    var priTag = { high: 'p-high', medium: 'p-medium', low: 'p-low' };
    body.innerHTML = '<button class="ho-btn" style="margin-bottom:10px" onclick="renderHoHubGlobal()">← Back</button>' +
      '<div class="ho-group">' + hoEsc(group.ownerName) + ' · ' + hoEsc(group.range) + '</div>' +
      group.items.map(function (it) {
        if (it.status !== 'pending') {
          return '<div class="ho-row"><div class="ho-main"><div class="ho-it-title">' + hoEsc(it.title) + '</div></div>' +
            '<span class="ho-chip ' + (it.status === 'accepted' ? 'cover' : 'declined') + '">' + (it.status === 'accepted' ? '✓ Accepted' : '✕ Declined') + '</span></div>';
        }
        return '<div class="ho-row"><div class="ho-main"><div class="ho-it-title">' + hoEsc(it.title) + '</div>' +
          '<div class="ho-meta"><span class="ho-chip ' + priTag[it.priority] + '">' + it.priority + '</span></div></div>' +
          '<button class="ho-btn teal" onclick="hoRespondItem(\'' + group.id + '\',\'' + it.id + '\',\'accepted\')">Accept</button>' +
          '<button class="ho-btn red" onclick="hoRespondItem(\'' + group.id + '\',\'' + it.id + '\',\'declined\')">Decline</button>' +
          '</div>';
      }).join('');
  };
  window.hoRespondItem = function (gid, itemId, status) {
    var d = hoLoad();
    var group = d.needsYou.find(function (g) { return g.id === gid; });
    if (!group) return;
    var item = group.items.find(function (i) { return i.id === itemId; });
    if (!item) return;
    item.status = status;
    if (status === 'accepted') {
      var existing = d.covering.find(function (c) { return c.ownerName === group.ownerName; });
      if (existing) existing.count += 1;
      else {
        var endPart = group.range.split('–')[1];
        d.covering.push({ ownerName: group.ownerName, ownerColor: group.ownerColor, count: 1, until: endPart ? ('Until' + endPart) : group.range });
      }
    }
    hoSave(d);
    hoUpdateBadge();
    if (typeof showToast === 'function') showToast(status === 'accepted' ? '✅ Task accepted' : 'Declined');
    window.hoReviewGroup(gid);
  };
  window.renderHoHubGlobal = function () { renderHoHub(); };
  window.hoStartNew = function () {
    if (typeof showToast === 'function') showToast('Starting a hand-over works from an upcoming leave in the Mac app.');
  };

  function decorateKanbanColumns() {
    var wrap = document.getElementById('kanban-wrap');
    if (!wrap) return;
    var widths = loadColWidths();
    wrap.querySelectorAll('.kanban-col[data-col-id]').forEach(function (colEl) {
      var colId = colEl.getAttribute('data-col-id');
      if (widths[colId]) {
        colEl.style.width = widths[colId] + 'px';
        colEl.style.flexBasis = widths[colId] + 'px';
      }
      if (colEl.querySelector('.bb-col-resize-handle')) return;
      var handle = document.createElement('div');
      handle.className = 'bb-col-resize-handle';
      handle.title = 'Drag to resize column';
      colEl.appendChild(handle);
      startColResize(handle, colEl, colId);
    });
  }
  function watchKanbanWrap() {
    var wrap = document.getElementById('kanban-wrap');
    if (!wrap) { setTimeout(watchKanbanWrap, 700); return; }
    decorateKanbanColumns();
    var mo = new MutationObserver(function () { decorateKanbanColumns(); });
    mo.observe(wrap, { childList: true, subtree: false });
  }

  /* ── "What's New" dialog (one-time, demo highlights) ── */
  var WHATSNEW_KEY = 'bb-demo-whatsnew-seen-v1';
  var WHATSNEW_ITEMS = [
    'Colored task cards — pick a vivid surface color per task',
    'Live status pill — show teammates you’re Available, Busy, or DND',
    'Read receipts — see when teammates have seen your chat messages',
    'Typing indicators in Team Chat',
    '@Mention teammates directly in task notes',
    'Resizable task board columns',
    '“Knock” a teammate — a friendly nudge when you need them',
  ];
  window.closeDemoWhatsNew = function () {
    var m = document.getElementById('bb-whatsnew-modal');
    if (m) m.classList.remove('visible');
  };
  function showDemoWhatsNew() {
    try { if (localStorage.getItem(WHATSNEW_KEY)) return; } catch (e) {}
    if (document.querySelector('.modal-overlay.visible')) return;
    var wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.id = 'bb-whatsnew-modal';
    wrap.onclick = function (e) { if (e.target === wrap) window.closeDemoWhatsNew(); };
    wrap.innerHTML =
      '<div class="modal-sheet bb-whatsnew-sheet">' +
      '<div class="modal-topbar"><button class="modal-x-btn" onclick="closeDemoWhatsNew()">✕</button></div>' +
      '<div class="bb-whatsnew-emoji">🌿</div>' +
      '<div class="modal-title">What’s new in BloomBoard</div>' +
      '<ul class="bb-whatsnew-list">' + WHATSNEW_ITEMS.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<div style="display:flex;justify-content:center;margin-top:18px">' +
      '<button class="task-color-clear" onclick="closeDemoWhatsNew()">Got it</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('visible'); });
    try { localStorage.setItem(WHATSNEW_KEY, '1'); } catch (e) {}
  }

  function injectDemoBanner() {
    if (/[?&]embed=home/.test(location.search)) return;
    if (document.getElementById('bb-web-demo-banner')) return;
    var bar = document.createElement('div');
    bar.id = 'bb-web-demo-banner';
    bar.className = 'bb-web-demo-banner';
    bar.innerHTML =
      'Browser demo — use the <strong>Switch workspace</strong> bar at the top of the dashboard. ' +
      '<a href="' +
      DOWNLOAD_URL +
      '" target="_blank" rel="noopener noreferrer" style="color:#fff;font-weight:700;margin-left:6px">Download Mac app →</a>';
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
        showWebDemoGate(featureNameForTarget(gated));
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

  function fixBloomDomMessages() {
    sanitizeBloomHistory();
    var container = document.getElementById('bloom-messages');
    if (!container) return;
    container.querySelectorAll('.bloom-msg-bubble').forEach(function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var fixed = demPersonalizeText(node.textContent);
        if (fixed !== node.textContent) node.textContent = fixed;
      }
    });
  }

  function patchBloomMessaging() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      sanitizeBloomHistory();
      fixBloomDomMessages();

      if (typeof window.bloomSend === 'function' && !window.bloomSend._demoSanitized) {
        var origSend = window.bloomSend;
        window.bloomSend = async function () {
          await origSend.apply(this, arguments);
          setTimeout(fixBloomDomMessages, 50);
          setTimeout(fixBloomDomMessages, 500);
        };
        window.bloomSend._demoSanitized = true;
      }

      if (typeof window.bloomQuick === 'function' && !window.bloomQuick._demoSanitized) {
        var origQuick = window.bloomQuick;
        window.bloomQuick = async function () {
          await origQuick.apply(this, arguments);
          setTimeout(fixBloomDomMessages, 50);
          setTimeout(fixBloomDomMessages, 500);
        };
        window.bloomQuick._demoSanitized = true;
      }

      if (typeof window.openBloom === 'function' && !window.openBloom._demoSanitized) {
        var origOpen = window.openBloom;
        window.openBloom = function () {
          sanitizeBloomHistory();
          var result = origOpen.apply(this, arguments);
          fixBloomBubble();
          setTimeout(fixBloomDomMessages, 50);
          setTimeout(fixBloomDomMessages, 350);
          return result;
        };
        window.openBloom._demoSanitized = true;
      }

      if (typeof window.closeBloom === 'function' && !window.closeBloom._demoSanitized) {
        var origClose = window.closeBloom;
        window.closeBloom = function () {
          var result = origClose.apply(this, arguments);
          fixBloomBubble();
          return result;
        };
        window.closeBloom._demoSanitized = true;
      }

      if (tries > 150) clearInterval(timer);
    }, 120);
  }

  /* ── Sidebar status pill (Available / Busy / DND / etc) ── */
  var SB_STATUSES = [
    ['available', 'Available'], ['busy', 'Busy'], ['dnd', 'Do not disturb'],
    ['brb', 'Be right back'], ['away', 'Appear away'], ['offline', 'Appear offline']
  ];
  var SB_STATUS_KEY = 'bb-demo-my-status';
  function sbStatusKey(s) {
    s = String(s || '').toLowerCase();
    for (var i = 0; i < SB_STATUSES.length; i++) { if (SB_STATUSES[i][0] === s) return s; }
    return 'available';
  }
  function sbStatusLabel(s) {
    var k = sbStatusKey(s);
    for (var i = 0; i < SB_STATUSES.length; i++) { if (SB_STATUSES[i][0] === k) return SB_STATUSES[i][1]; }
    return 'Available';
  }
  function sbGetMyStatus() {
    try { return sbStatusKey(localStorage.getItem(SB_STATUS_KEY) || 'available'); } catch (e) { return 'available'; }
  }
  function sbSetMyStatus(k) {
    try { localStorage.setItem(SB_STATUS_KEY, sbStatusKey(k)); } catch (e) {}
    renderDemoStatusPill();
  }
  function sbCloseStatusMenu() {
    var m = document.getElementById('sb-status-menu');
    if (m) m.remove();
    document.removeEventListener('mousedown', sbStatusOutside, true);
    document.removeEventListener('keydown', sbStatusEsc, true);
  }
  function sbStatusOutside(e) {
    var m = document.getElementById('sb-status-menu');
    if (m && !m.contains(e.target) && !e.target.closest('.sb-status-btn')) sbCloseStatusMenu();
  }
  function sbStatusEsc(e) { if (e.key === 'Escape') sbCloseStatusMenu(); }

  window.sbToggleStatusMenu = function (ev) {
    if (ev) ev.stopPropagation();
    if (document.getElementById('sb-status-menu')) { sbCloseStatusMenu(); return; }
    var current = sbGetMyStatus();
    var btn = ev && ev.currentTarget;
    var menu = document.createElement('div');
    menu.id = 'sb-status-menu';
    menu.className = 'sb-status-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = SB_STATUSES.map(function (s) {
      return '<button type="button" role="menuitemradio" aria-checked="' + (s[0] === current) + '"' +
        ' class="sb-status-opt' + (s[0] === current ? ' active' : '') + '" data-status="' + s[0] + '">' +
        '<span class="team-status-dot ' + s[0] + '"></span><span>' + s[1] + '</span></button>';
    }).join('');
    menu.addEventListener('click', function (e) {
      var opt = e.target.closest('.sb-status-opt');
      if (!opt) return;
      sbCloseStatusMenu();
      sbSetMyStatus(opt.getAttribute('data-status'));
    });
    document.body.appendChild(menu);
    if (btn) {
      var r = btn.getBoundingClientRect();
      menu.style.left = Math.round(r.left) + 'px';
      menu.style.top = Math.round(r.bottom + 6) + 'px';
    }
    setTimeout(function () {
      document.addEventListener('mousedown', sbStatusOutside, true);
      document.addEventListener('keydown', sbStatusEsc, true);
    }, 0);
  };

  function renderDemoStatusPill() {
    var statusEl = document.getElementById('sb-profile-status');
    if (!statusEl) return;
    var key = sbGetMyStatus();
    statusEl.innerHTML =
      '<button type="button" class="sb-status-btn" onclick="sbToggleStatusMenu(event)" title="Change your status">' +
      '<span class="team-status-dot ' + key + '"></span>' +
      '<span>' + sbStatusLabel(key) + '</span>' +
      '<svg class="sb-status-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>';
    statusEl.style.display = 'flex';
  }

  /* ── Chat read receipts (simulated — no real backend) ── */
  var RC_BUD = '<svg class="rc-ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6c2.3 1.7 3.3 3.8 3.3 5.9A3.3 3.3 0 0 1 8 11.8a3.3 3.3 0 0 1-3.3-3.3c0-2.1 1-4.2 3.3-5.9z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 11.8v2.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var RC_BLOOM = '<svg class="rc-ic" viewBox="0 0 16 16" aria-hidden="true"><g class="rc-petals"><circle cx="8" cy="4.3" r="2.7"/><circle cx="11.5" cy="6.9" r="2.7"/><circle cx="10.2" cy="11" r="2.7"/><circle cx="5.8" cy="11" r="2.7"/><circle cx="4.5" cy="6.9" r="2.7"/></g><circle class="rc-core" cx="8" cy="8" r="2.1"/></svg>';
  var _demoReceiptState = {};

  function paintSeenReceipt(receipt, convId, animate) {
    var conv = (typeof chatLoadConvs === 'function' ? chatLoadConvs() : []).find(function (c) { return c.id === convId; });
    var me = typeof chatGetMe === 'function' ? chatGetMe() : { id: '' };
    var others = ((conv && conv.members) || []).map(String).filter(function (id) { return id !== String(me.id); });
    if (!others.length) return;
    var seenId = others[Math.floor(Math.random() * others.length)];
    var member = typeof chatMemberById === 'function' ? chatMemberById(seenId) : null;
    var name = typeof chatMemberDisplayName === 'function' ? chatMemberDisplayName(member) : 'Teammate';
    var isGroup = conv && conv.type === 'group';
    receipt.dataset.state = 'seen';
    receipt.title = 'Seen by ' + name;
    receipt.innerHTML = RC_BLOOM + '<span class="rc-lbl">' + (isGroup ? 'Seen by' : 'Seen') + '</span>' + (isGroup ? '<span class="rc-avs"></span>' : '');
    var avsWrap = receipt.querySelector('.rc-avs');
    if (avsWrap) {
      var av = document.createElement('span');
      av.className = 'rc-av';
      av.style.background = typeof chatAvatarColor === 'function' ? chatAvatarColor(seenId) : '#4d9fff';
      av.textContent = typeof chatInitials === 'function' ? chatInitials(name) : '?';
      avsWrap.appendChild(av);
    }
    if (animate) {
      receipt.classList.add('rc-bloom');
      setTimeout(function () { receipt.classList.remove('rc-bloom'); }, 900);
    }
  }

  function addDemoReceipt(convId) {
    var area = document.getElementById('chat-msgs-area');
    if (!area || typeof chatLoadMsgs !== 'function' || typeof chatGetMe !== 'function') return;
    var msgs = chatLoadMsgs(convId);
    var me = chatGetMe();
    var lastOwnIdx = -1;
    for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i].senderId === me.id) { lastOwnIdx = i; break; } }
    if (lastOwnIdx < 0) return;
    var rows = area.querySelectorAll('.chat-msg-row');
    var row = rows[lastOwnIdx];
    if (!row) return;
    var main = row.querySelector('.chat-msg-main');
    if (!main || main.querySelector('.chat-receipt')) return;
    var receipt = document.createElement('div');
    receipt.className = 'chat-receipt';
    receipt.dataset.state = 'sent';
    receipt.innerHTML = RC_BUD + '<span class="rc-lbl">Sent</span>';
    main.appendChild(receipt);

    if (_demoReceiptState[convId] === 'seen') {
      paintSeenReceipt(receipt, convId, false);
      return;
    }
    var delay = 1600 + Math.random() * 2200;
    setTimeout(function () {
      _demoReceiptState[convId] = 'seen';
      paintSeenReceipt(receipt, convId, true);
    }, delay);
  }

  function patchChatReceipts() {
    if (typeof window.renderChatMessages !== 'function' || window.renderChatMessages._demoPatched) return;
    var orig = window.renderChatMessages;
    var patched = function (convId) {
      orig.apply(this, arguments);
      try { addDemoReceipt(convId); } catch (e) {}
    };
    patched._demoPatched = true;
    window.renderChatMessages = patched;
  }

  /* ── Typing indicator simulation ── */
  var TYPING_NAMES = ['Sarah Chen', 'Marcus Lee', 'Priya Patel', 'James Cole', 'Elena Vasquez'];
  function scheduleDemoTyping() {
    var delay = 14000 + Math.random() * 20000;
    setTimeout(function () {
      var area = document.getElementById('chat-msgs-area');
      if (area && area.offsetParent !== null && typeof window.chatShowPeerTyping === 'function') {
        var name = TYPING_NAMES[Math.floor(Math.random() * TYPING_NAMES.length)];
        window.chatShowPeerTyping('demo-typer-' + name.replace(/\s+/g, ''), name);
      }
      scheduleDemoTyping();
    }, delay);
  }

  /* ── "Knock" — nudge a teammate (Team page) ── */
  var KNOCK_REPLIES = ['Hey! Give me a sec 👋', 'On it — be right there', 'Sure, what’s up?', '👍 omw'];
  var KNOCK_NAMES = ['Sarah Chen', 'Marcus Lee', 'Priya Patel', 'James Cole', 'Elena Vasquez'];

  window.demoKnockMember = function (name) {
    if (typeof showToast !== 'function') return;
    showToast('👋 Knocked on ' + name);
    var reply = KNOCK_REPLIES[Math.floor(Math.random() * KNOCK_REPLIES.length)];
    setTimeout(function () {
      showToast(name + ': ' + reply, 3200);
    }, 1800 + Math.random() * 1600);
  };

  function decorateTeamKnockButtons() {
    var grid = document.getElementById('team-members-grid');
    if (!grid) return;
    grid.querySelectorAll('.team-member-card').forEach(function (card) {
      if (card.classList.contains('team-card-me')) return;
      var actions = card.querySelector('.team-member-actions');
      if (!actions || actions.querySelector('.demo-knock-btn')) return;
      var nameEl = card.querySelector('.team-member-name');
      var name = nameEl ? nameEl.textContent.trim() : 'Teammate';
      var btn = document.createElement('button');
      btn.className = 'team-mem-btn demo-knock-btn';
      btn.style.color = '#4d9fff';
      btn.textContent = '👋 Knock';
      btn.onclick = function (e) { e.stopPropagation(); window.demoKnockMember(name); };
      actions.appendChild(btn);
    });
  }
  function watchTeamGrid() {
    var grid = document.getElementById('team-members-grid');
    if (!grid) { setTimeout(watchTeamGrid, 700); return; }
    decorateTeamKnockButtons();
    var mo = new MutationObserver(function () { decorateTeamKnockButtons(); });
    mo.observe(grid, { childList: true, subtree: false });
  }
  function scheduleIncomingKnock() {
    var delay = 32000 + Math.random() * 38000;
    setTimeout(function () {
      var grid = document.getElementById('team-members-grid');
      if (grid && grid.offsetParent !== null && typeof showToast === 'function') {
        var name = KNOCK_NAMES[Math.floor(Math.random() * KNOCK_NAMES.length)];
        showToast('👋 ' + name + ' knocked on you — got a minute?', 4200);
      }
      scheduleIncomingKnock();
    }, delay);
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
    patchBloomMessaging();
    watchBloomBubble();
    interceptGatedClicks();
    var drag = document.getElementById('drag-strip');
    if (drag) drag.style.display = 'none';
    fixBloomBubble();
    renderDemoStatusPill();
    patchChatReceipts();
    scheduleDemoTyping();
    watchTeamGrid();
    scheduleIncomingKnock();
    watchKanbanWrap();
    installMentionListeners();
    renderTeamLiveStrip();
    hoUpdateBadge();
    setTimeout(showDemoWhatsNew, 2600);
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
