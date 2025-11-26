import express from "express";
import fs from "fs/promises";
import path from "path";
import { appendFile } from "fs/promises";
import fsSync from "fs";
import { promisify } from "util";
import { exec as execCb } from "child_process";
const exec = promisify(execCb);

const router = express.Router();

const CONTENT_PATH = path.resolve(process.cwd(), "content", "landing.json");

function checkAdminKey(req: express.Request) {
  const key = req.header("x-admin-key") || "";
  const envKey = process.env.ADMIN_KEY || "";
  // In production require ADMIN_KEY to be set and matched
  if (process.env.NODE_ENV === "production") {
    if (!envKey) return false;
    return key === envKey;
  }
  // In development: allow missing env for convenience, otherwise match if set
  if (!envKey && process.env.NODE_ENV === "development") return true;
  return key && envKey && key === envKey;
}

router.get("/landing", async (req, res) => {
  try {
    if (!checkAdminKey(req))
      return res.status(401).json({ error: "Unauthorized" });
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/landing", express.json(), async (req, res) => {
  try {
    if (!checkAdminKey(req))
      return res.status(401).json({ error: "Unauthorized" });
    const body = req.body;
    // basic validation: must be object
    if (typeof body !== "object" || body === null)
      return res.status(400).json({ error: "Invalid payload" });
    const dumped = JSON.stringify(body, null, 2);
    await fs.writeFile(CONTENT_PATH, dumped, "utf-8");
    // Append a checkpoint for automation/debugging (timestamp + action)
    try {
      const ck = `${new Date().toISOString()} | admin-save | user: ${req.ip}\n`;
      await appendFile(
        path.resolve(process.cwd(), "tmp_debug", "assistant_checkpoints.md"),
        ck,
        { encoding: "utf-8" }
      ).catch(() => {});
    } catch (e) {
      // non-fatal
    }

    // Optionally create a local git commit of the changed file. Behavior:
    // - Auto-commit is enabled by default in development for convenience.
    // - In other environments, set ADMIN_AUTOCOMMIT=true to enable.
    (async () => {
      const shouldAutoCommit =
        process.env.NODE_ENV === "development" ||
        process.env.ADMIN_AUTOCOMMIT === "true";
      if (!shouldAutoCommit) return;
      try {
        const repoRoot = process.cwd();
        const gitDir = path.join(repoRoot, ".git");
        if (!fsSync.existsSync(gitDir)) return;
        const ts = new Date().toISOString();
        const commitMsg = `admin: update landing.json ${ts}`;
        const author = process.env.ADMIN_COMMIT_AUTHOR; // optional "Name <email>"
        const authorArg = author
          ? `--author="${author.replace(/"/g, '\\"')}"`
          : "";
        await exec(
          `git add ${CONTENT_PATH} && git commit -m "${commitMsg}" ${authorArg}`,
          { cwd: repoRoot }
        );
        const ck2 = `${new Date().toISOString()} | admin-git-commit | msg: ${commitMsg}\n`;
        await appendFile(
          path.resolve(process.cwd(), "tmp_debug", "assistant_checkpoints.md"),
          ck2,
          { encoding: "utf-8" }
        ).catch(() => {});
      } catch (e: any) {
        const ckErr = `${new Date().toISOString()} | admin-git-error | ${String(e.message || e)}\n`;
        await appendFile(
          path.resolve(process.cwd(), "tmp_debug", "assistant_checkpoints.md"),
          ckErr,
          { encoding: "utf-8" }
        ).catch(() => {});
      }
    })();
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
