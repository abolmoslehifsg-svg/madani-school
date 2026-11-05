/* =========================================================================
   آپلود و فشرده‌سازی عکس
   ========================================================================= */
/* ---------- آپلود عکس ---------- */
function readImageAsDataURL(file, maxKB) {
  maxKB = maxKB || 400;
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('فایلی انتخاب نشد'));
    if (!file.type.startsWith('image/')) return reject(new Error('فایل تصویری نیست'));
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const maxW = 900;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        let quality = 0.85;
        let data = c.toDataURL('image/jpeg', quality);
        while (data.length / 1024 > maxKB && quality > 0.35) {
          quality -= 0.1;
          data = c.toDataURL('image/jpeg', quality);
        }
        resolve(data);
      };
      img.onerror = () => reject(new Error('تصویر قابل خواندن نیست'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('خواندن فایل ناموفق بود'));
    reader.readAsDataURL(file);
  });
}
