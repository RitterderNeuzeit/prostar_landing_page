const http = require('http');
const fs = require('fs');

async function tryFetch(port) {
  const url = `http://localhost:${port}/api/admin/landing`;
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'GET', timeout: 2000 }, (res) => {
      if (res.statusCode !== 200) return resolve(null);
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ port, json });
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

async function findServer() {
  for (let p = 3000; p <= 3020; p++) {
    // eslint-disable-next-line no-await-in-loop
    const res = await tryFetch(p);
    if (res) return res;
  }
  return null;
}

async function postJson(port, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port,
      path: '/api/admin/landing',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 5000,
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async function main() {
  console.log('Searching for running dev server on ports 3000-3020...');
  const s = await findServer();
  if (!s) {
    console.error('No server found on ports 3000-3020');
    process.exit(2);
  }
  console.log('Found server on port', s.port);
  const original = s.json;
  console.log('Original brand.title:', original?.brand?.title);
  const now = new Date().toISOString();
  const modified = JSON.parse(JSON.stringify(original));
  modified.brand = modified.brand || {};
  modified.brand.title = `${modified.brand.title || 'ProStar'} [AUTOTEST ${now}]`;

  try {
    const res = await postJson(s.port, modified);
    console.log('POST status', res.status);
    console.log('Response body:', res.body);
  } catch (e) {
    console.error('POST failed', e);
    process.exit(3);
  }

  try {
    const ck = fs.readFileSync('./tmp_debug/assistant_checkpoints.md', 'utf-8');
    const lines = ck.trim().split(/\n+/).slice(-5);
    console.log('Last checkpoint lines:\n' + lines.join('\n'));
  } catch (e) {
    console.warn('Could not read checkpoints file:', e.message);
  }
})();
