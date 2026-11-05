/* =========================================================================
   صفحه‌ی «پیام‌ها»
   ========================================================================= */
Object.assign(V, {

/* ---------- پیام‌ها ---------- */
msg: function() {
  let changed = false;
  (db.messages||[]).forEach(m => {
    if (m.to === me.id && !m.read) { m.read = true; changed = true; }
  });
  if (changed) save();
  const list = (db.messages||[]).filter(m => m.to===me.id || m.from===me.id);
  const p = paginate(list.slice().sort((a,b)=>b.ts-a.ts), 'msg');
  const rows = p.slice.map(m=>`<tr>
    <td>${m.from===me.id?'<span class="tag p">ارسالی</span>':'<span class="tag info">دریافتی</span>'}</td>
    <td>${m.from===me.id?uname(m.to):uname(m.from)}</td>
    <td>${esc(m.text)}</td>
    <td>${faDT(m.ts)}</td>
  </tr>`);
  return head('پیام‌ها') +
    card('ارسال پیام',
      `<form class="fm" onsubmit="A.sendMsg(event)">
        <label>گیرنده<select name="to" required>${opts(db.users.filter(u=>u.id!==me.id).map(u=>[u.id,u.name+' ('+ROLE[u.role]+')']))}</select></label>
        <label style="grid-column:1/-1">متن<textarea name="text" rows="2" required></textarea></label>
        <button class="b p">ارسال</button>
      </form>`) +
    card('', tbl(['نوع','طرف','متن','زمان'], rows, 'پیامی وجود ندارد.','✉️') + pagerHtml('msg', p.total));
},

});
