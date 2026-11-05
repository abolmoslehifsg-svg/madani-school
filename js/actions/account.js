/* =========================================================================
   حساب من: نام کاربری، رمز عبور و تأیید دو مرحله‌ای (TOTP)
   ========================================================================= */
const usernameTaken = (username, exceptId) => db.users.some(
  user => user.id !== exceptId && user.username && user.username.toLowerCase() === username.toLowerCase());

async function changeUsernameOnServer(username, password) {
  try {
    const result = await api.changeUsername(username, password);
    me.username = result.username;
    const entry = (db.users || []).find(user => user.id === me.id);
    if (entry) { entry.username = result.username; SyncEngine.rebase('users', me.id); }
    render();
    toast('نام کاربری تغییر کرد.', 'ok');
  } catch (error) {
    toast(error.message, 'bad');
  }
}

async function changePasswordOnServer(form, formElement) {
  try {
    await api.changePassword(form.old, form.pw);
    formElement.reset();
    toast('رمز عبور تغییر کرد.', 'ok');
  } catch (error) {
    toast(error.message, 'bad');
  }
}

const formatSecret = secret => (secret.match(/.{1,4}/g) || [secret]).join(' ');

Object.assign(A, {
  chUser: async function(e) {
    e.preventDefault();
    const form = fd(e);
    const username = form.username.trim();
    if (USE_SERVER) return changeUsernameOnServer(username, form.pw);
    if (await hp(form.pw, me.salt) !== me.hash) return toast('رمز فعلی اشتباه است.', 'bad');
    if (usernameTaken(username, me.id)) return toast('این نام کاربری قبلاً وجود دارد.', 'bad');
    me.username = username;
    save(); render();
    toast('نام کاربری تغییر کرد.', 'ok');
  },

  chPw: async function(e) {
    e.preventDefault();
    const form = fd(e);
    if (form.pw !== form.pw2) return toast('تکرار رمز جدید یکسان نیست.', 'bad');
    if (USE_SERVER) return changePasswordOnServer(form, e.target);
    if (await hp(form.old, me.salt) !== me.hash) return toast('رمز فعلی اشتباه است.', 'bad');
    me.salt = uid() + uid();
    me.hash = await hp(form.pw, me.salt);
    save();
    e.target.reset();
    toast('رمز عبور تغییر کرد.', 'ok');
  },

  totpBegin: async function() {
    try {
      const {secret, uri} = await api.totpSetup();
      openModal(`<h2>فعال‌سازی تأیید دو مرحله‌ای</h2>
        <p class="mu">۱) برنامه‌ی احراز هویت (Google Authenticator، Microsoft Authenticator، Aegis و …) را باز کنید و حساب جدیدی با «وارد کردن کلید» بسازید:</p>
        <p style="margin:12px 0"><b dir="ltr" style="user-select:all;letter-spacing:1px">${esc(formatSecret(secret))}</b></p>
        <p style="margin-bottom:12px"><a href="${esc(uri)}">باز کردن مستقیم در برنامه (روی موبایل)</a></p>
        <form class="fm" onsubmit="A.totpEnable(event)">
          <label>۲) کد ۶ رقمی که برنامه نشان می‌دهد
            <input name="code" dir="ltr" maxlength="6" inputmode="numeric" autocomplete="one-time-code" required>
          </label>
          <button class="b p">فعال‌سازی</button>
        </form>`);
    } catch (error) {
      toast(error.message, 'bad');
    }
  },

  totpEnable: async function(e) {
    e.preventDefault();
    try {
      await api.totpEnable(fd(e).code.trim());
      me.totp = true;
      closeModal();
      render();
      toast('تأیید دو مرحله‌ای فعال شد.', 'ok');
    } catch (error) {
      toast(error.message, 'bad');
    }
  },

  totpDisable: async function() {
    const password = prompt('برای غیرفعال‌سازی، رمز عبور فعلی را وارد کنید:');
    if (!password) return;
    try {
      await api.totpDisable(password);
      me.totp = false;
      render();
      toast('تأیید دو مرحله‌ای غیرفعال شد.', 'ok');
    } catch (error) {
      toast(error.message, 'bad');
    }
  }
});
