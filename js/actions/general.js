/* =========================================================================
   اکشن‌های «عمومی»
   ========================================================================= */
Object.assign(A, {

/* ---------- عمومی ---------- */
pg: function(key, v) { const n = +v; if (n >= 1) { pg[key] = n; render() } },
closeModal: function() { closeModal() },
toggleDark: function() { dark = !dark; applyTheme(); render() },
edit: function(id, c) { editForm(c, id) },

saveEdit: function(e) {
  e.preventDefault();
  const f = fd(e), type = editTarget.type, id = editTarget.id;
  if (type === 'students') {
    const nid = en(f.nid);
    if (!validNid(nid)) return toast('کد ملی معتبر نیست.', 'bad');
    if (db.students.some(s => s.id !== id && s.nid === nid)) return toast('کد ملی تکراری.', 'bad');
    Object.assign(db.students.find(s=>s.id===id), {name:f.name.trim(), nid, classId:f.classId, parent:f.parent.trim(), phone:en(f.phone)});
  } else if (type === 'classes') {
    Object.assign(db.classes.find(c=>c.id===id), {name:f.name.trim(), grade:f.grade.trim(), room:f.room.trim()});
  } else if (type === 'grades') {
    const sc = parseFloat(en(f.score).replace('٫','.'));
    if (!(sc >= 0 && sc <= 20)) return toast('نمره ۰ تا ۲۰.', 'bad');
    Object.assign(db.grades.find(g=>g.id===id), {sid:f.sid, subject:f.subject.trim(), type:f.type, score:sc});
    audit('grade_change', 'grades', 'ویرایش نمره');
  } else if (type === 'users') {
    const u = db.users.find(x=>x.id===id);
    if (!u) return toast('کاربر یافت نشد.', 'bad');
    if (!isAdmin() && (f.role === 'admin' || u.role === 'admin'))
      return toast('فقط مدیر می‌تواند مدیر را ویرایش کند.', 'bad');
    const oldRole = u.role;
    u.name = f.name.trim();
    u.role = f.role;
    u.sid = f.sid || '';
    u.classIds = f.role === 'teacher'
      ? $$('#modalBg input[name="classIds"]:checked').map(c => c.value)
      : [];
    if (oldRole !== f.role) audit('role_change', 'users', u.name + ': ' + oldRole + ' → ' + f.role);
  } else if (type === 'showcase') {
    Object.assign(db.showcase.find(x=>x.id===id), {
      title: f.title.trim(), desc: f.desc, cat: f.cat, date: f.date,
      img: f.img || (db.showcase.find(x=>x.id===id).img)
    });
  }
  save(); closeModal(); render(); toast('ذخیره شد.', 'ok');
},

del: function(id, c) {
  if (!confirm('این مورد حذف شود؟')) return;
  if (c === 'classes' && db.students.some(s => s.classId === id))
    return toast('ابتدا دانش‌آموزان این کلاس را جابه‌جا کنید.', 'bad');
  if (c === 'users') {
    const u = db.users.find(x=>x.id===id);
    if (!u) return;
    if (u.id === me.id) return toast('حساب خودتان را نمی‌توانید حذف کنید.', 'bad');
    if (!isAdmin() && u.role === 'admin') return toast('دسترسی ندارید.', 'bad');
    if (u.role === 'admin' && db.users.filter(x=>x.role==='admin').length < 2)
      return toast('حداقل یک مدیر باید بماند.', 'bad');
  }
  if (c === 'provTypes') {
    const used = (db.provEvents||[]).some(e => e.typeId === id);
    if (used) return toast('این نوع در رویدادها استفاده شده.', 'bad');
  }
  if (c === 'students') {
    db.grades = (db.grades||[]).filter(g => g.sid !== id);
    db.fin = (db.fin||[]).filter(f => f.sid !== id);
    db.discipline = (db.discipline||[]).filter(x => x.sid !== id);
    db.provRecords = (db.provRecords||[]).filter(x => x.sid !== id);
    db.leaves = (db.leaves||[]).filter(x => x.sid !== id);
    (db.homework||[]).forEach(h => { if (h.submissions) delete h.submissions[id] });
    (db.polls||[]).forEach(p => { if (p.votes) delete p.votes[id] });
    (db.quizzes||[]).forEach(q => { if (q.attempts) delete q.attempts[id] });
    Object.keys(db.att||{}).forEach(d => {
      Object.keys(db.att[d]||{}).forEach(b => { if (db.att[d][b]) delete db.att[d][b][id] });
    });
    db.users = (db.users||[]).filter(u => !(u.sid === id && (u.role === 'parent' || u.role === 'student')));
  }
  if (c === 'provEvents') {
    db.provRecords = (db.provRecords||[]).filter(x => x.eventId !== id);
  }
  db[c] = (db[c]||[]).filter(x => x.id !== id);
  audit('del', c, id);
  save(); render(); toast('حذف شد.', 'ok');
}
});
