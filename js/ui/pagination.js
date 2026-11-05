/* =========================================================================
   صفحه‌بندی
   ========================================================================= */
/* ---------- صفحه‌بندی ---------- */
function paginate(arr, key) {
  if (!pg[key] || pg[key] < 1) pg[key] = 1;
  const total = Math.max(1, Math.ceil((arr||[]).length / PER_PAGE));
  if (pg[key] > total) pg[key] = total;
  const start = (pg[key]-1) * PER_PAGE;
  return {slice: arr.slice(start, start+PER_PAGE), total, page: pg[key]};
}
function pagerHtml(key, total) {
  if (total <= 1) return '';
  let h = '<div class="pager np">';
  h += `<button class="b sm" data-a="pg" data-i="${key}" data-v="${pg[key]-1}" ${pg[key]<=1?'disabled':''}>قبلی</button>`;
  for (let i=1; i<=total; i++) {
    if (i===1 || i===total || Math.abs(i-pg[key])<=2)
      h += `<button class="b sm${i===pg[key]?' on':''}" data-a="pg" data-i="${key}" data-v="${i}">${i.toLocaleString('fa-IR')}</button>`;
    else if (Math.abs(i-pg[key])===3) h += '<span class="mu">…</span>';
  }
  h += `<button class="b sm" data-a="pg" data-i="${key}" data-v="${pg[key]+1}" ${pg[key]>=total?'disabled':''}>بعدی</button></div>`;
  return h;
}
