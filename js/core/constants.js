/* =========================================================================
   ثابت‌ها (نقش‌ها، دسترسی صفحه‌ها، زنگ‌ها، ...)
   ========================================================================= */
/* ---------- ثابت‌ها ---------- */
const BELLS = ['زنگ اول','زنگ دوم','زنگ سوم','زنگ چهارم','زنگ پنجم','زنگ ششم','زنگ هفتم'];
const ST = {p:['حاضر','ok'],a:['غایب','bad'],l:['تأخیر','warn'],e:['مرخصی','info']};
const ROLE = {admin:'مدیر',vice:'معاون',teacher:'معلم',parent:'ولی',student:'دانش‌آموز'};

const PERM = {
  admin  :['dash','events','news','students','classes','grades','att','hw','quiz','poll','disc','online','msg','chat','ann','fin','rep','users','acc','set','provereshi','calendar','timetable','audit','leaves'],
  vice   :['dash','events','news','students','classes','grades','att','hw','quiz','poll','disc','online','msg','chat','ann','rep','users','acc','provereshi','calendar','timetable','leaves'],
  teacher:['dash','events','news','students','grades','att','hw','quiz','poll','disc','online','msg','chat','ann','rep','acc','provereshi','calendar','timetable','leaves'],
  parent :['dash','events','news','att','hw','poll','disc','online','msg','chat','ann','fin','rep','acc','calendar','leaves'],
  student:['dash','events','news','att','hw','quiz','poll','online','msg','chat','ann','rep','acc','calendar']
};

const PAGES = [
  ['dash','📊','داشبورد'],
  ['events','🎪','رویدادها'],
  ['news','📰','اخبار'],
  ['provereshi','🏫','پرورشی'],
  ['calendar','📅','تقویم آموزشی'],
  ['timetable','🗓️','برنامه هفتگی'],
  ['students','👥','دانش‌آموزان'],
  ['classes','🏛️','کلاس‌ها'],
  ['grades','📝','نمرات'],
  ['att','✅','حضور و غیاب'],
  ['leaves','🌴','مرخصی'],
  ['hw','📚','تکالیف'],
  ['quiz','🧪','آزمون آنلاین'],
  ['poll','🗳️','نظرسنجی'],
  ['disc','⚠️','موارد انضباطی'],
  ['online','🎥','کلاس آنلاین'],
  ['msg','✉️','پیام‌ها'],
  ['chat','💬','گفتگوی آنلاین'],
  ['ann','📢','اعلانات'],
  ['fin','💰','امور مالی'],
  ['rep','📈','کارنامه'],
  ['users','👤','کاربران'],
  ['audit','📋','گزارش عملیات'],
  ['acc','🔑','حساب من'],
  ['set','⚙️','تنظیمات']
];
const PER_PAGE = 10;

/* ---------- ثابت‌های پرورشی ---------- */
const PROV_OP = {
  coupon : 'کوپن / خرید',
  attend : 'ثبت حضور',
  vote   : 'رأی‌گیری',
  custom : 'عمومی'
};
const PROV_ICONS = ['🛒','🕌','🗳️','📚','🏕️','🏆','🎭','🎨','⚽','🎵','🌿','🤝','💡','🎓','📖','🕋','🎬','🍎'];
const EVENT_CATS = ['مذهبی','فرهنگی','ورزشی','علمی','اجتماعی','اردو','جشن','عمومی'];
const AUDIT_ACTIONS = {
  login:'ورود', logout:'خروج', del:'حذف', edit:'ویرایش', add:'افزودن',
  grade_add:'ثبت نمره', grade_change:'تغییر نمره', att_change:'تغییر حضور',
  role_change:'تغییر نقش', coupon:'ثبت کوپن', vote:'رأی',
  leave_request:'درخواست مرخصی', leave_action:'بررسی مرخصی',
  prov_event:'رویداد پرورشی', election:'انتخابات', showcase:'رویداد عمومی'
};
