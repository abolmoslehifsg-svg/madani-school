/* =========================================================================
   صفحه‌ی «اعلانات»
   ========================================================================= */
Object.assign(V, {

/* ---------- اعلانات ---------- */
ann: function() {
  const list = annList().map(a=>`<div class="ann">
    <div class="body">
      <b>${esc(a.title)}</b>
      <span class="tag">${esc(a.target==='class'?'کلاس '+cname(a.classId):({all:'همه',teacher:'معلمان',parent:'اولیا',student:'دانش‌آموزان'}[a.target]||a.target))}</span>
      <p>${esc(a.body)}</p>
      <small class="mu">${esc(a.date)}</small>
    </div>
    ${mgr()?delBtn('ann',a.id):''}
  </div>`).join('');
  return head('اعلانات') +
    (mgr()?card('انتشار اعلان',
      `<form class="fm" onsubmit="A.addAnn(event)">
        <label>عنوان<input name="title" required></label>
        <label>مخاطب<select name="target" onchange="A.annTarget(this)">
          ${opts([['all','همه'],['teacher','معلمان'],['parent','اولیا'],['student','دانش‌آموزان'],['class','یک کلاس خاص']])}
        </select></label>
        <label id="annClassBox" style="display:none">کلاس<select name="classId">${opts(db.classes.map(c=>[c.id,c.name]))}</select></label>
        <label style="grid-column:1/-1">متن<textarea name="body" rows="3" required></textarea></label>
        <button class="b p">انتشار</button>
      </form>`):'') +
    card('', list || empty('اعلانی وجود ندارد.','📢'));
},

});
