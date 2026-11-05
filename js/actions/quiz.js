/* =========================================================================
   اکشن‌های «آزمون»
   ========================================================================= */
Object.assign(A, {

/* ---------- آزمون ---------- */
newQuizForm: function(e) {
  e.preventDefault();
  const f = fd(e);
  const quiz = {id:uid(), title:f.title, classId:f.classId, subject:f.subject,
                duration:+f.duration||15, questions:[], attempts:{},
                createdBy:me.id, date:iso()};
  db.quizzes = db.quizzes || [];
  db.quizzes.push(quiz);
  save();
  openModal(`<h2>افزودن سوال — ${esc(quiz.title)}</h2>
    <form onsubmit="A.addQuizQ(event, '${quiz.id}')" class="fm">
      <label style="grid-column:1/-1">صورت سوال<textarea name="text" rows="2" required></textarea></label>
      <label>گزینه ۱<input name="o1" required></label>
      <label>گزینه ۲<input name="o2" required></label>
      <label>گزینه ۳<input name="o3"></label>
      <label>گزینه ۴<input name="o4"></label>
      <label>پاسخ صحیح (شماره)<input type="number" name="correct" min="1" max="4" value="1" required></label>
      <button class="b p">افزودن سوال</button>
    </form>
    <div style="margin-top:12px"><button class="b ok" data-a="finishQuiz" data-i="${quiz.id}">پایان ساخت آزمون</button></div>`, true);
},
addQuizQ: function(e, qid) {
  e.preventDefault();
  const q = (db.quizzes||[]).find(x=>x.id===qid);
  if (!q) return;
  const f = fd(e);
  const options = [f.o1, f.o2, f.o3, f.o4].filter(Boolean);
  q.questions.push({text:f.text, options, correct: (+f.correct) - 1});
  save();
  toast('سوال اضافه شد (' + toFa(q.questions.length) + ')', 'ok');
  e.target.reset();
},
finishQuiz: function(qid) { closeModal(); render(); toast('آزمون ذخیره شد.', 'ok'); },
startQuiz: function(qid) {
  const q = (db.quizzes||[]).find(x=>x.id===qid);
  if (!q) return;
  if (!(q.questions||[]).length) return toast('این آزمون سوالی ندارد.', 'bad');
  if (scoped() && q.attempts && q.attempts[me.id]) return toast('قبلاً شرکت کرده‌اید.', 'bad');
  if (quizSession && !confirm('آزمون قبلی نیمه‌کاره است. ادامه؟')) return;
  quizSession = {quiz:q, answers:{}, start:Date.now()};
  A.renderQuizSession();
},
renderQuizSession: function() {
  const s = quizSession;
  if (!s) return;
  const q = s.quiz;
  const duration = (q.duration||15) * 60000;
  const endAt = s.start + duration;

  const html = `<div class="row" style="margin-bottom:12px">
      <h2 style="margin:0">${esc(q.title)} — ${toFa(q.questions.length)} سوال</h2>
      <span class="quiz-timer" id="quizTimer">${toFa(q.duration||15)}:۰۰</span>
    </div>
    <div id="quizBody">
      ${q.questions.map((qq, i) => `
        <div class="quiz-q">
          <b>سوال ${toFa(i+1)}: ${esc(qq.text)}</b>
          <div class="opts">
            ${qq.options.map((o, j) => `
              <label><input type="radio" name="q${i}" value="${j}" ${s.answers[i]===j?'checked':''}
                onchange="A.quizAns(${i}, ${j})"> ${esc(o)}</label>`).join('')}
          </div>
        </div>`).join('')}
    </div>
    <div class="row" style="margin-top:12px;justify-content:flex-end">
      <button class="b" data-a="cancelQuiz">انصراف</button>
      <button class="b p" data-a="submitQuiz">ثبت پاسخ‌ها</button>
    </div>`;
  openModal(html, true);

  if (quizTimer) clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    const el = document.getElementById('quizTimer');
    if (!el || !quizSession) { clearInterval(quizTimer); quizTimer = null; return }
    const remain = Math.max(0, endAt - Date.now());
    const m = Math.floor(remain/60000);
    const sec = Math.floor((remain%60000)/1000);
    el.textContent = toFa(m) + ':' + toFa(String(sec).padStart(2,'0'));
    el.className = 'quiz-timer' + (remain<60000?' bad':remain<300000?' warn':'');
    if (remain <= 0) {
      clearInterval(quizTimer); quizTimer = null;
      toast('زمان آزمون تمام شد. پاسخ‌ها ثبت می‌شود.', 'warn');
      A.submitQuiz();
    }
  }, 500);
},
quizAns: function(qi, oi) { if (quizSession) quizSession.answers[qi] = oi },
submitQuiz: async function() {
  if (!quizSession) return;
  if (quizTimer) { clearInterval(quizTimer); quizTimer = null }
  const session = quizSession, quiz = session.quiz;
  let attempt;
  if (USE_SERVER) {
    const answers = quiz.questions.map((q, i) => session.answers[i] === undefined ? null : session.answers[i]);
    try { attempt = await api.quizSubmit(quiz.id, answers); }
    catch (error) { quizSession = null; closeModal(); render(); return toast(error.message, 'bad'); }
  } else {
    const total = quiz.questions.length;
    const correct = quiz.questions.filter((q, i) => session.answers[i] === q.correct).length;
    attempt = {score: total ? +(correct / total * 20).toFixed(2) : 0, total, correct, ts: Date.now()};
  }
  quiz.attempts = quiz.attempts || {};
  quiz.attempts[me.id] = attempt;
  quizSession = null;
  if (USE_SERVER) SyncEngine.rebase('quizzes', quiz.id); else save();
  closeModal(); render();
  toast(`نمره شما: ${f1(attempt.score)} از ۲۰ (${toFa(attempt.correct)} از ${toFa(attempt.total)})`, 'ok');
},
cancelQuiz: function() {
  if (quizSession && !confirm('از آزمون خارج می‌شوید؟')) return;
  if (quizTimer) { clearInterval(quizTimer); quizTimer = null }
  quizSession = null; closeModal(); render();
},

});
