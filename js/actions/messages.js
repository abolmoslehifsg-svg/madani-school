/* =========================================================================
   اکشن‌های «پیام‌ها»
   ========================================================================= */
Object.assign(A, {

/* ---------- پیام‌ها ---------- */
sendMsg: function(e) {
  e.preventDefault();
  const f = fd(e);
  if (!f.to) return toast('گیرنده را انتخاب کنید.', 'bad');
  const allowed = allowedChatPeers().some(u => u.id === f.to) || mgr();
  if (!allowed) return toast('اجازه ارسال پیام به این کاربر را ندارید.', 'bad');
  if (!db.messages) db.messages = [];
  db.messages.push({id:uid(), from:me.id, to:f.to, text:f.text.trim(), ts:Date.now(), read:false});
  save(); render(); toast('پیام ارسال شد.', 'ok');
},

});
