/* =========================================================================
   خروجی/ورودی CSV و Excel
   ========================================================================= */
/* ---------- CSV / Excel ---------- */
function csvDownload(rows, filename) {
  const bom = '\uFEFF';
  const txt = bom + rows.map(r => r.map(c => `"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], {type:'text/csv;charset=utf-8'}));
  a.download = filename;
  a.click();
}
function xlsxDownload(rows, filename, sheetName) {
  if (typeof XLSX === 'undefined') return false;
  try {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    XLSX.writeFile(wb, filename);
    return true;
  } catch(e) { console.warn(e); return false }
}

/* ---------- پارس CSV / XLSX ---------- */
function parseCSVText(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], cur = '', inQ = false;
  for (let i=0; i<text.length; i++) {
    const c = text[i], n = text[i+1];
    if (inQ) {
      if (c === '"' && n === '"') { cur += '"'; i++ }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c===','||c===';'||c==='\t') { row.push(cur); cur = '' }
      else if (c==='\n' || (c==='\r'&&n==='\n')) { if(c==='\r')i++; row.push(cur); rows.push(row); row=[]; cur='' }
      else if (c==='\r') { row.push(cur); rows.push(row); row=[]; cur='' }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row) }
  return rows.filter(r => r.some(c => String(c).trim() !== ''));
}
function parseSheet(file) {
  return new Promise((resolve, reject) => {
    const name = (file.name||'').toLowerCase();
    const isCsv = /\.(csv|txt)$/i.test(name) || (file.type||'').includes('csv');
    const isXls = /\.xlsx?$/i.test(name) || (file.type||'').includes('sheet') || (file.type||'').includes('excel');
    function readCsv() {
      const r = new FileReader();
      r.onload = e => {
        try {
          const rows = parseCSVText(e.target.result||'');
          rows.length ? resolve(rows) : reject(new Error('فایل خالی است'));
        } catch(err) { reject(err) }
      };
      r.onerror = () => reject(new Error('خواندن فایل ناموفق بود'));
      r.readAsText(file, 'UTF-8');
    }
    if (isCsv || (!isXls && typeof XLSX === 'undefined')) return readCsv();
    if (typeof XLSX === 'undefined') return reject(new Error('برای Excel، کتابخانه لود نشده. از CSV استفاده کن.'));
    const r = new FileReader();
    r.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {type:'array', codepage:65001, cellText:true, cellDates:true});
        const sh = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sh, {header:1, defval:'', raw:false});
        resolve(rows);
      } catch(err) { try { readCsv() } catch(e2) { reject(err) } }
    };
    r.onerror = () => reject(new Error('خواندن فایل ناموفق بود'));
    r.readAsArrayBuffer(file);
  });
}
function normNid(v) {
  let s = en(String(v??'')).replace(/[^0-9]/g, '');
  if (s.length > 0 && s.length < 10) s = s.padStart(10, '0');
  return s;
}
const normPhone = v => en(String(v??'')).replace(/[^0-9]/g, '');
function findClassId(name) {
  name = String(name||'').trim();
  const c = db.classes.find(x => x.name === name || x.name.replace(/\s/g,'') === name.replace(/\s/g,''));
  return c ? c.id : null;
}
