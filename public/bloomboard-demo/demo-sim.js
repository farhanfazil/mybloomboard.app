/**
 * BloomBoard web demo — living team simulation (spec §17).
 * Teammates chat, knock, answer knocks, type back and drift on/offline, all by
 * writing to the fake Supabase in demo-supabase.js so the app reacts exactly as
 * it would to real teammates. Team workspace only; paused while the tab is hidden.
 */
(function () {
  'use strict';

  var demo = window.__bbDemo;
  if (!demo || !demo.signedIn()) return;

  var ID = demo.IDS;
  var ME = ID.me;
  /* Roster and rooms come from the team seed (demo-seed.js). */
  var MATES = demo.roster || [];
  var ROOMS = demo.rooms || [];
  /* Teammates on leave today stay out of chat and knocks. */
  var AWAY = demo.onLeave || [];
  var LIVE_ROOMS = demo.liveRooms || [];
  if (!MATES.length) return;
  var LINES = [
    '🎉', 'Can you check the latest export?', '🔥🔥', 'Approved 👍', 'Sending the file now', '😂',
    'Call in 5?', '❤️', 'The banner looks great 👏', 'Updated the sheet', '🚀',
    'Need the logo in white please', '👀', 'Done ✅', 'Thanks!',
  ];
  var REPLIES = ['On it 👍', 'Sounds good!', 'Got it, thanks', 'Give me 10 mins', '👍', 'Perfect 🙌', 'Will check now'];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var lineIdx = Math.floor(Math.random() * LINES.length);
  var knockCooldown = {};
  var selfSending = false;
  var busyReplying = {};

  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function dmId(other) { return 'dm_' + [ME, other].sort().join('_'); }
  function mate(id) { return MATES.filter(function (m) { return m.id === id; })[0]; }
  function hidden() { return document.visibilityState === 'hidden'; }
  function activeConvId() {
    try { return typeof window._chatActiveConvId === 'string' ? window._chatActiveConvId : null; } catch (e) { return null; }
  }
  function isOnline(id) { return !offline[id] && AWAY.indexOf(id) < 0; }
  /* Someone on Focus or "Back at" doesn't knock or wave. */
  function isFree(id) {
    if (!isOnline(id)) return false;
    var row = demo.rows('team_members').filter(function (r) { return r.user_id === id; })[0];
    return !row || (row.status !== 'dnd' && row.status !== 'brb' && row.status !== 'busy');
  }

  /* A timer that waits out hidden-tab time instead of firing into a background tab. */
  function later(ms, fn) {
    setTimeout(function tick() {
      if (hidden()) { setTimeout(tick, 1500); return; }
      fn();
    }, ms);
  }

  function postMessage(convId, from, text) {
    var ts = Date.now();
    demo.insert('messages', {
      id: demo.uuid(), conversation_id: convId, sender_id: from.id, sender_name: from.name,
      html: text, text_content: text, ts: ts, reactions: {},
      created_at: new Date(ts).toISOString(), updated_at: new Date(ts).toISOString(),
    });
    demo.update('conversations', { id: convId }, { last_msg_text: text, last_msg_ts: ts });
  }

  function typing(convId, from) {
    demo.broadcast('team_live_', 'typing', { from: from.id, convId: convId });
    demo.broadcast('chat_conv_' + convId, 'typing', { convId: convId, userId: from.id, name: from.name });
  }

  /* ── Ambient chatter: every 18–28 s, into a chat the visitor isn't reading ── */
  var storyChats = 0, storyEndedAt = 0;
  function ambientChat() {
    if (storyRunning && storyChats >= 1) { later(5000, ambientChat); return; }
    if (storyRunning) storyChats++;
    var from = pick(MATES.filter(function (m) { return isOnline(m.id); })) || MATES[0];
    var options = [dmId(from.id)].concat(ROOMS).filter(function (c) { return c !== activeConvId(); });
    if (options.length) {
      postMessage(pick(options), from, LINES[lineIdx % LINES.length]);
      lineIdx++;
    }
    later(rand(18000, 28000), ambientChat);
  }

  /* ── A teammate knocks every 75–95 s ── */
  function incomingKnock() {
    if (storyRunning || Date.now() - storyEndedAt < 20000) { later(8000, incomingKnock); return; }
    var from = pick(MATES.filter(function (m) { return isFree(m.id); }));
    if (from) {
      var knockId = demo.uuid();
      demo.broadcast('team_live_', 'knock', { id: knockId, from: from.id, to: ME, at: Date.now() });
      /* Unanswered knocks withdraw after a minute so they never pile up on the dashboard. */
      setTimeout(function () {
        demo.broadcast('team_live_', 'knock_reply', { id: knockId, from: from.id, to: ME, answer: 'cancel' });
      }, 60000);
    }
    /* Longer than the 1-minute lifetime, so knocks never stack up. */
    later(rand(75000, 95000), incomingKnock);
  }

  /* ── Visitor knocks a teammate: 70% come in, 20% five minutes, 10% silence ── */
  demo.onBroadcast(function (topic, event, p) {
    if (topic.indexOf('team_live_') !== 0 || event !== 'knock' || !p || !mate(p.to)) return;
    var who = p.to;
    if (knockCooldown[who] && Date.now() - knockCooldown[who] < 30000) return;
    knockCooldown[who] = Date.now();
    var roll = Math.random();
    if (roll >= 0.9) return; /* the app shows "No answer" on its own timeout */
    var answer = roll < 0.7 ? 'in' : 'soon';
    later(rand(3000, 6000), function () {
      demo.broadcast('team_live_', 'knock_reply', { id: p.id, from: who, to: ME, answer: answer });
    });
  });

  /* ── Visitor sends a message: typing after 1.5 s, reply after 3 s ── */
  demo.onChange(function (table, type, row) {
    if (table !== 'messages' || type !== 'INSERT' || !row || row.sender_id !== ME) return;
    if (selfSending) return;
    var convId = row.conversation_id;
    if (busyReplying[convId]) return;
    var conv = demo.rows('conversations').filter(function (c) { return c.id === convId; })[0];
    var members = conv && Array.isArray(conv.members) ? conv.members : [];
    var from = pick(MATES.filter(function (m) { return members.indexOf(m.id) >= 0; }));
    if (!from) return;
    busyReplying[convId] = true;
    later(1500, function () {
      typing(convId, from);
      later(1500, function () {
        busyReplying[convId] = false;
        postMessage(convId, from, pick(REPLIES));
      });
    });
  });

  /* ── Presence: everyone online at launch, someone occasionally steps away ── */
  var offline = {};
  demo.presenceDefaults['team_live_'] = {};
  /* People on leave stay offline, so the office shows "On leave · back …". */
  MATES.forEach(function (m) {
    if (AWAY.indexOf(m.id) < 0) demo.presenceDefaults['team_live_'][m.id] = { idle: false, at: Date.now() };
  });

  function presenceDrift() {
    var m = pick(MATES.filter(function (x) { return AWAY.indexOf(x.id) < 0; }));
    if (offline[m.id]) {
      delete offline[m.id];
      demo.setPresence('team_live_', m.id, { idle: false, at: Date.now() });
    } else if (Math.random() < 0.5) {
      demo.setPresence('team_live_', m.id, { idle: true, at: Date.now() });
      later(rand(20000, 40000), function () { demo.setPresence('team_live_', m.id, { idle: false, at: Date.now() }); });
    } else {
      offline[m.id] = true;
      demo.setPresence('team_live_', m.id, null);
      later(rand(25000, 45000), function () {
        if (!offline[m.id]) return;
        delete offline[m.id];
        demo.setPresence('team_live_', m.id, { idle: false, at: Date.now() });
      });
    }
    later(rand(50000, 80000), presenceDrift);
  }

  /* ── Team Space: who's talking in the live rooms, in turns of 6–10 s ── */
  function liveCalls() {
    return demo.rows('bloom_calls').filter(function (c) { return c.status === 'active'; });
  }
  function joinedIn(call) {
    var st = call.invite_state || {};
    return (call.participant_ids || []).filter(function (id) { return st[id] === 'joined'; });
  }
  function speaking() {
    var calls = liveCalls();
    var call = calls.length ? pick(calls) : null;
    var inside = call ? joinedIn(call).filter(function (id) { return id !== ME; }) : [];
    var turn = rand(6000, 10000);
    if (inside.length) {
      var who = pick(inside);
      /* One speaking turn of 6–10 s. The app clears a speaker 3 s after the last
         signal, so repeat it every 2 s; that way the sidebar's Enter office button
         (which checks every 3 s) can show "Maya talking". */
      var until = Date.now() + turn;
      (function keepTalking() {
        if (Date.now() >= until) { demo.broadcast('team_live_', 'speaking', { from: who, on: false }); return; }
        demo.broadcast('team_live_', 'speaking', { from: who, on: true });
        setTimeout(keepTalking, 2000);
      })();
    }
    later(turn + rand(2000, 5000), speaking);
  }

  /* ── Walking in and out: a guest leaves a live room or comes back ── */
  function setInRoom(room, id, inside) {
    var call = liveCalls().filter(function (c) { return c.conversation_id === room.conv; })[0];
    if (!call) return;
    var ids = (call.participant_ids || []).filter(function (x) { return x !== id; });
    var st = Object.assign({}, call.invite_state || {});
    if (inside) { ids.push(id); st[id] = 'joined'; } else { st[id] = 'left'; }
    demo.update('bloom_calls', { id: call.id }, { participant_ids: ids, invite_state: st, updated_at: new Date().toISOString() });
  }
  function roomShuffle() {
    var room = LIVE_ROOMS.length ? pick(LIVE_ROOMS) : null;
    var call = room && liveCalls().filter(function (c) { return c.conversation_id === room.conv; })[0];
    if (call) {
      var guest = pick(room.guests);
      setInRoom(room, guest, joinedIn(call).indexOf(guest) < 0);
    }
    later(rand(25000, 40000), roomShuffle);
  }

  /* ── Now and then a teammate waves at the visitor ── */
  function incomingWave() {
    if (storyRunning || Date.now() - storyEndedAt < 30000) { later(8000, incomingWave); return; }
    var from = pick(MATES.filter(function (m) { return isFree(m.id); }));
    if (from) demo.broadcast('team_live_', 'wave', { from: from.id, to: ME, at: Date.now() });
    later(rand(100000, 150000), incomingWave);
  }

  /* ── Visitor waves: usually a wave back. Visitor knocks on a room: someone inside answers ── */
  demo.onBroadcast(function (topic, event, p) {
    if (topic.indexOf('team_live_') !== 0 || !p || p.from !== ME) return;
    if (event === 'wave' && mate(p.to) && Math.random() < 0.7) {
      later(rand(3000, 6000), function () {
        demo.broadcast('team_live_', 'wave', { from: p.to, to: ME, at: Date.now() });
      });
    }
    if (event === 'room_knock') {
      var call = liveCalls().filter(function (c) { return c.conversation_id === p.conv || c.id === p.call; })[0];
      var inside = call ? joinedIn(call).filter(function (id) { return id !== ME; }) : [];
      if (!inside.length) return;
      var who = pick(inside);
      later(rand(3000, 6000), function () {
        demo.broadcast('team_live_', 'room_knock_reply', {
          from: who, to: ME, answer: Math.random() < 0.8 ? 'in' : 'not_now', conv: String(p.conv || ''),
        });
      });
    }
  });

  /* Alive from the start but not busy: the first message about 8 s in (so visitors see
     how a message arrives on the dashboard), then one every 18–28 s. A knock about 25 s
     in, then every 75–95 s. */
  later(20000, ambientChat);
  later(reduceMotion ? 60000 : 25000, incomingKnock);
  later(60000, presenceDrift);
  if (LIVE_ROOMS.length) {
    later(6000, speaking);
    /* Priya steps out of the Lounge early, so her tile shows what she is working on. */
    later(15000, function () { setInRoom(LIVE_ROOMS[1] || LIVE_ROOMS[0], (LIVE_ROOMS[1] || LIVE_ROOMS[0]).guests[0], false); });
    later(45000, roomShuffle);
  }
  later(reduceMotion ? 120000 : 55000, incomingWave);

  /* ── Drag and drop on the board ──
     A cursor picks a card up and drops it in the next column, so visitors see
     the board is drag-and-drop. It only plays while the board is on screen and
     the visitor has been still for a moment; otherwise the move just happens. */
  var lastInput = 0;
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastInput = Date.now(); }, { passive: true, capture: true });
  });
  function boardCol(status) {
    return [].slice.call(document.querySelectorAll('.kb-board .kb-col[data-colid="' + status + '"]')).filter(function (c) { return c.offsetParent; })[0] || null;
  }
  function boardCard(id) {
    return [].slice.call(document.querySelectorAll('.kb-board .swipe-outer[data-taskid="' + id + '"]')).filter(function (c) { return c.offsetParent; })[0] || null;
  }
  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.top > 70 && r.bottom < window.innerHeight - 10;
  }
  function busyScreen() {
    return [].slice.call(document.querySelectorAll('.modal-overlay.open, .modal.open, #task-modal.open, .kb-col.drag-over, .dragging'))
      .some(function (el) { return el.offsetParent || getComputedStyle(el).position === 'fixed' && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden'; });
  }
  var ghost = null;
  function ghostCursor(label) {
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.id = 'bb-demo-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;pointer-events:none;opacity:0;transition:transform .9s cubic-bezier(.65,0,.35,1),opacity .25s';
      ghost.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
        '<span style="position:absolute;left:16px;top:18px;white-space:nowrap;font:600 12px/1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#fff;background:#111;border-radius:6px;padding:5px 8px"></span>';
      document.body.appendChild(ghost);
    }
    var tag = ghost.querySelector('span');
    tag.textContent = label || '';
    tag.style.display = label ? '' : 'none';
    return ghost;
  }
  function placeGhost(x, y, instant) {
    ghost.style.transition = instant ? 'none' : 'transform .9s cubic-bezier(.65,0,.35,1),opacity .25s';
    ghost.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  /* Returns false (and does nothing) when the drag can't be shown right now. */
  function dragCard(id, toStatus, label, drop) {
    if (reduceMotion || hidden() || scripting || busyScreen() || Date.now() - lastInput < 1500) return false;
    var card = boardCard(id), col = boardCol(toStatus);
    if (!card || !col || !onScreen(card)) return false;
    var r = card.getBoundingClientRect();
    var last = [].slice.call(col.querySelectorAll('.swipe-outer')).filter(function (c) { return c.offsetParent; }).pop();
    var hd = col.querySelector('.kb-col-hd');
    var lr = last ? last.getBoundingClientRect() : null, cr = col.getBoundingClientRect();
    var tx = cr.left + 8, ty = lr ? lr.bottom + 8 : (hd ? hd.getBoundingClientRect().bottom + 8 : cr.top + 56);
    if (ty + r.height > window.innerHeight - 10) ty = Math.max(cr.top + 56, window.innerHeight - 10 - r.height);
    if (ty < 70 || ty + r.height > window.innerHeight - 10) return false;

    var g = ghostCursor(label);
    var gx = r.left + 36, gy = r.top + r.height / 2;
    placeGhost(gx + 140, gy + 90, true);
    void g.offsetWidth;
    g.style.opacity = '1';
    placeGhost(gx, gy);
    later(1000, function () {
      if (!document.body.contains(card)) { g.style.opacity = '0'; return; }
      var clone = card.cloneNode(true);
      clone.classList.add('bbd-clone');
      clone.removeAttribute('data-taskid');
      clone.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;overflow:hidden;margin:0;z-index:9998;pointer-events:none;' +
        'transition:transform .9s cubic-bezier(.65,0,.35,1),opacity .2s;box-shadow:0 10px 24px rgba(0,0,0,.28);border-radius:12px';
      /* Inside a board-like wrapper so the board's card styles still apply. */
      var host = document.createElement('div');
      host.className = 'kb-board bbd-clone-host';
      host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:9998;pointer-events:none';
      host.innerHTML = '<div class="kb-col-body"></div>';
      host.firstChild.appendChild(clone);
      document.body.appendChild(host);
      card.style.opacity = '.3';
      void clone.offsetWidth;
      clone.style.transform = 'rotate(-1.5deg) scale(1.02)';
      later(220, function () {
        var dx = tx - r.left, dy = ty - r.top;
        clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(-1.5deg) scale(1.02)';
        placeGhost(gx + dx, gy + dy);
        later(1000, function () {
          clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
          later(160, function () {
            try { drop(); } catch (e) {}
            card.style.opacity = '';
            clone.style.opacity = '0';
            later(220, function () { host.remove(); });
            later(500, function () { g.style.opacity = '0'; });
          });
        });
      });
    });
    return true;
  }
  /* Keep trying for a while; give up quietly if the board never shows. */
  function whenPossible(tries, attempt, fallback) {
    if (attempt()) return;
    if (tries <= 0) { if (fallback) fallback(); return; }
    later(4000, function () { whenPossible(tries - 1, attempt, fallback); });
  }
  function moveMine(id, toStatus) {
    try { if (typeof window.kbMoveTaskToColumn === 'function') window.kbMoveTaskToColumn(id, toStatus); } catch (e) {}
  }

  /* ── Image attachments ──
     A file is dragged in from the side of the board and dropped on a card,
     the way a file from the desktop would be. The app's own attach code
     takes it from there, so the card gets the real cover thumbnail. */
  var FILES = {
    hero: 'hero-v3.jpg',
    banners: 'banners-final.jpg',
    deck: 'launch-deck-p6.jpg',
  };
  function attachFile(id, key) {
    var name = FILES[key];
    if (!name || typeof window.bbAttachFilesToTask !== 'function') return;
    fetch('demo-files/' + name).then(function (r) { return r.blob(); }).then(function (b) {
      return window.bbAttachFilesToTask(id, [new File([b], name, { type: 'image/jpeg', lastModified: Date.now() })]);
    }).catch(function () {});
  }
  /* Returns false (and does nothing) when the drop can't be shown right now. */
  function dropFile(id, key, label) {
    if (reduceMotion || hidden() || scripting || busyScreen() || Date.now() - lastInput < 1500) return false;
    var card = boardCard(id);
    if (!card || !onScreen(card)) return false;
    var r = card.getBoundingClientRect();
    var tx = r.left + r.width / 2 - 70, ty = r.top + Math.min(r.height / 2, 40) - 20;
    var sx = window.innerWidth + 20, sy = Math.max(90, ty - 120);

    var chip = document.createElement('div');
    chip.className = 'bbd-file';
    chip.innerHTML = '<img src="demo-files/' + FILES[key] + '" alt=""><span>' + FILES[key] + '</span>';
    chip.style.transform = 'translate(' + sx + 'px,' + sy + 'px) rotate(-3deg)';
    document.body.appendChild(chip);
    var g = ghostCursor(label);
    placeGhost(sx + 110, sy + 34, true);
    void chip.offsetWidth;
    g.style.opacity = '1';
    chip.style.opacity = '1';
    chip.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(-3deg)';
    placeGhost(tx + 110, ty + 34);
    later(700, function () { card.classList.add('kb-file-over'); });
    later(1150, function () {
      card.classList.remove('kb-file-over');
      chip.style.transition = 'transform .2s ease-out,opacity .2s';
      chip.style.transform = 'translate(' + tx + 'px,' + (ty + 6) + 'px) scale(.9)';
      chip.style.opacity = '0';
      if (document.body.contains(card)) attachFile(id, key);
      later(260, function () { chip.remove(); });
      later(500, function () { g.style.opacity = '0'; });
    });
    return true;
  }
  function forgetAttachments(keep) {
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k && k.indexOf('bb-task-attach-') === 0 && !(keep && keep[k.slice(15)])) localStorage.removeItem(k);
      }
    } catch (e) {}
  }

  /* About 40 s in, Maya finishes the banners she was given and sends them to Sam
     for review: her cursor drags the card into In Review and a notification arrives. */
  function mayaToReview() {
    var tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('bbd-dash-tasks') || '[]') || []; } catch (e) { return; }
    var t = tasks.filter(function (x) { return x.id === MAYA_TASK; })[0];
    if (!t || t.status === 'review' || t.status === 'done') return;
    t.status = 'review';
    t.updatedAt = Date.now();
    localStorage.setItem('bbd-dash-tasks', JSON.stringify(tasks));
    try { if (typeof window.loadTasks === 'function') window.loadTasks(); } catch (e) {}
    try { if (typeof window.renderAll === 'function') window.renderAll(); } catch (e) {}
    demo.insert('notifications', {
      id: demo.uuid(), team_id: ID.team, recipient_id: ME, actor_id: ID.maya, actor_name: 'Maya Chen',
      type: 'task', entity_type: 'task', entity_id: t.id, read: false,
      body: 'sent a task for your review: "' + t.title + '"', created_at: new Date().toISOString(),
    });
  }
  /* The board keeps moving: about 10 s in a card goes from To Do to In Progress,
     Maya then sends the banners to In Review, and after that a card moves every
     10 to 15 s (To Do to In Progress, In Progress to In Review, In Review to Done)
     until the board has nothing left to move. */
  var shownHint = false;
  var STEPS = [['pending', 'ongoing'], ['ongoing', 'review'], ['review', 'done']];
  var stepIdx = 0;
  function firstCardIn(status, prefer) {
    var col = boardCol(status);
    if (!col) return null;
    var el = (prefer && col.querySelector('.swipe-outer[data-taskid="' + prefer + '"]')) || col.querySelector('.swipe-outer');
    return el ? el.getAttribute('data-taskid') : null;
  }
  function mateName() {
    var free = MATES.filter(function (m) { return isOnline(m.id); });
    var m = free.length ? pick(free) : null;
    return m && m.name ? m.name : '';
  }
  /* One move; returns false when it can't play yet (so the caller retries soon). */
  function nextMove() {
    for (var k = 0; k < STEPS.length; k++) {
      var st = STEPS[(stepIdx + k) % STEPS.length];
      var id = firstCardIn(st[0]);
      if (!id) continue;
      var label = st[0] === 'pending' ? (shownHint ? '' : 'Drag cards to move them') : mateName();
      var ok = dragCard(id, st[1], label, function () { moveMine(id, st[1]); });
      if (ok) { shownHint = true; stepIdx = (stepIdx + k + 1) % STEPS.length; }
      return ok ? 'moved' : 'wait';
    }
    return 'empty';
  }
  function boardLoop() {
    if (STORY) { boardRound(); return; }
    var r = nextMove();
    if (r === 'empty') return;
    later(r === 'moved' ? rand(10000, 15000) : 2000, boardLoop);
  }

  /* ── The board keeps living ──
     A round every 8 to 12 s after the last: three new tasks are typed
     into Type Your Tasks and organised into To Do, then work moves along
     (To Do to In Progress, In Progress to In Review, In Review to Done, three
     times). Done keeps the latest two, so the board never fills up or runs dry. */
  var POOL = [
    'Draft the newsletter for Thursday with @priya',
    'Book the team lunch next Friday',
    'Update the pricing table tomorrow',
    'Check the App Store reviews today at 4pm',
    'Plan the roadmap session next Tuesday with @leo',
    'Send the contract to Brightlane by Monday',
    'Export the hero images tomorrow at 11am with @nora',
    'Reply to the client feedback today',
    'Record the product walkthrough on Thursday',
    'Prepare the sprint review for Friday with @ethan',
    'Order new business cards next week',
    'Test the signup flow tomorrow with @chloe',
  ];
  var poolIdx = 0;
  function nextLines() {
    var out = [], k = 3;
    for (var i = 0; i < k; i++) { out.push(POOL[poolIdx % POOL.length]); poolIdx++; }
    return out;
  }
  function colCount(colid) {
    var c = boardCol(colid);
    return c ? c.querySelectorAll('.swipe-outer').length : 0;
  }
  function trimDone(keep) {
    var all = storedTasks();
    var done = all.filter(function (t) { return t.status === 'done'; })
      .sort(function (a, b) { return (a.completedAt || 0) - (b.completedAt || 0); });
    if (done.length <= keep) return;
    var drop = {};
    done.slice(0, done.length - keep).forEach(function (t) { drop[t.id] = 1; });
    localStorage.setItem('bbd-dash-tasks', JSON.stringify(all.filter(function (t) { return !drop[t.id]; })));
    Object.keys(drop).forEach(function (id) { try { localStorage.removeItem('bb-task-attach-' + id); } catch (e) {} });
    try { if (typeof window.loadTasks === 'function') window.loadTasks(); } catch (e) {}
    try { if (typeof window.renderAll === 'function') window.renderAll(); } catch (e) {}
  }
  function roundMoves(fresh, done) {
    /* Three passes of To Do to In Progress, In Progress to In Review, In Review
       to Done: as many cards move along as were added, so the columns stay even. */
    var pass = [['pending', 'ongoing'], ['ongoing', 'review'], ['review', 'done']];
    var plan = pass.concat(pass, pass);
    var i = 0;
    function step(stalls) {
      if (i >= plan.length) { done(); return; }
      var p = plan[i], id = firstCardIn(p[0]);
      if (!id) { i++; step(0); return; }
      if (dragCard(id, p[1], Math.random() < 0.5 ? mateName() : '', function () { moveMine(id, p[1]); })) {
        i++;
        later(2400 + rand(500, 900), function () { step(0); });
        return;
      }
      if (hidden() || busyScreen() || Date.now() - lastInput < 1500 || stalls < 3) { later(1500, function () { step(stalls + 1); }); return; }
      /* Out of sight: move it quietly so the board keeps flowing. */
      i++;
      moveMine(id, p[1]);
      later(800, function () { step(0); });
    }
    later(fresh ? 1400 : 0, function () { step(0); });
  }
  /* Now and then an image is dropped on a card, but only while fewer than
     two cards on the board have one: never bare, never full of pictures. */
  function maybeDrop(done) {
    var cards = [].slice.call(document.querySelectorAll('.kb-board .swipe-outer[data-taskid]')).filter(function (c) {
      var col = c.closest('.kb-col');
      return c.offsetParent && onScreen(c) && col && col.getAttribute('data-colid') !== 'done';
    });
    var withCover = document.querySelectorAll('.kb-board:not(.bbd-clone-host) .task-cover').length;
    var bare = cards.filter(function (c) { return !c.querySelector('.task-cover'); });
    if (withCover >= 2 || !bare.length || Math.random() < 0.4) { done(); return; }
    var keys = Object.keys(FILES), key = keys[Math.floor(Math.random() * keys.length)];
    var id = bare[Math.floor(Math.random() * bare.length)].getAttribute('data-taskid');
    if (dropFile(id, key, Math.random() < 0.5 ? mateName() : '')) later(2600, done);
    else done();
  }
  function boardRound() {
    if (hidden()) { later(3000, boardRound); return; }
    function next() { later(rand(8000, 12000), function () { maybeDrop(boardRound); }); }
    trimDone(2);
    var n = document.getElementById('t2t-input'), card = document.getElementById('t2t-dashboard-card');
    var canType = n && card && !n.value && document.activeElement !== n && fullyVisible(card) && !busyScreen() &&
      Date.now() - lastInput > 3000 && colCount('pending') < 5;
    if (!canType) { roundMoves(false, next); return; }
    t2tWalk(nextLines().join('\n'), function (ids) {
      if (ids && ids.length) popNew(ids);
      roundMoves(!!(ids && ids.length), next);
    }, 2000);
  }
  /* Maya sends the banners to In Review, with a notification; then the
     slow loop takes over. */
  var MAYA_TASK = 'demo-t-banners';
  function mayaTurn() {
    var where = boardCard(MAYA_TASK) && boardCard(MAYA_TASK).closest('.kb-col');
    if (!where || where.getAttribute('data-colid') !== 'ongoing') { stepIdx = 0; boardLoop(); return; }
    if (!dragCard(MAYA_TASK, 'review', 'Maya Chen', mayaToReview)) { later(2000, mayaTurn); return; }
    stepIdx = 0;
    later(rand(10000, 15000), boardLoop);
  }
  function afterMoves() {
    later(1500, function () {
      later(800, addTaskHint);
      later(rand(10000, 15000), mayaTurn);
    });
  }
  /* Without the fill (reduced motion): just the first move, then the rest. */
  function firstMoves() {
    var id = firstCardIn('pending', 'demo-t-banners');
    if (id && !dragCard(id, 'ongoing', 'Drag cards to move them', function () { moveMine(id, 'ongoing'); })) { later(2000, firstMoves); return; }
    shownHint = true;
    afterMoves();
  }

  /* ── The story: how anyone starts with BloomBoard ──
     The board starts empty. When the demo comes into view it types five tasks
     into Type Your Tasks, presses Organise (dates and @names are picked up),
     adds them all to To Do, then works through them: In Progress, In Review,
     Done. Maya finishes with her banners and a notification. Once per load. */
  var STORY = !reduceMotion && !window.__bbDemoFresh;
  var STORY_LINES = [
    'Finish the homepage hero redesign tomorrow at 3pm',
    'Review the new banners with @maya today at 5pm',
    'Write the pricing page copy by Wednesday',
    'Prepare the launch deck for Friday with @daniel',
    'Send the invoice to Acme next Monday',
  ];
  /* [line, column, cursor label] */
  /* A column of 'file:<key>' drops that image onto the card instead. */
  var STORY_MOVES = [
    [0, 'ongoing', 'Drag cards to move them'], [0, 'file:hero', 'Drop images on a task'],
    [1, 'ongoing', 'Maya Chen'], [1, 'file:banners', 'Maya Chen'], [2, 'ongoing', ''],
    [0, 'review', ''], [3, 'ongoing', 'Daniel Brooks'], [3, 'file:deck', 'Daniel Brooks'],
    [2, 'review', ''], [2, 'done', ''],
  ];
  var storyRunning = false;
  if (STORY) { try { localStorage.setItem('bbd-dash-tasks', '[]'); } catch (e) {} forgetAttachments(); }

  var fxCss = document.createElement('style');
  fxCss.textContent =
    '.kb-board .bbd-pop{animation:bbdPop .4s cubic-bezier(.2,.8,.2,1) both}' +
    '@keyframes bbdPop{from{opacity:0;transform:translateY(-10px) scale(.97)}to{opacity:1;transform:none}}' +
    '#bbd-hint{position:fixed;z-index:9997;max-width:220px;padding:9px 12px;border-radius:10px;background:#111;color:#fff;cursor:pointer;' +
      'font:500 12.5px/1.35 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.22);' +
      'opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s}' +
    '#bbd-hint.on{opacity:1;transform:none}' +
    '#bbd-hint b{display:block;font-weight:650;margin-bottom:2px}' +
    '#bbd-hint:before{content:"";position:absolute;top:-5px;right:var(--ar,40px);width:10px;height:10px;background:#111;transform:rotate(45deg)}' +
    'body.black-mode #bbd-hint{background:#f5f5f5;color:#111}' +
    'body.black-mode #bbd-hint:before{background:#f5f5f5}' +
    'body.black-mode #bb-demo-ghost span{background:#f5f5f5!important;color:#111!important}' +
    '.bbd-file{position:fixed;left:0;top:0;z-index:9998;pointer-events:none;opacity:0;display:flex;align-items:center;gap:8px;padding:5px 10px 5px 5px;' +
      'border-radius:9px;background:#fff;color:#111;box-shadow:0 8px 22px rgba(0,0,0,.28);font:600 11.5px/1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;' +
      'transition:transform .95s cubic-bezier(.65,0,.35,1),opacity .25s}' +
    '.bbd-file img{width:46px;height:24px;object-fit:cover;border-radius:4px;display:block}' +
    '.kb-board .task-cover img,.bbd-clone .task-cover img{max-height:150px;object-fit:cover;object-position:top}' +
    '.bbd-nudge{animation:bbdNudge 1.6s ease-in-out 3}' +
    '@keyframes bbdNudge{0%,100%{transform:none}50%{transform:scale(1.06)}}';
  (document.head || document.documentElement).appendChild(fxCss);

  function storyMoves(ids) {
    /* Two of the three image drops, a different pair each visit. */
    var drops = STORY_MOVES.filter(function (m) { return m[1].indexOf('file:') === 0; });
    var skip = drops[Math.floor(Math.random() * drops.length)];
    var left = STORY_MOVES.filter(function (m) { return ids[m[0]] && m !== skip; });
    function step(stalls) {
      if (!left.length) { storyEnd(ids); return; }
      var m = left[0], id = ids[m[0]];
      if (!boardCard(id)) { left.shift(); step(0); return; }
      var file = m[1].indexOf('file:') === 0 ? m[1].slice(5) : '';
      if (file ? dropFile(id, file, m[2]) : dragCard(id, m[1], m[2], function () { moveMine(id, m[1]); })) {
        shownHint = true;
        left.shift();
        later(2400 + rand(500, 900), function () { step(0); });
        return;
      }
      /* Wait while the visitor is busy; if the card is out of sight, move it quietly. */
      if (hidden() || busyScreen() || Date.now() - lastInput < 1500 || stalls < 3) { later(1500, function () { step(stalls + 1); }); return; }
      left.shift();
      if (file) attachFile(id, file); else moveMine(id, m[1]);
      later(800, function () { step(0); });
    }
    later(1400, function () { step(0); });
  }
  function storyEnd(ids) {
    storyRunning = window.__bbStoryRunning = false;
    storyEndedAt = Date.now();
    if (ids && ids[1]) MAYA_TASK = ids[1];
    later(1200, addTaskHint);
    later(rand(7000, 10000), mayaTurn);
  }
  function popNew(ids) {
    later(60, function () {
      ids.forEach(function (id, i) {
        var c = id && boardCard(id);
        if (c) { c.classList.add('bbd-pop'); c.style.animationDelay = (i * 0.16) + 's'; }
      });
    });
  }
  function startStory() {
    storyRunning = window.__bbStoryRunning = true;
    t2tWalk(STORY_LINES.join('\n'), function (ids) {
      if (!ids || !ids.length) { storyEnd(null); return; }
      popNew(ids);
      storyMoves(ids);
    });
  }
  /* Starts when the whole Type Your Tasks box is on the visitor's screen. */
  function watchStory() {
    var n = document.getElementById('t2t-input'), card = document.getElementById('t2t-dashboard-card');
    if (n && card && !hidden() && fullyVisible(card) && !busyScreen() && Date.now() - lastInput > 1500) {
      later(700, startStory);
      return;
    }
    setTimeout(watchStory, 400);
  }

  /* ── Type Your Tasks walkthrough ──
     After the first drag, the demo types two lines into Type Your Tasks,
     presses Organise (the dates and @name are picked up) and adds both tasks.
     It steps aside the moment the visitor touches anything. */
  var scripting = false;
  function fullyVisible(el) {
    var r = el.getBoundingClientRect();
    if (!r.width || r.top < 40 || r.bottom > window.innerHeight - 20) return false;
    try {
      var fe = window.frameElement;
      if (fe) {
        var fr = fe.getBoundingClientRect(), sc = fr.height / (window.innerHeight || fr.height) || 1;
        var top = fr.top + r.top * sc, bot = fr.top + r.bottom * sc;
        return top >= 0 && bot <= window.parent.innerHeight;
      }
    } catch (e) {}
    return true;
  }
  function ghostClick(el, then) {
    var r = el.getBoundingClientRect();
    var g = ghostCursor('');
    var x = r.left + r.width * 0.55, y = r.top + r.height * 0.55;
    if (g.style.opacity !== '1') { placeGhost(x + 120, y + 80, true); void g.offsetWidth; g.style.opacity = '1'; }
    placeGhost(x, y);
    later(950, function () {
      el.style.transition = 'transform .12s';
      el.style.transform = 'scale(.95)';
      later(140, function () { el.style.transform = ''; then(); });
    });
  }
  function storedTasks() {
    try { return JSON.parse(localStorage.getItem('bbd-dash-tasks') || '[]') || []; } catch (e) { return []; }
  }
  function t2tWalk(text, done, readMs) {
    if (scripting) { later(1000, function () { t2tWalk(text, done, readMs); }); return; }
    /* Open the box first if it's folded shut. */
    var card = document.getElementById('t2t-dashboard-card');
    if (card && card.classList.contains('collapsed') && typeof window.toggleT2T === 'function') {
      var hd = card.querySelector('.t2t-card-hd');
      scripting = true;
      ghostClick(hd || card, function () {
        try { window.toggleT2T(); } catch (e) {}
        scripting = false;
        later(450, function () { t2tWalk(text, done, readMs); });
      });
      return;
    }
    var n = document.getElementById('t2t-input'), btn = document.getElementById('t2t-btn');
    if (!n || !btn || typeof window.runT2T !== 'function' || n.value || document.activeElement === n) { done(null); return; }
    scripting = true;
    window.__bbAutoTasks = true;
    var started = Date.now(), i = 0;
    function finish(ids) {
      scripting = false;
      if (ghost) ghost.style.opacity = '0';
      setTimeout(function () { window.__bbAutoTasks = false; }, 3500);
      /* Tasks added: fold the box away until the next round types into it. */
      if (ids && ids.length) later(1300, function () {
        var c = document.getElementById('t2t-dashboard-card');
        if (c && !c.classList.contains('collapsed') && !scripting && document.activeElement !== document.getElementById('t2t-input') &&
            typeof window.toggleT2T === 'function') window.toggleT2T();
      });
      done(ids);
    }
    function touched() { return lastInput > started; }
    function bail() {
      if (n.value && text.indexOf(n.value.replace(/^[•\-*]\s*/gm, '')) === 0 && document.activeElement !== n) { n.value = ''; n.dispatchEvent(new Event('input', { bubbles: true })); }
      finish(null);
    }
    (function type() {
      if (touched()) { bail(); return; }
      /* Two letters at a time keeps it brisk even on slower machines. */
      i = Math.min(text.length, i + 2);
      if (text.charAt(i - 2) === '\n') i--;
      n.value = text.slice(0, i);
      n.dispatchEvent(new Event('input', { bubbles: true }));
      if (i < text.length) { later(text.charAt(i - 1) === '\n' ? 300 : 24 + Math.random() * 26, type); return; }
      later(600, function () {
        if (touched()) { bail(); return; }
        ghostClick(btn, function () {
          try { window.runT2T(); } catch (e) { finish(null); return; }
          var waited = 0;
          (function results() {
            var res = document.getElementById('t2t-results'), add = document.getElementById('t2t-add-all');
            if (!res || !res.classList.contains('show') || !add) {
              waited += 300;
              if (waited > 5000) { finish(null); return; }
              later(300, results); return;
            }
            /* Time to read the dates and names, then add them all. */
            later(readMs || 3000, function () {
              if (touched() || !res.classList.contains('show')) { finish(null); return; }
              ghostClick(add, function () {
                var before = {};
                storedTasks().forEach(function (t) { before[t.id] = 1; });
                var titles = [];
                try { titles = _t2tTasks.map(function (t) { return t.title; }); } catch (e) {}
                try { window.t2tAddAll(); } catch (e) {}
                var fresh = storedTasks().filter(function (t) { return !before[t.id]; });
                var ids = titles.map(function (title) {
                  var hit = fresh.filter(function (t) { return t.title === title; })[0];
                  if (hit) fresh.splice(fresh.indexOf(hit), 1);
                  return hit ? hit.id : null;
                });
                later(500, function () { finish(ids); });
              });
            });
          })();
        });
      });
    })();
  }

  /* ── Team Live pop-ups get answered ──
     A message bubble or a knock that has sat on screen for a few seconds gets
     a reply from the demo's cursor: a quick "On it", a like, "Give me 5", or
     Reply with a short typed answer. Only while the visitor isn't busy. */
  var REPLY_LINES = ['Thanks, looks good', 'On it now', 'Perfect, thank you', 'Will check in a bit', 'Great, sending it over'];
  var popSeen = [], lastAnswer = 0;
  function seenFor(el) {
    for (var i = 0; i < popSeen.length; i++) if (popSeen[i][0] === el) return Date.now() - popSeen[i][1];
    popSeen.push([el, Date.now()]);
    if (popSeen.length > 20) popSeen.shift();
    return 0;
  }
  function shown(el) { return el && el.offsetParent && fullyVisible(el); }
  function sending(fn) { selfSending = true; try { fn(); } catch (e) {} setTimeout(function () { selfSending = false; }, 1500); }
  function answerDone() { scripting = false; lastAnswer = Date.now(); if (ghost) ghost.style.opacity = '0'; }
  function answerPopups() {
    later(1500, answerPopups);
    if (reduceMotion || scripting || hidden() || busyScreen() || Date.now() - lastInput < 4000 || Date.now() - lastAnswer < 6000) return;
    var knock = [].slice.call(document.querySelectorAll('#tl-strip .tl-knock')).filter(shown)[0];
    var bubble = [].slice.call(document.querySelectorAll('.tl-bubble')).filter(function (b) { return shown(b) && b.querySelector('.tl-b-chips'); })[0];
    var target = knock || bubble;
    if (!target || seenFor(target) < 3500) return;
    scripting = true;
    if (knock) {
      var soon = knock.querySelector('[data-knock="soon"]');
      if (!soon) { answerDone(); return; }
      ghostClick(soon, function () { soon.click(); later(700, answerDone); });
      return;
    }
    var roll = Math.random();
    if (roll < 0.45) {
      var rep = bubble.querySelector('[data-act="reply"]');
      if (!rep) { answerDone(); return; }
      ghostClick(rep, function () {
        rep.click();
        later(450, function () {
          var inp = bubble.querySelector('.tl-input'), send = bubble.querySelector('[data-act="send"]');
          if (!inp || !send || !document.body.contains(bubble)) { answerDone(); return; }
          var text = pick(REPLY_LINES), i = 0;
          (function type() {
            if (!document.body.contains(inp)) { answerDone(); return; }
            i = Math.min(text.length, i + 2);
            inp.value = text.slice(0, i);
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            if (i < text.length) { later(40 + Math.random() * 30, type); return; }
            later(350, function () {
              ghostClick(send, function () {
                sending(function () { send.click(); });
                later(900, function () {
                  var x = document.body.contains(bubble) && bubble.querySelector('[data-act="x"]');
                  if (x && bubble.offsetParent) x.click();
                  answerDone();
                });
              });
            });
          })();
        });
      });
      return;
    }
    var chip = roll < 0.75 ? bubble.querySelector('[data-act="like"]') : bubble.querySelector('.tl-chip[data-q]');
    if (!chip) { answerDone(); return; }
    ghostClick(chip, function () {
      sending(function () { chip.click(); });
      later(900, function () {
        var x = document.body.contains(bubble) && bubble.querySelector('[data-act="x"]');
        if (x && bubble.offsetParent) x.click();
        answerDone();
      });
    });
  }
  later(6000, answerPopups);

  /* After the first drag: a note under Add Task inviting the visitor to try. */
  var hintDone = false;
  function addTaskHint() {
    if (hintDone) return;
    var btn = [].slice.call(document.querySelectorAll('.section-hd-actions .add-btn')).filter(function (b) { return b.offsetParent; })[0];
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    if (r.top < 60 || r.bottom > window.innerHeight - 90) return;
    if (busyScreen() || Date.now() - lastInput < 1500) { later(3000, addTaskHint); return; }
    hintDone = true;
    var tip = document.createElement('div');
    tip.id = 'bbd-hint';
    tip.setAttribute('role', 'button');
    tip.innerHTML = '<b>Your turn</b>Add a task of your own and watch it land on the board.';
    document.body.appendChild(tip);
    /* Stays under the button if the page shifts or scrolls. */
    function place() {
      var b = btn.getBoundingClientRect(), w = tip.offsetWidth;
      var left = Math.max(12, Math.min(window.innerWidth - w - 12, b.right - w));
      tip.style.left = left + 'px';
      tip.style.top = (b.bottom + 12) + 'px';
      tip.style.setProperty('--ar', Math.max(12, (left + w) - (b.left + b.width / 2) - 5) + 'px');
      tip.style.visibility = b.width && b.top > 40 && b.bottom < window.innerHeight - 60 ? '' : 'hidden';
    }
    place();
    var follow = setInterval(place, 120);
    btn.classList.add('bbd-nudge');
    void tip.offsetWidth;
    tip.classList.add('on');
    var closeTimer;
    function close() {
      tip.classList.remove('on');
      btn.classList.remove('bbd-nudge');
      window.removeEventListener('pointerdown', close, true);
      clearTimeout(closeTimer);
      setTimeout(function () { clearInterval(follow); tip.remove(); }, 300);
    }
    tip.addEventListener('pointerdown', function () { setTimeout(function () { try { btn.click(); } catch (e) {} }, 0); });
    window.addEventListener('pointerdown', close, true);
    closeTimer = setTimeout(close, 20000);
  }

  if (STORY) watchStory();
  else later(10000, firstMoves);

})();
