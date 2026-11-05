/* =========================================================================
   صفحه‌ی «داشبورد»
   ========================================================================= */
Object.assign(V, {

/* ---------- داشبورد ---------- */
dash: function() {
  const S = mine();
  const ids = S.map(s=>s.id);
  const gs = db.grades.filter(g => ids.includes(g.sid));
  const today = iso();
  const dayAtt = {};
  Object.keys(((db.att||{})[today]||{})).forEach(b => Object.assign(dayAtt, ((db.att||{})[today]||{})[b]||{}));

  const cls = myClasses().map(c => {
    const sids = db.students.filter(s=>s.classId===c.id).map(s=>s.id);
    return {n:c.name, a: avg(db.grades.filter(g=>sids.includes(g.sid)).map(g=>g.score))};
  }).filter(x => x.a != null);

  const an = annList().slice(0,3);
  const upcomingEvents = (db.showcase||[]).filter(e => !e.date || e.date >= today)
    .sort((a,b) => (a.ts||0) - (b.ts||0)).slice(0,3);
  const upcomingCal = (db.calendar||[]).filter(c => c.date >= today)
    .sort((a,b) => a.date.localeCompare(b.date)).slice(0,3);

  const dueHw = (() => {
    let list = (db.homework||[]).filter(h => {
      if (scoped()) { const s = db.students.find(x=>x.id===me.sid); return s && h.classId === s.classId }
      if (teacherScoped()) return (me.classIds||[]).includes(h.classId);
      return true;
    });
    if (scoped() && me.sid) list = list.filter(h => !h.submissions || !h.submissions[me.sid]);
    else if (teacherScoped()) list = list.filter(h => {
      const classStudents = db.students.filter(s => s.classId === h.classId);
      return classStudents.some(s => !h.submissions || !h.submissions[s.id]);
    });
    else list = [];
    return list;
  })();

  const pendingLeaves = (db.leaves||[]).filter(l => l.status === 'pending').length;

  return head('داشبورد', `خوش آمدید ${esc(me.name)}${db.year?` · سال تحصیلی ${esc(db.year)}`:''}`) +
    `<div class="stats">
      <div class="stat acc"><b>${S.length.toLocaleString('fa-IR')}</b><small>دانش‌آموز</small></div>
      ${scoped()?'':`<div class="stat"><b>${myClasses().length.toLocaleString('fa-IR')}</b><small>کلاس</small></div>
      <div class="stat ok"><b>${ids.filter(i=>dayAtt[i]&&dayAtt[i].status==='p').length.toLocaleString('fa-IR')}</b><small>حاضر امروز</small></div>
      <div class="stat bad"><b>${ids.filter(i=>dayAtt[i]&&dayAtt[i].status==='a').length.toLocaleString('fa-IR')}</b><small>غایب امروز</small></div>`}
      <div class="stat"><b>${f1(avg(gs.map(g=>g.score)))}</b><small>میانگین نمرات</small></div>
      ${dueHw.length?`<div class="stat warn"><b>${dueHw.length.toLocaleString('fa-IR')}</b><small>تکلیف در انتظار</small></div>`:''}
      ${pendingLeaves && mgr()?`<div class="stat warn"><b>${toFa(pendingLeaves)}</b><small>مرخصی در انتظار</small></div>`:''}
    </div>` +
    (scoped()?'':card('میانگین نمرات هر کلاس', cls.length
      ? `<div class="bars">${cls.map(c=>`<div><b>${f1(c.a)}</b><i style="height:${clamp(c.a*5,3,100)}%"></i><span>${esc(c.n)}</span></div>`).join('')}</div>`
      : empty('هنوز نمره‌ای ثبت نشده است.','📊'))) +
    (upcomingEvents.length?card('رویدادهای پیش‌رو',
      `<div class="events-grid">${upcomingEvents.map(e => evCardMini(e)).join('')}</div>`):'') +
    (upcomingCal.length?card('رویدادهای تقویم',
      `<div class="stack">${upcomingCal.map(c => `
        <div class="row" style="padding:8px 0;border-bottom:1px solid var(--bd)">
          <span><b>${esc(c.title)}</b></span>
          <span class="tag ${c.type==='exam'?'bad':c.type==='holiday'?'warn':c.type==='deadline'?'info':'p'}">${faDate(c.date)}</span>
        </div>`).join('')}</div>`):'') +
    card('آخرین اخبار', (db.news||[]).slice(0,3).map(n=>`<div class="ann"><div class="body"><b>${esc(n.title)}</b><p>${esc(n.body)}</p><small>${faDate(n.date)}</small></div></div>`).join('') || empty('خبری ثبت نشده.','📰')) +
    card('آخرین اعلانات', an.length
      ? an.map(a=>`<div class="ann"><div class="body"><b>${esc(a.title)}</b><p>${esc(a.body)}</p></div></div>`).join('')
      : empty('اعلانی وجود ندارد.','📢'));
},

});
