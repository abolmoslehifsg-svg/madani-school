/* =========================================================================
   اکشن‌های «کاربران»
   ========================================================================= */
Object.assign(A, {

/* ---------- کاربران ---------- */
addUser: async function(e) {
  e.preventDefault();
  const f = fd(e);
  if (db.users.some(u => u.username.toLowerCase() === String(f.username||'').trim().toLowerCase())) return toast('این نام کاربری قبلاً وجود دارد.', 'bad');
  if (['parent','student'].includes(f.role) && !f.sid) return toast('دانش‌آموز مرتبط را انتخاب کنید.', 'bad');
  if (f.role === 'admin' && !isAdmin()) return toast('فقط مدیر می‌تواند مدیر بسازد.', 'bad');
  const formEl = e.target;
  const classIds = f.role === 'teacher'
    ? Array.from((formEl||document).querySelectorAll('input[name="classIds"]:checked')).map(c => c.value)
    : [];
  if (f.role === 'teacher' && !classIds.length) return toast('حداقل یک کلاس انتخاب کنید.', 'bad');
  db.users.push(await mkUser(f.username, f.name.trim(), f.role, f.pw, f.sid||'', classIds));
  audit('add', 'users', f.name + ' (' + ROLE[f.role] + ')');
  save(); render(); toast('کاربر اضافه شد.', 'ok');
},
roleChange: function(sel) {
  const role = sel.value;
  const root = (sel && sel.closest && (sel.closest('form') || sel.closest('.modal') || document)) || document;
  const sidLab = root.querySelector ? root.querySelector('#sidLab') : $('#sidLab');
  const clsLab = root.querySelector ? root.querySelector('#clsLab') : $('#clsLab');
  if (sidLab) sidLab.style.display = ['parent','student'].includes(role) ? '' : 'none';
  if (clsLab) clsLab.style.display = role === 'teacher' ? 'grid' : 'none';
},
dlTeacherTpl: function() {
  const rows = [['نام','نام کاربری','رمز','کلاس‌ها'],
                ['معلم نمونه','teacher2','123456','دهم ریاضی,دهم انسانی']];
  csvDownload(rows, 'نمونه_معلمان.csv');
  xlsxDownload(rows, 'نمونه_معلمان.xlsx', 'معلمان');
  toast('نمونه دانلود شد.', 'ok');
},
importTeachers: async function(file) {
  if (!file || !isAdmin()) return;
  try {
    const rows = await parseSheet(file);
    if (rows.length < 2) return toast('فایل خالی است.', 'bad');
    let added = 0, skipped = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !String(r[0]||'').trim()) continue;
      const name = String(r[0]).trim();
      const username = String(r[1]||'').trim();
      const pw = String(r[2]||'123456');
      const classesStr = String(r[3]||'');
      if (!name || !username || username.length < 3) { skipped++; continue }
      if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) { skipped++; continue }
      const classIds = classesStr.split(/[,،]/).map(n => findClassId(n.trim())).filter(Boolean);
      if (!classIds.length) { skipped++; continue }
      db.users.push(await mkUser(username, name, 'teacher', pw || '123456', '', classIds));
      added++;
    }
    save(); render();
    toast(added.toLocaleString('fa-IR') + ' معلم اضافه شد' + (skipped?` · ${skipped.toLocaleString('fa-IR')} رد شد`:''), added?'ok':'bad');
  } catch(err) { toast('خطا در خواندن فایل.', 'bad') }
},

});
