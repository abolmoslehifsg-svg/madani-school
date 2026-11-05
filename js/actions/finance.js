/* =========================================================================
   اکشن‌های «امور مالی»
   ========================================================================= */
Object.assign(A, {

/* ---------- امور مالی ---------- */
addFin: function(e) {
  e.preventDefault();
  const f = fd(e);
  const amt = parseInt(en(f.amount), 10);
  if (!(amt > 0)) return toast('مبلغ را درست وارد کنید.', 'bad');
  push('fin', {sid:f.sid, amount:amt, type:f.type, due:f.due, paid:false}, 'هزینه ثبت شد.');
},
pay: function(id) {
  const f = db.fin.find(x=>x.id===id);
  if (!f) return;
  f.paid = new Date().toISOString();
  save(); render(); toast('پرداخت ثبت شد.', 'ok');
},
csvFin: function() {
  const ids = mine().map(s=>s.id);
  const items = db.fin.filter(f => ids.includes(f.sid));
  const rows = [['دانش‌آموز','نوع','مبلغ','سررسید','وضعیت']].concat(items.map(f => [
    (db.students.find(s=>s.id===f.sid)||{}).name||'', f.type, f.amount, f.due||'', f.paid?'پرداخت شده':'پرداخت نشده'
  ]));
  csvDownload(rows, 'finance_'+iso()+'.csv');
  xlsxDownload(rows, 'finance_'+iso()+'.xlsx', 'مالی');
  toast('خروجی گرفته شد.', 'ok');
},

});
