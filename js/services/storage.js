/* =========================================================================
   ذخیره‌سازی: روی سرور (همگام‌سازی) یا در مرورگر (حالت آفلاین)
   ========================================================================= */
const save = () => {
  if (USE_SERVER) {
    ReadState.capture();
    SyncEngine.schedule();
    return;
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
  catch (error) { toast('حجم داده بیشتر از ظرفیت مرورگر است (احتمالاً عکس‌ها)', 'bad'); }
};

/* بازخوانی از سرور؛ با cols فقط همان بخش‌ها در db ادغام می‌شوند */
async function reload(cols) {
  if (USE_SERVER) {
    const fresh = await api.bootstrap(cols);
    db = cols && cols.length ? Object.assign(db, fresh) : fresh;
    ReadState.apply(db);
    SyncEngine.reset();
  }
  render();
}
