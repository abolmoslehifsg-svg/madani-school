/* =========================================================================
   رمزنگاری و ساخت کاربر
   ========================================================================= */
async function hp(password, salt) {
  if (!(window.crypto && crypto.subtle)) {
    throw new Error('مرورگر شما رمزنگاری امن را پشتیبانی نمی‌کند (به HTTPS نیاز است).');
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256'}, key, 256);
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* روی سرور رمز خام ارسال می‌شود و سرور هش می‌کند؛ در حالت آفلاین هش محلی ساخته می‌شود */
async function mkUser(username, name, role, password, sid, classIds) {
  sid = sid || '';
  classIds = classIds || [];
  if (USE_SERVER) return {id: uid(), username, name, role, sid, classIds, password};
  const salt = uid() + uid();
  return {id: uid(), username, name, role, sid, classIds, salt, hash: await hp(password, salt)};
}
