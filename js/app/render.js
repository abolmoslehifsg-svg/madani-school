/* =========================================================================
   رندر اصلی صفحه
   ========================================================================= */
/* =========================================================================
   Render
   ========================================================================= */
function render() {
  applyTheme();
  const app = $('#app');

  if (!me) { renderLogin(app); return; }

  /* ---------- بررسی دسترسی ---------- */
  if (!PERM[me.role] || !PERM[me.role].includes(page)) page = 'dash';

  /* ---------- شمارنده اعلان‌ها ---------- */
  const notifs = getNotifications();
  const unreadNotifs = notifs.filter(n => !n.read).length;

  /* ---------- شمارنده پیام‌ها ---------- */
  const unreadMsgs = (db.messages||[]).filter(m => m.to === me.id && !m.read).length;
  const unreadChats = Object.values(chatCache).flat().filter(m => !m.read && m.from !== me.id).length;

  /* ---------- منو ---------- */
  const navItems = PAGES
    .filter(p => PERM[me.role].includes(p[0]))
    .map(p => {
      let badge = '';
      if (p[0] === 'msg' && unreadMsgs) badge = `<span class="badge">${toFa(unreadMsgs)}</span>`;
      if (p[0] === 'chat' && unreadChats) badge = `<span class="badge">${toFa(unreadChats)}</span>`;
      if (p[0] === 'leaves' && mgr()) {
        const pending = (db.leaves||[]).filter(l => l.status === 'pending').length;
        if (pending) badge = `<span class="badge">${toFa(pending)}</span>`;
      }
      return `<a href="#${p[0]}" class="${p[0]===page?'on':''}">${p[1]} ${p[2]}${badge}</a>`;
    }).join('');

  /* ---------- ویو ---------- */
  const viewFn = V[page] || V.dash;
  const pageHtml = viewFn();

  app.innerHTML = `
    <header>
      <div class="logo"><i>${LOGO_MARK}</i>${esc(db.school)}</div>
      <div class="who">
        <button class="notif-btn" data-a="toggleNotif" title="اعلان‌ها">
          🔔${unreadNotifs?`<span class="dot"></span>`:''}
        </button>
        <button class="theme-btn np" data-a="openSearch" title="جستجو (Ctrl+K)">🔍</button>
        <span class="mu np">${new Date().toLocaleDateString('fa-IR', {dateStyle:'full'})}</span>
        <span class="tag">${ROLE[me.role]}</span>
        <div class="avatar">${esc(me.name.slice(0,1))}</div>
        <b class="np">${esc(me.name)}</b>
        <button class="theme-btn np" data-a="toggleDark" title="تغییر تم">${dark?'☀️':'🌙'}</button>
        <button class="b" data-a="logout">خروج</button>
      </div>
    </header>
    <div class="wrap">
      <nav>${navItems}</nav>
      <main>${pageHtml}</main>
    </div>`;

  /* اسکرول خودکار چت */
  if (page === 'chat') {
    const el = $('#chatMsgs');
    if (el) el.scrollTop = el.scrollHeight;
  }
}
