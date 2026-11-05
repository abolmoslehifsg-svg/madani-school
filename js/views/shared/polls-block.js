/* =========================================================================
   بلوک نظرسنجی‌ها (مشترک بین رویدادها و صفحه‌ی نظرسنجی)
   ========================================================================= */
/* ---------- بلوک نظرسنجی‌ها (مشترک بین events و poll) ---------- */
function pollsBlock() {
  const list = (db.polls||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  if (!list.length) return card('نظرسنجی‌ها', empty('نظرسنجی‌ای وجود ندارد.','🗳️'));
  const body = list.map(pl=>{
    const myVote = (pl.votes||{})[me.id];
    const total = Object.keys(pl.votes||{}).length;
    const counts = pl.options.map((_,i)=>Object.values(pl.votes||{}).filter(v=>v===i).length);
    const expired = pl.deadline && iso() > pl.deadline;
    const img = pl.img ? `<div class="ev-card"><div class="img" style="background-image:url('${esc(pl.img)}')"></div><div class="body"><h3>${esc(pl.title)}</h3></div></div>` : '';
    const optsHtml = pl.options.map((o,i)=>{
      const pct = total ? Math.round(counts[i]/total*100) : 0;
      const mine = myVote === i;
      return `<label class="chk-group" style="display:block;padding:8px 12px;border:1px solid var(--bd);border-radius:10px;margin-bottom:6px;cursor:pointer;background:${mine?'#eef2ff':'var(--card)'}">
        <input type="radio" name="poll_${pl.id}" value="${i}" ${mine?'checked':''} ${myVote!==undefined||expired?'disabled':''} onchange="A.vote('${pl.id}', ${i})">
        ${esc(o)}
        ${myVote!==undefined||expired?`<span class="mu" style="float:left">${toFa(pct)}٪ (${toFa(counts[i])})</span>`:''}
      </label>`;
    }).join('');
    return `<div class="card flat" style="margin-bottom:12px">
      <div class="row"><b>${esc(pl.title)}</b><span class="mu">${toFa(total)} رأی${expired?' · منقضی':''}</span></div>
      ${img}
      <div style="margin-top:10px">${optsHtml}</div>
      ${pl.deadline?`<small class="mu">مهلت: ${faDate(pl.deadline)}</small>`:''}
    </div>`;
  }).join('');
  return card('نظرسنجی‌ها', body);
}
