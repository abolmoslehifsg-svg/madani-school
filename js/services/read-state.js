/* =========================================================================
   وضعیت «خوانده‌شدن» اعلان‌ها (فقط روی همین مرورگر، جدا از داده‌های سرور)
   ========================================================================= */
const ReadState = (() => {
  const storageKey = () => 'madani_read_' + (me ? me.id : '');
  const empty = () => ({ann: [], leaves: []});

  function load() {
    try { return JSON.parse(localStorage.getItem(storageKey())) || empty(); }
    catch (error) { return empty(); }
  }

  const addMe = (list, field) => (list || []).forEach(item => {
    item[field] = Array.from(new Set([...(item[field] || []), me.id]));
  });

  /* بعد از دریافت داده از سرور، وضعیت خوانده‌شده را دوباره اعمال می‌کند */
  function apply(data) {
    if (!me || !data) return;
    const saved = load();
    addMe((data.ann || []).filter(item => saved.ann.includes(item.id)), 'readBy');
    addMe((data.leaves || []).filter(item => saved.leaves.includes(item.id)), 'seenBy');
  }

  /* بعد از هر تغییر، آنچه کاربر خوانده را ذخیره می‌کند */
  function capture() {
    if (!me || !db) return;
    const readByMe = (list, field) => (list || [])
      .filter(item => (item[field] || []).includes(me.id)).map(item => item.id);
    try {
      localStorage.setItem(storageKey(), JSON.stringify({
        ann: readByMe(db.ann, 'readBy'),
        leaves: readByMe(db.leaves, 'seenBy')
      }));
    } catch (error) { /* حافظه پر است؛ مهم نیست */ }
  }

  return {apply, capture};
})();
