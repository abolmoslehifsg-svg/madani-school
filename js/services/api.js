/* =========================================================================
   لایه‌ی ارتباط با سرور (REST)
   ========================================================================= */
const CLIENT_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const requestHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Requested-With': 'MadaniClient',
  'X-Client-Id': CLIENT_ID
});

async function request(method, path, body, extra) {
  const options = Object.assign(
    {method, headers: requestHeaders(), credentials: 'same-origin'}, extra);
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(API_BASE + path, options);
  } catch (networkError) {
    throw new ApiError('اتصال به سرور برقرار نیست.', 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError((payload && payload.error) || response.statusText, response.status);
  }
  return payload;
}

const api = {
  get:  path        => request('GET', path),
  post: (path, body) => request('POST', path, body === undefined ? {} : body),

  publicInfo:     ()                      => api.get('/public/info'),
  setup:          (name, username, password, token) => api.post('/setup', {name, username, password, token}),
  login:          (username, password, role, remember) =>
                    api.post('/auth/login', {username, password, role, remember}),
  verifyOtp:      (pendingToken, code)    => api.post('/auth/otp', {pendingToken, code}),
  logout:         ()                      => api.post('/auth/logout'),
  me:             ()                      => api.get('/auth/me'),
  changePassword: (old, pw)               => api.post('/auth/password', {old, pw}),
  changeUsername: (username, password)    => api.post('/auth/username', {username, password}),
  totpSetup:      ()                      => api.post('/auth/totp/setup'),
  totpEnable:     code                    => api.post('/auth/totp/enable', {code}),
  totpDisable:    password                => api.post('/auth/totp/disable', {password}),
  resetPassword:  (userId, pw)            => api.post('/admin/users/' + encodeURIComponent(userId) + '/password', {pw}),

  bootstrap:      cols => api.get('/bootstrap' + (cols && cols.length ? '?cols=' + cols.join(',') : '')),
  sync:           ops  => api.post('/sync', {ops}),
  syncOnUnload:   ops  => request('POST', '/sync', {ops}, {keepalive: true}).catch(() => {}),

  chatSend:       (to, text) => api.post('/chat', {to, text}),
  chatHistory:    peer       => api.get('/chat/' + encodeURIComponent(peer)),
  quizSubmit:     (quizId, answers) =>
                    api.post('/quizzes/' + encodeURIComponent(quizId) + '/submit', {answers}),
  realtime:       since => api.get('/realtime' + (since === null ? '' : '?since=' + since))
};
