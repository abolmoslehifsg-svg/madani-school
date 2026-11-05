/* =========================================================================
   صفحه‌ی «آزمون آنلاین»
   ========================================================================= */
Object.assign(V, {

/* ---------- آزمون آنلاین ---------- */
quiz: function() {
  const list = (db.quizzes||[]).filter(q => {
    if (scoped()) { const s = db.students.find(x=>x.id===me.sid); return s && q.classId === s.classId }
    if (teacherScoped()) return (me.classIds||[]).includes(q.classId);
    return true;
  });
  const p = paginate(list, 'quiz');
  const canCreate = me.role==='teacher'||mgr();
  const rows = p.slice.map(q=>{
    const attempts = (q.attempts||{});
    const myAtt = attempts[me.id];
    return `<tr>
      <td><b>${esc(q.title)}</b></td>
      <td>${cname(q.classId)}</td>
      <td>${esc(q.subject)}</td>
      <td>${(q.questions||[]).length.toLocaleString('fa-IR')}</td>
      <td>${toFa(q.duration||0)} دقیقه</td>
      <td>${scoped()?(myAtt?`<span class="tag ok">${f1(myAtt.score)} از ${toFa(myAtt.total)}</span>`:`<button class="b p sm" data-a="startQuiz" data-i="${q.id}">شروع</button>`):`<span class="mu">${toFa(Object.keys(attempts).length)} شرکت‌کننده</span>`}</td>
    </tr>`;
  });
  return head('آزمون آنلاین') +
    (canCreate?card('ساخت آزمون', '<form onsubmit="A.newQuizForm(event)" class="fm"><label>عنوان<input name="title" required></label><label>کلاس<select name="classId" required>'+opts(myClasses().map(c=>[c.id,c.name]))+'</select></label><label>درس<input name="subject" required></label><label>مدت (دقیقه)<input type="number" name="duration" value="15" min="1"></label><button class="b p">ساخت</button></form>'):'') +
    card('', tbl(['عنوان','کلاس','درس','سوال','زمان',''], rows, 'آزمونی ثبت نشده.','🧪') + pagerHtml('quiz', p.total));
},

});
