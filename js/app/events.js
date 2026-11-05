/* =========================================================================
   رویدادهای سراسری document
   ========================================================================= */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const fn = A[b.dataset.a];
  if (fn) fn(b.dataset.i, b.dataset.v);
});

/* کیبورد */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal) closeModal();
    if (searchOpen) closeSearch();
    if (notifPanelOpen) A.closeNotif();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (me) openSearch();
  }
});

/* جستجو در باکس */
document.addEventListener('input', e => {
  if (e.target && e.target.id === 'gsInput') doSearch(e.target.value);
});

/* hashchange */
addEventListener('hashchange', () => {
  if (me) { page = location.hash.slice(1) || 'dash'; render() }
});

/* resize */
window.addEventListener('resize', () => {
  if (page === 'chat') {
    const el = $('#chatMsgs');
    if (el) el.scrollTop = el.scrollHeight;
  }
});
