/* =========================================================================
   صفحه‌ی «نمرات»
   ========================================================================= */
Object.assign(V, {

/* ---------- نمرات ---------- */
grades: function() {
  const all = db.grades.filter(g => {
    if (gf && g.sid !== gf) return false;
    if (teacherScoped()) { const s = db.students.find(x=>x.id===g.sid); return s && me.classIds.includes(s.classId) }
    if (scoped()) return g.sid === me.sid;
    return true;
  });
  const p = paginate(all, 'grades');
  const rows = p.slice.map(g=>`<tr>
    <td>${faDate(g.date)}</td>
    <td>${sname(g.sid)}</td>
    <td>${esc(g.subject)}</td>
    <td>${esc(g.type)}</td>
    <td>${scoreTag(g.score)}</td>
    <td>${me.role!=='parent'&&me.role!=='student'?editBtn('grades',g.id)+' '+delBtn('grades',g.id):''}</td>
  </tr>`);

  const draftRows = gradeDraft.map((g,i)=>`<tr>
    <td>${sname(g.sid)}</td><td>${esc(g.subject)}</td><td>${esc(g.type)}</td>
    <td>${scoreTag(g.score)}</td>
    <td><button class="b d sm" data-a="rmGradeDraft" data-i="${i}">حذف</button></td>
  </tr>`);
  const draftBox = needsConfirm() && gradeDraft.length
    ? `<div class="draft-bar">
        <span>📝 <b>${gradeDraft.length.toLocaleString('fa-IR')}</b> نمره در انتظار تأیید</span>
        <div>
          <button class="b sm" data-a="clearGradeDraft">انصراف</button>
          <button class="b ok sm" data-a="confirmGrades">تأیید و ثبت</button>
        </div>
      </div>`
      + tbl(['دانش‌آموز','درس','نوع','نمره',''], draftRows) : '';

  const formHtml = me.role!=='parent' && me.role!=='student'
    ? card('ثبت نمره',
        `<form class="fm" onsubmit="A.addGrade(event)">
          <label>دانش‌آموز<select name="sid" required>${stOpts()}</select></label>
          <label>درس<input name="subject" required></label>
          <label>نوع آزمون<select name="type">${opts([['میان‌ترم','میان‌ترم'],['پایان‌ترم','پایان‌ترم'],['کوییز','کوییز'],['پروژه','پروژه']])}</select></label>
          <label>نمره (۰ تا ۲۰)<input name="score" required inputmode="decimal"></label>
          <button class="b p">${needsConfirm()?'افزودن به لیست':'ثبت نمره'}</button>
        </form>
        ${needsConfirm()?'<p class="hint">پس از افزودن چند نمره، دکمه «تأیید و ثبت» را بزن.</p>':''}
        ${draftBox}`)
    : '';

  return head('نمرات', 'نمره بین ۰ تا ۲۰ · زیر ۱۰ قرمز، ۱۷ به بالا سبز') + formHtml +
    card('',
      `<div class="row" style="margin-bottom:12px">
        <label style="max-width:220px">فیلتر دانش‌آموز<select onchange="A.gf(this.value)"><option value="">همه</option>${stOpts(gf)}</select></label>
        <button class="b sm np" data-a="csvGrades">خروجی CSV</button>
      </div>` +
      tbl(['تاریخ','دانش‌آموز','درس','نوع','نمره',''], rows, 'نمره‌ای ثبت نشده است.','📝') +
      pagerHtml('grades', p.total));
},

});
