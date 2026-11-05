/* =========================================================================
   صفحه‌ی «کارنامه»
   ========================================================================= */
Object.assign(V, {

/* ---------- کارنامه ---------- */
rep: function() {
  const S = mine();
  if (!S.length) return head('کارنامه') + card('', empty('دانش‌آموزی برای نمایش وجود ندارد.','📈'));

  const s = S.find(x => x.id === rs) || S[0];
  const gs = db.grades.filter(g => g.sid === s.id);
  const scores = gs.map(g => g.score);
  const bySubject = {};
  gs.forEach(g => { (bySubject[g.subject] = bySubject[g.subject] || []).push(g) });

  const classMates = db.students.filter(x => x.classId === s.classId);
  const rankList = classMates.map(m => {
    const ms = db.grades.filter(g=>g.sid===m.id).map(g=>g.score);
    return {id:m.id, avg: avg(ms)};
  }).filter(x => x.avg != null).sort((a,b)=>b.avg-a.avg);
  const _ri = rankList.findIndex(x => x.id === s.id); const myRank = _ri >= 0 ? _ri + 1 : null;
  const classAvg = avg(rankList.map(x=>x.avg));

  const att = attForStudent(s.id);
  const attTotal = att.p + att.a + att.l + att.e;
  const attRate = attTotal ? Math.round((att.p / attTotal) * 100) : 0;

  const due = PERM[me.role].includes('fin')
    ? db.fin.filter(f => f.sid === s.id && !f.paid).reduce((t,f)=>t+f.amount,0)
    : null;

  const subjBars = Object.keys(bySubject).map(k=>{
    const a = avg(bySubject[k].map(g=>g.score));
    return `<div><b>${f1(a)}</b><i style="height:${clamp(a*5,3,100)}%"></i><span>${esc(k)}</span></div>`;
  }).join('');

  const subjRows = Object.keys(bySubject).map(k=>{
    const items = bySubject[k];
    const a = avg(items.map(g=>g.score));
    return `<tr>
      <td><b>${esc(k)}</b></td>
      <td>${toFa(items.length)}</td>
      <td>${items.map(g=>`<span class="tag" style="margin:1px">${esc(g.type)}: ${f1(g.score)}</span>`).join(' ')}</td>
      <td>${scoreTag(a)}</td>
    </tr>`;
  }).join('');

  const allRows = gs.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(g=>`<tr>
    <td>${faDate(g.date)}</td><td>${esc(g.subject)}</td><td>${esc(g.type)}</td><td>${scoreTag(g.score)}</td>
  </tr>`).join('');

  /* پرورشی */
  const provRecords = (db.provRecords||[]).filter(r => r.sid === s.id);
  const provSummary = provRecords.length ? provRecords.slice(0,10).map(r => {
    const ev = provEvent(r.eventId);
    const t = provType(r.typeId);
    return `<tr>
      <td>${faDate(new Date(r.ts).toLocaleDateString('en-CA'))}</td>
      <td>${t?esc(t.icon):''} ${ev?esc(ev.title):'—'}</td>
      <td>${esc(r.data && r.data.item || r.data && r.data.status || '')}</td>
      <td>${r.data && r.data.amount ? money(r.data.amount) : '—'}</td>
    </tr>`;
  }).join('') : '';

  return head('کارنامه', `${esc(s.name)} · ${cname(s.classId)}`) +
    (S.length > 1
      ? card('', `<label style="max-width:260px" class="np">انتخاب دانش‌آموز
          <select onchange="A.rs(this.value)">${stOpts(s.id)}</select></label>`)
      : '') +
    `<div class="report-card" style="margin-top:16px">
      <div class="report-head">
        <div>
          <div class="school">${esc(db.school)}</div>
          <div class="meta">سال تحصیلی ${esc(db.year||'—')} · ${esc(s.name)} · ${cname(s.classId)}</div>
          <div class="meta">کد ملی: ${toFa(s.nid)}</div>
        </div>
        <div class="badge-rank">
          ${myRank==null?'—':toFa(myRank)+' از '+toFa(rankList.length)}
          <small>رتبه در کلاس</small>
        </div>
      </div>
      <div class="report-grid">
        <div class="cell"><b>${f1(avg(scores))}</b><small>معدل کل</small></div>
        <div class="cell"><b>${f1(classAvg)}</b><small>میانگین کلاس</small></div>
        <div class="cell"><b>${toFa(scores.filter(x=>x>=17).length)}</b><small>نمره ۱۷+</small></div>
        <div class="cell"><b>${toFa(scores.filter(x=>x<10).length)}</b><small>نمره زیر ۱۰</small></div>
        <div class="cell"><b>${toFa(att.p)}</b><small>حاضر</small></div>
        <div class="cell"><b>${toFa(att.a)}</b><small>غایب</small></div>
        <div class="cell"><b>${toFa(att.l)}</b><small>تأخیر</small></div>
        <div class="cell"><b>${toFa(attRate)}٪</b><small>درصد حضور</small></div>
      </div>
      <h3 style="margin-top:8px">ریز نمرات به تفکیک درس</h3>
      ${Object.keys(bySubject).length
        ? `<table class="report-table">
            <thead><tr><th>درس</th><th>تعداد آزمون</th><th>نمرات</th><th>میانگین</th></tr></thead>
            <tbody>${subjRows}</tbody>
          </table>`
        : empty('نمره‌ای ثبت نشده است.','📝')}
      <h3 style="margin-top:20px">تاریخچه نمرات</h3>
      ${gs.length
        ? `<table class="report-table">
            <thead><tr><th>تاریخ</th><th>درس</th><th>نوع</th><th>نمره</th></tr></thead>
            <tbody>${allRows}</tbody>
          </table>`
        : empty('تاریخچه‌ای وجود ندارد.')}
      ${provSummary ? `<h3 style="margin-top:20px">فعالیت‌های پرورشی</h3>
        <table class="report-table">
          <thead><tr><th>تاریخ</th><th>رویداد</th><th>شرح</th><th>مبلغ</th></tr></thead>
          <tbody>${provSummary}</tbody>
        </table>` : ''}
      ${due != null ? `<div style="margin-top:18px" class="row">
        <b>مانده بدهی: <span class="tag ${due?'warn':'ok'}">${due?money(due):'بدون بدهی'}</span></b>
      </div>` : ''}
      <div class="report-sign">
        <div>امضای معلم</div>
        <div>امضای مدیر</div>
        <div>امضای ولی</div>
      </div>
      <div class="report-foot">
        <span>تاریخ صدور: ${faDate(iso())}</span>
        <span>${esc(db.school)} — سامانه مدیریت مدرسه</span>
      </div>
    </div>` +
    card('نمودار میانگین هر درس',
      Object.keys(bySubject).length
        ? `<div class="bars" style="height:180px">${subjBars}</div>`
        : empty('داده‌ای برای نمودار نیست.')) +
    `<div class="row np" style="margin-top:16px">
      <button class="b p" onclick="window.print()">🖨 چاپ کارنامه</button>
      <button class="b sm np" data-a="csvReport" data-i="${s.id}">خروجی CSV</button>
    </div>`;
},

});
