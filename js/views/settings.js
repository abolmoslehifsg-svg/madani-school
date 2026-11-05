/* =========================================================================
   صفحه‌ی «تنظیمات»
   ========================================================================= */
Object.assign(V, {

/* ---------- تنظیمات ---------- */
set: function() {
  const s = db.settings || {twoFA:{admin:false, vice:false}};
  return head('تنظیمات') +
    card('مدرسه',
      `<form class="fm" onsubmit="A.school(event)">
        <label>نام مدرسه<input name="school" value="${esc(db.school)}" required></label>
        <label>سال تحصیلی<input name="year" value="${esc(db.year||'')}" placeholder="مثلاً ۱۴۰۵-۱۴۰۶"></label>
        <button class="b p">ذخیره</button>
      </form>`) +
    card('ظاهر',
      `<div class="row"><span>حالت تیره</span>
        <button class="theme-btn" data-a="toggleDark">${dark?'☀️':'🌙'}</button>
      </div>`) +
    (isAdmin() && !USE_SERVER ? card('احراز هویت دو مرحله‌ای',
      `<p class="mu" style="margin-bottom:12px">با فعال‌سازی، هنگام ورود یک کد یکبارمصرف به شما نمایش داده می‌شود (در نسخه دمو، کد از طریق toast ارسال می‌شود). در نسخه سرور، به پیامک/ایمیل متصل خواهد شد.</p>
      <div class="stack">
        <label class="inline"><input type="checkbox" ${s.twoFA.admin?'checked':''} onchange="A.toggle2FA('admin', this.checked)"> فعال برای مدیر</label>
        <label class="inline"><input type="checkbox" ${s.twoFA.vice?'checked':''} onchange="A.toggle2FA('vice', this.checked)"> فعال برای معاون</label>
      </div>`) : '') +
    (USE_SERVER ? serverBackupCard() : card('پشتیبان‌گیری',
      `<p class="mu" style="margin-bottom:12px">اطلاعات (شامل عکس‌های رویدادها) فقط در همین مرورگر ذخیره می‌شود؛ مرتب پشتیبان بگیرید.</p>
       <div class="row start gap">
         <button class="b" data-a="export">دانلود پشتیبان</button>
         <label class="b" style="display:inline-block;cursor:pointer">بازیابی از فایل<input type="file" accept=".json" hidden onchange="A.import(this.files[0])"></label>
         <button class="b d" data-a="reset">بازنشانی کامل</button>
       </div>`));
}
});
