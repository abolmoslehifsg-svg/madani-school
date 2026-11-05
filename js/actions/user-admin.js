/* =========================================================================
   مدیریت حساب دیگران (فقط مدیر/معاون روی سرور)
   ========================================================================= */
Object.assign(A, {
  resetPw: async function(id) {
    const user = db.users.find(item => item.id === id);
    if (!user || !USE_SERVER) return;
    const password = prompt(`رمز جدید برای «${user.name}» (حداقل ۶ نویسه):`);
    if (!password) return;
    try {
      await api.resetPassword(id, password);
      audit('edit', 'users', 'بازنشانی رمز: ' + user.name);
      toast('رمز تغییر کرد؛ کاربر باید دوباره وارد شود.', 'ok');
    } catch (error) {
      toast(error.message, 'bad');
    }
  }
});
