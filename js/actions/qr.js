/* =========================================================================
   اکشن‌های «QR»
   ========================================================================= */
Object.assign(A, {

/* ---------- QR ---------- */
qrStudent: function(sid) {
  const s = db.students.find(x => x.id === sid);
  if (!s) return;
  const payload = 'PARTO|' + s.id + '|' + s.nid + '|' + s.name;
  const html = `<h2>QR دانش‌آموز — ${esc(s.name)}</h2>
    <div class="qr-wrap">
      <canvas id="qrCanvas" width="240" height="240"></canvas>
      <div class="qr-caption">${esc(s.name)}</div>
      <div class="mu">کد ملی: ${toFa(s.nid)}</div>
      <p class="hint">برای چاپ، مرورگر را در حالت پرینت باز کنید یا از QR زیر استفاده کنید.</p>
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="b p" onclick="A.printQR()">🖨 چاپ</button>
      </div>
    </div>`;
  openModal(html);
  drawQR(payload, document.getElementById('qrCanvas'));
},
printQR: function() { window.print() },

});
