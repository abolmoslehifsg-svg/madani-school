/* =========================================================================
   اکشن‌های «چت»
   ========================================================================= */
Object.assign(A, {

/* ---------- چت ---------- */
chatOpen: async function(peerId) {
  if (!allowedChatPeers().some(u => u.id === peerId)) return toast('دسترسی ندارید.', 'bad');
  chatPeer = peerId;
  if (!chatCache[peerId]) chatCache[peerId] = [];
  chatCache[peerId].forEach(m => m.read = true);
  if (USE_SERVER) {
    try {
      const hist = await api.chatHistory(peerId);
      if (Array.isArray(hist)) chatCache[peerId] = hist;
    } catch {}
  }
  render();
  setTimeout(() => { const el = $('#chatMsgs'); if (el) el.scrollTop = el.scrollHeight }, 50);
},
chatSend: function(e) {
  e.preventDefault();
  const t = e.target.text.value.trim();
  if (!t || !chatPeer) return;
  if (!allowedChatPeers().some(u => u.id === chatPeer)) return toast('دسترسی ندارید.', 'bad');
  chatCache[chatPeer] = chatCache[chatPeer] || [];
  chatCache[chatPeer].push({from:me.id, text:t, ts:Date.now(), me:true, read:true});
  e.target.reset();
  render();
  setTimeout(() => { const el = $('#chatMsgs'); if (el) el.scrollTop = el.scrollHeight }, 30);
  if (USE_SERVER) api.chatSend(chatPeer, t).catch(()=>{});
},

});
