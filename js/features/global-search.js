/* =========================================================================
   جستجوی سراسری (Ctrl+K)
   ========================================================================= */
/* =========================================================================
   Global Search
   ========================================================================= */
function openSearch() {
  if (searchOpen) return;
  searchOpen = true;
  const bg = document.createElement('div');
  bg.className = 'gs-bg';
  bg.id = 'gsBg';
  bg.innerHTML = `<div class="gs-box" onclick="event.stopPropagation()">
    <input id="gsInput" placeholder="جستجو در دانش‌آموزان، معلمان، کلاس‌ها، رویدادها، تکالیف..." autofocus>
    <div class="gs-results" id="gsResults"></div>
    <div class="gs-foot">Enter برای انتخاب · Esc برای بستن</div>
  </div>`;
  bg.addEventListener('click', closeSearch);
  document.body.appendChild(bg);
  setTimeout(() => document.getElementById('gsInput').focus(), 50);
}
function closeSearch() {
  const bg = document.getElementById('gsBg');
  if (bg) bg.remove();
  searchOpen = false;
}
function doSearch(q) {
  const results = document.getElementById('gsResults');
  if (!results) return;
  q = (q||'').trim().toLowerCase();
  if (!q) { results.innerHTML = ''; return }

  const items = [];

  /* دانش‌آموزان */
  (mgr() || teacherScoped() ? db.students : mine()).forEach(s => {
    if (s.name.toLowerCase().includes(q) || String(s.nid).includes(q) || (s.parent||'').toLowerCase().includes(q)) {
      items.push({ icon:'👤', title:s.name, sub:'دانش‌آموز · '+cname(s.classId), action:()=>{ page='students'; location.hash='#students'; closeSearch(); render() }});
    }
  });

  /* معلمان */
  if (!scoped()) {
    db.users.filter(u => u.role !== 'student' && u.role !== 'parent').forEach(u => {
      if (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)) {
        items.push({ icon:'👨‍🏫', title:u.name, sub:ROLE[u.role]+' · '+u.username, action:()=>{ page='users'; location.hash='#users'; closeSearch(); render() }});
      }
    });
  }

  /* کلاس‌ها */
  myClasses().forEach(c => {
    if (c.name.toLowerCase().includes(q)) {
      items.push({ icon:'🏛️', title:c.name, sub:'کلاس · '+c.grade, action:()=>{ page='classes'; location.hash='#classes'; closeSearch(); render() }});
    }
  });

  /* رویدادها */
  (db.showcase||[]).forEach(e => {
    if (e.title.toLowerCase().includes(q) || (e.desc||'').toLowerCase().includes(q)) {
      items.push({ icon:'🎪', title:e.title, sub:'رویداد · '+faDate(e.date), action:()=>{ page='events'; location.hash='#events'; closeSearch(); render() }});
    }
  });

  /* تکالیف */
  (db.homework||[]).forEach(h => {
    if (h.title.toLowerCase().includes(q)) {
      items.push({ icon:'📚', title:h.title, sub:'تکلیف · '+cname(h.classId), action:()=>{ page='hw'; location.hash='#hw'; closeSearch(); render() }});
    }
  });

  /* پرورشی */
  (db.provEvents||[]).forEach(ev => {
    if (ev.title.toLowerCase().includes(q)) {
      const t = provType(ev.typeId);
      items.push({ icon:t?t.icon:'🏫', title:ev.title, sub:'پرورشی · '+(t?t.name:''), action:()=>{ page='provereshi'; location.hash='#provereshi'; closeSearch(); render() }});
    }
  });

  results.innerHTML = items.length
    ? items.slice(0, 20).map((it, i) => `
        <div class="gs-item" data-a="gsSelect" data-i="${i}">
          <div class="ico">${it.icon}</div>
          <div class="info"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></div>
        </div>`).join('')
    : '<div class="empty" style="padding:20px">نتیجه‌ای یافت نشد</div>';

  /* ذخیره برای کلیک */
  window.__gsItems = items;
}
