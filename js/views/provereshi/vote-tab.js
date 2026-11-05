/* =========================================================================
   بخش پرورشی — vote-tab
   ========================================================================= */
/* ---------- تب ۴: شورای دانش‌آموزی / رأی‌گیری ---------- */
function provVoteTab() {
  const voteType = (db.provTypes||[]).find(t => t.op === 'vote');
  if (!voteType) return empty('نوع «رأی‌گیری» تعریف نشده است.','🗳️');

  const elections = (db.provElections||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  const openElections = elections.filter(el => el.open);
  const closedElections = elections.filter(el => !el.open);

  const mgr = isProvereshiMgr();

  let html = '';

  if (mgr) {
    html += card('ایجاد انتخابات',
      `<form class="fm" onsubmit="A.addElection(event)">
        <label style="grid-column:1/-1">عنوان<input name="title" required placeholder="مثلاً انتخابات شورای دانش‌آموزی ۱۴۰۵"></label>
        <label>مهلت رأی‌گیری<input type="date" name="deadline"></label>
        <label style="grid-column:1/-1">کاندیدها (هر خط: نام)</label>
        <textarea name="candidates" rows="5" required placeholder="علی احمدی&#10;زهرا رضایی&#10;محمد کریمی"></textarea>
        <button class="b p">ایجاد و باز کردن رأی‌گیری</button>
      </form>`);
  }

  html += card('انتخابات باز',
    openElections.length ? openElections.map(el => {
      const totalVotes = Object.keys(el.votes||{}).length;
      const counts = el.candidates.map((_,i) => Object.values(el.votes||{}).filter(v=>v===i).length);
      const winnerIdx = counts.indexOf(Math.max(...counts));
      const myVote = (el.votes||{})[me.id];
      const hasVoted = myVote !== undefined;

      const candCards = el.candidates.map((c,i) => {
        const pct = totalVotes ? Math.round(counts[i]/totalVotes*100) : 0;
        const voters = mgr ? Object.entries(el.votes||{}).filter(([_,v])=>v===i).map(([uid]) => uname(uid)) : [];
        const selected = myVote === i;
        return `<div class="vote-card ${selected?'selected':''}">
          <div class="av">${esc(c.name.slice(0,1))}</div>
          <h3>${esc(c.name)}</h3>
          ${hasVoted||!el.open
            ? `<div class="votes-bar"><i style="width:${pct}%"></i></div>
               <div class="votes-num">${toFa(counts[i])} رأی (${toFa(pct)}٪)</div>`
            : `<button class="b p sm" data-a="provCastVote" data-i="${el.id}" data-v="${i}" style="width:100%">رأی به این کاندید</button>`}
          ${mgr && hasVoted && voters.length
            ? `<div class="voter-list">${voters.map(v=>esc(v)).join('، ')}</div>` : ''}
        </div>`;
      }).join('');

      return `<div class="card flat" style="margin-bottom:14px">
        <div class="row">
          <b>${esc(el.title)}</b>
          <span class="tag">${toFa(totalVotes)} رأی · ${el.open?'<span style="color:var(--ok)">باز</span>':'بسته'}</span>
        </div>
        ${el.deadline?`<small class="mu">مهلت: ${faDate(el.deadline)}</small>`:''}
        <div class="vote-grid">${candCards}</div>
        ${mgr ? `<div class="row" style="margin-top:12px">
          <button class="b sm" data-a="provToggleElection" data-i="${el.id}">${el.open?'بستن رأی‌گیری':'باز کردن مجدد'}</button>
          <button class="b d sm" data-a="del" data-i="${el.id}" data-v="provElections">حذف</button>
        </div>` : ''}
      </div>`;
    }).join('') : empty('انتخابات بازی وجود ندارد.','🗳️'));

  if (closedElections.length) {
    html += card('انتخابات پایان‌یافته',
      closedElections.map(el => {
        const totalVotes = Object.keys(el.votes||{}).length;
        const counts = el.candidates.map((_,i) => Object.values(el.votes||{}).filter(v=>v===i).length);
        const winIdx = counts.indexOf(Math.max(...counts));
        return `<div class="card flat" style="margin-bottom:10px">
          <b>${esc(el.title)}</b>
          <div class="mu">برنده: <b>${el.candidates[winIdx]?esc(el.candidates[winIdx].name):'—'}</b> با ${toFa(counts[winIdx]||0)} رأی از ${toFa(totalVotes)} رأی</div>
        </div>`;
      }).join(''));
  }

  return html;
}
