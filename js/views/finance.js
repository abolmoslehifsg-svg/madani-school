/* =========================================================================
   صفحه‌ی «امور مالی»
   ========================================================================= */
Object.assign(V, {

/* ---------- امور مالی ---------- */
fin: function() {
  const ids = mine().map(s=>s.id);
  const items = db.fin.filter(f => ids.includes(f.sid));
  const sum = p => money(items.filter(f => !!f.paid === p).reduce((t,f)=>t+f.amount,0));
  const p = paginate(items, 'fin');
  const rows = p.slice.map(f=>`<tr>
    <td>${sname(f.sid)}</td>
    <td>${esc(f.type)}</td>
    <td>${money(f.amount)}</td>
    <td>${f.due?faDate(f.due):'—'}</td>
    <td><span class="tag ${f.paid?'ok':'warn'}">${f.paid?'پرداخت شده':'پرداخت نشده'}</span></td>
    <td>${isAdmin()?(f.paid?'':`<button class="b sm" data-a="pay" data-i="${esc(f.id)}">ثبت پرداخت</button> `)+delBtn('fin',f.id):''}</td>
  </tr>`);
  return head('امور مالی') +
    `<div class="stats">
      <div class="stat ok"><b>${sum(true)}</b><small>پرداخت‌شده</small></div>
      <div class="stat warn"><b>${sum(false)}</b><small>پرداخت‌نشده</small></div>
    </div>` +
    (isAdmin()?card('ثبت هزینه',
      `<form class="fm" onsubmit="A.addFin(event)">
        <label>دانش‌آموز<select name="sid" required>${stOpts()}</select></label>
        <label>مبلغ (تومان)<input name="amount" required inputmode="numeric"></label>
        <label>نوع<select name="type">${opts([['شهریه','شهریه'],['کتاب','کتاب'],['اردو','اردو'],['سایر','سایر']])}</select></label>
        <label>سررسید<input type="date" name="due"></label>
        <button class="b p">ثبت</button>
      </form>`):'') +
    card('',
      `<div class="row" style="margin-bottom:10px"><button class="b sm np" data-a="csvFin">خروجی CSV</button></div>` +
      tbl(['دانش‌آموز','نوع','مبلغ','سررسید','وضعیت',''], rows, 'موردی ثبت نشده.','💰') + pagerHtml('fin', p.total));
},

});
