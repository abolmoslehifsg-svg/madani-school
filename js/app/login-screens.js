/* =========================================================================
   صفحه‌های پیش از ورود: ورود، راه‌اندازی اولیه، تأیید دو مرحله‌ای
   ========================================================================= */
const ROLE_OPTIONS = [['student', 'دانش‌آموز'], ['parent', 'ولی'], ['teacher', 'معلم'], ['vice', 'معاون'], ['admin', 'مدیر']];

const logoHtml = () => `<div class="logo"><i>${LOGO_MARK}</i>${esc(db.school)}</div>`;

function renderOtpScreen(app) {
  const hint = USE_SERVER
    ? 'کد ۶ رقمی برنامه‌ی احراز هویت (Google Authenticator و مشابه) را وارد کنید'
    : 'کد ۶ رقمی ارسال‌شده را وارد کنید';
  app.innerHTML = `<div class="login"><form onsubmit="A.verifyOtp(event)">
    ${logoHtml()}
    <h1>تأیید دو مرحله‌ای</h1>
    <p class="mu" style="text-align:center">${hint}</p>
    <label>کد تأیید<input name="code" dir="ltr" maxlength="6" inputmode="numeric" autocomplete="one-time-code" required autofocus placeholder="••••••"></label>
    <button class="b p block">تأیید و ورود</button>
    <button type="button" class="b block" onclick="A.cancelOtp()">انصراف</button>
  </form></div>`;
}

function renderSetupScreen(app) {
  app.innerHTML = `<div class="login"><form onsubmit="A.setup(event)">
    ${logoHtml()}
    <h1>راه‌اندازی اولیه</h1>
    <p class="mu" style="text-align:center">حساب مدیر سامانه را بسازید. این صفحه فقط یک بار نمایش داده می‌شود.</p>
    <label>نام کامل مدیر<input name="name" required autofocus></label>
    <label>نام کاربری<input name="username" dir="ltr" autocomplete="username" required pattern="[A-Za-z0-9_.@\\-]{3,40}"></label>
    <label>رمز عبور<input name="password" type="password" autocomplete="new-password" minlength="6" required></label>
    <label>تکرار رمز عبور<input name="password2" type="password" autocomplete="new-password" minlength="6" required></label>
    ${serverInfo.setupTokenRequired ? '<label>توکن راه‌اندازی (MADANI_SETUP_TOKEN)<input name="token" dir="ltr" autocomplete="off" required></label>' : ''}
    <button class="b p block">ساخت حساب و ورود</button>
  </form></div>`;
}

function renderCredentialsScreen(app) {
  const offlineHint = USE_SERVER ? '' :
    '<p class="hint" style="text-align:center">نسخه‌ی آفلاین: اطلاعات فقط در همین مرورگر ذخیره می‌شود.</p>';
  app.innerHTML = `<div class="login"><form onsubmit="A.login(event)">
    ${logoHtml()}
    <h1>ورود به سامانه</h1>
    <label>ورود به عنوان
      <select name="role">${opts(ROLE_OPTIONS, localStorage.getItem('madani_role') || 'student')}</select>
    </label>
    <label>نام کاربری<input name="username" dir="ltr" autocomplete="username" required></label>
    <label>رمز عبور<input name="password" type="password" autocomplete="current-password" required></label>
    <label class="inline" style="font-weight:400"><input type="checkbox" name="remember"> مرا به خاطر بسپار</label>
    <button class="b p block">ورود</button>
    <p class="hint" style="text-align:center;margin-top:4px">نقش انتخابی باید با حساب کاربری مطابقت داشته باشد.</p>
    ${offlineHint}
  </form></div>`;
}

function renderLogin(app) {
  if (otpPending) return renderOtpScreen(app);
  if (USE_SERVER && serverInfo && serverInfo.needsSetup) return renderSetupScreen(app);
  renderCredentialsScreen(app);
}
