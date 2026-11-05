/* =========================================================================
   صفحه‌ی «مرخصی»
   ========================================================================= */
Object.assign(V, {

/* ---------- مرخصی ---------- */
leaves: function() {
  const isMgr = mgr();
  const isParent = me.role === 'parent' || me.role === 'student';
  let list = (db.leaves||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0));

  if (isParent) list = list.filter(l => l.sid === me.sid);

  const p = paginate(list, 'leaves');

  const statusTag = s => s==='ok'?'<span class="tag ok">تأیید شده</span>'
    : s==='no'?'<span class="tag bad">رد شده</span>'
    : '<span class="tag warn">در انتظار</span>';

  const rows = p.slice.map(l=>`<div class="leave-card">
    <div class="body">
      <b>${sname(l.sid)}</b>
      <div>از ${faDate(l.from)} تا ${faDate(l.to)} · ${statusTag(l.status)}</div>
      <div class="mu" style="margin-top:4px">${esc(l.reason)}</div>
      ${l.decidedBy?`<small class="mu">بررسی توسط ${uname(l.decidedBy)} · ${faDT(l.decidedTs)}</small>`:''}
    </div>
    ${isMgr && l.status==='pending'
      ? `<div style="display:flex;gap:6px;flex-direction:column">
          <button class="b ok sm" data-a="leaveDecide" data-i="${l.id}" data-v="ok">تأیید</button>
          <button class="b d sm" data-a="leaveDecide" data-i="${l.id}" data-v="no">رد</button>
        </div>`
      : ''}
  </div>`);

  const form = isParent
    ? card('درخواست مرخصی',
      `<form class="fm" onsubmit="A.addLeave(event)">
        <label>از تاریخ<input type="date" name="from" required></label>
        <label>تا تاریخ<input type="date" name="to" required></label>
        <label style="grid-column:1/-1">دلیل<textarea name="reason" rows="2" required placeholder="مثلاً مراجعه به پزشک"></textarea></label>
        <button class="b p">ارسال درخواست</button>
      </form>`)
    : '';

  return head('مرخصی', isMgr ? 'بررسی درخواست‌های مرخصی' : 'درخواست مرخصی برای دانش‌آموز') +
    form +
    card('', rows.join('') || empty('درخواستی ثبت نشده.','🌴') + pagerHtml('leaves', p.total));
},

});
