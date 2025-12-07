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
  // Try multiple possible paths for static files
  const possiblePaths = [
    // Railway/Docker: Always check /app/dist first (vite builds here now)
    path.resolve("/app/dist"),
    // Local production: current directory
    import.meta.dirname,
    // Legacy fallbacks
    path.resolve("/app/dist/public"),
    path.resolve(import.meta.dirname, "../..", "dist", "public"),
    path.resolve(import.meta.dirname, "public"),
  ];
  
  console.log(`[ServeStatic] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[ServeStatic] import.meta.dirname: ${import.meta.dirname}`);
  console.log(`[ServeStatic] Trying paths:`, possiblePaths);
  
  let distPath: string | null = null;
  for (const tryPath of possiblePaths) {
    const indexHtmlPath = path.resolve(tryPath, "index.html");
    if (fs.existsSync(indexHtmlPath)) {
      distPath = tryPath;
      console.log(`✅ Found static files at: ${distPath}`);
      break;
    } else {
      console.log(`❌ No index.html at: ${tryPath}`);
    }
  }
  
  if (!distPath) {
    console.error(`❌ Could not find static files in any of the expected locations!`);
    console.error(`Working directory: ${process.cwd()}`);
    console.error(`__dirname equivalent: ${import.meta.dirname}`);
    // Use first path as fallback
    distPath = possiblePaths[0];
  }

  app.use(express.static(distPath));

  // SPA fallback - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    
    const indexPath = path.resolve(distPath!, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at: ${indexPath}`);
      res.status(404).json({ 
        status: "error",
        code: 404,
        message: "Application not found",
        details: {
          searchPath: indexPath,
          distPath: distPath,
          cwd: process.cwd(),
          dirname: import.meta.dirname
        }
      });
    }
  });
}
