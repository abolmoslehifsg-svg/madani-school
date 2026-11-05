/* =========================================================================
   اکشن‌های «تنظیمات»
   ========================================================================= */
Object.assign(A, {

/* ---------- تنظیمات ---------- */
school: function(e) {
  e.preventDefault();
  const f = fd(e);
  db.school = f.school.trim();
  db.year = f.year.trim();
  save(); render(); toast('ذخیره شد.', 'ok');
},
toggle2FA: function(role, val) {
  if (!isAdmin()) return;
  if (!db.settings) db.settings = {twoFA:{admin:false, vice:false}};
  if (!db.settings.twoFA) db.settings.twoFA = {admin:false, vice:false};
  db.settings.twoFA[role] = !!val;
  save(); toast('ذخیره شد.', 'ok');
},
export: function() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(db)], {type:'application/json'}));
  a.download = 'school_backup_' + iso() + '.json';
  a.click();
},
import: async function(file) {
  if (!file || USE_SERVER) return;
  try {
    const d = JSON.parse(await file.text());
    if (!['users','students','classes','grades'].every(k => Array.isArray(d[k]))) throw 0;
    if (!confirm('اطلاعات فعلی جایگزین می‌شود. ادامه؟')) return;
    db = d; if (!db.v) db.v = 7;
    save(); me = null;
    sessionStorage.clear(); localStorage.removeItem('u');
    render(); toast('بازیابی شد؛ دوباره وارد شوید.', 'ok');
  } catch(e) { toast('فایل معتبر نیست.', 'bad') }
},
reset: function() {
  if (!USE_SERVER && confirm('همه اطلاعات پاک می‌شود. مطمئنید؟')) {
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('u');
    sessionStorage.clear(); location.hash = '';
    location.reload();
  }
},

});
