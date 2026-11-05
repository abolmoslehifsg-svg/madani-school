/* =========================================================================
   مرکز اعلان‌ها
   ========================================================================= */
/* =========================================================================
   Notification Center
   ========================================================================= */
function toggleNotifPanel() {
  notifPanelOpen = !notifPanelOpen;
  if (notifPanelOpen) {
    const panel = document.createElement('div');
    panel.className = 'notif-panel';
    panel.id = 'notifPanel';

    const items = getNotifications();
    const unreadCount = items.filter(i => !i.read).length;

    panel.innerHTML = `
      <div class="head">
        <span>🔔 اعلان‌ها ${unreadCount?`<span class="tag bad">${toFa(unreadCount)}</span>`:''}</span>
        <div class="row gap">
          ${unreadCount?`<button class="b sm" data-a="markAllNotifRead">همه خوانده شد</button>`:''}
          <button class="b sm" data-a="closeNotif">✕</button>
        </div>
      </div>
      <div class="list">
        ${items.length ? items.map(n => `
          <div class="notif-item ${n.read?'':'unread'}" data-a="openNotif" data-i="${esc(n.id)}">
            <b>${esc(n.title)}</b>
            <p>${esc(n.body||'')}</p>
            <small>${faDT(n.ts)}</small>
          </div>
        `).join('') : empty('اعلانی نیست.', '🔔')}
      </div>`;
    document.body.appendChild(panel);

    document.addEventListener('click', function closePanel(ev) {
      const p = document.getElementById('notifPanel');
      const btn = ev.target.closest('[data-a="toggleNotif"]');
      if (p && !p.contains(ev.target) && !btn) {
        p.remove();
        notifPanelOpen = false;
        document.removeEventListener('click', closePanel);
      }
    });
  } else {
    const p = document.getElementById('notifPanel');
    if (p) p.remove();
  }
}

function getNotifications() {
  const items = [];

  /* اعلانات */
  annList().forEach(a => {
    items.push({
      id: 'ann_' + a.id,
      type: 'ann', refId: a.id,
      title: '📢 ' + a.title,
      body: a.body,
      ts: a.ts || 0,
      read: (a.readBy||[]).includes(me.id),
      action: () => { page = 'ann'; location.hash = '#ann'; render() }
    });
  });

  /* پیام‌های خوانده‌نشده */
  (db.messages||[]).filter(m => m.to === me.id && !m.read).forEach(m => {
    items.push({
      id: 'msg_' + m.id,
      type: 'msg', refId: m.id,
      title: '✉️ پیام از ' + uname(m.from),
      body: m.text,
      ts: m.ts,
      read: false,
      action: () => { page = 'msg'; location.hash = '#msg'; render() }
    });
  });

  /* چت‌های خوانده‌نشده */
  Object.entries(chatCache).forEach(([peer, msgs]) => {
    const unread = msgs.filter(m => !m.read && m.from !== me.id);
    if (unread.length) {
      items.push({
        id: 'chat_' + peer,
        type: 'chat', refId: peer,
        title: '💬 ' + unread.length + ' پیام جدید از ' + uname(peer),
        body: unread[0].text,
        ts: unread[unread.length-1].ts,
        read: false,
        action: () => { page = 'chat'; location.hash = '#chat'; chatPeer = peer; render() }
      });
    }
  });

  /* مرخصی‌های در انتظار (مدیر/معاون) */
  if (mgr()) {
    (db.leaves||[]).filter(l => l.status === 'pending').forEach(l => {
      items.push({
        id: 'leave_' + l.id,
        type: 'leave', refId: l.id,
        title: '🌴 درخواست مرخصی — ' + sname(l.sid),
        body: 'از ' + faDate(l.from) + ' تا ' + faDate(l.to),
        ts: l.ts,
        read: false,
        action: () => { page = 'leaves'; location.hash = '#leaves'; render() }
      });
    });
  }

  return items.sort((a, b) => b.ts - a.ts);
}
