/* =========================================================================
   فیلتر اعلانات
   ========================================================================= */
/* ---------- لیست اعلانات با فیلتر ---------- */
function annList() {
  return (db.ann||[])
    .filter(a => {
      if (isProvereshiMgr()) return true;
      if (a.target === 'all') return true;
      if (a.target === me.role) return true;
      if (a.target === 'class' && a.classId) {
        const st = db.students.find(s=>s.id===me.sid);
        return st && st.classId === a.classId;
      }
      return false;
    })
    .sort((x,y) => (y.ts||0) - (x.ts||0));
}
