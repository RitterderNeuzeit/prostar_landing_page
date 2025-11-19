const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const DEV_URL = process.env.ADMIN_URL || "http://localhost:3000/admin";
const DEV_PORT = Number(
  new URL(process.env.ADMIN_URL || "http://localhost:3000").port || 3000
);

function checkServer(port, cb) {
  const req = http.request(
    { method: "GET", host: "localhost", port, path: "/" },
    res => {
      cb(true);
    }
  );
  req.on("error", () => cb(false));
  req.end();
}

function startDevServer() {
  console.log("Starting dev server... (pnpm dev)");
  const child = spawn("pnpm", ["dev"], {
    shell: true,
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  return child.pid;
}

async function ensureServerReady(port, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function poll() {
      checkServer(port, ok => {
        if (ok) return resolve();
        if (Date.now() - start > timeout)
          return reject(new Error("Timeout waiting for server"));
        setTimeout(poll, 500);
      });
    })();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadURL(DEV_URL);
}

app.whenReady().then(async () => {
  try {
    let pid = null;
    const port = DEV_PORT || 3000;
    checkServer(port, ok => {
      if (ok) {
        createWindow();
      } else {
        pid = startDevServer();
        ensureServerReady(port, 60000)
          .then(() => createWindow())
          .catch(err => {
            console.error("Server did not start:", err);
            createWindow();
          });
      }
    });
  } catch (e) {
    console.error("Electron error", e);
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
