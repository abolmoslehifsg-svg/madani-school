/* =========================================================================
   اکشن‌های اضافی رابط کاربری (اعلان‌ها و جستجو)
   ========================================================================= */
A.toggleNotif = function() { toggleNotifPanel() };
A.closeNotif = function() {
  const p = document.getElementById('notifPanel');
  if (p) p.remove();
  notifPanelOpen = false;
};
A.markAllNotifRead = function() {
  (db.ann||[]).forEach(a => {
    if (!a.readBy) a.readBy = [];
    if (!a.readBy.includes(me.id)) a.readBy.push(me.id);
  });
  (db.messages||[]).forEach(m => { if (m.to === me.id) m.read = true });
  Object.values(chatCache).forEach(msgs => msgs.forEach(m => m.read = true));
  (db.leaves||[]).forEach(l => { if (l.status === 'pending') l.seenBy = [...(l.seenBy||[]), me.id] });
  save(); A.closeNotif(); render(); toast('همه خوانده شد.', 'ok');
};
A.openNotif = function(id) {
  const list = getNotifications();
  const n = list.find(x => x.id === id);
  if (!n) return;
  if (n.type === 'ann') {
    const a = (db.ann||[]).find(x => x.id === n.refId);
    if (a) {
      if (!a.readBy) a.readBy = [];
      if (!a.readBy.includes(me.id)) a.readBy.push(me.id);
      save();
    }
  }
  if (n.type === 'msg') {
    const m = (db.messages||[]).find(x => x.id === n.refId);
    if (m) m.read = true;
    save();
  }
  if (n.type === 'chat') {
    chatPeer = n.refId;
    if (chatCache[chatPeer]) chatCache[chatPeer].forEach(m => m.read = true);
  }
  A.closeNotif();
  n.action && n.action();
  render();
};

A.openSearch = function() { openSearch() };
A.gsSelect = function(idx) {
  const item = window.__gsItems && window.__gsItems[+idx];
  if (item && item.action) { closeSearch(); item.action() }
};
