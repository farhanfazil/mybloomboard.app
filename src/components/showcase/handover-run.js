/* eslint-disable */
// Animations for the Handover page. Runs inside `root` and returns a cleanup that
// stops every timer, observer and listener (same pattern as office-run.js).
import { ICONS } from "./icons";

export function run(root) {
  const timers = new Set(), intervals = new Set(), observers = [], offs = [];
  let dead = false;
  const setTimeout = (f, ms) => { const id = window.setTimeout(() => { timers.delete(id); if (!dead) f(); }, ms); timers.add(id); return id; };
  const setInterval = (f, ms) => { const id = window.setInterval(f, ms); intervals.add(id); return id; };
  const S = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const icons = () => $$("i[data-lucide]").forEach((i) => {
    const svg = ICONS[i.getAttribute("data-lucide")]; if (!svg) return;
    const t = document.createElement("span"); t.innerHTML = svg; const el = t.firstChild;
    if (i.getAttribute("style")) el.setAttribute("style", i.getAttribute("style"));
    i.replaceWith(el);
  });

  const F = (k) => `/office/face-${k}.jpg`;
  const ppl = { sam: F("sam"), maya: F("maya"), daniel: F("daniel"), ethan: F("ethan"), nora: F("nora") };
  const av = (k, cls = "a") => `<span class="${cls}" style="background-image:url(${ppl[k]})"></span>`;
  const CUR = '<div class="mini-cursor"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg><span class="clk"></span></div>';
  const ITEMS = [
    { t: "Send drafts to Acme", m: "Task · High priority", where: "My tasks", due: "Oct 11", flag: "before you go", who: "maya", brief: "Nora has the logo files. Send all three sizes, logo on the left." },
    { t: "Spring banners: final sizes", m: "Board card", where: "Spring Campaign", due: "Oct 13", flag: "while away", who: "maya", brief: "" },
    { t: "Review App Store copy", m: "Task · Medium", where: "Mobile App V2", due: "Oct 14", flag: "while away", who: "ethan", brief: "Keep it under 170 characters." },
    { t: "Weekly KPI report", m: "Task · Recurring", where: "My tasks", due: "Oct 15", flag: "while away", who: "daniel", brief: "" },
    { t: "Homepage hero polish", m: "Board card", where: "Website Relaunch", due: "Oct 22", flag: "", who: "", brief: "" },
    { t: "Plan Q4 offsite", m: "Task · Low", where: "My tasks", due: "Nov 3", flag: "", who: "", brief: "" },
  ];
  const NAME = { sam: "Sam", maya: "Maya", daniel: "Daniel", ethan: "Ethan", nora: "Nora" };

  /* cursor helpers: positions are measured in the element's own (unscaled) space */
  const scaleOf = (el) => { const c = el.closest(".canvas"); if (!c) return 1; return c.getBoundingClientRect().width / c.offsetWidth; };
  function moveTo(el, target, dx = 0.5, dy = 0.6) {
    const c = $(".mini-cursor", el); if (!c || !target) return;
    const s = scaleOf(el), r = el.getBoundingClientRect(), t = target.getBoundingClientRect();
    c.style.left = (t.left - r.left + t.width * dx) / s + "px"; c.style.top = (t.top - r.top + t.height * dy) / s + "px";
  }
  async function tap(el, btn) { const c = $(".mini-cursor", el); c.classList.remove("click"); void c.offsetWidth; c.classList.add("click"); if (btn) { btn.classList.add("press"); await S(180); btn.classList.remove("press"); } await S(150); }

  /* ── typing headline ── */
  (async () => {
    const LINES = ["Go on *leave*.\nYour work keeps ~moving~.", "Hand over your work\nin *two minutes*.", "Nothing gets ~dropped~\nwhile you're away.", "Come back to\neverything in *order*."];
    const el = $("#tw"); let i = 0;
    /* *word* in teal, ~word~ in amber: the important words */
    const escc = (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === "\n" ? "<br>" : c;
    const show = (t, k) => { let out = "", n = 0, open = ""; for (const ch of t) { if (ch === "*" || ch === "~") { if (open) { out += "</span>"; open = ""; } else { open = ch; out += `<span class="${ch === "*" ? "hl-a" : "hl-b"}">`; } continue; } if (n >= k) break; out += escc(ch); n++; } if (open) out += "</span>"; el.innerHTML = out; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { show(LINES[0], 1e9); return; }
    for (;;) {
      const t = LINES[i++ % LINES.length], p = t.replace(/[*~]/g, "");
      for (let k = 1; k <= p.length; k++) { show(t, k); await S(p[k - 1] === "," || p[k - 1] === "." ? 220 : 48 + Math.random() * 40); }
      await S(2600);
      for (let k = p.length; k >= 0; k--) { show(t, k); await S(24); }
      await S(380);
    }
  })();

  /* ── the film ── */
  const film = $("#hfilm"), canvas = $("#hcanvas");
  const fit = () => { canvas.style.transform = `scale(${film.clientWidth / 1100})`; };
  fit(); window.addEventListener("resize", fit); offs.push(() => window.removeEventListener("resize", fit));

  const stepbar = (n) => `<div class="stepbar">${["Choose work", "Assign and brief", "Review and send"].map((s, i) => `${i ? '<span class="ln"></span>' : ""}<span class="${i + 1 < n ? "done" : i + 1 === n ? "on" : ""}"><span class="n">${i + 1 < n ? '<i data-lucide="check" style="width:12px;height:12px"></i>' : i + 1}</span>${s}</span>`).join("")}</div>`;
  const winHd = `<div class="win-hd"><i data-lucide="users"></i><b>Hand over your work</b><span>Vacation · Oct 12 – Oct 15</span></div>`;
  canvas.innerHTML = `
    <div class="appbg"><div class="tabs"><span>Tasks</span><span>My Boards</span><b>Handover</b><span>Calendar</span></div><div class="cols"><div class="col"></div><div class="col"></div><div class="col"></div></div></div>
    <div class="scene" data-s="remind"><div class="remind" id="fr"><div class="r1"><i data-lucide="plane"></i>Your leave starts in 3 days</div><p>Vacation, Oct 12 – Oct 15. Hand over your work so nothing waits for you.</p><span class="bt p" id="fr-b"><i data-lucide="users"></i>Hand over work</span></div></div>
    <div class="scene" data-s="choose"><div class="win">${winHd}${stepbar(1)}<div class="win-bd">
      <div class="tbar"><span class="seg"><span class="on">All 5</span><span>Tasks 3</span><span>Board cards 2</span></span><span class="srch"><i data-lucide="search"></i>Search</span><span class="link" id="fc-sel" style="margin-left:auto">Select the 4 due by the end of your leave</span></div>
      <table><tr><th style="width:34px"><span class="cb" id="fc-all"><i data-lucide="check"></i></span></th><th>Work</th><th>Where</th><th>Due</th></tr>
      ${ITEMS.slice(0, 5).map((it, i) => `<tr data-i="${i}"><td><span class="cb"><i data-lucide="check"></i></span></td><td>${it.t}<small>${it.m}</small></td><td style="color:var(--muted)">${it.where}</td><td><span class="due ${it.flag ? "warn" : ""}">${it.due}${it.flag ? " · " + it.flag : ""}</span></td></tr>`).join("")}</table></div>
      <div class="win-ft"><span id="fc-n">0 of 5 selected</span><span class="sp"></span><span class="bt">Cancel</span><span class="bt p" id="fc-next">Next: assign people</span></div></div></div>
    <div class="scene" data-s="assign"><div class="win">${winHd}${stepbar(2)}<div class="win-bd">
      ${ITEMS.slice(0, 4).map((it, i) => `<div class="arow"><div><div class="tt">${it.t}<small>${it.m} · ${it.where}</small></div>${i === 0 ? `<div class="brief ph" id="fa-b${i}">Add a brief (optional)</div>` : ""}</div>
        <div class="pbtn empty" id="fa-p${i}"><span>Choose person</span><i data-lucide="chevron-down"></i>${i === 0 ? `<div class="menu" id="fa-menu">${["maya", "daniel", "ethan", "nora"].map((k) => `<div class="mi" data-k="${k}">${av(k)}<span>${NAME[k]}${k === "nora" ? '<small class="away">Away Oct 13 – Oct 14</small>' : '<small>Here all week</small>'}</span></div>`).join("")}</div>` : ""}</div></div>`).join("")}</div>
      <div class="win-ft"><span id="fa-n">4 items still need a person</span><span class="sp"></span><span class="bt">Back</span><span class="bt p" id="fa-next">Next: review</span></div></div></div>
    <div class="scene" data-s="review"><div class="win">${winHd}${stepbar(3)}<div class="win-bd">
      <div class="banner"><i data-lucide="plane"></i>Vacation · Oct 12 – Oct 15. Everything comes back to you on Oct 16.</div>
      <div class="pcards">${["maya", "ethan", "daniel"].map((k) => { const its = ITEMS.filter((x) => x.who === k); return `<div class="pc"><div class="pc-hd">${av(k)}<div><b>${NAME[k]}</b><small>Covers ${its.length} item${its.length > 1 ? "s" : ""}</small></div></div>${its.map((x) => `<div class="it">${x.t}${x.brief ? `<q>${x.brief}</q>` : '<q style="color:var(--dim)">No brief</q>'}</div>`).join("")}</div>`; }).join("")}</div></div>
      <div class="win-ft"><span>You'll get a notification when they reply.</span><span class="sp"></span><span class="bt">Back</span><span class="bt p" id="fv-send"><i data-lucide="send"></i>Send hand-over</span></div></div></div>
    <div class="scene" data-s="receive"><span class="onscreen">On Maya's screen</span><div class="win" style="top:30px">
      <div class="win-hd"><i data-lucide="users"></i><b>Sam asked you to cover 2 items</b></div>
      <div class="win-bd" style="min-height:0"><div style="font-size:13px;color:var(--muted);margin-bottom:10px">While Sam is away Oct 12 – Oct 15. Everything goes back to Sam on Oct 16.</div>
      <div class="note">Thanks so much! Nora knows where the logo files are.</div>
      ${ITEMS.filter((x) => x.who === "maya").map((x, i) => `<div class="rrow"><div class="tt">${x.t}<small>${x.m} · due ${x.due}</small></div><span class="ad"><span id="fr-a${i}">Accept</span><span>Decline</span></span>${x.brief ? `<div class="bx">${x.brief}</div>` : ""}</div>`).join("")}</div>
      <div class="win-ft"><span class="bt">Review later</span><span class="sp"></span><span class="bt p" id="fr-all">Accept all 2</span></div></div></div>
    <span class="toast" id="ft" style="left:0;right:0;margin:0 auto;width:max-content;bottom:86px"></span>
    ${CUR}`;
  icons();

  const SHOTS = [["Your leave is coming up.", 3200], ["Pick the work that's due while you're away.", 4600], ["Choose a person, add a note.", 6400], ["Check it, and send.", 3600], ["They accept with one click.", 4200]];
  const steps = $("#hsteps"); steps.innerHTML = SHOTS.map(() => "<i></i>").join("");
  const shot = (i) => {
    const c = $("#hcapt"); c.style.opacity = 0; setTimeout(() => { c.textContent = SHOTS[i][0]; c.style.opacity = 1; }, 220);
    $("#hcapk").textContent = String(i + 1).padStart(2, "0");
    [...steps.children].forEach((s, k) => { s.className = k < i ? "done" : k === i ? "on" : ""; s.style.setProperty("--d", SHOTS[i][1] + "ms"); });
  };
  const scene = (n) => $$(".scene", canvas).forEach((s) => s.classList.toggle("show", s.dataset.s === n));
  const toast = async (html, ms = 1800) => { const t = $("#ft"); t.innerHTML = html; icons(); t.classList.add("on"); await S(ms); t.classList.remove("on"); };
  async function typeInto(el, text, alive) { el.classList.remove("ph"); for (let k = 1; k <= text.length && alive(); k++) { el.textContent = text.slice(0, k); await S(28); } }

  let filmRun = 0;
  async function play() {
    const me = ++filmRun, alive = () => me === filmRun && !dead;
    // reset
    $$("tr[data-i]", canvas).forEach((r) => r.classList.remove("sel")); $("#fc-all").classList.remove("on"); $("#fc-n").textContent = "0 of 5 selected";
    ITEMS.slice(0, 4).forEach((_, i) => { const p = $("#fa-p" + i); p.classList.add("empty"); p.querySelector("span").outerHTML = "<span>Choose person</span>"; }); $("#fa-b0").classList.add("ph"); $("#fa-b0").textContent = "Add a brief (optional)";
    $("#fa-n").textContent = "4 items still need a person"; $("#fa-menu").classList.remove("on");
    [0, 1].forEach((i) => $("#fr-a" + i).classList.remove("acc"));
    $(".mini-cursor", canvas).style.left = "900px"; $(".mini-cursor", canvas).style.top = "560px";

    shot(0); scene("remind"); await S(900); if (!alive()) return;
    moveTo(canvas, $("#fr-b")); await S(1100); await tap(canvas, $("#fr-b")); await S(500);
    shot(1); scene("choose"); await S(800); if (!alive()) return;
    moveTo(canvas, $("#fc-sel")); await S(1000); await tap(canvas);
    for (let i = 0; i < 4 && alive(); i++) { $(`tr[data-i="${i}"]`, canvas).classList.add("sel"); $("#fc-n").textContent = `${i + 1} of 5 selected`; await S(260); }
    await S(600); moveTo(canvas, $("#fc-next")); await S(1000); await tap(canvas, $("#fc-next"));
    shot(2); scene("assign"); await S(700); if (!alive()) return;
    // first item: open the menu, show Nora is away, pick Maya
    moveTo(canvas, $("#fa-p0")); await S(900); await tap(canvas); $("#fa-menu").classList.add("on"); await S(500);
    moveTo(canvas, $('.mi[data-k="nora"]')); $('.mi[data-k="nora"]').classList.add("on2"); await S(1100); $('.mi[data-k="nora"]').classList.remove("on2");
    moveTo(canvas, $('.mi[data-k="maya"]')); $('.mi[data-k="maya"]').classList.add("on2"); await S(800); await tap(canvas); $('.mi[data-k="maya"]').classList.remove("on2");
    $("#fa-menu").classList.remove("on");
    const setP = (i, k) => { const p = $("#fa-p" + i); p.classList.remove("empty"); p.querySelector("span").outerHTML = `<span style="display:flex;align-items:center;gap:8px">${av(k)}${NAME[k]}</span>`; };
    setP(0, "maya"); $("#fa-n").textContent = "3 items still need a person";
    moveTo(canvas, $("#fa-b0"), 0.2, 0.5); await S(800); if (!alive()) return; await tap(canvas);
    await typeInto($("#fa-b0"), ITEMS[0].brief, alive); if (!alive()) return;
    for (let i = 1; i < 4 && alive(); i++) { moveTo(canvas, $("#fa-p" + i)); await S(450); setP(i, ITEMS[i].who); $("#fa-n").textContent = i === 3 ? "Everyone has a person" : `${3 - i} item${3 - i > 1 ? "s" : ""} still need a person`; }
    await S(500); moveTo(canvas, $("#fa-next")); await S(900); await tap(canvas, $("#fa-next"));
    shot(3); scene("review"); await S(1300); if (!alive()) return;
    moveTo(canvas, $("#fv-send")); await S(1000); await tap(canvas, $("#fv-send"));
    await toast('<i data-lucide="send"></i>Hand-over sent to Maya, Ethan and Daniel', 1500); if (!alive()) return;
    shot(4); scene("receive"); $(".mini-cursor", canvas).style.left = "900px"; await S(1100); if (!alive()) return;
    moveTo(canvas, $("#fr-all")); await S(1000); await tap(canvas, $("#fr-all"));
    $("#fr-a0").classList.add("acc"); await S(200); $("#fr-a1").classList.add("acc");
    await toast(`${av("maya")}Maya accepted 2 items`, 2200); if (!alive()) return;
    await S(600); play();
  }
  $("#hreplay").onclick = () => play();
  play();

  /* ── clips: each plays while it is on screen ── */
  const CLIPS = {
    "hc-remind": {
      html: `<div class="center"><div class="card2"><div style="display:flex;align-items:center;gap:9px;font-weight:700;font-size:15px"><i data-lucide="plane" style="width:17px;height:17px"></i>Your leave starts in</div>
        <div class="count" id="rc">3 <small>days</small></div><div style="font-size:13px;color:var(--muted);margin:2px 0 12px">Vacation, Oct 12 – Oct 15</div><span class="bt p"><i data-lucide="users"></i>Hand over work</span></div></div>`,
      async loop(el, alive) { const c = $("#rc", el); while (alive()) { for (const n of [3, 2, 1]) { c.innerHTML = `${n} <small>day${n > 1 ? "s" : ""}</small>`; c.classList.remove("fade-in"); void c.offsetWidth; c.classList.add("fade-in"); await S(1600); if (!alive()) return; } } },
    },
    "hc-select": {
      html: `<div class="center" style="align-items:stretch;padding:16px 20px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span id="sn" style="font-size:13px;color:var(--muted)">0 of 5 selected</span><span class="link" id="sl">Select the 4 due by the end of your leave</span></div>
        <table>${ITEMS.slice(0, 5).map((it, i) => `<tr data-i="${i}"><td style="width:30px"><span class="cb"><i data-lucide="check"></i></span></td><td>${it.t}</td><td><span class="due ${it.flag ? "warn" : ""}">${it.due}</span></td></tr>`).join("")}</table></div>` + CUR,
      async loop(el, alive) { while (alive()) { $$("tr", el).forEach((r) => r.classList.remove("sel")); $("#sn", el).textContent = "0 of 5 selected"; await S(900); moveTo(el, $("#sl", el)); await S(1000); if (!alive()) return; await tap(el);
        for (let i = 0; i < 4; i++) { $(`tr[data-i="${i}"]`, el).classList.add("sel"); $("#sn", el).textContent = `${i + 1} of 5 selected`; await S(280); } await S(2600); } },
    },
    "hc-pick": {
      html: `<div class="center"><div class="card2" style="max-width:340px"><div style="font-size:13.5px;font-weight:600;margin-bottom:10px">Review App Store copy</div>
        ${["maya", "daniel", "ethan", "nora"].map((k) => `<div class="mi" data-k="${k}" style="cursor:pointer">${av(k)}<span>${NAME[k]}${k === "nora" ? '<small class="away">Away Oct 13 – Oct 14</small>' : '<small>Here all week</small>'}</span></div>`).join("")}</div><div class="kres" id="pr"></div></div>` + CUR,
      init(el) { $$(".mi", el).forEach((m) => (m.onclick = () => { this.user = Date.now(); this.pick(el, m.dataset.k); })); },
      pick(el, k) { $$(".mi", el).forEach((m) => m.classList.toggle("on2", m.dataset.k === k)); const r = $("#pr", el); r.className = "kres fade-in"; r.textContent = k === "nora" ? "Nora is away for part of your leave. Pick someone else?" : `${NAME[k]} will cover it.`; },
      async loop(el, alive) { let i = 0; while (alive()) { await S(1200); if (!alive()) return; if (Date.now() - (this.user || 0) < 8000) continue; const k = ["nora", "ethan"][i++ % 2]; moveTo(el, $(`.mi[data-k="${k}"]`, el)); await S(1000); await tap(el); this.pick(el, k); await S(2400); } },
    },
    "hc-brief": {
      html: `<div class="center"><div class="card2"><div style="font-size:13.5px;font-weight:600">Send drafts to Acme</div><div style="font-size:12px;color:var(--dim);margin:2px 0 10px">Task · High priority · to Maya</div>
        <div class="brief" id="bb" style="min-height:36px"></div><div class="counter" id="bc"></div></div></div>`,
      async loop(el, alive) { const text = "Nora has the logo files. Send all three sizes with the logo on the left, and copy me so I can see it when I'm back. The client prefers PDF over PNG, and Friday morning is the deadline they agreed to."; const b = $("#bb", el), c = $("#bc", el);
        while (alive()) { b.textContent = ""; c.textContent = ""; c.classList.remove("warn"); await S(800); for (let k = 1; k <= text.length; k++) { if (!alive()) return; b.textContent = text.slice(0, k); if (k >= 220) { c.textContent = `${k} / 280`; c.classList.add("warn"); } await S(22); } await S(2600); } },
    },
    "hc-accept": {
      html: `<div class="center" style="align-items:stretch;padding:16px 22px"><div style="font-size:14.5px;font-weight:700;margin-bottom:4px">Sam asked you to cover 3 items</div><div style="font-size:12.5px;color:var(--muted);margin-bottom:6px">While Sam is away Oct 12 – Oct 15</div>
        ${[["Send drafts to Acme", "Task · due Oct 11"], ["Review App Store copy", "Task · due Oct 14"], ["Weekly KPI report", "Task · due Oct 15"]].map(([t, m], i) => `<div class="rrow" data-i="${i}"><div class="tt">${t}<small>${m}</small></div><span class="ad"><span data-a="acc" style="cursor:pointer">Accept</span><span data-a="dec" style="cursor:pointer">Decline</span></span></div>`).join("")}
        <div class="kres" id="ar" style="text-align:left;margin-top:8px"></div></div>` + CUR,
      init(el) { $$(".ad span", el).forEach((s) => (s.onclick = () => { this.user = Date.now(); this.set(el, +s.closest(".rrow").dataset.i, s.dataset.a); })); },
      set(el, i, a) { const row = $(`.rrow[data-i="${i}"]`, el); const [ac, dc] = row.querySelectorAll(".ad span"); ac.className = a === "acc" ? "acc" : ""; dc.className = a === "dec" ? "dec" : ""; row.classList.toggle("declined", a === "dec");
        const n = $$(".dec", el).length; const r = $("#ar", el); r.textContent = n ? "Why are you declining? (optional, Sam will see this)" : ""; },
      async loop(el, alive) { while (alive()) { if (Date.now() - (this.user || 0) < 8000) { await S(1500); continue; } [0, 1, 2].forEach((i) => this.set(el, i, "")); await S(900);
        for (const [i, a] of [[0, "acc"], [1, "acc"], [2, "dec"]]) { if (!alive()) return; moveTo(el, $(`.rrow[data-i="${i}"] [data-a="${a}"]`, el)); await S(900); await tap(el); this.set(el, i, a); await S(300); } await S(2800); } },
    },
    "hc-reply": {
      html: `<div class="center" style="gap:10px"><div class="hi fade-in" id="r1" style="width:100%;max-width:330px">${av("maya")}<span>Maya accepted 2 items<small>Send drafts to Acme, Spring banners</small></span></div>
        <div class="hi" id="r2" style="width:100%;max-width:330px;opacity:0">${av("daniel")}<span>Daniel declined 1 item<small>"In client workshops all week."</small></span></div>
        <div class="hi" id="r3" style="width:100%;max-width:330px;opacity:0"><i data-lucide="undo-2" style="width:16px;height:16px"></i><span>Weekly KPI report<small>Choose someone else</small></span>${av("ethan")}</div></div>`,
      async loop(el, alive) { while (alive()) { ["r2", "r3"].forEach((i) => { $("#" + i, el).style.opacity = 0; $("#" + i, el).classList.remove("fade-in"); }); await S(1300);
        for (const i of ["r2", "r3"]) { if (!alive()) return; const e = $("#" + i, el); e.style.opacity = 1; e.classList.add("fade-in"); await S(1500); } await S(2400); } },
    },
    "hc-brieftask": {
      html: `<div class="center"><div class="task"><div class="tt"><span class="ring"></span>Send drafts to Acme</div><div style="font-size:12px;color:var(--dim);margin-top:4px">High priority · due Oct 11</div>
        <div class="hob" id="hb"><b>Hand-over brief</b>Nora has the logo files. Send all three sizes, logo on the left.<small id="hbs">Sam handed this to Maya · Oct 12 – Oct 15 · waiting for Maya</small></div></div></div>`,
      async loop(el, alive) { while (alive()) { const b = $("#hb", el); b.classList.remove("ok"); $("#hbs", el).textContent = "Sam handed this to Maya · Oct 12 – Oct 15 · waiting for Maya"; await S(2200); if (!alive()) return; b.classList.add("ok"); $("#hbs", el).textContent = "Sam handed this to Maya · Oct 12 – Oct 15 · Maya accepted"; await S(3200); } },
    },
    "hc-away": {
      html: `<div class="center"><div class="task" style="max-width:340px;opacity:.75"><div style="display:flex;align-items:center;gap:12px">${av("sam", "a")}<div><div style="font-weight:700">Sam Rivera</div><div style="font-size:12px;color:var(--dim)">Designer</div></div></div>
        <div style="margin-top:10px;font-size:13px;color:#c4b5fd;display:flex;align-items:center;gap:6px"><i data-lucide="sun" style="width:14px;height:14px"></i>On leave · back Oct 16</div></div>
        <div class="bubble fade-in" id="aw" style="font-size:13px;color:var(--muted)">On leave, back Oct 16. Messages will wait for them.</div></div>`,
      async loop(el, alive) { const a = $("#aw", el); while (alive()) { a.classList.remove("fade-in"); void a.offsetWidth; a.classList.add("fade-in"); await S(3600); } },
    },
    "hc-tab": {
      html: `<div class="hcols">
        <div class="hcol"><h5>Waiting on you<span>1</span></h5><div class="hi"><span>Approve hero copy<small>From Daniel</small></span>${av("daniel")}</div></div>
        <div class="hcol"><h5>You're covering<span>2</span></h5><div class="hi"><span>Client check-in notes<small>For Ethan · until Oct 10</small></span>${av("ethan")}</div><div class="hi"><span>Launch email<small>For Nora · until Oct 14</small></span>${av("nora")}</div></div>
        <div class="hcol" id="hoff"><h5>Handed off<span id="hoc">0</span></h5></div></div>`,
      async loop(el, alive) { const col = $("#hoff", el); while (alive()) { $$(".hi", col).forEach((x) => x.remove()); $("#hoc", el).textContent = 0; await S(900);
        for (const [i, it] of ITEMS.slice(0, 4).entries()) { if (!alive()) return; const d = document.createElement("div"); d.className = "hi fade-in"; d.innerHTML = `${it.t}${av(it.who)}`; col.appendChild(d); $("#hoc", el).textContent = i + 1; await S(600); } await S(3000); } },
    },
    "hc-back": {
      html: `<div class="back"><div><div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)">Thursday, Oct 16</div><div style="font-size:28px;font-weight:700;letter-spacing:-.02em;margin-top:6px">Welcome back, Sam.</div>
        <div style="font-size:14px;color:var(--muted);margin-top:8px;line-height:1.55">4 items come back to you. 3 were finished while you were away.</div></div>
        <div class="ret">${ITEMS.slice(0, 4).map((it, i) => `<div class="hi">${av(it.who)}<span>${it.t}<small>${i === 3 ? `${NAME[it.who]}: "Numbers are in, chart still to do."` : `Done by ${NAME[it.who]}`}</small></span><span class="st ${i === 3 ? "p" : "d"}">${i === 3 ? "Yours again" : "Done"}</span></div>`).join("")}</div></div>`,
      async loop(el, alive) { while (alive()) { const r = $$(".ret .hi", el); r.forEach((x) => x.classList.remove("in")); await S(800); for (const x of r) { if (!alive()) return; x.classList.add("in"); await S(450); } await S(3400); } },
    },
  };
  Object.entries(CLIPS).forEach(([id, c]) => {
    const el = $("#" + id); if (!el) return;
    el.insertAdjacentHTML("beforeend", c.html); c.init && c.init(el);
    let token = 0;
    const io = new window.IntersectionObserver(([e]) => { token++; if (e.isIntersecting) { const me = token; c.loop(el, () => me === token && !dead && !document.hidden); } }, { threshold: 0.35 });
    io.observe(el); observers.push(io);
  });
  icons();

  /* ── reveal on scroll + chapter menu ── */
  const rio = new window.IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { threshold: 0.12 });
  $$(".rv").forEach((e) => rio.observe(e)); observers.push(rio);
  const links = $$(".cnav a[data-ch]");
  const cio = new window.IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.dataset.ch === e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  $$(".chap").forEach((c) => cio.observe(c)); observers.push(cio);

  /* ── the journey: chapters light up as you reach them, the line fills as you scroll ── */
  const chaps = $$(".chap");
  const jio = new window.IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = chaps.indexOf(e.target);
    chaps.forEach((c, k) => { c.classList.toggle("on", k === i); c.classList.toggle("past", k < i); });
  }), { rootMargin: "-35% 0px -55% 0px" });
  chaps.forEach((c) => jio.observe(c)); observers.push(jio);
  const fill = () => chaps.forEach((c) => { const r = c.getBoundingClientRect(), mid = window.innerHeight * .45; c.style.setProperty("--p", Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3)); });
  window.addEventListener("scroll", fill, { passive: true }); offs.push(() => window.removeEventListener("scroll", fill)); fill();

  /* ── the hand-over at the top: task cards fly from Sam to each teammate and land ── */
  {
    const band = $("#hpass"), air = $("#pass-air"), st = $("#pass-st");
    const TASKS = [["maya", "Send drafts to Acme"], ["ethan", "Review App Store copy"], ["daniel", "Weekly KPI report"]];
    const from = $(".pf-av", band);
    const fly = (card, a, b) => new Promise((res) => {
      if (reduce || !card.animate) { res(); return; }
      const dx = b.x - a.x, dy = b.y - a.y, lift = -70 - Math.abs(dy) * .2;
      const an = card.animate([
        { transform: `translate(${a.x}px,${a.y}px) scale(.6) rotate(-8deg)`, opacity: 0 },
        { transform: `translate(${a.x + dx * .15}px,${a.y + dy * .15 + lift * .6}px) scale(1) rotate(-4deg)`, opacity: 1, offset: .2 },
        { transform: `translate(${a.x + dx * .55}px,${a.y + dy * .5 + lift}px) scale(1.02) rotate(3deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${b.x}px,${b.y}px) scale(.55) rotate(0)`, opacity: .2 },
      ], { duration: 1100, easing: "cubic-bezier(.45,0,.25,1)" });
      an.onfinish = res;
    });
    const pt = (x) => { const r = x.getBoundingClientRect(), br = band.getBoundingClientRect(); return { x: r.left - br.left + r.width / 2 - 80, y: r.top - br.top + r.height / 2 - 18 }; };
    const svgEl = $("#pass-paths");
    const center = (x) => { const r = x.getBoundingClientRect(), br = band.getBoundingClientRect(); return { x: r.left - br.left + r.width / 2, y: r.top - br.top + r.height / 2 }; };
    const drawPaths = () => {
      const br = band.getBoundingClientRect(); svgEl.setAttribute("viewBox", `0 0 ${br.width} ${br.height}`);
      const a = center(from);
      svgEl.innerHTML = TASKS.map(([k]) => {
        const t = $(`.pt[data-k="${k}"] .pt-av`, band), b = center(t);
        const sx = a.x + 56, ex = b.x - 32, mx = (sx + ex) / 2, my = Math.min(a.y, b.y) - 70 - Math.abs(b.y - a.y) * .2;
        return `<path data-k="${k}" d="M${sx} ${a.y} Q ${mx} ${my} ${ex} ${b.y}"/>`;
      }).join("");
    };
    drawPaths(); window.addEventListener("resize", drawPaths); offs.push(() => window.removeEventListener("resize", drawPaths));
    let token = 0;
    const loop = async (me) => {
      while (me === token && !dead) {
        $$(".pt", band).forEach((p) => p.classList.remove("got")); drawPaths();
        st.textContent = "Leaving Friday"; from.classList.remove("away");
        await S(900);
        for (const [k, t] of TASKS) {
          if (me !== token || dead) return;
          const card = document.createElement("div"); card.className = "pass-card"; card.textContent = t; air.appendChild(card);
          const target = $(`.pt[data-k="${k}"]`, band);
          await fly(card, pt(from), pt($(".pt-av", target)));
          card.remove(); target.classList.add("got"); const path = svgEl.querySelector(`path[data-k="${k}"]`); if (path) path.classList.add("done");
          await S(350);
        }
        st.textContent = "Back Oct 16"; from.classList.add("away");
        await S(3000);
      }
    };
    const pio = new window.IntersectionObserver(([e]) => { token++; if (e.isIntersecting && !document.hidden) loop(token); }, { threshold: 0.4 });
    pio.observe(band); observers.push(pio);
  }

  return () => {
    dead = true;
    timers.forEach((id) => window.clearTimeout(id)); intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect()); offs.forEach((f) => f());
  };
}
