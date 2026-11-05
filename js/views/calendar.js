/* =========================================================================
   صفحه‌ی تقویم
   ========================================================================= */
/* =========================================================================
   V.calendar — تقویم ماهانه
   ========================================================================= */
V.calendar = function() {
  const monthNames = ['ژانویه','فوریه','مارس','آپریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
  const dayNames = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
  const y = calYear, m = calMonth;
  const firstDay = new Date(y, m, 1).getDay();
  const totalDays = monthDays(y, m);
  const today = iso();

  const eventsByDate = {};
  (db.calendar||[]).forEach(e => {
    (eventsByDate[e.date] = eventsByDate[e.date] || []).push(e);
  });
  (db.homework||[]).forEach(h => {
    if (!h.due) return;
    (eventsByDate[h.due] = eventsByDate[h.due] || []).push({title:'مهلت: '+h.title, type:'deadline'});
  });
  (db.showcase||[]).forEach(e => {
    if (!e.date) return;
    (eventsByDate[e.date] = eventsByDate[e.date] || []).push({title:e.title, type:'event'});
  });

  let cells = '';
  const prevMonthDays = monthDays(y, m === 0 ? 11 : m - 1);
  const prevY = m === 0 ? y - 1 : y;
  const prevM = m === 0 ? 11 : m - 1;

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells += `<div class="cal-cell other"><div class="num mu">${toFa(d)}</div></div>`;
  }
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = isoDate(y, m, d);
    const evs = eventsByDate[dateStr] || [];
    const isToday = dateStr === today;
    cells += `<div class="cal-cell ${isToday?'today':''}">
      <div class="num">${toFa(d)}</div>
      ${evs.slice(0,3).map(e => `<div class="ev ${e.type}">${esc(e.title)}</div>`).join('')}
      ${evs.length > 3 ? `<div class="mu">+${toFa(evs.length - 3)}</div>` : ''}
    </div>`;
  }
  const lastDay = new Date(y, m, totalDays).getDay();
  for (let i = lastDay + 1; i < 7; i++) {
    cells += `<div class="cal-cell other"><div class="num mu">${toFa(i - lastDay)}</div></div>`;
  }

  const form = isProvereshiMgr() || me.role === 'teacher' ? card('افزودن رویداد تقویم',
    `<form class="fm" onsubmit="A.addCalEvent(event)">
      <label>تاریخ<input type="date" name="date" value="${today}" required></label>
      <label>عنوان<input name="title" required></label>
      <label>نوع<select name="type">
        ${opts([['event','رویداد'],['exam','امتحان'],['holiday','تعطیلی'],['deadline','مهلت']])}
      </select></label>
      <label style="grid-column:1/-1">توضیح (اختیاری)<input name="desc"></label>
      <button class="b p">افزودن</button>
    </form>`) : '';

  return head('تقویم آموزشی', 'رویدادها، امتحانات و تعطیلات') + form +
    card(`${monthNames[m]} ${y}`,
      `<div class="cal-head">
        <button class="b sm" data-a="calPrev">◀ ماه قبل</button>
        <span class="tag">${monthNames[m]} ${y}</span>
        <button class="b sm" data-a="calNext">ماه بعد ▶</button>
      </div>
      <div class="cal-grid">
        ${dayNames.map(d => `<div class="cal-weekday">${d}</div>`).join('')}
        ${cells}
      </div>`);
};
