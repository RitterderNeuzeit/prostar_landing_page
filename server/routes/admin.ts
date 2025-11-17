import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const CONTENT_PATH = path.resolve(process.cwd(), 'content', 'landing.json');

function checkAdminKey(req: express.Request) {
  const key = req.header('x-admin-key') || '';
  const envKey = process.env.ADMIN_KEY || '';
  // In development, allow empty env with a warning
  if (!envKey && process.env.NODE_ENV === 'development') return true;
  return key && envKey && key === envKey;
}

router.get('/landing', async (req, res) => {
  try {
    if (!checkAdminKey(req)) return res.status(401).json({ error: 'Unauthorized' });
    const raw = await fs.readFile(CONTENT_PATH, 'utf-8');
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/landing', express.json(), async (req, res) => {
  try {
    if (!checkAdminKey(req)) return res.status(401).json({ error: 'Unauthorized' });
    const body = req.body;
    // basic validation: must be object
    if (typeof body !== 'object' || body === null) return res.status(400).json({ error: 'Invalid payload' });
    const dumped = JSON.stringify(body, null, 2);
    await fs.writeFile(CONTENT_PATH, dumped, 'utf-8');
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
