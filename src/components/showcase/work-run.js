/* eslint-disable */
// Animations for the Tasks & Boards page. Runs inside `root` and returns a cleanup
// (same pattern as handover-run.js).
import { ICONS } from "./icons";

export function run(root) {
  const timers = new Set(), observers = [], offs = [];
  let dead = false;
  const setTimeout = (f, ms) => { const id = window.setTimeout(() => { timers.delete(id); if (!dead) f(); }, ms); timers.add(id); return id; };
  const S = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const icons = (scope = root) => scope.querySelectorAll("i[data-lucide]").forEach((i) => {
    const svg = ICONS[i.getAttribute("data-lucide")]; if (!svg) return;
    const t = document.createElement("span"); t.innerHTML = svg; i.replaceWith(t.firstChild);
  });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const F = (k) => `/office/face-${k}.jpg`;
  const av = (k, cls = "av") => `<span class="${cls}" style="background-image:url(${F(k)})"></span>`;
  const ic = (n) => `<i data-lucide="${n}"></i>`;
  const CUR = '<div class="mcur"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg></div>';
  const moveTo = (el, t, dx = .5, dy = .6) => { const c = $(".mcur", el); if (!c || !t) return; const r = el.getBoundingClientRect(), q = t.getBoundingClientRect(); c.style.left = (q.left - r.left + q.width * dx) + "px"; c.style.top = (q.top - r.top + q.height * dy) + "px"; };

  /* ── headline: types a line, pauses, deletes, types the next.
     *word* is shown in the tasks colour, ~word~ in the boards colour. ── */
  {
    const LINES = ["Tasks for your *day*.\nBoards for your ~team~.", "Assign it. Tag them.\nSend it for *review*.", "Type it like you'd say it.\nThe *deadline* sets itself.", "One project.\nThe whole team on one ~board~.", "From To Do to *Done*,\nwithout a single meeting."];
    const el = $("#tw");
    const esc = (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === "\n" ? "<br>" : c;
    const plainLen = (t) => t.replace(/[*~]/g, "").length;
    const show = (t, k) => { let out = "", n = 0, open = ""; for (const ch of t) { if (ch === "*" || ch === "~") { if (open) { out += "</span>"; open = ""; } else { open = ch; out += `<span class="${ch === "*" ? "hl-t" : "hl-b"}">`; } continue; } if (n >= k) break; out += esc(ch); n++; } if (open) out += "</span>"; el.innerHTML = out; };
    if (el) {
      if (reduce) show(LINES[0], 1e9);
      else (async () => {
        for (let i = 0; !dead; i++) {
          const t = LINES[i % LINES.length], len = plainLen(t), p = t.replace(/[*~]/g, "");
          for (let k = 1; k <= len; k++) { show(t, k); await S(p[k - 1] === "," || p[k - 1] === "." ? 220 : 48 + Math.random() * 40); }
          await S(2600);
          for (let k = len; k >= 0; k--) { show(t, k); await S(24); }
          await S(380);
        }
      })();
    }
  }

  /* ── the sorter at the top ── */
  {
    const ITEMS = [["Weekly KPI report", "t"], ["Spring Campaign", "b"], ["Review Maya's banners", "t"], ["Website Relaunch", "b"], ["Send the invoice to Acme", "t"], ["Q4 Roadmap", "b"], ["Reply to the client's notes", "t"], ["Mobile App v2", "b"]];
    const drop = $("#drop"), bt = $("#bin-t"), bb = $("#bin-b"), sorter = $("#sorter");
    let token = 0;
    const loop = async (me) => {
      let i = 0;
      while (me === token && !dead) {
        const [text, where] = ITEMS[i++ % ITEMS.length];
        const chip = document.createElement("div"); chip.className = "chip " + where; chip.textContent = text;
        drop.appendChild(chip); await S(900); if (me !== token) return;
        const bin = where === "t" ? bt : bb;
        const r1 = chip.getBoundingClientRect(), r2 = bin.getBoundingClientRect();
        const dx = (r2.left + r2.width / 2) - (r1.left + r1.width / 2), dy = (r2.top + 20) - (r1.top + r1.height / 2);
        if (!reduce && chip.animate) await chip.animate([{ transform: "none" }, { transform: `translate(${dx * .5}px,${dy - 60}px) rotate(${where === "t" ? -6 : 6}deg)`, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.9)`, opacity: .3 }], { duration: 700, easing: "cubic-bezier(.45,0,.25,1)" }).finished.catch(() => {});
        chip.remove();
        const row = document.createElement("div"); row.className = "bin-row"; row.innerHTML = (where === "t" ? '<span class="circ"></span>' : '<span class="crd"></span>') + text;
        bin.prepend(row); while (bin.children.length > 4) bin.lastElementChild.remove();
        await S(500);
      }
    };
    const io = new window.IntersectionObserver(([e]) => { token++; if (e.isIntersecting) loop(token); }, { threshold: 0.4 });
    io.observe(sorter); observers.push(io);
  }

  /* ── the ten comparison clips ── */
  const SC = {
    "r1-t": {
      html: `<div class="card"><div class="card-hd">${ic("list-checks")}<b>My tasks</b><small>Today</small></div>${["Weekly KPI report", "Homepage hero redesign", "Send the invoice to Acme"].map((t, i) => `<div class="li" data-s><span class="circ"></span><span class="li-t">${t}</span>${i === 1 ? `<span class="asg" id="r1t-a">${av("maya")}Maya</span>` : ""}</div>`).join("")}<small class="note" id="r1t-n"></small></div>`,
      async loop(el, alive) { const L = $$("[data-s]", el), a = $("#r1t-a", el), n = $("#r1t-n", el); while (alive()) { L.forEach((x) => x.classList.remove("in")); a.classList.remove("in"); n.textContent = ""; await S(300); for (const x of L) { x.classList.add("in"); await S(350); } await S(900); if (!alive()) return; a.classList.add("in"); n.textContent = "Assigned to Maya. It's on her list now."; await S(2800); } },
    },
    "r1-b": {
      html: `<div class="card"><div class="cover" style="background-image:url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=160&fit=crop&auto=format&q=60)"></div><div class="card-hd"><b>Spring Campaign</b><span class="stack" id="r1b-st"></span></div><div class="mini-cols">${["To Do", "Doing", "Done"].map((c, i) => `<div class="mc"><small>${c}</small><div class="mcard">${av(["maya", "daniel", "ethan"][i])}</div></div>`).join("")}</div><small class="note" id="r1b-n"></small></div>`,
      async loop(el, alive) { const st = $("#r1b-st", el), n = $("#r1b-n", el), K = ["maya", "daniel", "nora", "ethan", "sam"]; while (alive()) { st.innerHTML = ""; for (let i = 0; i < K.length; i++) { st.insertAdjacentHTML("beforeend", av(K[i], "av pop")); n.textContent = `${i + 1} ${i ? "people" : "person"} on this board`; await S(380); } await S(2600); } },
    },
    "r2-t": {
      html: `<div class="col"><div class="input">${ic("text-cursor-input")}<span id="r2t-tx"></span><span class="caret"></span></div><div class="card task" id="r2t-task"><div class="li strong"><span class="circ"></span>Send banners to Acme</div><div class="chips"><span class="chip-s blue">Due Fri</span><span class="chip-s">${av("maya")}Maya</span></div></div></div>`,
      async loop(el, alive) { const tx = $("#r2t-tx", el), task = $("#r2t-task", el), s = "Send banners to Acme Friday @Maya"; while (alive()) { tx.textContent = ""; task.classList.remove("in"); await S(500); for (let i = 1; i <= s.length; i++) { if (!alive()) return; tx.textContent = s.slice(0, i); await S(45); } await S(400); task.classList.add("in"); await S(2600); } },
    },
    "r2-b": {
      html: `<div class="cols3">${["To Do", "Waiting on client", "Done"].map((c, i) => `<div class="kc" ${i === 1 ? 'id="r2b-col"' : ""}><small>${c}</small>${i === 0 ? '<div class="kcard">Landing page</div>' : i === 2 ? '<div class="kcard">Moodboard</div>' : ""}${i === 1 ? '<div class="add" id="r2b-add">+ Add card</div>' : ""}</div>`).join("")}</div>${CUR}`,
      async loop(el, alive) { const col = $("#r2b-col", el), add = $("#r2b-add", el); while (alive()) { $$(".kcard.new", col).forEach((x) => x.remove()); await S(700); moveTo(el, add); await S(900); if (!alive()) return; const c = document.createElement("div"); c.className = "kcard new"; c.textContent = "Logo files from client"; col.insertBefore(c, add); await S(2800); } },
    },
    "r3-t": {
      html: `<div class="card"><div class="li strong big"><span class="stat" id="r3t-s"></span><span>Homepage hero redesign</span></div><div class="st-line" id="r3t-l">To Do</div></div>${CUR}`,
      async loop(el, alive) { const s = $("#r3t-s", el), l = $("#r3t-l", el), ST = [["", "To Do"], ["half", "In Progress"], ["rev", "In Review"], ["done", "Done"]]; let i = 0; while (alive()) { const [c, t] = ST[i % 4]; s.className = "stat " + c; l.textContent = t; l.className = "st-line " + c; moveTo(el, s); await S(i % 4 === 3 ? 2400 : 1300); i++; } },
    },
    "r3-b": {
      html: `<div class="cols3" id="r3b">${["To Do", "In Progress", "Done"].map((c) => `<div class="kc"><small>${c}</small></div>`).join("")}</div><div class="kcard fly" id="r3b-card">${av("maya")}Spring banners</div>${CUR}`,
      async loop(el, alive) { const cols = $$("#r3b .kc", el), card = $("#r3b-card", el); let i = 0; while (alive()) { const c = cols[i % 3], r = c.getBoundingClientRect(), b = el.getBoundingClientRect(); card.style.left = (r.left - b.left + 8) + "px"; card.style.top = (r.top - b.top + 34) + "px"; const cur = $(".mcur", el); cur.style.left = (r.left - b.left + 60) + "px"; cur.style.top = (r.top - b.top + 50) + "px"; card.classList.toggle("lift", true); await S(800); card.classList.remove("lift"); await S(i % 3 === 2 ? 1800 : 900); i++; } },
    },
    "r4-t": {
      html: `<div class="card det"><div class="det-row"><b class="det-t">Spring campaign banners</b><span class="stack">${av("maya")}${av("daniel")}</span></div><div class="meta"><span class="hi">High</span><span>${ic("calendar-days")}Fri, Oct 9</span></div>${[["Key visual", "Maya"], ["Social sizes", "Daniel"], ["Copy review", "Maya"]].map(([t, w]) => `<div class="li sub" data-k><span class="cb"></span>${t}<small class="by">${w}</small></div>`).join("")}<div class="cmt" id="r4t-c">${av("sam")}<span><span class="m">@Maya</span> can you check the headline?</span></div></div>`,
      async loop(el, alive) { const L = $$("[data-k]", el), c = $("#r4t-c", el); while (alive()) { L.forEach((x) => x.classList.remove("done")); c.classList.remove("in"); await S(700); for (const x of L) { if (!alive()) return; x.classList.add("done"); await S(650); } if (!alive()) return; c.classList.add("in"); await S(2600); } },
    },
    "r4-b": {
      html: `<div class="card det"><b class="det-t">Landing page</b><div class="lbls"><span style="--c:#c4b5fd">Design</span><span style="--c:#6ee7b7">Web</span></div><div class="chk"><small>Checklist <b id="r4b-n">1/4</b></small><span class="bar"><i id="r4b-bar"></i></span></div><div class="cmt" id="r4b-c1">${av("daniel")}<span><span class="m">@Sam</span> can you check the hero?</span></div><div class="cmt" id="r4b-c2">${av("maya")}<span class="vn"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div><div class="file" id="r4b-f">${ic("file-text")}Brief.pdf</div></div>`,
      async loop(el, alive) { const n = $("#r4b-n", el), bar = $("#r4b-bar", el), parts = ["#r4b-c1", "#r4b-c2", "#r4b-f"].map((s) => $(s, el)); while (alive()) { parts.forEach((p) => p.classList.remove("in")); n.textContent = "1/4"; bar.style.width = "25%"; await S(600); for (const p of parts) { if (!alive()) return; p.classList.add("in"); await S(600); } n.textContent = "3/4"; bar.style.width = "75%"; await S(2600); } },
    },
    "r5-t": {
      html: `<div class="card"><div class="ms-hd"><b>Today's milestone</b><span id="r5t-n">0/7</span></div><span class="bar big"><i id="r5t-bar"></i></span><div class="streak"><img src="/chat/emoji/fire.png" alt=""><b id="r5t-s">11</b><small>day streak</small></div></div>`,
      async loop(el, alive) { const n = $("#r5t-n", el), bar = $("#r5t-bar", el), s = $("#r5t-s", el); while (alive()) { s.textContent = "11"; for (let i = 0; i <= 7; i++) { if (!alive()) return; n.textContent = `${i}/7`; bar.style.width = (i / 7 * 100) + "%"; await S(350); } s.textContent = "12"; s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop"); await S(2600); } },
    },
    "r5-b": {
      html: `<div class="btile"><div class="cover" style="background-image:url(https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&h=180&fit=crop&auto=format&q=60)"></div><div class="bt-b"><b>Team Offsite</b><span class="bar"><i id="r5b-bar"></i></span><small id="r5b-n">0 of 28 cards done</small></div></div>`,
      async loop(el, alive) { const bar = $("#r5b-bar", el), n = $("#r5b-n", el); while (alive()) { for (let i = 0; i <= 18; i += 2) { if (!alive()) return; bar.style.width = (i / 28 * 100) + "%"; n.textContent = `${i} of 28 cards done`; await S(160); } await S(2800); } },
    },
  };
  Object.entries(SC).forEach(([id, c]) => {
    const el = $("#" + id); if (!el) return;
    el.insertAdjacentHTML("beforeend", c.html); icons(el);
    let token = 0;
    const io = new window.IntersectionObserver(([e]) => { token++; if (e.isIntersecting) { const me = token; c.loop(el, () => me === token && !dead && !document.hidden); } }, { threshold: 0.35 });
    io.observe(el); observers.push(io);
  });

  /* ── reveal on scroll ── */
  const rio = new window.IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { threshold: 0.1 });
  $$(".rv").forEach((e) => rio.observe(e)); observers.push(rio);

  icons();
  return () => {
    dead = true;
    timers.forEach((id) => window.clearTimeout(id));
    observers.forEach((o) => o.disconnect()); offs.forEach((f) => f());
  };
}
