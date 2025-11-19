#!/usr/bin/env node
/*
 Automation assisten (Node, CommonJS) - interactive automation for developer tasks
 Same behaviour as the ESM script but uses CommonJS so it can be executed in this repo
 (package.json uses "type": "module").
*/

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const readline = require("readline");

const TIMEOUT = Number(process.env.TIMEOUT || 10);
const PER_CMD_TIMEOUT = Number(process.env.PER_CMD_TIMEOUT || 300);
const CHECKPOINT_FILE = path.join(
  __dirname,
  "..",
  "tmp_debug",
  "assistant_checkpoints.md"
);
const DEFAULT_TASKS = [
  "pnpm run check",
  "pnpm dev",
  "bash scripts/open-dev-url.sh",
];

fs.mkdirSync(path.dirname(CHECKPOINT_FILE), { recursive: true });
if (!fs.existsSync(CHECKPOINT_FILE))
  fs.writeFileSync(CHECKPOINT_FILE, "# Automation assisten - Checkpoints\n\n");

function timestamp() {
  return new Date().toISOString();
}

function logCheckpoint(status, task, note) {
  const entry = `- time: ${timestamp()}\n  status: ${status}\n  task: "${task}"\n  note: "${String(note).replace(/\n/g, " ")}"\n\n`;
  fs.appendFileSync(CHECKPOINT_FILE, entry);
}

function askQuestion(question, timeoutSec) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let answered = false;
    const timer = setTimeout(() => {
      if (!answered) {
        rl.close();
        resolve("");
      }
    }, timeoutSec * 1000);
    rl.question(question, answer => {
      answered = true;
      clearTimeout(timer);
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log(
    "Automation assisten (node,cjs): Gib eine durch Semikolon getrennte Aufgabenliste ein (wartet",
    TIMEOUT,
    "s):"
  );
  const input = await askQuestion("> ", TIMEOUT);
  let tasks;
  if (!input) {
    console.log(
      "Keine Eingabe — verwende Standardaufgaben:",
      DEFAULT_TASKS.join(", ")
    );
    tasks = DEFAULT_TASKS;
  } else {
    tasks = input
      .split(";")
      .map(s => s.trim())
      .filter(Boolean);
  }

  console.log(`Starte ${tasks.length} Aufgabe(n)...`);
  for (const cmd of tasks) {
    logCheckpoint("start", cmd, "starting");
    console.log("->", cmd);
    try {
      if (/\bdev\b/.test(cmd)) {
        const child = spawn(cmd, {
          shell: true,
          detached: true,
          stdio: "ignore",
        });
        child.unref();
        const note = `detached pid=${child.pid}`;
        console.log("  (background) pid=", child.pid);
        logCheckpoint("done", cmd, note);
        continue;
      }
      await runCommandWithTimeout(cmd, PER_CMD_TIMEOUT);
      logCheckpoint("done", cmd, "exit=0");
    } catch (err) {
      console.error("  Fehler bei", cmd, err && err.message);
      logCheckpoint(
        "error",
        cmd,
        `exit error ${err && err.code ? err.code : "unknown"} ${err && err.message ? err.message : ""}`
      );
    }
  }
  console.log("Fertig. Checkpoints in", CHECKPOINT_FILE);
}

function runCommandWithTimeout(cmd, timeoutSec) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, { shell: true });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      try {
        child.kill("SIGTERM");
      } catch (e) {}
      reject(new Error("timeout"));
    }, timeoutSec * 1000);
    child.stdout &&
      child.stdout.on("data", d => {
        stdout += d.toString();
      });
    child.stderr &&
      child.stderr.on("data", d => {
        stderr += d.toString();
      });
    child.on("error", err => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", code => {
      clearTimeout(timer);
      if (code === 0) resolve({ code, stdout: stdout.slice(0, 1000) });
      else {
        const e = new Error("non-zero exit");
        e.code = code;
        e.stdout = stdout;
        e.stderr = stderr;
        reject(e);
      }
    });
  });
}

main().catch(e => {
  console.error("Fatal", e);
  process.exit(1);
});
