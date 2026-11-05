/* =========================================================================
   بخش پرورشی — events-tab
   ========================================================================= */
/* ---------- تب ۱: رویدادها ---------- */
function provEventsTab() {
  const evs = (db.provEvents||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  const rows = evs.map(e => {
    const t = provType(e.typeId);
    const records = provRecordsFor(e.id);
    return `<div class="prov-tile">
      <span class="count">${toFa(records.length)} رکورد</span>
      <div class="ico">${t?t.icon:'📌'}</div>
      <h3>${esc(e.title)}</h3>
      <div class="mu">${t?esc(t.name):'—'} · ${faDate(e.date)}</div>
      <div class="leaders">سرپرست‌ها: <b>${(e.leaders||[]).map(id => uname(id)).join('، ') || '—'}</b></div>
      <div class="actions row gap" style="margin-top:10px">
        <button class="b p sm" data-a="provOpenEvent" data-i="${e.id}">مدیریت</button>
        ${isProvereshiMgr() ? `<button class="b e sm" data-a="provEditEvent" data-i="${e.id}">ویرایش</button>
        <button class="b d sm" data-a="del" data-i="${e.id}" data-v="provEvents">حذف</button>` : ''}
      </div>
    </div>`;
  }).join('');

  const form = isProvereshiMgr() ? card('ایجاد رویداد پرورشی',
    `<form class="fm" onsubmit="A.addProvEvent(event)">
      <label>عنوان<input name="title" required placeholder="مثلاً بوفه هفته وحدت"></label>
      <label>نوع بخش<select name="typeId" required>
        ${opts((db.provTypes||[]).filter(t=>t.active).map(t=>[t.id, t.icon+' '+t.name]))}
      </select></label>
      <label>تاریخ<input type="date" name="date" value="${iso()}"></label>
      <label style="grid-column:1/-1">توضیحات<textarea name="desc" rows="2"></textarea></label>
      <label style="grid-column:1/-1">سرپرست‌ها (چندگزینه)
        <div class="chk-group">
          ${db.users.filter(u=>u.role!=='admin').map(u =>
            `<label><input type="checkbox" name="leaders" value="${u.id}"> ${esc(u.name)} (${ROLE[u.role]})</label>`
          ).join('')}
        </div>
      </label>
      <label class="inline"><input type="checkbox" name="active" checked> فعال باشد</label>
      <button class="b p">ایجاد رویداد</button>
    </form>`) : '';

  return form + card('رویدادهای پرورشی',
    evs.length ? `<div class="prov-grid">${rows}</div>` : empty('رویدادی ثبت نشده.','🏫'));
}
