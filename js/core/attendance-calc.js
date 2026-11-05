/* =========================================================================
   محاسبات مشترک حضور و غیاب
   ========================================================================= */
/* =========================================================================
   محاسبات مشترک حضور
   ========================================================================= */
function attDay(date, bell) {
  return ((db.att||{})[date]||{})[bell] || {};
}
function attForStudent(sid) {
  const stat = {p:0,a:0,l:0,e:0};
  Object.keys(db.att||{}).forEach(d => {
    Object.keys(db.att[d]||{}).forEach(b => {
      const rec = db.att[d][b][sid];
      if (rec && stat[rec.status] !== undefined) stat[rec.status]++;
    });
  });
  return stat;
}
function attSummaryText(date, bell) {
  const day = attDay(date, bell);
  const ids = Object.keys(day);
  if (!ids.length) return null;
  const groups = {p:[], a:[], l:[], e:[]};
  ids.forEach(id => {
    const r = day[id];
    const name = (db.students.find(s=>s.id===id)||{}).name || '—';
    if (groups[r.status]) groups[r.status].push({name, delay:r.delay||0});
  });
  const parts = [];
  if (groups.p.length) parts.push(`<span class="p">${groups.p.map(x=>esc(x.name)).join('، ')} حاضر</span>`);
  if (groups.a.length) parts.push(`<span class="a">${groups.a.map(x=>esc(x.name)).join('، ')} غایب</span>`);
  if (groups.l.length) parts.push(`<span class="l">${groups.l.map(x=>esc(x.name)+(x.delay?` (${toFa(x.delay)} دقیقه)`:'')).join('، ')} تأخیر</span>`);
  if (groups.e.length) parts.push(`${groups.e.map(x=>esc(x.name)).join('، ')} مرخصی`);
  return parts.join(' · ');
}
