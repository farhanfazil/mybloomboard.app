/* eslint-disable */
// Animations for the Chat page: an interactive chat playground plus small looping scenes.
// Returns a cleanup that stops every timer, observer and listener (same pattern as office-run.js).
import { ICONS } from "./icons";

export function run(root) {
  const timers = new Set(), intervals = new Set(), observers = [], offs = [];
  let dead = false;
  const setTimeout = (f, ms) => { const id = window.setTimeout(() => { timers.delete(id); if (!dead) f(); }, ms); timers.add(id); return id; };
  const setInterval = (f, ms) => { const id = window.setInterval(f, ms); intervals.add(id); return id; };
  const S = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const on = (el, ev, f, o) => { el.addEventListener(ev, f, o); offs.push(() => el.removeEventListener(ev, f, o)); };
  const icons = (scope = root) => scope.querySelectorAll("i[data-lucide]").forEach((i) => {
    const svg = ICONS[i.getAttribute("data-lucide")]; if (!svg) return;
    const t = document.createElement("span"); t.innerHTML = svg; const el = t.firstChild;
    if (i.getAttribute("style")) el.setAttribute("style", i.getAttribute("style"));
    i.replaceWith(el);
  });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const F = (k) => `/office/face-${k}.jpg`;
  const NAME = { maya: "Maya", daniel: "Daniel", nora: "Nora", ethan: "Ethan", sam: "You" };
  const E = (n) => `<img class="emj" src="/chat/emoji/${n}.png" alt="">`;
  const time = () => { const d = new Date(); return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ── headline: types a line, pauses, deletes, types the next.
     *word* is shown in cyan, ~word~ in lavender. ── */
  {
    const LINES = ["Stop switching apps\nto talk about your *work*.", "Chat right next to\nyour ~tasks~ and boards.", "Reply, react, *mention*.\nAll in one place.", "Been away an hour?\n~Catch me up~ in one click.", "Voice notes, GIFs, files.\nRight where the *work* is."];
    const el = $("#tw");
    const escc = (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === "\n" ? "<br>" : c;
    const show = (t, k) => { let out = "", n = 0, open = ""; for (const ch of t) { if (ch === "*" || ch === "~") { if (open) { out += "</span>"; open = ""; } else { open = ch; out += `<span class="${ch === "*" ? "hl-a" : "hl-b"}">`; } continue; } if (n >= k) break; out += escc(ch); n++; } if (open) out += "</span>"; el.innerHTML = out; };
    if (el) {
      if (reduce) show(LINES[0], 1e9);
      else (async () => {
        for (let i = 0; !dead; i++) {
          const t = LINES[i % LINES.length], p = t.replace(/[*~]/g, "");
          for (let k = 1; k <= p.length; k++) { show(t, k); await S(p[k - 1] === "," || p[k - 1] === "." || p[k - 1] === "?" ? 220 : 48 + Math.random() * 40); }
          await S(2600);
          for (let k = p.length; k >= 0; k--) { show(t, k); await S(24); }
          await S(380);
        }
      })();
    }
  }

  /* ── the playground ── */
  const msgs = $("#pl-msgs"), input = $("#pl-in"), win = $("#pl");
  let busy = false, userTouched = 0;
  const MAX_MSGS = 7;

  /* Oldest messages leave once the room is full, so the newest always show. */
  function trim() { while (msgs.children.length > 2 && (msgs.scrollHeight > msgs.clientHeight + 2 || msgs.children.length > MAX_MSGS)) msgs.firstElementChild.remove(); }
  function add(who, html, opts = {}) {
    const me = who === "sam";
    const m = document.createElement("div");
    const media = /class="(gif|gifx[^"]*|img|voice|doc)"/.test(html);
    m.className = "m" + (me ? " me" : "") + (opts.big ? " big" : "") + (media ? " media" : "");
    m.innerHTML = `${me ? "" : `<span class="a" style="background-image:url(${F(who)})"></span>`}<div class="body">${me ? "" : `<div class="who">${NAME[who]}<small>${time()}</small></div>`}${opts.quote ? `<div class="quote">${opts.quote}</div>` : ""}<div class="txt">${html}</div><div class="rxs"></div></div>
      <div class="tools">${["thumbs_up", "red_heart", "face_with_tears_of_joy"].map((e) => `<span data-rx="${e}">${E(e)}</span>`).join("")}<span data-act="reply" title="Reply"><i data-lucide="corner-up-left"></i></span><span data-act="pin" title="Pin"><i data-lucide="pin"></i></span></div>`;
    msgs.appendChild(m); trim(); icons(m);
    m.querySelectorAll('img').forEach((im) => im.addEventListener('load', trim, { once: true }));
    setTimeout(trim, 450);
    m.dataset.who = who;
    return m;
  }
  function typing(who) {
    const m = document.createElement("div");
    m.className = "m";
    m.innerHTML = `<span class="a" style="background-image:url(${F(who)})"></span><div class="typing"><i></i><i></i><i></i></div>`;
    msgs.appendChild(m); trim();
    return m;
  }
  function burst(m, e) {
    if (reduce) return;
    const r = m.getBoundingClientRect(), w = win.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("img");
      b.className = "burst"; b.src = `/chat/emoji/${e}.png`; b.alt = "";
      b.style.left = (r.left - w.left + 60 + Math.random() * 60) + "px";
      b.style.top = (r.bottom - w.top - 30) + "px";
      b.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      b.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
      b.style.animationDelay = i * 70 + "ms";
      win.appendChild(b);
      setTimeout(() => b.remove(), 1400);
    }
  }
  function react(m, e, n = 1, mine = false) {
    const box = $(".rxs", m);
    let chip = box.querySelector(`[data-e="${e}"]`);
    if (chip) { const c = chip.querySelector("b"); c.textContent = +c.textContent + n; chip.classList.toggle("mine", mine || chip.classList.contains("mine")); }
    else { chip = document.createElement("span"); chip.className = "rx" + (mine ? " mine" : ""); chip.dataset.e = e; chip.innerHTML = `${E(e)}<b>${n}</b>`; box.appendChild(chip); }
    burst(m, e);
  }
  function toast(html, ms = 2000) { const t = $("#pl-toast"); t.innerHTML = html; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), ms); }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  async function teammateReply(text) {
    const who = pick(["maya", "daniel", "nora", "ethan"]);
    await S(700); const t = typing(who); await S(1300); t.remove();
    const REPLIES = ["Love it", "On it!", "Haha, yes", "Sounds good to me", "Perfect, thanks!", "Agreed", "Ship it"];
    const m = add(who, esc(pick(REPLIES)));
    if (Math.random() < .6) { await S(600); const last = [...msgs.querySelectorAll(".m.me")].pop(); if (last) react(last, pick(["fire", "red_heart", "raising_hands", "thumbs_up"]), 1); }
    return m;
  }

  /* Seed the room. */
  const seed = () => {
    msgs.innerHTML = "";
    const a = add("maya", "Morning! Banners are up for review");
    react(a, "fire", 3); react(a, "raising_hands", 2);
    add("daniel", "Looking good. Can we keep the logo on the left?");
    add("nora", `Agreed. <span class="mention">@Sam</span> can you send the final sizes?`);
  };
  seed();
  $$(".rxs .rx", msgs).forEach((r) => (r.style.animation = "none"));

  /* Visitor typing. */
  let replyTo = null;
  async function sendOwn() {
    const v = input.value.trim(); if (!v || busy) return;
    userTouched = Date.now(); input.value = "";
    const quote = replyTo; replyTo = null; $("#pl-reply").classList.remove("on");
    add("sam", esc(v).replace(/@(\w+)/g, '<span class="mention">@$1</span>'), quote ? { quote } : {});
    busy = true; await teammateReply(v); busy = false;
  }
  on(input, "keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendOwn(); } });
  on(input, "focus", () => { userTouched = Date.now(); });
  on($("#pl-send"), "click", sendOwn);
  on(msgs, "click", (e) => {
    const m = e.target.closest(".m"); if (!m) return; userTouched = Date.now();
    const rx = e.target.closest("[data-rx]"); if (rx) { react(m, rx.dataset.rx, 1, true); return; }
    const act = e.target.closest("[data-act]");
    if (act && act.dataset.act === "reply") { replyTo = `<b>${NAME[m.dataset.who] || "You"}</b> ${$(".txt", m).textContent.slice(0, 60)}`; $("#pl-reply-who").textContent = NAME[m.dataset.who] || "yourself"; $("#pl-reply").classList.add("on"); input.focus(); }
    if (act && act.dataset.act === "pin") { pinMsg(m); }
  });
  function pinMsg(m) { $("#pl-pin-t").innerHTML = `<b style="color:#fff">${NAME[m.dataset.who] || "You"}:</b> ${esc($(".txt", m).textContent.slice(0, 70))}`; $("#pl-pin").classList.add("on"); toast("Message pinned", 1400); }

  /* Pickers built once. */
  const EMO = ["thumbs_up", "red_heart", "face_with_tears_of_joy", "fire", "party_popper", "raising_hands", "clapping_hands", "rocket", "star-struck", "smiling_face_with_heart-eyes", "hundred_points", "folded_hands"];
  $("#pl-emoji-pop").innerHTML = EMO.map((e) => `<span data-e="${e}"><img src="/chat/emoji/${e}.png" alt=""></span>`).join("");
  /* Our own animated GIFs: a bold caption over a looping scene (no third-party GIFs). */
  const GIFS = [
    { cap: "LET'S GO", bg: "#2563eb", main: "rocket", fx: "fly", extra: ["sparkles", "glowing_star"] },
    { cap: "SHIP IT", bg: "#15803d", main: "check_mark_button", fx: "stamp", extra: ["confetti_ball", "party_popper"] },
    { cap: "YES!", bg: "#d97706", main: "partying_face", fx: "hop", extra: ["balloon", "balloon"] },
    { cap: "COFFEE FIRST", bg: "#7c2d12", main: "hot_beverage", fx: "steam", extra: [] },
    { cap: "ON IT", bg: "#0f766e", main: "saluting_face", fx: "nod", extra: ["flexed_biceps"] },
    { cap: "MIND BLOWN", bg: "#6d28d9", main: "exploding_head", fx: "boom", extra: ["sparkles", "sparkles"] },
  ];
  const gifHtml = (i, cls = "") => { const g = GIFS[i]; return `<div class="gifx fx-${g.fx} ${cls}" data-i="${i}" style="--bg:${g.bg}">${g.extra.map((e, k) => `<img class="gx-x x${k}" src="/chat/emoji/${e}.png" alt="">`).join("")}<img class="gx-main" src="/chat/emoji/${g.main}.png" alt="">${g.fx === "steam" ? '<span class="gx-steam"><i></i><i></i><i></i></span>' : ""}<span class="gx-cap">${g.cap}</span><b class="gx-tag">GIF</b></div>`; };
  $("#pl-gif-pop").innerHTML = GIFS.map((_, i) => gifHtml(i)).join("");
  $("#pl-mention-pop").innerHTML = ["maya", "daniel", "nora", "ethan"].map((k) => `<div data-k="${k}"><span class="a" style="background-image:url(${F(k)})"></span>${NAME[k]}</div>`).join("");
  const closePops = () => $$(".pop").forEach((p) => p.classList.remove("on"));
  on($("#pl-emoji"), "click", () => { userTouched = Date.now(); const p = $("#pl-emoji-pop"); const was = p.classList.contains("on"); closePops(); if (!was) p.classList.add("on"); });
  on($("#pl-gif"), "click", () => { userTouched = Date.now(); const p = $("#pl-gif-pop"); const was = p.classList.contains("on"); closePops(); if (!was) p.classList.add("on"); });
  on($("#pl-emoji-pop"), "click", async (e) => { const s = e.target.closest("[data-e]"); if (!s || busy) return; closePops(); add("sam", E(s.dataset.e), { big: true }); busy = true; await teammateReply(); busy = false; });
  on($("#pl-gif-pop"), "click", async (e) => { const g = e.target.closest(".gifx"); if (!g || busy) return; closePops(); add("sam", gifHtml(+g.dataset.i, "big")); busy = true; await teammateReply(); busy = false; });
  on($("#pl-mention-pop"), "click", (e) => { const d = e.target.closest("[data-k]"); if (!d) return; closePops(); input.value = (input.value.replace(/@\w*$/, "") + "@" + NAME[d.dataset.k] + " ").trimStart(); input.focus(); });
  on(input, "input", () => { if (/@\w*$/.test(input.value)) { closePops(); $("#pl-mention-pop").classList.add("on"); } else $("#pl-mention-pop").classList.remove("on"); });
  on($("#pl-attach"), "click", () => runFeature("file", true));
  on($("#pl-mic"), "click", () => runFeature("voice", true));
  on($("#pl-cmu"), "click", () => runFeature("cmu", true));
  on($("#pl-call"), "click", () => runFeature("call", true));
  on($("#pl-hang"), "click", () => $("#pl-callov").classList.remove("on"));

  /* Typed text into the composer, letter by letter. */
  async function typeIn(text, speed = 38) { input.value = ""; for (let i = 1; i <= text.length; i++) { if (dead) return; input.value = text.slice(0, i); await S(speed); } }
  const waveHtml = (n = 26) => Array.from({ length: n }, () => `<i style="--h:${20 + Math.round(Math.random() * 75)}%"></i>`).join("");

  /* Each feature, performed live in the playground. */
  const FEATURES = {
    async react() {
      const target = [...msgs.querySelectorAll(".m:not(.me)")].slice(-2)[0] || msgs.lastElementChild;
      target.classList.add("tools-on"); await S(700);
      target.querySelector('[data-rx="red_heart"]').style.background = "var(--tile-hi)"; await S(350);
      react(target, "red_heart", 1, true); target.classList.remove("tools-on");
      await S(700); react(target, "fire", 1); await S(500); react(target, "raising_hands", 1);
    },
    async gif() {
      $("#pl-gif-pop").classList.add("on"); await S(900);
      const pickI = Math.floor(Math.random() * GIFS.length);
      const g = $(`#pl-gif-pop .gifx[data-i="${pickI}"]`); g.classList.add("hi"); await S(700); g.classList.remove("hi"); closePops();
      add("sam", gifHtml(pickI, "big"));
      await S(600); const t = typing("maya"); await S(1100); t.remove(); const m = add("maya", "Haha, perfect"); await S(400); react(m, "face_with_tears_of_joy", 2);
    },
    async voice() {
      $("#pl-crow").style.display = "none"; const rec = $("#pl-rec"); rec.classList.add("on"); $("#pl-rec-w").innerHTML = waveHtml(30); $("#pl-rec-w").classList.add("wave");
      for (let s = 0; s <= 6; s++) { $("#pl-rec-t").textContent = `0:0${s}`; await S(330); }
      rec.classList.remove("on"); $("#pl-crow").style.display = "";
      const m = add("sam", `<div class="voice playing"><span class="pl"><i data-lucide="play"></i></span><span class="wave">${waveHtml()}</span><small>0:06</small></div>`); icons(m);
      await S(1800); $(".voice", m).classList.remove("playing");
      const t = typing("daniel"); await S(1000); t.remove(); add("daniel", "Got it, will do it after lunch");
    },
    async file() {
      const drag = $("#pl-drag"), drop = $("#pl-drop"), wr = win.getBoundingClientRect(), mr = msgs.getBoundingClientRect();
      drag.style.transition = "none"; drag.style.left = "-40px"; drag.style.top = (wr.height - 150) + "px"; void drag.offsetWidth;
      drag.style.transition = ""; drag.style.opacity = 1;
      await S(60); drag.style.left = (mr.left - wr.left + mr.width / 2 - 90) + "px"; drag.style.top = (mr.top - wr.top + mr.height / 2 - 30) + "px";
      await S(500); drop.classList.add("on"); await S(800); drop.classList.remove("on"); drag.style.opacity = 0;
      const m = add("sam", `<div class="img" style="background-image:url(/office/banner-2.jpg)"><span class="up"><i></i></span></div>`);
      await S(60); $(".up i", m).style.width = "100%"; await S(1100); $(".up", m).style.opacity = 0;
      await S(500); const t = typing("daniel"); await S(1000); t.remove();
      const d = add("daniel", `<div class="doc"><i data-lucide="file-text"></i><span><b>Launch brief.pdf</b><small>PDF · 240 KB</small></span></div>`); icons(d);
    },
    async reply() {
      const target = [...msgs.querySelectorAll('.m[data-who="daniel"]')].pop() || [...msgs.querySelectorAll(".m:not(.me)")].pop();
      target.classList.add("tools-on"); await S(800); target.classList.remove("tools-on");
      const q = `<b>${NAME[target.dataset.who]}</b> ${$(".txt", target).textContent.slice(0, 50)}`;
      $("#pl-reply-who").textContent = NAME[target.dataset.who]; $("#pl-reply").classList.add("on");
      await typeIn("Yes, logo stays on the left for all sizes"); await S(300);
      $("#pl-reply").classList.remove("on"); input.value = "";
      add("sam", "Yes, logo stays on the left for all sizes", { quote: q });
      await S(700); react([...msgs.querySelectorAll(".m.me")].pop(), "thumbs_up", 1);
    },
    async mention() {
      await typeIn("Thanks "); input.value += "@"; $("#pl-mention-pop").classList.add("on"); await S(800);
      const it = $('#pl-mention-pop [data-k="maya"]'); it.classList.add("hi"); await S(500); it.classList.remove("hi"); closePops();
      input.value = "Thanks @Maya "; await typeIn("Thanks @Maya the banners look great", 30); await S(250); input.value = "";
      add("sam", `Thanks <span class="mention">@Maya</span> the banners look great`);
      await S(400); toast(`<span class="a" style="background-image:url(${F("maya")})"></span>Maya was notified`, 1800);
    },
    async pin() {
      const target = [...msgs.querySelectorAll(".m:not(.me)")][0]; if (!target) return;
      target.classList.add("tools-on"); await S(800); target.classList.remove("tools-on"); pinMsg(target);
    },
    async cmu() {
      const b = $("#pl-cmu"); b.classList.add("press"); await S(250); b.classList.remove("press");
      const t = document.createElement("div"); t.className = "m"; t.innerHTML = `<div class="summary"><b><span class="lines3"><i></i><i></i><i></i></span>Catch up · 40 messages</b><ul><li>Banners approved, logo on the left.</li><li>Acme needs all sizes by Friday.</li><li>Review moved to 11:00.</li></ul></div>`;
      msgs.appendChild(t); trim();
    },
    async call() {
      const b = $("#pl-call"); b.classList.add("press"); await S(250); b.classList.remove("press");
      const ov = $("#pl-callov"); ov.classList.add("on"); const ts = $$(".ct", ov); ts.forEach((x) => x.classList.remove("in", "talk"));
      for (const x of ts) { await S(260); x.classList.add("in"); }
      for (let i = 0; i < 4; i++) { ts.forEach((x, j) => x.classList.toggle("talk", j === i % 3)); await S(900); }
      ov.classList.remove("on");
    },
  };
  const ORDER = ["react", "gif", "voice", "file", "reply", "mention", "pin", "cmu", "call"];
  let cur = -1;
  async function runFeature(name, byUser) {
    if (busy) return; busy = true;
    if (byUser) userTouched = Date.now();
    closePops();
    $$("#pl-dock [data-f]").forEach((c) => c.classList.toggle("on", c.dataset.f === name));
    try { await FEATURES[name](); } catch (e) {}
    $$("#pl-dock [data-f]").forEach((c) => c.classList.remove("on"));
    await S(400); busy = false;
  }
  on($("#pl-dock"), "click", (e) => { const c = e.target.closest("[data-f]"); if (c) { cur = ORDER.indexOf(c.dataset.f); runFeature(c.dataset.f, true); } });
  /* Plays the features on its own until the visitor takes over (resumes after 20 s idle). */
  let visible = false;
  const pio = new window.IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 }); pio.observe(win); observers.push(pio);
  setInterval(() => {
    if (busy || !visible || document.hidden || Date.now() - userTouched < 20000 || document.activeElement === input) return;
    cur = (cur + 1) % ORDER.length; runFeature(ORDER[cur], false);
  }, 6500);

  /* ── bento scenes (each loops while on screen) ── */
  const loops = {
    "bx-fmt": async (el, alive) => {
      const parts = [["Ship ", ""], ["today", "b"], [", not ", ""], ["tomorrow", "s"], ["! ", ""], ["Really", "i"], [".", ""]];
      while (alive()) {
        el.innerHTML = '<span class="car"></span>';
        for (const [t, tag] of parts) {
          const node = document.createElement(tag || "span"); el.insertBefore(node, el.lastChild);
          for (let i = 1; i <= t.length && alive(); i++) { node.textContent = t.slice(0, i); await S(70); }
        }
        await S(2600);
      }
    },
    "bx-unread": async (el, alive) => {
      const ns = $$("[data-n]", el);
      while (alive()) {
        const n = pick(ns); n.textContent = +n.textContent + 1; n.classList.add("bump"); await S(300); n.classList.remove("bump");
        await S(1100); if (Math.random() < .25) ns.forEach((x) => (x.textContent = Math.ceil(Math.random() * 2)));
      }
    },
    "bx-edit": async (el, alive) => {
      while (alive()) {
        el.innerHTML = `<div class="bubble" id="e1">Meeting moved to 11:30</div><div class="bubble" id="e2">oops wrong chat</div>`;
        await S(1400); $("#e1", el).innerHTML = 'Meeting moved to 11:00<small>edited</small>';
        await S(1400); $("#e2", el).classList.add("gone"); await S(2400);
      }
    },
    "bx-srch": async (el, alive) => {
      const q = $("#bx-srch-q", el), hits = $$(".hit", el);
      while (alive()) {
        q.textContent = ""; hits.forEach((h) => h.classList.remove("in")); await S(500);
        for (const c of "banners") { q.textContent += c; await S(110); }
        for (const h of hits) { await S(350); h.classList.add("in"); }
        await S(2600);
      }
    },
    "bx-knock": async (el, alive) => {
      const a = $(".a", el), kk = $(".kk", el);
      while (alive()) { kk.classList.remove("on"); await S(700); a.classList.remove("shake"); void a.offsetWidth; a.classList.add("shake"); kk.classList.add("on"); await S(2600); }
    },
    "bx-sugg": async (el, alive) => {
      const SUG = ["Yes, after lunch", "On it now", "Can we do tomorrow?"];
      while (alive()) {
        el.innerHTML = `<div class="sg-in"><span class="a" style="background-image:url(${F("daniel")})"></span><span class="sg-b">Can you review the banners today?</span></div><div class="sg-chips"></div><div class="sg-out"></div>`;
        const box = $(".sg-chips", el); await S(900);
        for (const t of SUG) { if (!alive()) return; const c = document.createElement("span"); c.className = "sg-chip"; c.innerHTML = `<span class="sb2"><i></i><i></i></span>${t}`; box.appendChild(c); await S(280); }
        await S(900); const pickC = box.children[0]; pickC.classList.add("hi"); await S(500);
        box.style.opacity = 0; $(".sg-out", el).innerHTML = `<span class="sg-me">${SUG[0]}</span>`; await S(2600); box.style.opacity = "";
      }
    },
    "bx-any": async (el, alive) => {
      while (alive()) {
        el.innerHTML = `<div class="any-dash"><div class="any-rows"><span></span><span></span><span></span></div>
          <div class="any-live">${["maya", "daniel", "nora", "ethan"].map((k) => `<span class="a" data-k="${k}" style="background-image:url(${F(k)})"></span>`).join("")}</div>
          <div class="any-pop"><b>Maya</b>Got a sec for the hero?<div class="any-in"><span class="any-t"></span><span class="any-send"><i data-lucide="send"></i></span></div></div></div>`;
        icons(el);
        const pop = $(".any-pop", el), t = $(".any-t", el), maya = $('[data-k="maya"]', el);
        await S(800); maya.classList.add("ping"); pop.classList.add("on"); await S(1200);
        for (const ch of "Sure, call in 5") { if (!alive()) return; t.textContent += ch; await S(60); }
        await S(500); $(".any-send", el).classList.add("press"); await S(250);
        pop.classList.add("sent"); t.textContent = ""; await S(900); pop.classList.remove("on", "sent"); maya.classList.remove("ping");
        await S(1600);
      }
    },
    "gap-before": async (el, alive) => {
      const apps = $$(".app", el), n = $("#gap-n"); let k = 0, count = 11;
      while (alive()) {
        apps.forEach((x, i) => x.classList.toggle("front", i === k % 3));
        if (k % 3 === 1) { $(".q", el).classList.add("on"); setTimeout(() => $(".q2", el).classList.add("on"), 700); }
        if (k % 3 === 0) $$(".q,.q2", el).forEach((q) => q.classList.remove("on"));
        count = count >= 40 ? 11 : count + 1; n.textContent = count; n.classList.remove("tick"); void n.offsetWidth; n.classList.add("tick");
        k++; await S(1300);
      }
    },
    "gap-after": async (el, alive) => {
      const card = $("#gap-card", el), review = $("#gap-review", el), chat = $("#gap-chat", el);
      const home = card.parentElement, ref = card.nextElementSibling;
      while (alive()) {
        home.insertBefore(card, ref); card.classList.remove("moved"); chat.innerHTML = "";
        const msg = (who, t) => { const m = document.createElement("div"); m.className = "oc-m"; m.innerHTML = `<span class="av" style="background-image:url(${F(who)})"></span><span>${t}</span>`; chat.appendChild(m); };
        msg("daniel", "How are the banners going?"); await S(1500); if (!alive()) return;
        card.classList.add("lift"); await S(500); review.insertBefore(card, review.children[1]); card.classList.remove("lift"); card.classList.add("moved");
        await S(350); msg("maya", "Banners are in review"); await S(900); msg("daniel", `Approved ${E("fire")}`);
        await S(2600);
      }
    },
    "bx-pres": async (el, alive) => {
      const ps = $$(".p .a", el), C = [["Online", "#22c55e"], ["In a call", "#9fdcff"], ["In focus", "#a78bfa"], ["Back at 2:30", "#fbbf24"]];
      while (alive()) { await S(2200); const i = Math.floor(Math.random() * ps.length), [t, c] = pick(C); ps[i].style.setProperty("--c", c); ps[i].parentElement.lastChild.textContent = t; }
    },
  };
  Object.entries(loops).forEach(([id, fn]) => {
    const el = $("#" + id); if (!el) return;
    let token = 0;
    const io = new window.IntersectionObserver(([e]) => { token++; if (e.isIntersecting) { const me = token; fn(el, () => me === token && !dead && !document.hidden); } }, { threshold: 0.3 });
    io.observe(el); observers.push(io);
  });

  /* ── catch me up ── */
  const stack = $("#cmu-stack");
  on($("#cmu-go"), "click", () => stack.classList.toggle("collapsed"));
  const cio = new window.IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => stack.classList.add("collapsed"), 1400); }, { threshold: 0.5 });
  cio.observe(stack); observers.push(cio);

  /* ── narrator lines: BloomBoard "types" to the visitor as they scroll ── */
  const sayIO = new window.IntersectionObserver((es) => es.forEach(async (e) => {
    if (!e.isIntersecting) return; sayIO.unobserve(e.target);
    const el = e.target, full = el.dataset.say, t = $(".say-t", el);
    el.classList.add("on");
    if (reduce) { t.innerHTML = full; el.classList.add("done"); return; }
    await S(700);
    el.classList.add("talking");
    const parts = full.split("<br>");
    for (let p = 0; p < parts.length; p++) {
      if (p) t.insertAdjacentHTML("beforeend", "<br>");
      const span = document.createElement("span"); t.appendChild(span);
      for (let i = 1; i <= parts[p].length; i++) { const ch = parts[p][i - 1]; span.textContent = parts[p].slice(0, i); await S(ch === "," || ch === "." || ch === "?" ? 260 : 42); }
    }
    el.classList.add("done");
  }), { threshold: 0.6 });
  $$(".say").forEach((x) => sayIO.observe(x)); observers.push(sayIO);

  /* ── reveal on scroll ── */
  const rio = new window.IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { threshold: 0.12 });
  $$(".rv").forEach((e) => rio.observe(e)); observers.push(rio);

  icons();
  return () => {
    dead = true;
    timers.forEach((id) => window.clearTimeout(id)); intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect()); offs.forEach((f) => f());
  };
}
