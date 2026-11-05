/* =========================================================================
   صفحه‌ی «تکالیف»
   ========================================================================= */
Object.assign(V, {

/* ---------- تکالیف ---------- */
hw: function() {
  const list = (db.homework||[]).filter(h => {
    if (scoped()) { const s = db.students.find(x=>x.id===me.sid); return s && h.classId===s.classId }
    if (teacherScoped()) return me.classIds.includes(h.classId);
    return true;
  });
  const p = paginate(list, 'hw');
  const rows = p.slice.map(h => {
    const sub = h.submissions || {};
    const subCount = Object.keys(sub).length;
    const total = db.students.filter(s=>s.classId===h.classId).length;
    const mySub = scoped() && sub[me.sid];
    return `<tr>
      <td><b>${esc(h.title)}</b><div class="mu" style="font-size:12px">${esc(h.desc||'')}</div></td>
      <td>${cname(h.classId)}</td>
      <td>${esc(h.subject)}</td>
      <td>${faDate(h.due)}</td>
      <td>${toFa(subCount)} / ${toFa(total)}</td>
      <td>
        ${scoped()
          ? (mySub ? '<span class="tag ok">ارسال شده</span>' : `<button class="b p sm" data-a="submitHw" data-i="${h.id}">ارسال</button>`)
          : `<button class="b e sm" data-a="viewHwSubs" data-i="${h.id}">مشاهده</button>`}
        ${mgr()?delBtn('homework',h.id):''}
      </td>
    </tr>`;
  });
  const canAdd = me.role==='teacher'||mgr();
  return head('تکالیف') +
    (canAdd?card('افزودن تکلیف',
      `<form class="fm" onsubmit="A.addHw(event)">
        <label>کلاس<select name="classId" required>${opts(myClasses().map(c=>[c.id,c.name]))}</select></label>
        <label>درس<input name="subject" required></label>
        <label>عنوان<input name="title" required></label>
        <label>مهلت<input type="date" name="due" required></label>
        <label style="grid-column:1/-1">توضیحات<textarea name="desc" rows="2"></textarea></label>
        <button class="b p">ثبت</button>
      </form>`):'') +
    card('', tbl(['عنوان','کلاس','درس','مهلت','ارسال',''], rows, 'تکلیفی ثبت نشده.','📚') + pagerHtml('hw', p.total));
},

});
