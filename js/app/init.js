/* =========================================================================
   راه‌اندازی برنامه: تشخیص سرور، بازیابی نشست، یا حالت آفلاین
   ========================================================================= */
const emptyDb = school => ({
  v: 7, school: school || 'مدرسه سمپاد شهید مدنی', year: '',
  users: [], students: [], classes: [], grades: [], att: {}, ann: [], news: [], fin: [],
  polls: [], discipline: [], homework: [], quizzes: [], online: [], messages: [], chats: {},
  provTypes: [], provEvents: [], provRecords: [], provElections: [],
  showcase: [], calendar: [], timetable: {}, leaves: [], audit: [],
  settings: {twoFA: {admin: false, vice: false}}
});

async function detectServer() {
  try {
    serverInfo = await api.publicInfo();
    USE_SERVER = !!serverInfo && typeof serverInfo.needsSetup === 'boolean';
  } catch (error) {
    USE_SERVER = false;
  }
}

async function restoreServerSession() {
  db = emptyDb(serverInfo.school);
  if (serverInfo.needsSetup) return;
  try {
    const result = await api.me();
    me = result.user;
    db = result.bootstrap;
    ReadState.apply(db);
    SyncEngine.reset();
    Realtime.start();
  } catch (error) {
    if (error.status !== 401) toast('اتصال به سرور برقرار نشد.', 'warn');
  }
}

/* ---------- حالت آفلاین (ذخیره در مرورگر) ---------- */
const DEFAULT_PROV_TYPES = () => [
  {id: 'pt1', name: 'بوفه', icon: '🛒', op: 'coupon', unit: 'تومان', active: true, createdBy: '', ts: Date.now()},
  {id: 'pt2', name: 'نمازخانه', icon: '🕌', op: 'attend', unit: '', active: true, createdBy: '', ts: Date.now()},
  {id: 'pt3', name: 'شورای دانش‌آموزی', icon: '🗳️', op: 'vote', unit: '', active: true, createdBy: '', ts: Date.now()}
];

function migrateOfflineDb(data) {
  if (data.v && data.v >= 7) return data;
  const defaults = emptyDb(data.school);
  Object.keys(defaults).forEach(key => { if (data[key] === undefined) data[key] = defaults[key]; });
  data.v = 7;
  data.year = data.year || '۱۴۰۵-۱۴۰۶';
  data.provTypes = data.provTypes.length ? data.provTypes : DEFAULT_PROV_TYPES();
  (data.polls || []).forEach(poll => { if (!('img' in poll)) poll.img = ''; });
  return data;
}

async function loadOfflineDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    db = raw ? migrateOfflineDb(JSON.parse(raw)) : await seed();
  } catch (error) {
    console.warn('اطلاعات ذخیره‌شده خراب است؛ بازنشانی می‌شود.');
    db = await seed();
  }
  save();
  const id = sessionStorage.getItem('u') || localStorage.getItem('u');
  me = (db.users || []).find(user => user.id === id) || null;
  if (me) Realtime.start();
}

(async function init() {
  applyTheme();
  await detectServer();
  if (USE_SERVER) await restoreServerSession();
  else await loadOfflineDb();

  page = location.hash.slice(1) || 'dash';
  render();

  window.addEventListener('beforeunload', () => {
    if (quizTimer) clearInterval(quizTimer);
    SyncEngine.flushOnUnload();
  });
})();
