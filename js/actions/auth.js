/* =========================================================================
   ورود، خروج، راه‌اندازی اولیه و تأیید دو مرحله‌ای
   ========================================================================= */
const LOCK_MS = 30000;
const MAX_LOCAL_FAILURES = 5;

function startSession(user, bootstrap, remember) {
  me = user;
  if (bootstrap) db = bootstrap;
  attDraft = {};
  gradeDraft = [];
  chatCache = {};
  chatPeer = null;
  if (USE_SERVER) {
    ReadState.apply(db);
    SyncEngine.reset();
  } else {
    (remember ? localStorage : sessionStorage).setItem('u', me.id);
  }
  localStorage.setItem('madani_role', me.role);
  page = location.hash.slice(1) || 'dash';
  Realtime.start();
  render();
}

/* ---------- ورود با سرور ---------- */
async function loginOnServer(form) {
  try {
    const remember = !!form.remember;
    const result = await api.login(form.username.trim(), form.password, form.role, remember);
    if (result.otpRequired) {
      otpPending = {pendingToken: result.pendingToken};
      return render();
    }
    startSession(result.user, result.bootstrap, remember);
    toast('خوش آمدید ' + me.name, 'ok');
  } catch (error) {
    toast(error.message, 'bad');
  }
}

/* ---------- ورود آفلاین (نسخه‌ی نمایشی بدون سرور) ---------- */
function registerLocalFailure() {
  if (++fails >= MAX_LOCAL_FAILURES) { lock = Date.now() + LOCK_MS; fails = 0; }
}

async function loginOffline(form) {
  if (Date.now() < lock) return toast('چند بار اشتباه وارد شدید؛ ۳۰ ثانیه صبر کنید.', 'bad');
  const username = form.username.trim();
  const user = db.users.find(x => x.username.toLowerCase() === username.toLowerCase());
  if (!user) { registerLocalFailure(); return toast('نام کاربری یا رمز اشتباه است.', 'bad'); }
  if (user.role !== form.role) { registerLocalFailure(); return toast('نقش انتخابی مطابقت ندارد.', 'bad'); }
  if (await hp(form.password, user.salt) !== user.hash) {
    registerLocalFailure();
    return toast('نام کاربری یا رمز اشتباه است.', 'bad');
  }
  fails = 0;
  const twoFactorEnabled = db.settings && db.settings.twoFA && db.settings.twoFA[user.role];
  if (twoFactorEnabled) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpPending = {user, code, remember: form.remember};
    toast('کد یکبارمصرف (دمو): ' + code, 'info');
    return render();
  }
  startSession(user, null, form.remember);
  audit('login', '', 'ورود موفق');
}

async function verifyOtpOnServer(code) {
  try {
    const result = await api.verifyOtp(otpPending.pendingToken, code);
    otpPending = null;
    startSession(result.user, result.bootstrap, false);
    toast('خوش آمدید ' + me.name, 'ok');
  } catch (error) {
    toast(error.message, 'bad');
    if (error.status === 401 && /مهلت/.test(error.message)) { otpPending = null; render(); }
  }
}

function verifyOtpOffline(code) {
  if (!otpPending || otpPending.code !== code) return toast('کد نامعتبر است.', 'bad');
  const {user, remember} = otpPending;
  otpPending = null;
  startSession(user, null, remember);
  audit('login', '', 'ورود با 2FA');
  toast('خوش آمدید ' + me.name, 'ok');
}

Object.assign(A, {
  login: async function(e) {
    e.preventDefault();
    const form = fd(e);
    return USE_SERVER ? loginOnServer(form) : loginOffline(form);
  },

  setup: async function(e) {
    e.preventDefault();
    const form = fd(e);
    if (form.password !== form.password2) return toast('تکرار رمز یکسان نیست.', 'bad');
    try {
      const result = await api.setup(form.name.trim(), form.username.trim(), form.password, (form.token || '').trim());
      serverInfo.needsSetup = false;
      startSession(result.user, result.bootstrap, false);
      toast('راه‌اندازی انجام شد؛ خوش آمدید ' + me.name, 'ok');
    } catch (error) {
      toast(error.message, 'bad');
    }
  },

  verifyOtp: function(e) {
    e.preventDefault();
    const code = (fd(e).code || '').trim();
    return USE_SERVER ? verifyOtpOnServer(code) : verifyOtpOffline(code);
  },

  cancelOtp: function() { otpPending = null; render(); },

  logout: async function() {
    audit('logout', '', '');
    if (USE_SERVER) {
      await SyncEngine.flushNow();
      try { await api.logout(); } catch (error) { /* خروج محلی ادامه می‌یابد */ }
    }
    Realtime.stop();
    me = null;
    attDraft = {};
    gradeDraft = [];
    chatCache = {};
    chatPeer = null;
    quizSession = null;
    sessionStorage.removeItem('u');
    localStorage.removeItem('u');
    if (USE_SERVER) db = emptyDb(serverInfo.school);
    render();
  }
});
