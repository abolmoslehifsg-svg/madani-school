/* =========================================================================
   اکشن‌های «رویدادها (showcase)»
   ========================================================================= */
Object.assign(A, {

/* ---------- رویدادها (showcase) ---------- */
previewShowcaseImg: async function(inp) {
  try {
    const file = inp.files[0]; if (!file) return;
    const data = await readImageAsDataURL(file, 400);
    const hidden = document.getElementById('showcaseImgData');
    if (hidden) hidden.value = data;
    const hint = document.getElementById('showcaseImgHint');
    if (hint) hint.textContent = '✅ بارگذاری شد (' + Math.round(data.length/1024) + ' کیلوبایت)';
    toast('عکس آماده است.', 'ok');
  } catch(err) { toast(err.message, 'bad') }
},
previewPollImg: async function(inp) {
  try {
    const file = inp.files[0]; if (!file) return;
    const data = await readImageAsDataURL(file, 300);
    const hidden = document.getElementById('pollImgData');
    if (hidden) hidden.value = data;
    toast('عکس آماده است.', 'ok');
  } catch(err) { toast(err.message, 'bad') }
},
addShowcase: function(e) {
  e.preventDefault();
  const f = fd(e);
  const item = {
    title: f.title.trim(), desc: f.desc.trim(), img: f.img || '',
    cat: f.cat, date: f.date, pinned: !!f.pinned, authorId: me.id
  };
  push('showcase', item, 'رویداد منتشر شد.');
  audit('showcase', 'showcase', f.title);
  e.target.reset();
},
addCalEvent: function(e) {
  e.preventDefault();
  const f = fd(e);
  push('calendar', {date: f.date, title: f.title.trim(), type: f.type, desc: f.desc||''}, 'رویداد تقویم اضافه شد.');
},

});
