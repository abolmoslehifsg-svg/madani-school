/* =========================================================================
   اکشن‌های «پرورشی»
   ========================================================================= */
Object.assign(A, {

/* ---------- پرورشی ---------- */
provTab: function(t) { provereshiTab = t; render() },
provSelectEvent: function(eid) { provEventView = eid; render() },

addProvType: function(e) {
  e.preventDefault();
  if (!isProvereshiMgr()) return;
  const f = fd(e);
  push('provTypes', {
    name: f.name.trim(), icon: f.icon, op: f.op,
    unit: f.unit.trim(), active: true, createdBy: me.id
  }, 'نوع بخش اضافه شد.');
},
provToggleType: function(id) {
  if (!isProvereshiMgr()) return;
  const t = provType(id);
  if (!t) return;
  t.active = !t.active;
  save(); render();
},
addProvEvent: function(e) {
  e.preventDefault();
  if (!isProvereshiMgr()) return;
  const f = fd(e);
  const formEl = e.target;
  const leaders = Array.from(formEl.querySelectorAll('input[name="leaders"]:checked')).map(x => x.value);
  push('provEvents', {
    typeId: f.typeId, title: f.title.trim(), desc: f.desc||'',
    date: f.date, leaders, active: !!f.active, createdBy: me.id
  }, 'رویداد پرورشی ایجاد شد.');
  audit('prov_event', 'provEvents', f.title);
  e.target.reset();
},
provEditEvent: function(id) {
  if (!isProvereshiMgr()) return;
  const ev = provEvent(id);
  if (!ev) return;
  const leadersBox = db.users.filter(u=>u.role!=='admin').map(u =>
    `<label><input type="checkbox" name="leaders" value="${u.id}" ${(ev.leaders||[]).includes(u.id)?'checked':''}> ${esc(u.name)} (${ROLE[u.role]})</label>`
  ).join('');
  openModal(`<h2>ویرایش رویداد پرورشی</h2>
    <form class="fm" onsubmit="A.saveProvEvent(event, '${ev.id}')">
      <label>عنوان<input name="title" value="${esc(ev.title)}" required></label>
      <label>نوع<select name="typeId">${opts((db.provTypes||[]).map(t=>[t.id, t.icon+' '+t.name]), ev.typeId)}</select></label>
      <label>تاریخ<input type="date" name="date" value="${ev.date}"></label>
      <label style="grid-column:1/-1">توضیحات<textarea name="desc" rows="2">${esc(ev.desc||'')}</textarea></label>
      <label style="grid-column:1/-1">سرپرست‌ها<div class="chk-group">${leadersBox}</div></label>
      <label class="inline"><input type="checkbox" name="active" ${ev.active!==false?'checked':''}> فعال</label>
      <button class="b p">ذخیره</button>
    </form>`);
},
saveProvEvent: function(e, id) {
  e.preventDefault();
  if (!isProvereshiMgr()) return;
  const ev = provEvent(id); if (!ev) return;
  const f = fd(e);
  const formEl = e.target;
  const leaders = Array.from(formEl.querySelectorAll('input[name="leaders"]:checked')).map(x => x.value);
  Object.assign(ev, {
    title: f.title.trim(), typeId: f.typeId, date: f.date,
    desc: f.desc||'', leaders, active: !!f.active
  });
  save(); closeModal(); render(); toast('ذخیره شد.', 'ok');
},
provOpenEvent: function(eid) {
  const ev = provEvent(eid); if (!ev) return;
  provEventView = eid;
  const t = provType(ev.typeId);
  if (t && t.op === 'coupon') { provereshiTab = 'coupon'; }
  else if (t && t.op === 'attend') { provereshiTab = 'attend'; }
  else if (t && t.op === 'vote') { provereshiTab = 'vote'; }
  render();
},

addCoupon: function(e) {
  e.preventDefault();
  if (!isProvereshiMgr()) {
    if (!(db.provEvents||[]).some(ev => (ev.leaders||[]).includes(me.id))) return toast('اجازه ندارید.', 'bad');
  }
  const f = fd(e);
  const evs = (db.provEvents||[]).filter(e2 => {
    const t = provType(e2.typeId);
    return t && t.op === 'coupon' && (e2.active !== false);
  });
  const ev = provEventView ? provEvent(provEventView) : evs[0];
  if (!ev) return toast('رویدادی نیست.', 'bad');
  if (!isProvereshiMgr() && !(ev.leaders||[]).includes(me.id)) return toast('شما سرپرست این رویداد نیستید.', 'bad');
  const t = provType(ev.typeId);
  push('provRecords', {
    eventId: ev.id, typeId: ev.typeId, sid: f.sid, by: me.id,
    data: { item: f.item, amount: parseInt(en(f.amount), 10)||0 }
  }, 'کوپن ثبت شد.');
  audit('coupon', 'provRecords', sname(f.sid) + ' · ' + f.item + ' · ' + f.amount);
  e.target.reset();
},
addAttendRecord: function(e) {
  e.preventDefault();
  const f = fd(e);
  const evs = (db.provEvents||[]).filter(e2 => {
    const t = provType(e2.typeId);
    return t && t.op === 'attend' && (e2.active !== false);
  });
  const ev = provEventView ? provEvent(provEventView) : evs[0];
  if (!ev) return toast('رویدادی نیست.', 'bad');
  if (!isProvereshiMgr() && !(ev.leaders||[]).includes(me.id)) return toast('شما سرپرست این رویداد نیستید.', 'bad');
  push('provRecords', {
    eventId: ev.id, typeId: ev.typeId, sid: f.sid, by: me.id,
    data: { status: f.status, note: f.note || '' }
  }, 'ثبت شد.');
  e.target.reset();
},

addElection: function(e) {
  e.preventDefault();
  if (!isProvereshiMgr()) return;
  const f = fd(e);
  const cands = f.candidates.split(/\n+/).map(x => x.trim()).filter(Boolean).map(n => ({name: n}));
  if (cands.length < 2) return toast('حداقل دو کاندید لازم است.', 'bad');
  push('provElections', {
    title: f.title.trim(), candidates: cands, votes: {},
    open: true, deadline: f.deadline || '', createdBy: me.id
  }, 'انتخابات ایجاد شد.');
  audit('election', 'provElections', f.title);
  e.target.reset();
},
provCastVote: function(elId, cidx) {
  const el = (db.provElections||[]).find(x => x.id === elId);
  if (!el) return;
  if (!el.open) return toast('رأی‌گیری بسته است.', 'bad');
  if (el.deadline && iso() > el.deadline) return toast('مهلت تمام شده.', 'bad');
  if (el.votes[me.id] !== undefined) return toast('قبلاً رأی داده‌اید.', 'bad');
  el.votes[me.id] = +cidx;
  save(); render(); toast('رأی شما ثبت شد.', 'ok');
  audit('vote', 'provElections', el.title + ' → ' + (el.candidates[cidx]||{}).name);
},
provToggleElection: function(elId) {
  if (!isProvereshiMgr()) return;
  const el = (db.provElections||[]).find(x => x.id === elId);
  if (!el) return;
  el.open = !el.open;
  save(); render();
},

csvProv: function() {
  const rows = [['تاریخ','رویداد','نوع','دانش‌آموز','شرح','مبلغ','ثبت‌کننده']].concat(
    (db.provRecords||[]).map(r => {
      const ev = provEvent(r.eventId);
      const t = provType(r.typeId);
      return [
        new Date(r.ts).toLocaleDateString('en-CA'),
        ev?ev.title:'', t?t.name:'',
        (db.students.find(s=>s.id===r.sid)||{}).name||'',
        (r.data && (r.data.item || r.data.status))||'',
        r.data && r.data.amount || 0,
        (db.users.find(u=>u.id===r.by)||{}).name||''
      ];
    })
  );
  csvDownload(rows, 'provereshi_'+iso()+'.csv');
  xlsxDownload(rows, 'provereshi_'+iso()+'.xlsx', 'پرورشی');
  toast('خروجی گرفته شد.', 'ok');
},

});
