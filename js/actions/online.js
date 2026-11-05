/* =========================================================================
   اکشن‌های «کلاس آنلاین»
   ========================================================================= */
Object.assign(A, {

/* ---------- کلاس آنلاین ---------- */
addOnline: function(e) {
  e.preventDefault();
  const f = fd(e);
  const live = !!document.querySelector('input[name="live"]:checked');
  const item = {title:f.title, classId:f.classId, time:f.time, link:f.link, live,
                teacher:me.name, createdBy:me.id, ts:Date.now()};
  push('online', item, 'کلاس آنلاین ایجاد شد.');
},

});
