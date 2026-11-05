/* =========================================================================
   صفحه‌ی «دانش‌آموزان»
   ========================================================================= */
Object.assign(V, {

/* ---------- دانش‌آموزان ---------- */
students: function() {
  const all = mine();
  const p = paginate(all, 'students');
  const rows = p.slice.map(s=>`<tr data-s="${esc(s.name+s.nid+s.parent)}">
    <td><b>${esc(s.name)}</b></td>
    <td dir="ltr">${esc(s.nid)}</td>
    <td>${cname(s.classId)}</td>
    <td>${esc(s.parent)}</td>
    <td dir="ltr">${esc(s.phone)}</td>
    <td>
      <button class="b e sm" data-a="qrStudent" data-i="${esc(s.id)}">QR</button>
      ${mgr()?editBtn('students',s.id)+' '+delBtn('students',s.id):''}
    </td>
  </tr>`);
  const importBox = mgr()
    ? `<div class="row start gap" style="margin-top:12px;flex-wrap:wrap">
        <label class="b sm" style="cursor:pointer">ورود از اکسل<input type="file" accept=".xlsx,.xls,.csv" hidden onchange="A.importStudents(this.files[0])"></label>
        <button class="b sm" data-a="dlStudentTpl">دانلود قالب CSV</button>
        <span class="hint">ستون‌ها: نام | کد ملی | کلاس | ولی | تلفن</span>
      </div>` : '';
  return head('دانش‌آموزان') +
    (mgr()?card('افزودن دانش‌آموز',
      `<form class="fm" onsubmit="A.addStudent(event)">
        <label>نام و نام خانوادگی<input name="name" required></label>
        <label>کد ملی<input name="nid" required pattern="[0-9۰-۹]{10}" title="۱۰ رقم معتبر" inputmode="numeric"></label>
        <label>کلاس<select name="classId" required>${opts(myClasses().map(c=>[c.id,c.name]))}</select></label>
        <label>نام ولی<input name="parent"></label>
        <label>تلفن ولی<input name="phone" dir="ltr"></label>
        <button class="b p">افزودن</button>
      </form>${importBox}`):'') +
    card(`فهرست (${all.length.toLocaleString('fa-IR')})`,
      `<div class="row" style="margin-bottom:12px">
        <input placeholder="جستجو…" oninput="A.find(this.value)" style="flex:1;min-width:180px">
        <button class="b sm np" data-a="csvStudents">دانلود پشتیبان (CSV)</button>
      </div>` +
      tbl(['نام','کد ملی','کلاس','ولی','تلفن',''], rows, 'دانش‌آموزی ثبت نشده است.','👥') +
      pagerHtml('students', p.total));
},

});
