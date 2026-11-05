/* =========================================================================
   داده‌ی نمونه (فقط حالت آفلاین)
   ========================================================================= */
/* =========================================================================
   Seed
   ========================================================================= */
async function seed() {
  const classes = [
    {id:'c1', name:'دهم ریاضی',   grade:'دهم',    room:'۱۰۱', teacherId:''},
    {id:'c2', name:'دهم تجربی',   grade:'دهم',    room:'۱۰۲', teacherId:''},
    {id:'c3', name:'دهم انسانی',  grade:'دهم',    room:'۱۰۳', teacherId:''},
    {id:'c4', name:'یازدهم ریاضی', grade:'یازدهم', room:'۲۰۱', teacherId:''}
  ];
  const students = [
    ['علی احمدی',   '0499370899','c1','حسن احمدی',   '09121111111'],
    ['زهرا رضایی',  '0499370902','c2','محمد رضایی',  '09122222222'],
    ['محمد کریمی',  '0499370910','c1','رضا کریمی',   '09123333333'],
    ['سارا محمدی',  '0499370929','c4','اکبر محمدی',  '09124444444'],
    ['رضا نوری',    '0499370937','c1','حسن نوری',    '09125555555'],
    ['مریم حسینی',  '0123456789','c3','علی حسینی',   '09126666666']
  ].map((arr,i) => ({id:'s'+i, name:arr[0], nid:arr[1], classId:arr[2], parent:arr[3], phone:arr[4]}));

  const g = (i,subject,score,type) => ({id:uid(), sid:'s'+i, subject, score, type, date:iso()});
  const grades = [
    g(0,'ریاضی',18.5,'میان‌ترم'), g(0,'فیزیک',15,'کوییز'), g(0,'ریاضی',19,'پایان‌ترم'),
    g(1,'زیست',17,'میان‌ترم'),   g(1,'شیمی',16.5,'کوییز'),
    g(2,'ریاضی',8.5,'میان‌ترم'), g(2,'فیزیک',12,'کوییز'),
    g(3,'ادبیات',19,'پایان‌ترم'), g(3,'عربی',18,'میان‌ترم'),
    g(5,'تاریخ',16,'میان‌ترم'),  g(5,'جغرافیا',14,'کوییز')
  ];

  const users = [
    await mkUser('manager',  'مدیر مدرسه',      'admin',   '12345678'),
    await mkUser('Qazanfari','قاظفری (معاون)',  'vice',    '12345678'),
    await mkUser('teacher',  'خانم معلم',       'teacher', 'teacher','', ['c1','c2']),
    await mkUser('parent1',  'حسن احمدی',       'parent',  '12345678','s0'),
    await mkUser('student1', 'علی احمدی',       'student', '12345678','s0')
  ];

  const today = iso();
  const att = {};
  att[today] = {};
  BELLS.slice(0,3).forEach(b => {
    att[today][b] = {};
    students.forEach((s,i) => { att[today][b][s.id] = {status: i%5===0?'a':i%4===0?'l':'p', delay:i%4===0?5:0} });
  });

  /* برنامه هفتگی نمونه */
  const weekdays = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه'];
  const timetable = {};
  classes.forEach(c => {
    timetable[c.id] = {};
    weekdays.forEach((d, di) => {
      timetable[c.id][d] = {};
      for (let b=1; b<=4; b++) {
        const subs = ['ریاضی','فیزیک','شیمی','ادبیات','عربی','زیست','تاریخ','جغرافیا'];
        timetable[c.id][d][b] = subs[(di + b) % subs.length];
      }
    });
  });

  /* تقویم نمونه */
  const cal = [
    {id:uid(), date: iso(), title:'شروع سال تحصیلی', type:'event', desc:'', ts:Date.now()},
    {id:uid(), date: isoDate(new Date().getFullYear(), new Date().getMonth(), 15), title:'امتحان میان‌ترم ریاضی', type:'exam', desc:'', ts:Date.now()},
    {id:uid(), date: isoDate(new Date().getFullYear(), new Date().getMonth(), 22), title:'هفته وحدت', type:'holiday', desc:'', ts:Date.now()}
  ];

  return {
    v: 7,
    school:'مدرسه سمپاد شهید مدنی', year:'۱۴۰۵-۱۴۰۶',
    classes, students, grades, users,
    att,
    ann: [
      {id:uid(), title:'شروع سال تحصیلی', target:'all', body:'به همه دانش‌آموزان خوش آمد می‌گوییم.', date:iso(), authorId:users[0].id, ts:Date.now()}
    ],
    news: [
      {id:uid(), title:'افتتاح آزمایشگاه جدید', body:'آزمایشگاه فیزیک با تجهیزات جدید افتتاح شد.', date:iso(), authorId:users[0].id, img:'', ts:Date.now()}
    ],
    fin: [],
    polls: [
      {id:uid(), title:'نظر شما درباره ساعات کلاس‌ها؟', options:['خیلی خوب','خوب','نیاز به تغییر'], votes:{}, multi:false, createdBy:users[0].id, date:iso(), deadline:'', img:'', ts:Date.now()}
    ],
    discipline: [
      {id:uid(), sid:'s0', type:'تذکر شفاهی', desc:'بی‌نظمی در کلاس', date:iso(), by:users[0].id, severity:'low'}
    ],
    homework: [
      {id:uid(), classId:'c1', subject:'ریاضی', title:'تمرین فصل ۳', desc:'صفحه ۴۵ تا ۵۰', due:iso(), createdBy:users[2].id, submissions:{}}
    ],
    quizzes: [],
    online: [],
    messages: [],
    chats: {},

    /* پرورشی */
    provTypes: [
      {id:'pt1', name:'بوفه', icon:'🛒', op:'coupon', unit:'تومان', active:true, createdBy:users[0].id, ts:Date.now()},
      {id:'pt2', name:'نمازخانه', icon:'🕌', op:'attend', unit:'', active:true, createdBy:users[0].id, ts:Date.now()},
      {id:'pt3', name:'شورای دانش‌آموزی', icon:'🗳️', op:'vote', unit:'', active:true, createdBy:users[0].id, ts:Date.now()}
    ],
    provEvents: [],
    provRecords: [],
    provElections: [],

    /* رویدادها */
    showcase: [
      {id:uid(), title:'هفته وحدت', desc:'هفته وحدت، فاصله میان ۱۲ ربیع‌الاول (سالروز ولادت پیامبر اسلام به روایت اهل سنت) و ۱۷ ربیع‌الاول (به روایت شیعه) است. این هفته نماد وحدت مسلمانان است.', img:'', cat:'مذهبی', date:iso(), authorId:users[0].id, pinned:true, ts:Date.now()}
    ],

    /* تقویم و برنامه هفتگی */
    calendar: cal,
    timetable,

    /* مرخصی */
    leaves: [],

    /* Audit */
    audit: [],

    /* تنظیمات */
    settings: {twoFA:{admin:false, vice:false}}
  };
}
