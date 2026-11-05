/* =========================================================================
   موتور همگام‌سازی
   تفاوت وضعیت فعلی db با آخرین وضعیت تأییدشده‌ی سرور محاسبه و ارسال می‌شود.
   سرور مرجع نهایی است: اگر تغییری رد شود، داده‌ها از سرور بازخوانی می‌شود.
   ========================================================================= */
const SyncEngine = (() => {
  /* ترتیب مهم است: دانش‌آموز قبل از نمره/حضور، و کاربران آخر */
  const RECORD_COLLECTIONS = [
    'students', 'classes', 'grades', 'ann', 'news', 'showcase', 'calendar', 'fin', 'polls',
    'discipline', 'homework', 'quizzes', 'online', 'provTypes', 'provEvents', 'provElections',
    'leaves', 'provRecords', 'messages', 'audit', 'users'
  ];
  const APPEND_ONLY = ['audit'];
  const META_KEYS = ['school', 'year', 'settings', 'timetable'];
  const LOCAL_ONLY_FIELDS = ['readBy', 'seenBy'];   /* فقط در مرورگر نگه‌داری می‌شوند */
  const DEBOUNCE_MS = 400;
  const RETRY_MS = 4000;

  let snapshot = {records: {}, att: new Map(), meta: {}};
  let timer = null;
  let inFlight = false;
  let dirty = false;

  /* ---------- اثر انگشت رکوردها ---------- */
  const withoutLocalFields = record => {
    const copy = Object.assign({}, record);
    LOCAL_ONLY_FIELDS.forEach(field => delete copy[field]);
    return copy;
  };
  const fingerprint = record => {
    const copy = withoutLocalFields(record);
    delete copy.password;
    return JSON.stringify(copy);
  };

  function takeSnapshot() {
    const records = {};
    RECORD_COLLECTIONS.forEach(col => {
      const map = new Map();
      (db[col] || []).forEach(record => map.set(record.id, fingerprint(record)));
      records[col] = map;
    });

    const att = new Map();
    Object.entries(db.att || {}).forEach(([date, bells]) =>
      Object.entries(bells || {}).forEach(([bell, rows]) =>
        Object.entries(rows || {}).forEach(([sid, value]) =>
          att.set(JSON.stringify([date, bell, sid]), JSON.stringify(value)))));

    const meta = {};
    META_KEYS.forEach(key => { meta[key] = JSON.stringify(db[key] === undefined ? null : db[key]); });
    return {records, att, meta};
  }

  /* ---------- محاسبه‌ی تفاوت ---------- */
  function recordOps(next) {
    const ops = [];
    RECORD_COLLECTIONS.forEach(col => {
      const before = snapshot.records[col] || new Map();
      const after = next.records[col];
      const upsert = (db[col] || [])
        .filter(record => before.get(record.id) !== after.get(record.id))
        .map(withoutLocalFields);
      const remove = APPEND_ONLY.includes(col) ? []
        : Array.from(before.keys()).filter(id => !after.has(id));
      if (upsert.length || remove.length) ops.push({col, upsert, remove});
    });
    return ops;
  }

  function attendanceOp(next) {
    const parse = key => { const [date, bell, sid] = JSON.parse(key); return {date, bell, sid}; };
    const set = [];
    const remove = [];
    next.att.forEach((value, key) => {
      if (snapshot.att.get(key) !== value) set.push(Object.assign(parse(key), JSON.parse(value)));
    });
    snapshot.att.forEach((_, key) => { if (!next.att.has(key)) remove.push(parse(key)); });
    return set.length || remove.length ? [{col: 'att', set, remove}] : [];
  }

  function metaOp(next) {
    const changed = {};
    META_KEYS.forEach(key => { if (snapshot.meta[key] !== next.meta[key]) changed[key] = db[key]; });
    return Object.keys(changed).length ? [{col: 'meta', set: changed}] : [];
  }

  const buildOps = next => [...recordOps(next), ...attendanceOp(next), ...metaOp(next)];

  /* ---------- ارسال ---------- */
  const forgetPasswords = () => (db.users || []).forEach(user => { delete user.password; });

  function schedule(delay) {
    if (!USE_SERVER) return;
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(flush, delay === undefined ? DEBOUNCE_MS : delay);
  }

  async function flush() {
    timer = null;
    if (!USE_SERVER || !me || inFlight) return;
    const next = takeSnapshot();
    const ops = buildOps(next);
    dirty = false;
    if (!ops.length) return;

    inFlight = true;
    try {
      await api.sync(ops);
      snapshot = next;
      forgetPasswords();
    } catch (error) {
      await handleFailure(error);
    } finally {
      inFlight = false;
    }
    if (dirty) schedule();
  }

  async function handleFailure(error) {
    if (error.status === 401) return handleSessionExpired();
    if (error.status >= 400 && error.status < 500) {
      toast(error.message, 'bad');       /* رد شد: وضعیت را با سرور یکی کن */
      try { await reload(); } catch (reloadError) { /* بدون اتصال: بعداً */ }
      return;
    }
    toast('اتصال با سرور برقرار نیست؛ تغییرات پس از اتصال ارسال می‌شود.', 'warn');
    dirty = true;
    timer = setTimeout(flush, RETRY_MS);
  }

  /* ---------- API عمومی ---------- */
  async function flushNow() {
    clearTimeout(timer);
    while (inFlight) await sleep(50);
    await flush();
  }

  function flushOnUnload() {
    if (!USE_SERVER || !me || inFlight) return;
    const ops = buildOps(takeSnapshot());
    if (ops.length) api.syncOnUnload(ops);
  }

  /* ثبت وضعیت فعلی به‌عنوان «همگام‌شده» (بعد از بارگیری از سرور) */
  function reset() {
    clearTimeout(timer);
    timer = null;
    dirty = false;
    snapshot = takeSnapshot();
  }

  /* وقتی یک رکورد را خود سرور تغییر داده (مثل نمره‌ی آزمون) دوباره ارسال نشود */
  function rebase(col, id) {
    const record = (db[col] || []).find(item => item.id === id);
    if (record && snapshot.records[col]) snapshot.records[col].set(id, fingerprint(record));
  }

  const isIdle = () => !inFlight && !dirty && !timer;

  return {schedule, flush, flushNow, flushOnUnload, reset, rebase, isIdle};
})();
