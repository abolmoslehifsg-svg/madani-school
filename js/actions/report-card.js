/* =========================================================================
   اکشن‌های «کارنامه»
   ========================================================================= */
Object.assign(A, {

/* ---------- کارنامه ---------- */
rs: function(v) { rs = v; render() },
csvReport: function(sid) {
  const s = db.students.find(x => x.id === sid);
  if (!s) return;
  const gs = db.grades.filter(g => g.sid === sid);
  const att = attForStudent(sid);
  const rows = [
    ['کارنامه', s.name],
    ['کلاس', (db.classes.find(c=>c.id===s.classId)||{}).name||''],
    ['معدل', f1(avg(gs.map(g=>g.score)))],
    ['حاضر', att.p], ['غایب', att.a], ['تأخیر', att.l],
    [],
    ['تاریخ','درس','نوع','نمره']
  ].concat(gs.map(g => [g.date, g.subject, g.type, g.score]));
  csvDownload(rows, `report_${s.name}.csv`);
  toast('خروجی کارنامه گرفته شد.', 'ok');
},

});
