/* =========================================================================
   صفحه‌ی «چت»
   ========================================================================= */
Object.assign(V, {

/* ---------- چت ---------- */
chat: function() {
  const peers = allowedChatPeers().map(u=>({
    id:u.id, name:u.name, role:u.role,
    last: (chatCache[u.id]||[]).slice(-1)[0],
    unread: (chatCache[u.id]||[]).filter(m => !m.read && m.from !== me.id).length
  }));
  const peerList = peers.map(u=>`
    <div class="item ${chatPeer===u.id?'on':''}" data-a="chatOpen" data-i="${u.id}">
      <div class="avatar" style="width:32px;height:32px;font-size:12px">${esc(u.name.slice(0,1))}</div>
      <div style="flex:1;min-width:0">
        <div class="nm">${esc(u.name)}</div>
        <div class="ls">${u.last?esc(u.last.text.slice(0,30)):ROLE[u.role]}</div>
      </div>
      ${u.unread?`<span class="badge">${toFa(u.unread)}</span>`:''}
    </div>`).join('');

  const msgs = (chatCache[chatPeer]||[]).map(m=>`
    <div class="msg ${m.from===me.id?'me':'you'}">
      ${esc(m.text)}
      <span class="t">${faDT(m.ts)}</span>
    </div>`).join('');

  const chatHeadHtml = chatPeer
    ? `<div class="chat-head"><span>${esc((db.users.find(u=>u.id===chatPeer)||{}).name||'')}</span>
        <span class="mu" style="font-size:12px">${Realtime.connected?'🟢 آنلاین':'🔴 آفلاین'}</span></div>`
    : `<div class="chat-head">یک مخاطب انتخاب کنید</div>`;

  return `<h1>گفتگوی آنلاین</h1>` +
    `<div class="chat-wrap">
      <div class="chat-list">${peerList || empty('مخاطبی نیست.','💬')}</div>
      <div class="chat-box">
        ${chatHeadHtml}
        <div class="chat-msgs" id="chatMsgs">${msgs || (chatPeer?empty('شروع گفتگو…','💬'):'')}</div>
        ${chatPeer?`<form class="chat-input" onsubmit="A.chatSend(event)">
          <input name="text" placeholder="پیام خود را بنویسید…" autocomplete="off" required>
          <button class="b p">ارسال</button>
        </form>`:''}
      </div>
    </div>`;
},

});
