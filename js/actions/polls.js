/* =========================================================================
   اکشن‌های «نظرسنجی»
   ========================================================================= */
Object.assign(A, {

/* ---------- نظرسنجی ---------- */
addPoll: function(e) {
  e.preventDefault();
  const f = fd(e);
  const options = f.options.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  if (options.length < 2) return toast('حداقل دو گزینه لازم است.', 'bad');
  push('polls', {title: f.title.trim(), options, votes:{}, img: f.img||'',
                 multi:false, createdBy: me.id, date: iso(), deadline: f.deadline||''}, 'نظرسنجی ایجاد شد.');
  e.target.reset();
},
vote: function(pid, opt) {
  const pl = (db.polls||[]).find(x=>x.id===pid);
  if (!pl) return;
  pl.votes = pl.votes || {};
  if (pl.deadline && iso() > pl.deadline) return toast('مهلت این نظرسنجی تمام شده.', 'bad');
  if (pl.votes[me.id] !== undefined) return toast('قبلاً رأی داده‌اید.', 'bad');
  pl.votes[me.id] = +opt;
  save(); render(); toast('رأی ثبت شد.', 'ok');
  audit('vote', 'polls', pl.title);
},

});
