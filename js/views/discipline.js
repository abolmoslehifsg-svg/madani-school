/* =========================================================================
   صفحه‌ی «انضباطی»
   ========================================================================= */
Object.assign(V, {

/* ---------- انضباطی ---------- */
disc: function() {
  const list = (db.discipline||[]).filter(d => scoped() ? d.sid === me.sid : true);
  const p = paginate(list.slice().sort((a,b)=>b.date.localeCompare(a.date)), 'disc');
  const sevTag = s => `<span class="tag ${s==='high'?'bad':s==='mid'?'warn':'info'}">${s==='high'?'شدید':s==='mid'?'متوسط':'خفیف'}</span>`;
  const rows = p.slice.map(d=>`<tr>
    <td>${sname(d.sid)}</td>
    <td>${esc(d.type)}</td>
    <td>${esc(d.desc)}</td>
    <td>${sevTag(d.severity||'low')}</td>
    <td>${faDate(d.date)}</td>
    <td>${mgr()?delBtn('discipline',d.id):''}</td>
  </tr>`);
  return head('موارد انضباطی') +
    (mgr()?card('ثبت مورد',
      `<form class="fm" onsubmit="A.addDisc(event)">
        <label>دانش‌آموز<select name="sid" required>${opts(db.students.map(s=>[s.id,s.name]))}</select></label>
        <label>نوع<select name="type">${opts([['تذکر شفاهی','تذکر شفاهی'],['تذکر کتبی','تذکر کتبی'],['احضار ولی','احضار ولی'],['تشویق','تشویق']])}</select></label>
        <label>شدت<select name="severity">${opts([['low','خفیف'],['mid','متوسط'],['high','شدید']])}</select></label>
        <label style="grid-column:1/-1">توضیح<textarea name="desc" rows="2" required></textarea></label>
        <button class="b p">ثبت</button>
      </form>`):'') +
    card('', tbl(['دانش‌آموز','نوع','توضیح','شدت','تاریخ',''], rows, 'موردی ثبت نشده.','⚠️') + pagerHtml('disc', p.total));
},

});
