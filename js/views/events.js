/* =========================================================================
   صفحه‌ی «رویدادها (با عکس)»
   ========================================================================= */
Object.assign(V, {

/* ---------- رویدادها (با عکس) ---------- */
events: function() {
  const list = (db.showcase||[]).slice().sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0) || (b.ts||0)-(a.ts||0));
  const p = paginate(list, 'events');
  const canEdit = isProvereshiMgr();

  const grid = p.slice.length
    ? `<div class="events-grid">${p.slice.map(e => evCardMini(e, canEdit)).join('')}</div>`
    : empty('هنوز رویدادی ثبت نشده.', '🎪');

  return head('رویدادها و مناسبت‌ها', 'رویدادها، مناسبت‌ها و نظرسنجی‌های تصویری مدرسه') +
    (canEdit ? card('ایجاد رویداد جدید',
      `<form class="fm" onsubmit="A.addShowcase(event)">
        <label>عنوان<input name="title" required placeholder="مثلاً هفته وحدت"></label>
        <label>دسته<select name="cat">${opts(EVENT_CATS.map(c=>[c,c]))}</select></label>
        <label>تاریخ<input type="date" name="date" value="${iso()}"></label>
        <label style="grid-column:1/-1">توضیحات<textarea name="desc" rows="3" required placeholder="هفته وحدت چیست و چه رویدادهایی در مدرسه برگزار می‌شود..."></textarea></label>
        <label style="grid-column:1/-1">عکس
          <input type="file" accept="image/*" onchange="A.previewShowcaseImg(this)">
          <input type="hidden" name="img" id="showcaseImgData">
          <small class="hint" id="showcaseImgHint">حداکثر ۴۰۰ کیلوبایت — به صورت خودکار فشرده می‌شود</small>
        </label>
        <label class="inline"><input type="checkbox" name="pinned"> سنجاق در بالای صفحه</label>
        <button class="b p">انتشار رویداد</button>
      </form>`):'') +
    (canEdit ? card('نظرسنجی تصویری',
      `<form class="fm" onsubmit="A.addPoll(event)">
        <label style="grid-column:1/-1">عنوان<input name="title" required></label>
        <label style="grid-column:1/-1">گزینه‌ها (هر خط یک گزینه)<textarea name="options" rows="3" required placeholder="خیلی خوب&#10;خوب&#10;نیاز به تغییر"></textarea></label>
        <label>مهلت (اختیاری)<input type="date" name="deadline"></label>
        <label style="grid-column:1/-1">عکس نظرسنجی
          <input type="file" accept="image/*" onchange="A.previewPollImg(this)">
          <input type="hidden" name="img" id="pollImgData">
        </label>
        <button class="b p">ایجاد نظرسنجی</button>
      </form>`):'') +
    card('', grid + pagerHtml('events', p.total)) +
    pollsBlock();
},

});
