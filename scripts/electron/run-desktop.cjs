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
    // quick check: try to require electron; if it throws, we avoid spawning
    let electronAvailable = false;
    try {
      require.resolve('electron');
      electronAvailable = true;
    } catch (e) {
      electronAvailable = false;
    }

    if (!electronAvailable) {
      console.warn('Electron package not available or not installed properly. Falling back to browser.');
      console.log('If you want Electron desktop, run: `pnpm rebuild electron` or `pnpm approve-builds` then reinstall.');
      openInBrowser(DEV_URL);
      process.exit(0);
    }

    // Try to run electron with the bundled main
    try {
      await trySpawnElectron(['./scripts/electron/main.cjs']);
      process.exit(0);
    } catch (err) {
      console.warn('Failed to start Electron:', err && err.message ? err.message : err);
      console.log('Falling back to opening the Admin UI in the default browser at', DEV_URL);
      openInBrowser(DEV_URL);
      process.exit(0);
    }
  } catch (err) {
    console.error('Unexpected error in desktop launcher:', err);
    openInBrowser(DEV_URL);
    process.exit(1);
  }
})();
