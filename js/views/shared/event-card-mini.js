/* =========================================================================
   کارت کوچک رویداد
   ========================================================================= */
/* ---------- کارت کوچک رویداد ---------- */
function evCardMini(e, canEdit) {
  const imgStyle = e.img ? `style="background-image:url('${esc(e.img)}')"` : '';
  const icon = !e.img ? `<div class="empty-img">🎪</div>` : '';
  return `<div class="ev-card">
    <div class="img" ${imgStyle}>
      ${icon}
      ${e.cat?`<span class="cat">${esc(e.cat)}</span>`:''}
      ${e.pinned?`<span class="pin">📌 سنجاق</span>`:''}
    </div>
    <div class="body">
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.desc||'')}</p>
      <div class="meta">
        <span>${faDate(e.date)}</span>
        ${canEdit ? `<span class="actions">
          ${editBtn('showcase',e.id)}
          ${delBtn('showcase',e.id)}
        </span>` : ''}
      </div>
    </div>
  </div>`;
}
