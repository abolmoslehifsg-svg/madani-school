/* =========================================================================
   رویدادهای زنده با polling سبک (بدون WebSocket و بدون سرویس جانبی)
   ========================================================================= */
const Realtime = (() => {
  const POLL_MS = 5000;
  const REFRESH_DEBOUNCE_MS = 1500;
  const REFRESH_RETRY_MS = 3000;

  let running = false;
  let connected = false;
  let lastId = null;
  let pollTimer = null;
  let refreshTimer = null;
  const pendingCols = new Set();

  /* ---------- رویدادها ---------- */
  function onChat(event) {
    const peer = event.from === me.id ? event.to : event.from;
    if (!peer) return;
    chatCache[peer] = chatCache[peer] || [];
    chatCache[peer].push({
      from: event.from, text: event.text, ts: event.ts || Date.now(),
      me: event.from === me.id, read: event.from === me.id
    });
    if (chatPeer === peer) render();
    else toast('پیام جدید از ' + (event.fromName || event.from), 'info');
  }

  function handle(event) {
    if (event.type === 'chat') onChat(event);
    else if (event.type === 'notify') toast(event.text, event.kind || 'info');
    else if (event.type === 'refresh') scheduleRefresh(event.cols || []);
  }

  /* ---------- تازه‌سازی داده بدون خراب‌کردن فرمِ در حال پرشدن ---------- */
  const userIsTyping = () => {
    const el = document.activeElement;
    return !!(el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) || !!document.getElementById('modalBg');
  };

  function scheduleRefresh(cols) {
    cols.forEach(col => pendingCols.add(col));
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshNow, REFRESH_DEBOUNCE_MS);
  }

  async function refreshNow() {
    if (!running || !pendingCols.size) return;
    if (!SyncEngine.isIdle() || userIsTyping()) {
      refreshTimer = setTimeout(refreshNow, REFRESH_RETRY_MS);
      return;
    }
    const cols = Array.from(pendingCols);
    pendingCols.clear();
    try { await reload(cols); }
    catch (error) { cols.forEach(col => pendingCols.add(col)); }
  }

  /* ---------- حلقه‌ی polling ---------- */
  async function poll() {
    if (!running) return;
    try {
      if (!document.hidden) {
        const result = await api.realtime(lastId);
        lastId = result.last;
        connected = true;
        result.events.forEach(handle);
      }
    } catch (error) {
      connected = false;
      if (error.status === 401) return handleSessionExpired();
    }
    pollTimer = setTimeout(poll, POLL_MS);
  }

  function start() {
    if (!USE_SERVER || !me || running) return;
    running = true;
    lastId = null;
    poll();
  }

  function stop() {
    running = false;
    connected = false;
    clearTimeout(pollTimer);
    clearTimeout(refreshTimer);
    pendingCols.clear();
  }

  return {start, stop, get connected() { return connected; }};
})();

function handleSessionExpired() {
  Realtime.stop();
  me = null;
  toast('نشست شما به پایان رسید؛ دوباره وارد شوید.', 'warn');
  render();
}
