/* =========================================================================
   دامنه‌ی دسترسی داده‌ها بر اساس نقش
   ========================================================================= */
/* =========================================================================
   Scoping
   ========================================================================= */
const scoped        = () => me && (me.role === 'parent' || me.role === 'student');
const teacherScoped = () => me && me.role === 'teacher' && (me.classIds||[]).length > 0;
const mine = () => {
  if (scoped())        return db.students.filter(s => s.id === me.sid);
  if (teacherScoped()) return db.students.filter(s => me.classIds.includes(s.classId));
  return db.students;
};
const allowedChatPeers = () => {
  if (!me) return [];
  const others = db.users.filter(u => u.id !== me.id);
  if (me.role === 'admin' || me.role === 'vice') return others;
  if (me.role === 'teacher') {
    return others.filter(u => {
      if (u.role === 'admin' || u.role === 'vice' || u.role === 'teacher') return true;
      if ((u.role === 'student' || u.role === 'parent') && u.sid) {
        const st = db.students.find(s => s.id === u.sid);
        return st && (me.classIds||[]).includes(st.classId);
      }
      return false;
    });
  }
  if (me.role === 'student' || me.role === 'parent') {
    const st = db.students.find(s => s.id === me.sid);
    const cid = st && st.classId;
    return others.filter(u => {
      if (u.role === 'admin' || u.role === 'vice') return true;
      if (u.role === 'teacher' && cid && (u.classIds||[]).includes(cid)) return true;
      return false;
    });
  }
  return [];
};
const myClasses = () => teacherScoped()
  ? db.classes.filter(c => me.classIds.includes(c.id))
  : db.classes;
const sname = id => esc((db.students.find(s=>s.id===id)||{}).name || '—');
const cname = id => esc((db.classes.find(c=>c.id===id)||{}).name || '—');
const uname = id => esc((db.users.find(u=>u.id===id)||{}).name || '—');
const mgr   = () => me && (me.role === 'admin' || me.role === 'vice');
const isAdmin = () => me && me.role === 'admin';
const canMarkAtt = () => me && (me.role === 'admin' || me.role === 'vice' || me.role === 'teacher');
const needsConfirm = () => me && me.role === 'teacher';

/* ---------- کمک‌های پرورشی ---------- */
const isProvereshiMgr = () => me && (me.role === 'admin' || me.role === 'vice');
const provType = id => (db.provTypes||[]).find(t => t.id === id);
const provEvent = id => (db.provEvents||[]).find(e => e.id === id);
const isLeaderOf = (eventId) => {
  if (!me) return false;
  if (isProvereshiMgr()) return true;
  const ev = provEvent(eventId);
  return !!(ev && (ev.leaders||[]).includes(me.id));
};
const provRecordsFor = (eventId, sid) => (db.provRecords||[]).filter(r =>
  r.eventId === eventId && (!sid || r.sid === sid)
);
const sumProv = (eventId, key) => provRecordsFor(eventId)
  .reduce((t,r) => t + (+((r.data||{})[key]||0)), 0);
