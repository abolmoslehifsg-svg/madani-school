/* =========================================================================
   اکشن‌های «دانش‌آموزان»
   ========================================================================= */
Object.assign(A, {

/* ---------- دانش‌آموزان ---------- */
addStudent: function(e) {
  e.preventDefault();
  const f = fd(e), nid = en(f.nid);
  if (!validNid(nid)) return toast('کد ملی معتبر نیست.', 'bad');
  if (db.students.some(s => s.nid === nid)) return toast('این کد ملی قبلاً ثبت شده است.', 'bad');
  push('students', {name:f.name.trim(), nid, classId:f.classId, parent:f.parent.trim(), phone:en(f.phone||'')}, 'دانش‌آموز اضافه شد.');
  audit('add', 'students', 'دانش‌آموز: '+f.name);
},

csvStudents: function() {
  const list = mgr() ? db.students : mine();
  if (!list.length) return toast('دانش‌آموزی برای خروجی وجود ندارد.', 'bad');
  const rows = [['نام','کد ملی','کلاس','ولی','تلفن']].concat(list.map(s => {
    const cn = (db.classes.find(c=>c.id===s.classId)||{}).name || '';
    return [s.name, String(s.nid||''), cn, s.parent||'', String(s.phone||'')];
  }));
  const fname = 'students_backup_' + iso();
  csvDownload(rows, fname + '.csv');
  if (xlsxDownload(rows, fname + '.xlsx', 'دانش‌آموزان')) toast(list.length.toLocaleString('fa-IR') + ' دانش‌آموز خروجی گرفته شد.', 'ok');
  else toast('CSV دانلود شد.', 'ok');
},

dlStudentTpl: function() {
  const rows = [
    ['نام','کد ملی','کلاس','ولی','تلفن'],
    ['پارسا محمدی','2000000002','دهم ریاضی','رضا محمدی','09121230001'],
    ['نیما کریمی','2000000010','دهم ریاضی','حسن کریمی','09121230002'],
    ['آیدا رضایی','2000000029','دهم تجربی','علی رضایی','09121230003'],
    ['سارا موسوی','2000000037','دهم تجربی','محمد موسوی','09121230004']
  ];
  csvDownload(rows, 'نمونه_دانش_آموزان.csv');
  xlsxDownload(rows, 'نمونه_دانش_آموزان.xlsx', 'دانش‌آموزان');
  toast('قالب دانلود شد.', 'ok');
},

importStudents: async function(file) {
  if (!file) return;
  try {
    const rows = await parseSheet(file);
    if (rows.length < 2) return toast('فایل خالی است یا فقط هدر دارد.', 'bad');
    let added = 0, skipped = 0; const reasons = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !String(r[0]||'').trim()) continue;
      const name = String(r[0]).trim();
      const nid = normNid(r[1]);
      const className = String(r[2]||'').trim();
      const parent = String(r[3]||'').trim();
      const phone = normPhone(r[4]);
      if (!name || !nid) { skipped++; reasons.push(`ردیف ${i+1}: نام یا کد ملی خالی`); continue }
      if (!validNid(nid)) { skipped++; reasons.push(`ردیف ${i+1}: کد ملی نامعتبر`); continue }
      if (db.students.some(s => s.nid === nid)) { skipped++; reasons.push(`ردیف ${i+1}: کد ملی تکراری`); continue }
      let classId = findClassId(className);
      if (!classId && className) { classId = uid(); db.classes.push({id:classId, name:className, grade:'', room:''}) }
      if (!classId) {
        if (db.classes.length) classId = db.classes[0].id;
        else { classId = uid(); db.classes.push({id:classId, name:'کلاس پیش‌فرض', grade:'', room:''}) }
      }
      db.students.push({id:uid(), name, nid, classId, parent, phone});
      added++;
    }
    save(); render();
    let msg = added.toLocaleString('fa-IR') + ' دانش‌آموز اضافه شد';
    if (skipped) msg += ` · ${skipped.toLocaleString('fa-IR')} رد شد`;
    toast(msg, added ? 'ok' : 'bad');
  } catch(err) { console.error(err); toast('خطا در خواندن فایل: ' + (err.message||'فرمت نامعتبر'), 'bad') }
},

});
