/**
 * BloomBoard web demo — in-memory stand-in for the Supabase JS client.
 *
 * The desktop app's own code runs unchanged; it believes it is signed in to a
 * team and talks to this fake instead of the network. Everything lives in
 * memory, so a page refresh restores the pristine demo.
 *
 * Exposes window.supabase (createClient) and window.__bbDemo (seed + simulation hooks).
 */
(function () {
  'use strict';

  var IDS = {
    team: 'b1f0a0d0-0000-4000-8000-0000000000aa',
    me: 'b1f0a0d0-0000-4000-8000-000000000001',
    yasmin: 'b1f0a0d0-0000-4000-8000-000000000002',
    omar: 'b1f0a0d0-0000-4000-8000-000000000003',
    lina: 'b1f0a0d0-0000-4000-8000-000000000004',
  };

  var ME_USER = {
    id: IDS.me,
    email: 'farhan@mybloomboard.app',
    user_metadata: { full_name: 'Farhan Fazil' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2026-05-01T09:00:00.000Z',
  };

  /* Team features only exist in the Team workspace; Personal and Freelance run signed out. */
  function signedIn() {
    try {
      var m = sessionStorage.getItem('bb-demo-workspace-mode');
      return !m || m === 'team';
    } catch (e) {
      return true;
    }
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  function nowIso() { return new Date().toISOString(); }
  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  /* ── Tables ─────────────────────────────────────────────────────────── */
  var DEFAULTS = {
    messages: { deleted: false, edited: false, pinned: false, reactions: {} },
    boards: { deleted: false },
    board_cards: { deleted: false },
    tasks: { deleted: false },
    notifications: { read: false },
  };
  var DB = {};
  [
    'teams', 'team_members', 'team_invites', 'conversations', 'messages', 'conversation_reads',
    'boards', 'board_cards', 'tasks', 'notifications', 'user_app_data', 'shared_leaves',
    'leave_shares', 'handovers', 'handover_items', 'bloom_calls', 'fl_client_actions',
  ].forEach(function (t) { DB[t] = []; });
  function table(name) { return DB[name] || (DB[name] = []); }

  function withDefaults(name, row) {
    var out = Object.assign({}, DEFAULTS[name] || {}, row);
    if (out.id == null && name !== 'conversation_reads' && name !== 'user_app_data') out.id = uuid();
    if (!out.created_at) out.created_at = nowIso();
    if (!out.updated_at) out.updated_at = out.created_at;
    return out;
  }

  /* ── Filters ────────────────────────────────────────────────────────── */
  function same(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a == b;
    return String(a) === String(b);
  }
  function likeToRegex(pattern) {
    var src = '';
    for (var i = 0; i < pattern.length; i++) {
      var ch = pattern[i];
      if (ch === '\\' && i + 1 < pattern.length) { src += pattern[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); continue; }
      if (ch === '%') src += '.*';
      else if (ch === '_') src += '.';
      else src += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    return new RegExp('^' + src + '$', 'i');
  }
  /* Realtime filter strings look like "conversation_id=eq.<id>". */
  function matchesRealtimeFilter(filter, row) {
    if (!filter) return true;
    var m = /^([a-z_]+)=(eq|neq|in)\.(.*)$/.exec(filter);
    if (!m || !row) return true;
    var v = row[m[1]];
    if (m[2] === 'eq') return same(v, m[3]);
    if (m[2] === 'neq') return !same(v, m[3]);
    var list = m[3].replace(/^\(|\)$/g, '').split(',');
    return list.some(function (x) { return same(v, x); });
  }

  /* ── Realtime ───────────────────────────────────────────────────────── */
  var channels = [];
  var presence = {}; // channelName -> { key: [meta] }

  function fire(fn, arg) {
    setTimeout(function () {
      try { fn(arg); } catch (e) { console.warn('[BB Demo] realtime handler error', e); }
    }, 0);
  }

  var changeListeners = [];

  function emitChange(tableName, eventType, newRow, oldRow) {
    changeListeners.forEach(function (fn) {
      fire(function () { fn(tableName, eventType, newRow ? clone(newRow) : null, oldRow ? clone(oldRow) : null); });
    });
    channels.forEach(function (ch) {
      ch._handlers.forEach(function (h) {
        if (h.type !== 'postgres_changes') return;
        var f = h.filter || {};
        if (f.table && f.table !== tableName) return;
        if (f.event && f.event !== '*' && f.event !== eventType) return;
        if (!matchesRealtimeFilter(f.filter, newRow || oldRow)) return;
        fire(h.cb, {
          schema: 'public', table: tableName, eventType: eventType,
          commit_timestamp: nowIso(), new: newRow ? clone(newRow) : {}, old: oldRow ? clone(oldRow) : {},
        });
      });
    });
  }

  function emitBroadcast(channelPrefix, event, payload) {
    channels.forEach(function (ch) {
      if (ch.topic.indexOf(channelPrefix) !== 0) return;
      ch._handlers.forEach(function (h) {
        if (h.type !== 'broadcast') return;
        if (h.filter && h.filter.event && h.filter.event !== '*' && h.filter.event !== event) return;
        fire(h.cb, { type: 'broadcast', event: event, payload: clone(payload) });
      });
    });
  }

  function emitPresenceSync(topic) {
    channels.forEach(function (ch) {
      if (ch.topic !== topic) return;
      ch._handlers.forEach(function (h) {
        if (h.type === 'presence' && (!h.filter || !h.filter.event || h.filter.event === 'sync')) fire(h.cb, {});
      });
    });
  }

  var broadcastListeners = [];

  function Channel(topic, opts) {
    this.topic = topic;
    this._opts = opts || {};
    this._handlers = [];
    this._presenceKey = (((this._opts.config || {}).presence) || {}).key || null;
    this.state = 'closed';
  }
  Channel.prototype.on = function (type, filter, cb) {
    if (typeof filter === 'function') { cb = filter; filter = {}; }
    this._handlers.push({ type: type, filter: filter || {}, cb: cb });
    return this;
  };
  Channel.prototype.subscribe = function (cb) {
    var self = this;
    if (channels.indexOf(self) < 0) channels.push(self);
    self.state = 'joined';
    setTimeout(function () {
      if (typeof cb === 'function') { try { cb('SUBSCRIBED'); } catch (e) { console.warn(e); } }
      if (self._handlers.some(function (h) { return h.type === 'presence'; })) emitPresenceSync(self.topic);
    }, 40);
    return self;
  };
  Channel.prototype.send = function (msg) {
    var topic = this.topic;
    if (msg && msg.type === 'broadcast') {
      broadcastListeners.forEach(function (fn) {
        try { fn(topic, msg.event, clone(msg.payload)); } catch (e) { console.warn(e); }
      });
    }
    return Promise.resolve('ok');
  };
  Channel.prototype.track = function (meta) {
    if (this._presenceKey) {
      var st = presence[this.topic] || (presence[this.topic] = {});
      st[this._presenceKey] = [Object.assign({ presence_ref: uuid() }, meta)];
      emitPresenceSync(this.topic);
    }
    return Promise.resolve('ok');
  };
  Channel.prototype.untrack = function () {
    if (this._presenceKey && presence[this.topic]) {
      delete presence[this.topic][this._presenceKey];
      emitPresenceSync(this.topic);
    }
    return Promise.resolve('ok');
  };
  Channel.prototype.presenceState = function () { return clone(presence[this.topic] || {}); };
  Channel.prototype.unsubscribe = function () {
    var i = channels.indexOf(this);
    if (i >= 0) channels.splice(i, 1);
    this.state = 'closed';
    return Promise.resolve('ok');
  };

  /* ── Query builder (the PostgREST subset the app uses) ──────────────── */
  function Query(name) {
    this.t = name;
    this.op = 'select';
    this.filters = [];
    this.orders = [];
    this.lim = null;
    this.one = null;
    this.cols = '*';
    this.returning = false;
    this.payload = null;
    this.conflict = 'id';
  }
  Query.prototype.select = function (cols) {
    this.cols = cols || '*';
    if (this.op !== 'select') this.returning = true;
    return this;
  };
  Query.prototype.insert = function (rows) { this.op = 'insert'; this.payload = rows; return this; };
  Query.prototype.upsert = function (rows, opts) {
    this.op = 'upsert'; this.payload = rows;
    this.conflict = (opts && opts.onConflict) || 'id';
    return this;
  };
  Query.prototype.update = function (patch) { this.op = 'update'; this.payload = patch; return this; };
  Query.prototype.delete = function () { this.op = 'delete'; return this; };
  function addFilter(q, fn) { q.filters.push(fn); return q; }
  Query.prototype.eq = function (c, v) { return addFilter(this, function (r) { return same(r[c], v); }); };
  Query.prototype.neq = function (c, v) { return addFilter(this, function (r) { return !same(r[c], v); }); };
  Query.prototype.gt = function (c, v) { return addFilter(this, function (r) { return r[c] > v; }); };
  Query.prototype.gte = function (c, v) { return addFilter(this, function (r) { return r[c] >= v; }); };
  Query.prototype.lt = function (c, v) { return addFilter(this, function (r) { return r[c] < v; }); };
  Query.prototype.lte = function (c, v) { return addFilter(this, function (r) { return r[c] <= v; }); };
  Query.prototype.is = function (c, v) { return addFilter(this, function (r) { return v === null ? r[c] == null : r[c] === v; }); };
  Query.prototype.in = function (c, list) {
    return addFilter(this, function (r) { return (list || []).some(function (v) { return same(r[c], v); }); });
  };
  Query.prototype.like = function (c, p) { var re = likeToRegex(p); return addFilter(this, function (r) { return re.test(String(r[c] || '')); }); };
  Query.prototype.ilike = Query.prototype.like;
  Query.prototype.contains = function (c, vals) {
    return addFilter(this, function (r) {
      var have = r[c];
      if (!Array.isArray(have)) return false;
      return (vals || []).every(function (v) { return have.some(function (h) { return same(h, v); }); });
    });
  };
  Query.prototype.match = function (obj) {
    var self = this;
    Object.keys(obj || {}).forEach(function (k) { self.eq(k, obj[k]); });
    return self;
  };
  Query.prototype.not = function (c, op, v) {
    var probe = new Query(this.t);
    probe[op](c, v);
    var fn = probe.filters[0];
    return addFilter(this, function (r) { return !fn(r); });
  };
  Query.prototype.order = function (c, opts) {
    this.orders.push({ c: c, asc: !opts || opts.ascending !== false });
    return this;
  };
  Query.prototype.limit = function (n) { this.lim = n; return this; };
  Query.prototype.range = function (from, to) { this.offset = from; this.lim = to - from + 1; return this; };
  Query.prototype.single = function () { this.one = 'single'; return this; };
  Query.prototype.maybeSingle = function () { this.one = 'maybe'; return this; };
  Query.prototype.abortSignal = function () { return this; };
  Query.prototype.then = function (resolve, reject) {
    var result;
    try { result = this._run(); } catch (e) { result = { data: null, error: { message: String(e && e.message || e) } }; }
    return Promise.resolve(result).then(resolve, reject);
  };
  Query.prototype.catch = function (reject) { return this.then(null, reject); };

  Query.prototype._matching = function () {
    var fs = this.filters;
    return table(this.t).filter(function (r) { return fs.every(function (f) { return f(r); }); });
  };

  /* Embedded relations like "*, teams(*)" → attach the parent row via <singular>_id. */
  Query.prototype._shape = function (rows) {
    var rels = [];
    var re = /([a-z_]+)\(\*\)/g, m;
    while ((m = re.exec(this.cols || ''))) rels.push(m[1]);
    return rows.map(function (r) {
      var out = clone(r);
      rels.forEach(function (rel) {
        var fk = rel.replace(/s$/, '') + '_id';
        out[rel] = clone(table(rel).find(function (p) { return same(p.id, r[fk]); }) || null);
      });
      return out;
    });
  };

  Query.prototype._finish = function (rows) {
    var data = this._shape(rows);
    if (this.one) {
      if (data.length === 0) {
        return this.one === 'single'
          ? { data: null, error: { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116' } }
          : { data: null, error: null };
      }
      return { data: data[0], error: null };
    }
    return { data: data, error: null, count: data.length };
  };

  Query.prototype._run = function () {
    var name = this.t;
    var rows = table(name);

    if (this.op === 'select') {
      var out = this._matching();
      if (this.orders.length) {
        var orders = this.orders;
        out = out.slice().sort(function (a, b) {
          for (var i = 0; i < orders.length; i++) {
            var o = orders[i], av = a[o.c], bv = b[o.c];
            if (av === bv) continue;
            if (av == null) return 1;
            if (bv == null) return -1;
            return (av < bv ? -1 : 1) * (o.asc ? 1 : -1);
          }
          return 0;
        });
      }
      if (this.offset) out = out.slice(this.offset);
      if (this.lim != null) out = out.slice(0, this.lim);
      return this._finish(out);
    }

    if (this.op === 'insert' || this.op === 'upsert') {
      var list = Array.isArray(this.payload) ? this.payload : [this.payload];
      var keys = String(this.conflict || 'id').split(',').map(function (s) { return s.trim(); });
      var written = [];
      var isUpsert = this.op === 'upsert';
      list.forEach(function (raw) {
        var idx = -1;
        if (isUpsert) {
          idx = rows.findIndex(function (r) {
            return keys.every(function (k) { return raw[k] != null && same(r[k], raw[k]); });
          });
        }
        if (idx >= 0) {
          var before = clone(rows[idx]);
          rows[idx] = Object.assign({}, rows[idx], raw, { updated_at: raw.updated_at || nowIso() });
          written.push(rows[idx]);
          emitChange(name, 'UPDATE', rows[idx], before);
        } else {
          var row = withDefaults(name, raw);
          rows.push(row);
          written.push(row);
          emitChange(name, 'INSERT', row, null);
        }
      });
      return this.returning ? this._finish(written) : { data: null, error: null };
    }

    if (this.op === 'update') {
      var patch = this.payload || {};
      var changed = this._matching().map(function (r) {
        var before = clone(r);
        Object.assign(r, patch);
        if (!('updated_at' in patch)) r.updated_at = nowIso();
        emitChange(name, 'UPDATE', r, before);
        return r;
      });
      return this.returning ? this._finish(changed) : { data: null, error: null };
    }

    if (this.op === 'delete') {
      var gone = this._matching();
      DB[name] = rows.filter(function (r) { return gone.indexOf(r) < 0; });
      gone.forEach(function (r) { emitChange(name, 'DELETE', null, r); });
      return this.returning ? this._finish(gone) : { data: null, error: null };
    }

    return { data: null, error: { message: 'Unsupported operation ' + this.op } };
  };

  /* ── RPCs ───────────────────────────────────────────────────────────── */
  var DEMO_ONLY = { message: 'This works in the Mac app — download BloomBoard to use it.' };
  function rpc(fn, args) {
    args = args || {};
    if (fn === 'respond_handover_items') {
      var ids = args.p_item_ids || args.item_ids || [];
      var status = args.p_status || args.status || 'accepted';
      table('handover_items').forEach(function (it) {
        if (ids.some(function (id) { return same(id, it.id); })) {
          var before = clone(it);
          it.status = status;
          it.updated_at = nowIso();
          emitChange('handover_items', 'UPDATE', it, before);
        }
      });
      return Promise.resolve({ data: true, error: null });
    }
    if (fn === 'return_handover') return Promise.resolve({ data: true, error: null });
    return Promise.resolve({ data: null, error: DEMO_ONLY });
  }

  /* ── Auth ───────────────────────────────────────────────────────────── */
  var authListeners = [];
  var auth = {
    getUser: function () {
      return Promise.resolve({ data: { user: signedIn() ? clone(ME_USER) : null }, error: null });
    },
    getSession: function () {
      var session = signedIn() ? { user: clone(ME_USER), access_token: 'demo', refresh_token: 'demo' } : null;
      return Promise.resolve({ data: { session: session }, error: null });
    },
    onAuthStateChange: function (cb) {
      authListeners.push(cb);
      if (signedIn()) setTimeout(function () { cb('SIGNED_IN', { user: clone(ME_USER) }); }, 0);
      return { data: { subscription: { unsubscribe: function () {
        var i = authListeners.indexOf(cb); if (i >= 0) authListeners.splice(i, 1);
      } } } };
    },
    signInWithPassword: function () { return Promise.resolve({ data: { user: clone(ME_USER), session: {} }, error: null }); },
    signUp: function () { return Promise.resolve({ data: { user: null }, error: DEMO_ONLY }); },
    signOut: function () { return Promise.resolve({ error: null }); },
    setSession: function () { return Promise.resolve({ data: { user: clone(ME_USER) }, error: null }); },
    updateUser: function (attrs) {
      if (attrs && attrs.data) ME_USER.user_metadata = Object.assign({}, ME_USER.user_metadata, attrs.data);
      return Promise.resolve({ data: { user: clone(ME_USER) }, error: null });
    },
    verifyOtp: function () { return Promise.resolve({ data: null, error: DEMO_ONLY }); },
    resetPasswordForEmail: function () { return Promise.resolve({ data: null, error: DEMO_ONLY }); },
    refreshSession: function () { return auth.getSession(); },
  };

  function createClient() {
    return {
      from: function (name) { return new Query(name); },
      rpc: rpc,
      auth: auth,
      channel: function (topic, opts) { return new Channel(topic, opts); },
      removeChannel: function (ch) { return ch && ch.unsubscribe ? ch.unsubscribe() : Promise.resolve('ok'); },
      removeAllChannels: function () { channels.slice().forEach(function (ch) { ch.unsubscribe(); }); return Promise.resolve([]); },
      getChannels: function () { return channels.slice(); },
      functions: { invoke: function () { return Promise.resolve({ data: null, error: DEMO_ONLY }); } },
      storage: {
        from: function () {
          return {
            upload: function () { return Promise.resolve({ data: null, error: DEMO_ONLY }); },
            getPublicUrl: function () { return { data: { publicUrl: '' } }; },
            remove: function () { return Promise.resolve({ data: null, error: null }); },
          };
        },
      },
    };
  }

  window.supabase = { createClient: createClient };

  /* ── Hooks for the seed and the simulation ─────────────────────────── */
  window.__bbDemo = {
    IDS: IDS,
    ME_USER: ME_USER,
    DB: DB,
    uuid: uuid,
    signedIn: signedIn,
    /** Seed rows without firing realtime events (used before the app boots). */
    seed: function (name, rows) {
      (Array.isArray(rows) ? rows : [rows]).forEach(function (r) { table(name).push(withDefaults(name, r)); });
    },
    /** Write as if another client did it — the app hears it over realtime. */
    /* Queries are lazy (they run on .then), so these helpers run them right away. */
    insert: function (name, row) { return Promise.resolve(new Query(name).insert(row).select().single()); },
    update: function (name, match, patch) { return Promise.resolve(new Query(name).update(patch).match(match)); },
    rows: function (name) { return table(name); },
    broadcast: emitBroadcast,
    onBroadcast: function (fn) { broadcastListeners.push(fn); },
    /** Every write, from the app or the simulation: fn(table, eventType, newRow, oldRow). */
    onChange: function (fn) { changeListeners.push(fn); },
    setPresence: function (topicPrefix, key, meta) {
      channels.forEach(function (ch) {
        if (ch.topic.indexOf(topicPrefix) !== 0) return;
        var st = presence[ch.topic] || (presence[ch.topic] = {});
        if (meta) st[key] = [Object.assign({ presence_ref: uuid() }, meta)];
        else delete st[key];
        emitPresenceSync(ch.topic);
      });
    },
    /** Presence to apply as soon as a matching channel subscribes. */
    presenceDefaults: {},
    channels: function () { return channels.slice(); },
  };

  /* Apply default presence when a presence channel is first subscribed. */
  var origSubscribe = Channel.prototype.subscribe;
  Channel.prototype.subscribe = function (cb) {
    var self = this;
    var defaults = window.__bbDemo.presenceDefaults;
    Object.keys(defaults).forEach(function (prefix) {
      if (self.topic.indexOf(prefix) !== 0) return;
      var st = presence[self.topic] || (presence[self.topic] = {});
      Object.keys(defaults[prefix]).forEach(function (key) {
        if (!st[key]) st[key] = [Object.assign({ presence_ref: uuid() }, defaults[prefix][key])];
      });
    });
    return origSubscribe.call(self, cb);
  };
})();
