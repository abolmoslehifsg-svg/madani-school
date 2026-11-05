/* =========================================================================
   اکشن‌های «مرخصی»
   ========================================================================= */
Object.assign(A, {

/* ---------- مرخصی ---------- */
addLeave: function(e) {
  e.preventDefault();
  const f = fd(e);
  if (!me.sid) return toast('حساب شما به دانش‌آموز متصل نیست.', 'bad');
  if (f.from > f.to) return toast('تاریخ شروع باید قبل از پایان باشد.', 'bad');
  push('leaves', {
    sid: me.sid, from: f.from, to: f.to, reason: f.reason.trim(),
    status: 'pending', by: me.id
  }, 'درخواست مرخصی ارسال شد.');
  audit('leave_request', 'leaves', sname(me.sid));
  e.target.reset();
},
leaveDecide: function(id, status) {
  if (!mgr()) return;
  const l = (db.leaves||[]).find(x => x.id === id);
  if (!l) return;
  l.status = status;
  l.decidedBy = me.id;
  l.decidedTs = Date.now();
  save(); render();
  toast(status==='ok'?'مرخصی تأیید شد.':'مرخصی رد شد.', 'ok');
  audit('leave_action', 'leaves', sname(l.sid) + ' · ' + status);
},

});
