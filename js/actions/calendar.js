/* =========================================================================
   اکشن‌های «تقویم»
   ========================================================================= */
Object.assign(A, {

/* ---------- تقویم ---------- */
calPrev: function() {
  calMonth--; if (calMonth < 0) { calMonth = 11; calYear-- }
  render();
},
calNext: function() {
  calMonth++; if (calMonth > 11) { calMonth = 0; calYear++ }
  render();
},

});
