#!/usr/bin/env node
const { spawn } = require('child_process');
const os = require('os');

const DEV_URL = process.env.ADMIN_URL || 'http://localhost:3000/admin';

function openInBrowser(url) {
  const platform = os.platform();
  if (platform === 'darwin') return spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
  if (platform === 'win32') return spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  // linux
  return spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

function trySpawnElectron(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('electron', args, { stdio: 'inherit' });
    proc.on('error', err => reject(err));
    proc.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error('Electron exited with code ' + code));
    });
  });
}

(async function main() {
  try {
    // Try to run electron with the bundled main
    await trySpawnElectron(['./scripts/electron/main.cjs']);
    process.exit(0);
  } catch (err) {
    console.warn('Failed to start Electron:', err && err.message ? err.message : err);
    console.log('Falling back to opening the Admin UI in the default browser at', DEV_URL);
    try {
      openInBrowser(DEV_URL);
      process.exit(0);
    } catch (openErr) {
      console.error('Failed to open browser fallback:', openErr);
      process.exit(1);
    }
  }
})();
