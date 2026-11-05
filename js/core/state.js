/* =========================================================================
   وضعیت سراسری برنامه
   ========================================================================= */
/* ---------- State ---------- */
let db, me = null, page = 'dash';
let dark = localStorage.getItem('madani_dark') === '1';
let gf = '', ad = new Date().toLocaleDateString('en-CA'), rs = '', attClass = '', attBell = BELLS[0];
let fails = 0, lock = 0;
let pg = {students:1,grades:1,fin:1,users:1,att:1,news:1,hw:1,quiz:1,msg:1,disc:1,events:1,audit:1,leaves:1,poll:1};
let modal = null, editTarget = null;
let attDraft = {};
let gradeDraft = [];
let chatPeer = null, chatCache = {};
let quizSession = null, quizTimer = null;
let provereshiTab = 'events';
let provEventView = null;
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
let ttClassId = '';
let notifPanelOpen = false;
let searchOpen = false;
let otpPending = null;
