/* =========================================================================
   صفحه‌ی «حساب من»
   ========================================================================= */
Object.assign(V, {

/* ---------- حساب من ---------- */
acc: function() {
  return head('حساب من') +
    card('نام کاربری',
      `<p class="mu" style="margin-bottom:12px">نام کاربری فعلی: <b dir="ltr">${esc(me.username)}</b></p>
       <form class="fm" onsubmit="A.chUser(event)">
         <label>نام کاربری جدید<input name="username" dir="ltr" required pattern="[A-Za-z0-9_]{3,}"></label>
         <label>رمز فعلی<input name="pw" type="password" autocomplete="current-password" required></label>
         <button class="b p">تغییر</button>
       </form>`) +
    card('تغییر رمز عبور',
      `<form class="fm" onsubmit="A.chPw(event)">
        <label>رمز فعلی<input name="old" type="password" autocomplete="current-password" required></label>
        <label>رمز جدید<input name="pw" type="password" minlength="6" autocomplete="new-password" required></label>
        <label>تکرار رمز جدید<input name="pw2" type="password" minlength="6" autocomplete="new-password" required></label>
        <button class="b p">تغییر رمز</button>
      </form>`) +
    (USE_SERVER ? totpCard() : '') +
    card('خروج از حساب',
      `<p class="mu" style="margin-bottom:12px">در صورت نیاز می‌توانید از حساب خود خارج شوید.</p>
       <button class="b d" data-a="logout">خروج</button>`);
},

});
