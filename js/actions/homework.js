/* =========================================================================
   اکشن‌های «تکالیف»
   ========================================================================= */
Object.assign(A, {

/* ---------- تکالیف ---------- */
addHw: function(e) {
  e.preventDefault();
  const f = fd(e);
  push('homework', {classId:f.classId, subject:f.subject, title:f.title, desc:f.desc||'',
                    due:f.due, createdBy:me.id, submissions:{}}, 'تکلیف ثبت شد.');
},
submitHw: function(id) {
  const h = (db.homework||[]).find(x=>x.id===id);
  if (!h) return;
  h.submissions = h.submissions || {};
  if (h.submissions[me.sid]) return toast('قبلاً ارسال کرده‌اید.', 'bad');
  h.submissions[me.sid] = {ts: Date.now(), text:'ارسال شد'};
  save(); render(); toast('تکلیف ارسال شد.', 'ok');
},
viewHwSubs: function(id) {
  const h = (db.homework||[]).find(x=>x.id===id);
  if (!h) return;
  const subs = h.submissions || {};
  const all = db.students.filter(s => s.classId === h.classId);
  const html = `<h2>${esc(h.title)} — ارسال‌ها</h2>
    <div class="ov"><table>
      <thead><tr><th>دانش‌آموز</th><th>وضعیت</th><th>زمان</th></tr></thead>
      <tbody>${all.map(s => {
        const sub = subs[s.id];
        return `<tr><td>${esc(s.name)}</td>
          <td>${sub?'<span class="tag ok">ارسال</span>':'<span class="tag bad">ارسال نشده</span>'}</td>
          <td>${sub?faDT(sub.ts):'—'}</td></tr>`;
      }).join('')}</tbody>
    </table></div>`;
  openModal(html, true);
},

});
