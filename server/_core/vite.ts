import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production: dist/index.js is running, so dirname is 'dist'
  // We need dist/public which is at ./public relative to dist/
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  
  console.log(`[ServeStatic] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[ServeStatic] import.meta.dirname: ${import.meta.dirname}`);
  console.log(`[ServeStatic] Serving static from: ${distPath}`);
  console.log(`[ServeStatic] Path exists: ${fs.existsSync(distPath)}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `❌ Could not find the build directory: ${distPath}, make sure to build the client first`
    );
    // List what's actually there
    const parentDir = path.dirname(distPath);
    console.error(`Contents of ${parentDir}:`);
    try {
      const contents = fs.readdirSync(parentDir);
      console.error(contents);
    } catch (e) {
      console.error("Cannot read parent directory");
    }
  } else {
    console.log(`✅ Static files directory found at ${distPath}`);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
