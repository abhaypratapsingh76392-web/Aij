const express = require('express');
const path = require('path');
const { Readable } = require('stream');
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '60mb' }));
const BASE = (process.env.FM_BASE_URL || 'https://freemodel.in/v1').replace(/\/+$/, '');
const KEY = process.env.FM_API_KEY || '';
const PASS = process.env.APP_PASSWORD || '';
const hits = new Map();
setInterval(() => hits.clear(), 60000);
function limited(req) { const n = (hits.get(req.ip) || 0) + 1; hits.set(req.ip, n); return n > 60; }

app.get('/api/info', (req, res) => res.json({ needsPassword: !!PASS, hasKey: !!KEY }));

app.use('/api', async (req, res) => {
  if (!KEY) return res.status(500).send('FM_API_KEY Render env vars me set nahi hai');
  if (PASS && req.get('x-app-password') !== PASS) return res.status(401).send('Wrong password');
  if (limited(req)) return res.status(429).send('Too many requests, 1 minute ruko');
  const h = { authorization: 'Bearer ' + KEY, 'x-api-key': KEY };
  if (req.headers['content-type']) h['content-type'] = req.headers['content-type'];
  const init = { method: req.method, headers: h };
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (req.is('json')) init.body = JSON.stringify(req.body);
    else { init.body = req; init.duplex = 'half'; }
  }
  try {
    const up = await fetch(BASE + req.url, init);
    res.status(up.status);
    for (const k of ['content-type', 'content-disposition']) { const v = up.headers.get(k); if (v) res.setHeader(k, v); }
    res.setHeader('x-accel-buffering', 'no');
    if (!up.body) return res.end();
    Readable.fromWeb(up.body).pipe(res);
  } catch (e) { res.status(502).send(String(e)); }
});
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('FreeModel Studio running'));
