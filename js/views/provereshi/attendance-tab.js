/* =========================================================================
   بخش پرورشی — attendance-tab
   ========================================================================= */
/* ---------- تب ۳: نمازخانه / حضور ---------- */
function provAttendTab() {
  const attendType = (db.provTypes||[]).find(t => t.op === 'attend');
  if (!attendType) return empty('نوع «حضور» تعریف نشده است.','🕌');

  const evs = (db.provEvents||[]).filter(e => e.typeId === attendType.id && e.active !== false);
  const myLeads = evs.filter(e => isProvereshiMgr() || (e.leaders||[]).includes(me.id));

  if (!myLeads.length && !isProvereshiMgr()) {
    return empty('شما سرپرست هیچ رویداد حضوری نیستید.','🕌');
  }

  const activeEvent = myLeads[0];
  if (!activeEvent) return empty('هنوز رویداد حضوری ایجاد نشده.','🕌');

  const records = provRecordsFor(activeEvent.id).sort((a,b) => b.ts - a.ts);
  const todayStr = iso();
  const todayRecords = records.filter(r => new Date(r.ts).toLocaleDateString('en-CA') === todayStr);

  const rows = todayRecords.map(r => `<tr>
    <td>${sname(r.sid)}</td>
    <td>${esc(r.data&&r.data.status||'حاضر')}</td>
    <td>${faDT(r.ts)}</td>
    <td>${uname(r.by)}</td>
    <td>${isProvereshiMgr()?delBtn('provRecords',r.id):''}</td>
  </tr>`).join('');

  const eventSelector = myLeads.length > 1
    ? `<label style="max-width:320px">رویداد فعال<select onchange="A.provSelectEvent(this.value)">
        ${opts(myLeads.map(e=>[e.id, e.title + ' · ' + faDate(e.date)]), activeEvent.id)}
      </select></label>` : '';

  return card('ثبت حضور — ' + esc(activeEvent.title),
    `<div class="stats">
      <div class="stat ok"><b>${toFa(todayRecords.length)}</b><small>حاضر امروز</small></div>
      <div class="stat"><b>${toFa(records.length)}</b><small>کل رکوردها</small></div>
    </div>
    <div class="row" style="margin-top:14px">${eventSelector}</div>
    <form class="fm" onsubmit="A.addAttendRecord(event)" style="margin-top:14px">
      <label>دانش‌آموز<select name="sid" required>${allStOpts()}</select></label>
      <label>وضعیت<select name="status">
        ${opts([['حاضر','حاضر'],['غایب','غایب'],['امانت','ثبت امانت'],['سایر','سایر']])}
      </select></label>
      <label>توضیح (اختیاری)<input name="note" placeholder="مثلاً سجاده امانت"></label>
      <button class="b p">ثبت</button>
    </form>
    <h3 style="margin-top:18px">حاضران امروز</h3>
    ${tbl(['دانش‌آموز','وضعیت','زمان','ثبت‌کننده',''], rows.split('</tr>').map(r=>r?r+'</tr>':''), 'امروز رکوردی ثبت نشده.','🕌')}`);
}
