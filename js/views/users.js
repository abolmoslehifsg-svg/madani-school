/* =========================================================================
   صفحه‌ی «کاربران»
   ========================================================================= */
Object.assign(V, {

/* ---------- کاربران ---------- */
users: function() {
  const roles = Object.keys(ROLE).filter(k => isAdmin() || k !== 'admin').map(k=>[k,ROLE[k]]);
  const p = paginate(db.users, 'users');
  const rows = p.slice.map(u=>{
    const canDel = u.id !== me.id && !(u.role==='admin' && !isAdmin());
    const related = u.sid ? sname(u.sid) : (u.classIds && u.classIds.length ? u.classIds.map(cname).join('، ') : '—');
    return `<tr>
      <td><b>${esc(u.name)}</b></td>
      <td dir="ltr">${esc(u.username)}</td>
      <td><span class="tag">${ROLE[u.role]}</span></td>
      <td>${related}</td>
      <td>${editBtn('users',u.id)} ${resetPwBtn(u)} ${canDel?delBtn('users',u.id):''}</td>
    </tr>`;
  });
  const importTeachers = isAdmin()
    ? `<div class="row start gap" style="margin-top:12px;flex-wrap:wrap">
        <label class="b sm" style="cursor:pointer">ورود معلمان از اکسل<input type="file" accept=".xlsx,.xls,.csv" hidden onchange="A.importTeachers(this.files[0])"></label>
        <button class="b sm" data-a="dlTeacherTpl">دانلود نمونه</button>
        <span class="hint">ستون‌ها: نام | نام کاربری | رمز | کلاس‌ها (با کاما)</span>
      </div>` : '';
  return head('کاربران') +
    card('افزودن کاربر',
      `<form class="fm" onsubmit="A.addUser(event)">
        <label>نام کامل<input name="name" required></label>
        <label>نام کاربری<input name="username" dir="ltr" required pattern="[A-Za-z0-9_]{3,}"></label>
        <label>رمز<input name="pw" type="password" minlength="6" required></label>
        <label>نقش<select name="role" onchange="A.roleChange(this)">${opts(roles)}</select></label>
        <label id="sidLab">دانش‌آموز مرتبط<select name="sid"><option value="">—</option>${opts(db.students.map(s=>[s.id,s.name]))}</select></label>
        <label id="clsLab" style="display:none;grid-column:1/-1">کلاس‌های معلم
          <div class="chk-group">${db.classes.map(c=>`<label><input type="checkbox" name="classIds" value="${esc(c.id)}"> ${esc(c.name)}</label>`).join('')}</div>
        </label>
        <button class="b p">افزودن</button>
      </form>${importTeachers}`) +
    card('', tbl(['نام','نام کاربری','نقش','مرتبط',''], rows, 'کاربری نیست.','👤') + pagerHtml('users', p.total));
},

});
