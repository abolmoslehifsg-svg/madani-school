/* =========================================================================
   اکشن‌های «انضباطی»
   ========================================================================= */
Object.assign(A, {

/* ---------- انضباطی ---------- */
addDisc: function(e) {
  e.preventDefault();
  const f = fd(e);
  push('discipline', {sid:f.sid, type:f.type, desc:f.desc, severity:f.severity, date:iso(), by:me.id}, 'مورد ثبت شد.');
},

});
