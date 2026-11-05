/* =========================================================================
   صفحه‌ی بخش پرورشی (تب‌ها)
   ========================================================================= */
/* =========================================================================
   V.provereshi — بخش پرورشی با تب‌های داخلی
   ========================================================================= */
V.provereshi = function() {
  const tabs = [
    ['events','رویدادها'],
    ['coupon','کوپن بوفه'],
    ['attend','نمازخانه / حضور'],
    ['vote','شورای دانش‌آموزی'],
    ['types','انواع بخش‌ها'],
    ['report','گزارش']
  ];
  const tabBar = `<div class="tabs">${tabs.map(t =>
    `<button class="${provereshiTab===t[0]?'on':''}" data-a="provTab" data-v="${t[0]}">${t[1]}</button>`
  ).join('')}</div>`;

  let body = '';
  switch(provereshiTab) {
    case 'events':   body = provEventsTab(); break;
    case 'coupon':   body = provCouponTab(); break;
    case 'attend':   body = provAttendTab(); break;
    case 'vote':     body = provVoteTab(); break;
    case 'types':    body = provTypesTab(); break;
    case 'report':   body = provReportTab(); break;
  }

  return head('بخش پرورشی', 'مدیریت رویدادها، بوفه، نمازخانه و شورای دانش‌آموزی') +
    (isProvereshiMgr() ? '<p class="hint">شما دسترسی کامل به مدیریت بخش پرورشی دارید.</p>' : '') +
    tabBar + body;
};
