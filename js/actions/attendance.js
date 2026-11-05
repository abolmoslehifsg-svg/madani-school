/* =========================================================================
   اکشن‌های «حضور و غیاب»
   ========================================================================= */
Object.assign(A, {

/* ---------- حضور و غیاب ---------- */
date: function(v) { if (v) { ad = v; attDraft = {}; render() } },
attClass: function(v) { attClass = v; pg.att = 1; attDraft = {}; render() },
setBell: function(bell) {
  if (Object.keys(attDraft).length) {
    if (!confirm('تغییرات تأییدنشده پاک می‌شوند. ادامه؟')) return;
    attDraft = {};
  }
  attBell = bell;
  render();
},
mark: function(sid, status) {
  if (!canMarkAtt()) return toast('دسترسی ندارید.', 'bad');
  if (needsConfirm()) {
    attDraft[sid] = {status, delay: (attDraft[sid] && attDraft[sid].delay) || 0, _bell: attBell, _date: ad};
    render();
  } else {
    if (!db.att) db.att = {};
    if (!db.att[ad]) db.att[ad] = {};
    if (!db.att[ad][attBell]) db.att[ad][attBell] = {};
    const prev = db.att[ad][attBell][sid] || {};
    const delay = status === 'l' ? (prev.delay || 0) : 0;
    db.att[ad][attBell][sid] = {status, delay};
    save(); render();
  }
},
setDelay: function(sid, v) {
  if (!canMarkAtt()) return;
  const d = clamp(parseInt(en(v), 10) || 0, 0, 120);
  if (needsConfirm()) {
    const cur = attDraft[sid] || attDay(ad, attBell)[sid] || {status:'l', delay:0};
    if (cur.status !== 'l') return;
    attDraft[sid] = Object.assign({}, cur, {status:'l', delay:d});
    render();
  } else {
    if (db.att[ad] && db.att[ad][attBell] && db.att[ad][attBell][sid]) {
      if (db.att[ad][attBell][sid].status !== 'l') return;
      db.att[ad][attBell][sid].delay = d;
      save(); render();
    }
  }
},
allP: function() {
  if (!canMarkAtt()) return toast('اجازه ندارید.', 'bad');
  const list = mine().filter(s => !attClass || s.classId === attClass);
  if (needsConfirm()) {
    list.forEach(s => attDraft[s.id] = {status:'p', delay:0, _bell: attBell, _date: ad});
    render(); toast('همه حاضر — تأیید را بزن.', 'warn');
  } else {
    if (!db.att) db.att = {};
    if (!db.att[ad]) db.att[ad] = {};
    if (!db.att[ad][attBell]) db.att[ad][attBell] = {};
    list.forEach(s => db.att[ad][attBell][s.id] = {status:'p', delay:0});
    save(); render(); toast('همه حاضر ثبت شد.', 'ok');
  }
},
allA: function() {
  if (!canMarkAtt()) return toast('اجازه ندارید.', 'bad');
  const list = mine().filter(s => !attClass || s.classId === attClass);
  if (needsConfirm()) {
    list.forEach(s => attDraft[s.id] = {status:'a', delay:0, _bell: attBell, _date: ad});
    render(); toast('همه غایب — تأیید را بزن.', 'warn');
  } else {
    if (!db.att) db.att = {};
    if (!db.att[ad]) db.att[ad] = {};
    if (!db.att[ad][attBell]) db.att[ad][attBell] = {};
    list.forEach(s => db.att[ad][attBell][s.id] = {status:'a', delay:0});
    save(); render(); toast('همه غایب ثبت شد.', 'ok');
  }
},
confirmAtt: function() {
  if (!canMarkAtt()) return toast('اجازه ندارید.', 'bad');
  if (!Object.keys(attDraft).length) return;
  if (!db.att) db.att = {};
  if (!db.att[ad]) db.att[ad] = {};
  if (!db.att[ad][attBell]) db.att[ad][attBell] = {};
  const payload = [];
  Object.keys(attDraft).forEach(id => {
    const rec = attDraft[id];
    if (rec._bell && rec._bell !== attBell) return;
    if (rec._date && rec._date !== ad) return;
    const clean = {status: rec.status, delay: rec.delay||0};
    db.att[ad][attBell][id] = clean;
    payload.push({sid:id, status:clean.status, delay:clean.delay});
  });
  const n = Object.keys(attDraft).length;
  audit('att_change', 'attendance', n + ' مورد حضور/غیاب · ' + attBell);
  attDraft = {}; save(); render();
  toast(n.toLocaleString('fa-IR') + ' مورد ثبت شد.', 'ok');
},
clearAttDraft: function() { attDraft = {}; render(); toast('تغییرات لغو شد.') },
csvAtt: function() {
  const day = attDay(ad, attBell);
  const list = mine().filter(s => !attClass || s.classId === attClass);
  const rows = [['تاریخ', 'زنگ', 'دانش‌آموز', 'کلاس', 'وضعیت', 'تأخیر']].concat(
    list.map(s => {
      const r = day[s.id] || {};
      return [ad, attBell, s.name, (db.classes.find(c=>c.id===s.classId)||{}).name||'',
              (ST[r.status]||[])[0] || 'ثبت‌نشده', r.delay||0];
    })
  );
  csvDownload(rows, `attendance_${ad}_${attBell}.csv`);
  xlsxDownload(rows, `attendance_${ad}_${attBell}.xlsx`, attBell);
  toast('خروجی گرفته شد.', 'ok');
},

});
