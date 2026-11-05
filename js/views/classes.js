/* =========================================================================
   صفحه‌ی «کلاس‌ها»
   ========================================================================= */
Object.assign(V, {

/* ---------- کلاس‌ها ---------- */
classes: function() {
  const rows = myClasses().map(c=>`<tr>
    <td><b>${esc(c.name)}</b></td>
    <td>${esc(c.grade)}</td>
    <td>${esc(c.room)}</td>
    <td>${db.students.filter(s=>s.classId===c.id).length.toLocaleString('fa-IR')}</td>
    <td>${mgr()?editBtn('classes',c.id)+' '+delBtn('classes',c.id):''}</td>
  </tr>`);
  return head('کلاس‌ها') +
    (mgr()?card('افزودن کلاس',
      `<form class="fm" onsubmit="A.addClass(event)">
        <label>نام کلاس<input name="name" required placeholder="مثلاً دهم انسانی"></label>
        <label>پایه<input name="grade" placeholder="دهم"></label>
        <label>شماره اتاق<input name="room"></label>
        <button class="b p">افزودن</button>
      </form>`):'') +
    card('', tbl(['نام','پایه','اتاق','دانش‌آموز',''], rows, 'کلاسی ثبت نشده است.','🏛️'));
},

});
