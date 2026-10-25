/* The demo's camera. While the demo plays on its own (the story typing tasks, the ghost cursor at work,
   a teammate knocking), it tells the page around it what to look at; the page zooms the demo window in on
   that part (LiveDemoFrame.tsx) and back out when nothing is happening. The app itself is never
   transformed, so everything inside keeps working as it is. The moment the visitor touches anything,
   the camera lets go and stays out until they have left the demo alone for a while. */
(function () {
  if (window.parent === window) return;
  var HOST = location.origin, IDLE_MS = 15000, HOLD_MS = 1600;
  var W = function () { return window.innerWidth || 1280; }, H = function () { return window.innerHeight || 920; };
  /* The part of the app a focus point belongs to, most specific first. A part bigger than most of the
     window is no help, so then a box around the point is used instead. */
  var SCENES = ['[role="dialog"]:not([hidden])', '.tl-knock', '#t2t-dashboard-card', '#bl-sc', '.ofr', '.office-dept', '.chat-main', '#chat-overlay .chat-conv-list', '.kb-col', '.calendar-grid', '.modal-box', '.dash-card', 'section'];
  var lastInput = 0, cur = null, idleSince = 0, knockSeen = '', knockUntil = 0;

  function send(rect) {
    var key = rect ? [rect.x, rect.y, rect.w, rect.h].map(Math.round).join(',') : '';
    if (key === (cur ? cur.key : '')) return;
    cur = rect ? { x: rect.x, y: rect.y, w: rect.w, h: rect.h, key: key } : null;
    try { window.parent.postMessage({ type: 'bb-demo-focus', rect: rect ? { x: rect.x, y: rect.y, w: rect.w, h: rect.h } : null }, HOST); } catch (e) {}
  }
  /* Padded, at least 700 x 480 (so it never zooms past about 1.8x) and inside the window. */
  function frame(r, wide) {
    var pad = 28, x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    var mw = wide ? 980 : 760, mh = wide ? 680 : 520;
    if (w < mw) { x -= (mw - w) / 2; w = mw; }
    if (h < mh) { y -= (mh - h) / 2; h = mh; }
    /* keep the window's shape, so the zoom fills the frame without bars */
    var ar = W() / H();
    if (w / h > ar) { var nh = w / ar; y -= (nh - h) / 2; h = nh; } else { var nw = h * ar; x -= (nw - w) / 2; w = nw; }
    if (w >= W() * 0.92) return null;   /* almost everything: just show everything */
    x = Math.max(0, Math.min(W() - w, x)); y = Math.max(0, Math.min(H() - h, y));
    if (x < 160) x = 0;   /* close to the left: keep the sidebar in the shot */
    return { x: x, y: y, w: w, h: h };
  }
  function around(px, py) {
    return frame({ left: px - 420, top: py - 260, width: 840, height: 520 });
  }
  function union(a, b) { if (!b) return a; var l = Math.min(a.left, b.left), t = Math.min(a.top, b.top); return { left: l, top: t, width: Math.max(a.right, b.right) - l, height: Math.max(a.bottom, b.bottom) - t }; }
  function sceneAt(px, py) {
    var el = document.elementFromPoint(px, py); if (!el) return around(px, py);
    var peek = el.closest('#station-peek, .sp-win');
    if (peek) { var pr = peek.getBoundingClientRect(), desk = document.querySelector('.station-card.peek-open, .station-card[aria-expanded="true"]'); var f0 = frame(union(pr, desk && desk.getBoundingClientRect()), true); if (f0) return f0; }
    for (var i = 0; i < SCENES.length; i++) {
      var s = el.closest(SCENES[i]);
      if (s) { var r = s.getBoundingClientRect(); if (r.width * r.height < W() * H() * 0.55) { var f = frame(r); if (f) return f; } }
    }
    return around(px, py);
  }
  function inside(px, py, r) { return r && px > r.x + 60 && px < r.x + r.w - 60 && py > r.y + 50 && py < r.y + r.h - 50; }
  function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H(); }

  function tick() {
    var now = Date.now();
    if (now - lastInput < IDLE_MS || document.visibilityState === 'hidden') { send(null); return; }
    /* A teammate knocking: look at the knock for a few seconds. */
    var k = document.querySelector('#tl-knocks .tl-knock:not(.missed)');
    if (k && visible(k) && k.getAttribute('data-id') !== knockSeen) { knockSeen = k.getAttribute('data-id'); knockUntil = now + 4500; }
    if (k && now < knockUntil) { send(frame(k.getBoundingClientRect())); idleSince = 0; return; }
    /* The story typing tasks. */
    var t2t = document.getElementById('t2t-input'), card = document.getElementById('t2t-dashboard-card');
    if (t2t && t2t.value && card && visible(card) && (window.__bbStoryRunning || document.activeElement !== t2t)) {
      var res = document.getElementById('t2t-results');
      send(frame(res && res.classList.contains('show') ? union(card.getBoundingClientRect(), res.getBoundingClientRect()) : card.getBoundingClientRect())); idleSince = 0; return;
    }
    /* The ghost cursor: where it is heading (its target position), and the part of the app there. */
    var g = document.getElementById('bb-demo-ghost');
    if (g && g.style.opacity === '1') {
      var m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(g.style.transform || '');
      if (m) {
        var px = +m[1], py = +m[2];
        if (!inside(px, py, cur)) send(sceneAt(px, py));
        idleSince = 0;
        return;
      }
    }
    /* Nothing going on: hold the shot a moment, then show everything. */
    if (!idleSince) idleSince = now;
    if (now - idleSince > HOLD_MS) send(null);
  }
  /* Not wheel: scrolling the page with the pointer over the demo is not using it. */
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function (e) { if (!e.isTrusted) return; lastInput = Date.now(); send(null); }, { passive: true, capture: true });
  });
  setInterval(tick, 200);
})();
