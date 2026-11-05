/* =========================================================================
   فرم ویرایش (مودال)
   ========================================================================= */
/* =========================================================================
   ویرایش (مودال)
   ========================================================================= */
function editForm(type, id) {
  editTarget = {type, id};
  if (type === 'students') {
    const s = db.students.find(x=>x.id===id); if (!s) return;
    openModal(`<h2>ویرایش دانش‌آموز</h2>
      <form class="fm" onsubmit="A.saveEdit(event)">
        <label>نام<input name="name" value="${esc(s.name)}" required></label>
        <label>کد ملی<input name="nid" value="${esc(s.nid)}" required></label>
        <label>کلاس<select name="classId">${opts(myClasses().map(c=>[c.id,c.name]), s.classId)}</select></label>
        <label>ولی<input name="parent" value="${esc(s.parent)}"></label>
        <label>تلفن<input name="phone" dir="ltr" value="${esc(s.phone)}"></label>
        <button class="b p">ذخیره</button>
      </form>`);
  } else if (type === 'classes') {
    const c = db.classes.find(x=>x.id===id); if (!c) return;
    openModal(`<h2>ویرایش کلاس</h2>
      <form class="fm" onsubmit="A.saveEdit(event)">
        <label>نام<input name="name" value="${esc(c.name)}" required></label>
        <label>پایه<input name="grade" value="${esc(c.grade)}"></label>
        <label>اتاق<input name="room" value="${esc(c.room)}"></label>
        <button class="b p">ذخیره</button>
      </form>`);
  } else if (type === 'grades') {
    const g = db.grades.find(x=>x.id===id); if (!g) return;
    openModal(`<h2>ویرایش نمره</h2>
      <form class="fm" onsubmit="A.saveEdit(event)">
        <label>دانش‌آموز<select name="sid">${stOpts(g.sid)}</select></label>
        <label>درس<input name="subject" value="${esc(g.subject)}" required></label>
        <label>نوع<select name="type">${opts([['میان‌ترم','میان‌ترم'],['پایان‌ترم','پایان‌ترم'],['کوییز','کوییز'],['پروژه','پروژه']], g.type)}</select></label>
        <label>نمره<input name="score" value="${g.score}" required></label>
        <button class="b p">ذخیره</button>
      </form>`);
  } else if (type === 'users') {
    const u = db.users.find(x=>x.id===id); if (!u) return;
    const roles = Object.keys(ROLE).filter(k => isAdmin() || k !== 'admin' || u.role === 'admin').map(k=>[k,ROLE[k]]);
    openModal(`<h2>ویرایش کاربر</h2>
      <form class="fm" onsubmit="A.saveEdit(event)">
        <label>نام<input name="name" value="${esc(u.name)}" required></label>
        <label>نقش<select name="role" onchange="A.roleChange(this)">${opts(roles, u.role)}</select></label>
        <label id="sidLab" style="${['parent','student'].includes(u.role) ? '' : 'display:none'}">دانش‌آموز مرتبط
          <select name="sid"><option value="">—</option>${opts(db.students.map(s=>[s.id,s.name]), u.sid||'')}</select>
        </label>
        <label id="clsLab" style="${u.role==='teacher' ? 'grid-column:1/-1' : 'display:none;grid-column:1/-1'}">کلاس‌های معلم
          <div class="chk-group">${db.classes.map(c=>`<label><input type="checkbox" name="classIds" value="${esc(c.id)}"${(u.classIds||[]).includes(c.id)?' checked':''}> ${esc(c.name)}</label>`).join('')}</div>
        </label>
        <button class="b p">ذخیره</button>
      </form>`);
  } else if (type === 'showcase') {
    const e = (db.showcase||[]).find(x=>x.id===id); if (!e) return;
    openModal(`<h2>ویرایش رویداد</h2>
      <form class="fm" onsubmit="A.saveEdit(event)">
        <label>عنوان<input name="title" value="${esc(e.title)}" required></label>
        <label>دسته<select name="cat">${opts(EVENT_CATS.map(c=>[c,c]), e.cat)}</select></label>
        <label>تاریخ<input type="date" name="date" value="${e.date||''}"></label>
        <label style="grid-column:1/-1">توضیحات<textarea name="desc" rows="3">${esc(e.desc||'')}</textarea></label>
        <label style="grid-column:1/-1">تغییر عکس
          <input type="file" accept="image/*" onchange="A.previewShowcaseImg(this)">
          <input type="hidden" name="img" id="showcaseImgData">
        </label>
        <button class="b p">ذخیره</button>
      </form>`);
  }
}
