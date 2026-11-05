/* =========================================================================
   اعلان کوتاه (Toast) و تم
   ========================================================================= */
/* ---------- Toast ---------- */
const toast = (m, t) => {
  const x = $('#toast');
  x.textContent = m;
  x.className = 'show ' + (t||'');
  clearTimeout(x._t);
  x._t = setTimeout(() => x.className = '', 3200);
};

/* ---------- Theme ---------- */
const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  localStorage.setItem('madani_dark', dark ? '1' : '0');
};
