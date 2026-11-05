/* =========================================================================
   بخش پرورشی — report-tab
   ========================================================================= */
/* ---------- تب ۶: گزارش پرورشی ---------- */
function provReportTab() {
  const records = (db.provRecords||[]).slice();
  const byType = {};
  records.forEach(r => {
    const t = provType(r.typeId);
    if (!t) return;
    byType[t.name] = (byType[t.name] || 0) + 1;
  });

  const byStudent = {};
  records.forEach(r => {
    if (!byStudent[r.sid]) byStudent[r.sid] = {coupon:0, attend:0, total:0};
    const t = provType(r.typeId);
    if (t && t.op === 'coupon') byStudent[r.sid].coupon += (+(r.data&&r.data.amount||0));
    if (t && t.op === 'attend') byStudent[r.sid].attend++;
    byStudent[r.sid].total++;
  });

  const sortedStudents = Object.entries(byStudent).sort((a,b) => b[1].total - a[1].total);

  const summaryStats = `<div class="stats">
    <div class="stat"><b>${toFa(records.length)}</b><small>کل رکوردها</small></div>
    <div class="stat ok"><b>${money(records.reduce((t,r) => t + (+(r.data&&r.data.amount||0)), 0))}</b><small>مجموع کوپن‌ها</small></div>
    <div class="stat warn"><b>${toFa(records.filter(r => {
      const t = provType(r.typeId);
      return t && t.op === 'attend';
    }).length)}</b><small>ثبت‌های حضور</small></div>
  </div>`;

  const typeRows = Object.entries(byType).map(([name, count]) =>
    `<tr><td>${esc(name)}</td><td>${toFa(count)}</td></tr>`).join('');

  const stuRows = sortedStudents.slice(0, 30).map(([sid, data]) => `<tr>
    <td>${sname(sid)}</td>
    <td>${toFa(data.total)}</td>
    <td>${toFa(data.attend)}</td>
    <td>${money(data.coupon)}</td>
  </tr>`).join('');

  return `<div class="row" style="margin-bottom:10px">
    <button class="b sm" data-a="csvProv">خروجی کامل (CSV)</button>
  </div>` +
    summaryStats +
    card('به تفکیک نوع',
      typeRows ? tbl(['نوع','تعداد'], typeRows.split('</tr>').map(r=>r?r+'</tr>':''), 'داده‌ای نیست.','📊') : empty('داده‌ای نیست.','📊')) +
    card('به تفکیک دانش‌آموز',
      stuRows ? tbl(['دانش‌آموز','کل رکورد','حضور','مجموع کوپن'], stuRows.split('</tr>').map(r=>r?r+'</tr>':''), 'داده‌ای نیست.','📊') : empty('داده‌ای نیست.','📊'));
}
