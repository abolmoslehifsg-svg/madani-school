/* =========================================================================
   بخش پرورشی — types-tab
   ========================================================================= */
/* ---------- تب ۵: انواع بخش‌ها ---------- */
function provTypesTab() {
  if (!isProvereshiMgr()) return empty('فقط مدیر و معاون می‌توانند انواع بخش را مدیریت کنند.','🔒');

  const types = db.provTypes || [];
  const rows = types.map(t => `<tr>
    <td><b>${esc(t.icon)} ${esc(t.name)}</b></td>
    <td>${esc(PROV_OP[t.op]||t.op)}</td>
    <td>${t.unit?esc(t.unit):'—'}</td>
    <td>${t.active?'<span class="tag ok">فعال</span>':'<span class="tag bad">غیرفعال</span>'}</td>
    <td>
      <button class="b e sm" data-a="provToggleType" data-i="${t.id}">${t.active?'غیرفعال':'فعال'}</button>
      <button class="b d sm" data-a="del" data-i="${t.id}" data-v="provTypes">حذف</button>
    </td>
  </tr>`).join('');

  return card('افزودن نوع جدید',
    `<form class="fm" onsubmit="A.addProvType(event)">
      <label>نام<input name="name" required placeholder="مثلاً کتابخانه"></label>
      <label>آیکون<select name="icon">${opts(PROV_ICONS.map(i=>[i,i]))}</select></label>
      <label>نوع عملیات<select name="op">
        ${opts(Object.entries(PROV_OP).map(([k,v])=>[k,v]))}
      </select></label>
      <label>واحد پولی (اختیاری)<input name="unit" placeholder="تومان"></label>
      <button class="b p">افزودن نوع</button>
    </form>`) +
    card('انواع بخش‌های پرورشی',
      types.length ? tbl(['نام','عملیات','واحد','وضعیت',''], rows.split('</tr>').map(r=>r?r+'</tr>':''), 'نوعی ثبت نشده.','📋') : empty('نوعی ثبت نشده.','📋'));
}
