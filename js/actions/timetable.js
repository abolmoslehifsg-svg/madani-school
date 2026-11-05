/* =========================================================================
   اکشن‌های «برنامه هفتگی»
   ========================================================================= */
Object.assign(A, {

/* ---------- برنامه هفتگی ---------- */
ttClass: function(v) { ttClassId = v; render() },
ttSet: function(cid, day, bell, val) {
  if (!isProvereshiMgr()) return;
  if (!db.timetable) db.timetable = {};
  if (!db.timetable[cid]) db.timetable[cid] = {};
  if (!db.timetable[cid][day]) db.timetable[cid][day] = {};
  db.timetable[cid][day][bell] = val.trim();
  save();
  toast('ذخیره شد.', 'ok');
},
ttExport: function(cid) {
  const tt = (db.timetable||{})[cid] || {};
  const weekdays = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه'];
  const rows = [['روز','زنگ ۱','زنگ ۲','زنگ ۳','زنگ ۴']].concat(
    weekdays.map(d => [d, 1,2,3,4].map(b => (tt[d] && tt[d][b]) || ''))
  );
  csvDownload(rows, 'timetable_'+cid+'.csv');
  toast('خروجی گرفته شد.', 'ok');
},

});
