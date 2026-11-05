/* =========================================================================
   بخش پرورشی — coupon-tab
   ========================================================================= */
/* ---------- تب ۲: کوپن بوفه ---------- */
function provCouponTab() {
  const couponType = (db.provTypes||[]).find(t => t.op === 'coupon');
  if (!couponType) return empty('نوع «کوپن» تعریف نشده است.','🛒');

  const evs = (db.provEvents||[]).filter(e => e.typeId === couponType.id && e.active !== false);
  const myLeads = evs.filter(e => isProvereshiMgr() || (e.leaders||[]).includes(me.id));

  if (!myLeads.length && !isProvereshiMgr()) {
    return empty('شما سرپرست هیچ رویداد بوفه‌ای نیستید.','🛒');
  }

  const activeEvent = myLeads[0];
  if (!activeEvent) return empty('هنوز رویداد بوفه‌ای ایجاد نشده.','🛒');

  const records = provRecordsFor(activeEvent.id).sort((a,b) => b.ts - a.ts);
  const totalAmount = records.reduce((t,r) => t + (+(r.data&&r.data.amount||0)), 0);
  const todayRecords = records.filter(r => new Date(r.ts).toLocaleDateString('en-CA') === iso());

  const rows = records.slice(0, 20).map(r => `<tr>
    <td>${sname(r.sid)}</td>
    <td>${esc(r.data&&r.data.item||'—')}</td>
    <td>${money(r.data&&r.data.amount||0)}</td>
    <td>${faDT(r.ts)}</td>
    <td>${uname(r.by)}</td>
    <td>${isProvereshiMgr()?delBtn('provRecords',r.id):''}</td>
  </tr>`).join('');

  const eventSelector = myLeads.length > 1
    ? `<label style="max-width:320px">رویداد فعال<select onchange="A.provSelectEvent(this.value)">
        ${opts(myLeads.map(e=>[e.id, e.title + ' · ' + faDate(e.date)]), activeEvent.id)}
      </select></label>` : '';

  return card('کوپن بوفه — ' + esc(activeEvent.title),
    `<div class="stats">
      <div class="stat"><b>${toFa(records.length)}</b><small>کل کوپن</small></div>
      <div class="stat ok"><b>${money(totalAmount)}</b><small>مجموع مبلغ</small></div>
      <div class="stat warn"><b>${toFa(todayRecords.length)}</b><small>امروز</small></div>
    </div>
    <div class="row" style="margin-top:14px">${eventSelector}</div>
    <form class="fm" onsubmit="A.addCoupon(event)" style="margin-top:14px">
      <label>دانش‌آموز<select name="sid" required>${allStOpts()}</select></label>
      <label>شرح آیتم<input name="item" required placeholder="مثلاً ساندویچ + نوشابه"></label>
      <label>مبلغ (تومان)<input name="amount" inputmode="numeric" required></label>
      <button class="b p">ثبت کوپن</button>
    </form>
    <h3 style="margin-top:18px">آخرین کوپن‌ها</h3>
    ${tbl(['دانش‌آموز','آیتم','مبلغ','زمان','ثبت‌کننده',''], rows.split('</tr>').map(r=>r?r+'</tr>':''), 'کوپنی ثبت نشده.','🛒')}`);
}
