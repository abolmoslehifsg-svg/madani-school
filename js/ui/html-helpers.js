/* =========================================================================
   ابزارهای ساخت HTML
   ========================================================================= */
/* =========================================================================
   HTML helpers
   ========================================================================= */
const head  = (t,s) => `<h1>${t}</h1>${s?`<p class="mu">${s}</p>`:''}`;
const card  = (h,b) => `<section class="card">${h?`<h2>${h}</h2>`:''}${b}</section>`;
const tbl   = (h,r,e,ico) => r.length
  ? `<div class="ov"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${r.join('')}</tbody></table></div>`
  : empty(e||'موردی ثبت نشده است.', ico||'📭');
const opts  = (a,sel) => a.map(x=>`<option value="${esc(x[0])}"${x[0]===sel?' selected':''}>${esc(x[1])}</option>`).join('');
const stOpts = (sel) => opts(mine().map(s=>[s.id,s.name]), sel);
const allStOpts = (sel) => opts(db.students.map(s=>[s.id,s.name]), sel);
const delBtn = (c,i) => `<button class="b d sm" data-a="del" data-i="${esc(i)}" data-v="${c}">حذف</button>`;
const editBtn= (c,i) => `<button class="b e sm" data-a="edit" data-i="${esc(i)}" data-v="${c}">ویرایش</button>`;
const scoreTag = n => `<span class="tag ${n<10?'bad':n>=17?'ok':''}">${f1(n)}</span>`;
const empty = (msg, ico) => `<div class="empty"><div class="ico">${ico||'📭'}</div><p>${msg}</p></div>`;
