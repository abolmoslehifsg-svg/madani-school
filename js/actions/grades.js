/* =========================================================================
   اکشن‌های «نمرات»
   ========================================================================= */
Object.assign(A, {

/* ---------- نمرات ---------- */
addGrade: function(e) {
  e.preventDefault();
  const f = fd(e);
  const sc = parseFloat(en(f.score).replace('٫','.'));
  if (!(sc >= 0 && sc <= 20)) return toast('نمره باید بین ۰ تا ۲۰ باشد.', 'bad');
  if (needsConfirm()) {
    gradeDraft.push({sid:f.sid, subject:f.subject.trim(), type:f.type, score:sc, date:iso()});
    e.target.reset(); render();
    toast('به لیست انتظار اضافه شد — تأیید را بزن.', 'warn');
  } else {
    push('grades', {sid:f.sid, subject:f.subject.trim(), type:f.type, score:sc, date:iso()}, 'نمره ثبت شد.');
    audit('grade_add', 'grades', sname(f.sid) + ' · ' + f.subject + ' · ' + sc);
  }
},
confirmGrades: function() {
  if (!gradeDraft.length) return;
  gradeDraft.forEach(g => db.grades.push(Object.assign({id:uid()}, g)));
  const n = gradeDraft.length;
  audit('grade_add', 'grades', n + ' نمره تأیید شد');
  gradeDraft = []; save(); render();
  toast(n.toLocaleString('fa-IR') + ' نمره ثبت شد.', 'ok');
},
clearGradeDraft: function() { gradeDraft = []; render(); toast('لیست انتظار پاک شد.') },
rmGradeDraft: function(i) { gradeDraft.splice(+i, 1); render() },

csvGrades: function() {
  const src = db.grades.filter(g => {
    if (scoped()) return g.sid === me.sid;
    if (teacherScoped()) { const s = db.students.find(x=>x.id===g.sid); return s && me.classIds.includes(s.classId) }
    return true;
  });
  const rows = [['تاریخ','دانش‌آموز','درس','نوع','نمره']].concat(src.map(g => [
    g.date, (db.students.find(s=>s.id===g.sid)||{}).name||'', g.subject, g.type, g.score
  ]));
  csvDownload(rows, 'grades_'+iso()+'.csv');
  xlsxDownload(rows, 'grades_'+iso()+'.xlsx', 'نمرات');
  toast('خروجی گرفته شد.', 'ok');
},

gf: function(v) { gf = v; pg.grades = 1; render() },

});
