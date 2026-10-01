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
  function ambientChat() {
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
  later(8000, ambientChat);
  later(reduceMotion ? 60000 : 25000, incomingKnock);
  later(60000, presenceDrift);
  if (LIVE_ROOMS.length) {
    later(6000, speaking);
    /* Priya steps out of the Lounge early, so her tile shows what she is working on. */
    later(15000, function () { setInRoom(LIVE_ROOMS[1] || LIVE_ROOMS[0], (LIVE_ROOMS[1] || LIVE_ROOMS[0]).guests[0], false); });
    later(45000, roomShuffle);
  }
  later(reduceMotion ? 120000 : 55000, incomingWave);

  /* About 40 s in, Maya finishes the banners she was given and sends them to Sam
     for review: the card moves to In Review and a notification arrives. */
  later(40000, function () {
    var tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('bbd-dash-tasks') || '[]') || []; } catch (e) { return; }
    var t = tasks.filter(function (x) { return x.id === 'demo-t-banners'; })[0];
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
  });
})();
