/* =========================================================================
   تنظیمات برنامه
   سامانه مدیریت مدرسه سمپاد شهید مدنی
   ========================================================================= */
const API_BASE = window.API_BASE || '/api';
const STORAGE_KEY = 'madani_lms_v8';   // فقط در حالت آفلاین (بدون سرور) استفاده می‌شود
const LOGO_MARK = 'م';

let USE_SERVER = false;                // پس از اتصال موفق به سرور true می‌شود
let serverInfo = null;                 // {school, year, needsSetup}

window.__xlsxReady = typeof XLSX !== 'undefined';
