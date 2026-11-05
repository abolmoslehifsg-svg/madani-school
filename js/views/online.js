/* =========================================================================
   صفحه‌ی «کلاس آنلاین»
   ========================================================================= */
Object.assign(V, {

/* ---------- کلاس آنلاین ---------- */
online: function() {
  const list = (db.online||[]).filter(o => {
    if (scoped()) { const s = db.students.find(x=>x.id===me.sid); return s && (!o.classId || o.classId===s.classId) }
    if (teacherScoped()) return !o.classId || me.classIds.includes(o.classId);
    return true;
  });
  const body = list.map(o=>{
    const isLive = o.live;
    return `<div class="online-card">
      <div>
        <div class="row"><b>${esc(o.title)}</b>${isLive?'<span class="live">زنده</span>':'<span class="tag">آفلاین</span>'}</div>
        <div class="mu" style="font-size:12.5px;margin-top:4px">
          ${cname(o.classId)} · ${esc(o.teacher||'')} · ${esc(o.time||'')}
        </div>
      </div>
      <a class="b p" href="${esc(o.link)}" target="_blank" rel="noopener">ورود به کلاس</a>
    </div>`;
  }).join('');
  const canCreate = me.role==='teacher'||mgr();
  return head('کلاس‌های آنلاین') +
    (canCreate?card('ایجاد کلاس آنلاین',
      `<form class="fm" onsubmit="A.addOnline(event)">
        <label>عنوان<input name="title" required></label>
        <label>کلاس<select name="classId">${opts(myClasses().map(c=>[c.id,c.name]))}</select></label>
        <label>زمان<input name="time" placeholder="۱۴۰۵/۰۷/۱۵ - ۱۰:۰۰"></label>
        <label style="grid-column:1/-1">لینک<input name="link" dir="ltr" required placeholder="https://meet.google.com/..."></label>
        <label class="inline"><input type="checkbox" name="live"> به عنوان «زنده» علامت بزن</label>
        <button class="b p">ایجاد</button>
      </form>`):'') +
    card('', body || empty('کلاس آنلاینی ثبت نشده.','🎥'));
},

});
