/* =========================================================================
   صفحه‌ی برنامه‌ی هفتگی
   ========================================================================= */
/* =========================================================================
   V.timetable — برنامه هفتگی
   ========================================================================= */
V.timetable = function() {
  const classes = myClasses();
  if (!classes.length) return head('برنامه هفتگی') + empty('کلاسی موجود نیست.','🗓️');

  const activeClass = classes.find(c => c.id === ttClassId) || classes[0];
  const tt = (db.timetable||{})[activeClass.id] || {};
  const weekdays = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه'];
  const canEdit = isProvereshiMgr();

  const classSelector = classes.length > 1
    ? `<label style="max-width:260px">کلاس<select onchange="A.ttClass(this.value)">
        ${opts(classes.map(c=>[c.id, c.name]), activeClass.id)}
      </select></label>` : '';

  const rows = weekdays.map(day => {
    const cells = [1,2,3,4].map(b => {
      const val = (tt[day] && tt[day][b]) || '';
      return `<td>${canEdit
        ? `<input value="${esc(val)}" placeholder="—" style="width:100%;text-align:center;font-size:12px;padding:4px"
            onchange="A.ttSet('${esc(activeClass.id)}','${esc(day)}',${b},this.value)">`
        : (val ? esc(val) : '<span class="mu">—</span>')}</td>`;
    }).join('');
    return `<tr><td class="day-cell">${day}</td>${cells}</tr>`;
  }).join('');

  return head('برنامه هفتگی', canEdit ? 'روی هر خانه کلیک کنید و درس را وارد کنید' : 'برنامه کلاس شما') +
    card('', `<div class="row" style="margin-bottom:12px">${classSelector}
      ${canEdit?`<button class="b sm" data-a="ttExport" data-i="${activeClass.id}">خروجی CSV</button>`:''}</div>
      <div class="ov"><table class="tt-table">
        <thead><tr><th></th>${[1,2,3,4].map(b=>`<th>زنگ ${toFa(b)}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`);
};
