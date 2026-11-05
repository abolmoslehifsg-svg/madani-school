/* =========================================================================
   تولید QR (بدون کتابخانه)
   ========================================================================= */
/* =========================================================================
   QR Generator (بدون کتابخانه — الگوریتم ساده)
   فقط برای نمایش استفاده می‌شود
   ========================================================================= */
function drawQR(text, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 240;
  canvas.width = size; canvas.height = size;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000';
  const cells = 25;
  const cellSize = size / cells;
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  const rand = (i) => {
    hash = ((hash << 5) + hash + i) >>> 0;
    return (hash & 0xFFFF) / 0xFFFF;
  };
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const isFinder = (x < 7 && y < 7) || (x >= cells-7 && y < 7) || (x < 7 && y >= cells-7);
      if (isFinder) {
        const fx = x >= cells-7 ? x-(cells-7) : x;
        const fy = y >= cells-7 ? y-(cells-7) : y;
        const ring = Math.min(fx, fy, 6-fx, 6-fy);
        if (ring === 0 || ring === 2 || (fx>=2&&fx<=4&&fy>=2&&fy<=4)) {
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      } else {
        if (rand(x*1000+y) > 0.5) {
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      }
    }
  }
}
