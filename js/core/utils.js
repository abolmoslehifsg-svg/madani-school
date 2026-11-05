/* =========================================================================
   توابع کمکی عمومی
   ========================================================================= */
/* ---------- توابع کمکی عمومی ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
const iso = () => new Date().toLocaleDateString('en-CA');
const fd  = e => Object.fromEntries(new FormData(e.target));
const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
const f1  = n => (n==null||n===''||isNaN(+n)) ? '—' : (+(+n).toFixed(2)).toLocaleString('fa-IR');
const money = n => (n==null||n===''||isNaN(+n)) ? '—' : (+n).toLocaleString('fa-IR') + ' تومان';
const faDate = d => { if (!d) return '—'; try { const x=new Date(d+'T12:00:00'); return isNaN(x.getTime())?String(d):x.toLocaleDateString('fa-IR') } catch { return d } };
const faDT = ts => new Date(ts).toLocaleString('fa-IR',{dateStyle:'short',timeStyle:'short'});
const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const faDateObj = d => { if (!d) return null; try { const x = new Date(d + 'T12:00:00'); return isNaN(x.getTime()) ? null : x } catch { return null } };
const isoDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const monthDays = (y, m) => new Date(y, m+1, 0).getDate();

/* نرمال‌سازی اعداد فارسی */
const faDigits = '۰۱۲۳۴۵۶۷۸۹';
const en = s => String(s||'').replace(/[۰-۹]/g, d => faDigits.indexOf(d));
const toFa = s => String(s??'').replace(/[0-9]/g, d => faDigits[+d]);
