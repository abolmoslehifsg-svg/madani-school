/* =========================================================================
   صفحه‌ی «گزارش عملیات (Audit)»
   ========================================================================= */
Object.assign(V, {

/* ---------- گزارش عملیات (Audit) ---------- */
audit: function() {
  const list = (db.audit||[]).slice().sort((a,b) => b.ts - a.ts);
  const p = paginate(list, 'audit');
  const rows = p.slice.map(a => `<div class="audit-row">
    <span class="tag">${AUDIT_ACTIONS[a.action]||a.action}</span>
    <span class="act">${uname(a.userId)}</span>
    <span class="tgt">${esc(a.detail||'')}${a.target?' <span class="mu">('+esc(a.target)+')</span>':''}</span>
    <span class="ts">${faDT(a.ts)}</span>
  </div>`);
  return head('گزارش عملیات', 'آخرین ۵۰۰ عملیات حساس سیستم') +
    card('', rows.join('') || empty('عملیاتی ثبت نشده.', '📋') + pagerHtml('audit', p.total));
},

});
