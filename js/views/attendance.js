/* =========================================================================
   صفحه‌ی «حضور و غیاب»
   ========================================================================= */
Object.assign(V, {

/* ---------- حضور و غیاب ---------- */
att: function() {
  const date = ad, bell = attBell;

  if (!canMarkAtt()) {
    const sids = mine().map(s => s.id);
    const rows = [];
    const dates = Object.keys(db.att||{}).sort().reverse();
    dates.forEach(d => {
      BELLS.forEach(b => {
        const day = attDay(d, b);
        sids.forEach(sid => {
          if (!day[sid]) return;
          const st = day[sid];
          const label = (ST[st.status]||['—'])[0];
          const tag = (ST[st.status]||[])[1] || '';
          const delay = st.status==='l' && st.delay ? ` (${toFa(st.delay)} دقیقه)` : '';
          rows.push(`<tr>
            <td>${faDate(d)}</td>
            <td>${esc(b)}</td>
            <td>${sname(sid)}</td>
            <td><span class="tag ${tag}">${label}${delay}</span></td>
          </tr>`);
        });
      });
    });
    return head('حضور و غیاب', 'فقط مشاهده — ثبت توسط معلم انجام می‌شود') +
      card('سوابق حضور',
        rows.length
          ? `<div class="ov"><table><thead><tr><th>تاریخ</th><th>زنگ</th><th>دانش‌آموز</th><th>وضعیت</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`
          : empty('هنوز حضوری برای شما ثبت نشده است.','✅'));
  }

  const saved = attDay(date, bell);
  const day = needsConfirm() ? Object.assign({}, saved, attDraft) : saved;
  const list = mine().filter(s => !attClass || s.classId === attClass);
  const p = paginate(list, 'att');
  const summaryText = attSummaryText(date, bell);

  const bellsHtml = BELLS.map(b => {
    const filled = Object.keys(attDay(date, b)).length > 0;
    return `<button type="button" class="${b===bell?'on':''} ${filled&&b!==bell?'has':''}" data-a="setBell" data-v="${esc(b)}">
      ${esc(b)}${filled?' ✓':''}
    </button>`;
  }).join('');

  const cnt = k => Object.values(day).filter(r => r && r.status===k).length.toLocaleString('fa-IR');
  const draftCount = Object.keys(attDraft).length;

  const rows = p.slice.map(s => {
    const cur = day[s.id] || {};
    const buttons = Object.keys(ST).map(k => `
      <button type="button" class="b sm ${cur.status===k?'on':''}" data-a="mark" data-i="${esc(s.id)}" data-v="${k}">
        ${ST[k][0]}
      </button>`).join(' ');
    const delayInput = cur.status === 'l'
      ? ` <input type="number" min="0" max="120" value="${cur.delay||0}" style="width:70px;display:inline-block"
           onchange="A.setDelay('${esc(s.id)}', this.value)" title="دقیقه تأخیر">`
      : '';
    return `<tr>
      <td><b>${esc(s.name)}</b></td>
      <td>${cname(s.classId)}</td>
      <td>${buttons}${delayInput}</td>
    </tr>`;
  });

  const draftBar = needsConfirm()
    ? (draftCount
      ? `<div class="draft-bar">
          <span>⚠️ <b>${draftCount.toLocaleString('fa-IR')}</b> تغییر در انتظار تأیید — <b>${esc(bell)}</b> · ${faDate(date)}</span>
          <div>
            <button type="button" class="b sm" data-a="clearAttDraft">انصراف</button>
            <button type="button" class="b ok sm" data-a="confirmAtt">تأیید و ثبت ${esc(bell)}</button>
          </div>
        </div>`
      : `<p class="hint">۱) زنگ را از بالا انتخاب کنید ← ۲) وضعیت را بزنید ← ۳) «تأیید و ثبت» را بزنید.</p>`)
    : `<p class="hint">زنگ انتخاب‌شده: <b>${esc(bell)}</b> — با عوض کردن زنگ می‌توانید برای هر زنگ جداگانه ثبت کنید.</p>`;

  return head('حضور و غیاب', `ثبت برای «${esc(bell)}» · ${faDate(date)}`) +
    card('انتخاب تاریخ و زنگ',
      `<div class="row" style="margin-bottom:12px">
        <label style="max-width:200px">تاریخ<input type="date" value="${date}" onchange="A.date(this.value)"></label>
        <label style="max-width:200px">کلاس<select onchange="A.attClass(this.value)">
          <option value="">همه کلاس‌ها</option>
          ${opts(myClasses().map(c=>[c.id,c.name]), attClass)}
        </select></label>
      </div>
      <p class="hint" style="margin-bottom:8px">زنگ درس را انتخاب کنید (هر زنگ جدا ثبت می‌شود):</p>
      <div class="bells">${bellsHtml}</div>
      <div class="row start gap" style="margin-top:12px">
        <button type="button" class="b" data-a="allP">همه حاضر</button>
        <button type="button" class="b" data-a="allA">همه غایب</button>
        <span class="mu">حاضر: ${cnt('p')} · غایب: ${cnt('a')} · تأخیر: ${cnt('l')} · مرخصی: ${cnt('e')}</span>
        <button type="button" class="b sm np" data-a="csvAtt" style="margin-inline-start:auto">خروجی CSV</button>
      </div>
      ${draftBar}`) +
    (summaryText
      ? card(`خلاصه ثبت‌شده — ${esc(bell)} · ${faDate(date)}`,
          `<div class="summary-box">${summaryText}</div>`)
      : '') +
    card(`فهرست — ${esc(bell)}`,
      tbl(['دانش‌آموز','کلاس','وضعیت'], rows, 'دانش‌آموزی نیست.','✅') +
      pagerHtml('att', p.total));
},

});
