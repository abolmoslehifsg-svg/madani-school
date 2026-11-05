/* =========================================================================
   صفحه‌ی «اخبار»
   ========================================================================= */
Object.assign(V, {

/* ---------- اخبار ---------- */
news: function() {
  const p = paginate((db.news||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0)), 'news');
  const rows = p.slice.map(n=>`
    <div class="ann">
      <div class="body">
        <b>${esc(n.title)}</b>
        <p>${esc(n.body)}</p>
        <small class="mu">${faDate(n.date)}${n.authorId?' · '+uname(n.authorId):''}</small>
      </div>
      ${mgr()?delBtn('news',n.id):''}
    </div>`);
  return head('اخبار مدرسه') +
    (mgr()?card('انتشار خبر',
      `<form class="fm" onsubmit="A.addNews(event)">
        <label>عنوان<input name="title" required></label>
        <label style="grid-column:1/-1">متن<textarea name="body" rows="3" required></textarea></label>
        <label>لینک تصویر (اختیاری)<input name="img" dir="ltr" placeholder="https://..."></label>
        <button class="b p">انتشار</button>
      </form>`):'') +
    card('', rows.join('') || empty('خبری ثبت نشده.','📰')) +
    pagerHtml('news', p.total);
},

});
