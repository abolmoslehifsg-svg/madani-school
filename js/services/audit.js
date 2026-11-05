/* =========================================================================
   گزارش عملیات (Audit)
   ========================================================================= */
/* ---------- Audit Log ---------- */
const audit = (action, target, detail) => {
  if (!db.audit) db.audit = [];
  db.audit.unshift({
    id: uid(), userId: me ? me.id : null,
    action, target: String(target||''), detail: String(detail||''),
    ts: Date.now()
  });
  if (db.audit.length > 500) db.audit.length = 500;
  save();
};
