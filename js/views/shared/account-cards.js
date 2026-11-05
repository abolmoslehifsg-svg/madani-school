/* =========================================================================
   کارت‌های ویژه‌ی حالت سرور
   ========================================================================= */
/* کارت‌های حساب و تنظیمات که فقط در حالت سرور نمایش داده می‌شوند */
function totpCard() {
  const body = me.totp
    ? `<p class="mu" style="margin-bottom:12px">تأیید دو مرحله‌ای برای حساب شما <b>فعال</b> است.</p>
       <button class="b d" data-a="totpDisable">غیرفعال‌سازی</button>`
    : `<p class="mu" style="margin-bottom:12px">با فعال‌سازی، هنگام ورود علاوه بر رمز، یک کد ۶ رقمی از برنامه‌ی احراز هویت روی گوشی‌تان لازم است. برای مدیر و معاون به‌شدت توصیه می‌شود.</p>
       <button class="b p" data-a="totpBegin">فعال‌سازی</button>`;
  return card('تأیید دو مرحله‌ای (TOTP)', body);
}

function serverBackupCard() {
  return card('پشتیبان‌گیری',
    `<p class="mu" style="margin-bottom:12px">داده‌ها روی سرور و در فایل پایگاه‌داده ذخیره می‌شوند. نسخه‌ی کامل پشتیبان (شامل رمزهای هش‌شده) را مرتب دانلود و در جای امن نگه دارید. بازیابی: فایل را جایگزین <code dir="ltr">instance/madani.db</code> کنید.</p>
     <a class="b" href="${API_BASE}/admin/backup" download>دانلود پشتیبان کامل</a>`);
}

function resetPwBtn(user) {
  const allowed = USE_SERVER && (user.role !== 'admin' || isAdmin());
  return allowed ? `<button class="b sm" data-a="resetPw" data-i="${esc(user.id)}">بازنشانی رمز</button>` : '';
}
