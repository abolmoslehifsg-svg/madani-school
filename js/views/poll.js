/* =========================================================================
   صفحه‌ی «نظرسنجی (صفحه مستقل)»
   ========================================================================= */
Object.assign(V, {

/* ---------- نظرسنجی (صفحه مستقل) ---------- */
poll: function() {
  return head('نظرسنجی‌ها') + pollsBlock() +
    (mgr()?card('ایجاد نظرسنجی',
      `<form class="fm" onsubmit="A.addPoll(event)">
        <label style="grid-column:1/-1">عنوان<input name="title" required></label>
        <label style="grid-column:1/-1">گزینه‌ها (هر خط یک گزینه)<textarea name="options" rows="3" required placeholder="خیلی خوب&#10;خوب&#10;نیاز به تغییر"></textarea></label>
        <label>مهلت (اختیاری)<input type="date" name="deadline"></label>
        <button class="b p">ایجاد</button>
      </form>`):'');
},

});
