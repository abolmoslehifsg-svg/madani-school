/* =========================================================================
   پنجره‌ی مودال
   ========================================================================= */
/* =========================================================================
   Modal
   ========================================================================= */
function openModal(html, wide) {
  closeModal();
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.id = 'modalBg';
  bg.innerHTML = `<div class="modal${wide?' wide':''}">${html}
    <div class="row" style="margin-top:16px;justify-content:flex-end">
      <button class="b" data-a="closeModal">بستن</button>
    </div></div>`;
  bg.addEventListener('click', e => { if (e.target === bg) closeModal() });
  document.body.appendChild(bg);
  modal = bg;
}
function closeModal() { if (modal) { modal.remove(); modal = null; editTarget = null } }
