/* =========================================================================
   اکشن‌های «اعلانات»
   ========================================================================= */
Object.assign(A, {

/* ---------- اعلانات ---------- */
annTarget: function(sel) {
  const box = document.getElementById('annClassBox');
  if (box) box.style.display = sel.value === 'class' ? '' : 'none';
},
addAnn: function(e) {
  e.preventDefault();
  const f = fd(e);
  push('ann', {
    title: f.title.trim(), target: f.target, classId: f.classId || '',
    body: f.body.trim(), date: new Date().toLocaleDateString('fa-IR'),
    authorId: me.id
  }, 'اعلان منتشر شد.');
},

});
