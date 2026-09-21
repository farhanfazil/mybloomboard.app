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
  var MATES = [
    { id: ID.yasmin, name: 'Yasmin Khan' },
    { id: ID.omar, name: 'Omar Saleh' },
    { id: ID.lina, name: 'Lina Marker' },
  ];
  var ROOM = 'grp_khaleeji_cup';
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
  function isOnline(id) { return !offline[id]; }

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

  /* ── Ambient chatter: every 7–12 s, into a chat the visitor isn't reading ── */
  function ambientChat() {
    var from = pick(MATES.filter(function (m) { return isOnline(m.id); })) || MATES[0];
    var options = [dmId(from.id), ROOM].filter(function (c) { return c !== activeConvId(); });
    if (options.length) {
      postMessage(pick(options), from, LINES[lineIdx % LINES.length]);
      lineIdx++;
    }
    later(rand(7000, 12000), ambientChat);
  }

  /* ── A teammate knocks roughly every 45 s ── */
  function incomingKnock() {
    var from = pick(MATES.filter(function (m) { return isOnline(m.id); }));
    if (from) demo.broadcast('team_live_', 'knock', { id: demo.uuid(), from: from.id, to: ME, at: Date.now() });
    later(rand(40000, 52000), incomingKnock);
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
  MATES.forEach(function (m) { demo.presenceDefaults['team_live_'][m.id] = { idle: false, at: Date.now() }; });

  function presenceDrift() {
    var m = pick(MATES);
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

  /* Give the app time to sign in, pull chats and open its realtime channels. */
  later(9000, ambientChat);
  later(reduceMotion ? 60000 : 25000, incomingKnock);
  later(60000, presenceDrift);
})();
