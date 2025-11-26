import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import checkoutRoutes from "../routes/checkout";
import stripeRoutes from "../routes/stripe";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ⚠️ KRITISCH: Stripe-Webhook Middleware-Reihenfolge
  // express.raw() MUSS vor express.json() registriert sein!
  // Grund: Stripe braucht den rohen Request-Body zur Signatur-Verifikation.
  // Wenn express.json() zuerst lädt, wird der Body geparsed und die Signatur ungültig.
  // → Webhook bricht! Niemals die Reihenfolge ändern!
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
      next();
    }
  );

  // === CORS Konfiguration ===
  // Erlaubte Origins aus .env (komma-separiert)
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || "http://localhost:3000"
  )
    .split(",")
    .map(origin => origin.trim());

  app.use((req, res, next) => {
    const origin = req.headers.origin || "";
    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === "development"
    ) {
      res.header("Access-Control-Allow-Origin", origin || "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Ab hier: Standard Body Parser (JSON mit 50MB Limit für Datei-Uploads)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Checkout routes
  app.use("/api/checkout", checkoutRoutes);
  // Stripe routes
  app.use("/api/stripe", stripeRoutes);
  // Admin routes for local CMS editing of landing content
  // Protected by header `x-admin-key` matching `process.env.ADMIN_KEY` (or allowed in dev when ADMIN_KEY unset)
  try {
    // lazy dynamic import to avoid ESM/CJS issues and circular deps
    const adminModule = await import("../routes/admin");
    const adminRoutes = adminModule.default;
    if (adminRoutes) app.use("/api/admin", adminRoutes);
  } catch (e) {
    console.warn("Admin routes not mounted", e);
  }
  // Email routes (open tracking)
  try {
    const emailModule = await import("../routes/email");
    const emailRoutes = emailModule.default;
    if (emailRoutes) app.use("/api/email", emailRoutes);
  } catch (e) {
    console.warn("Email routes not mounted", e);
  }
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // === ERROR HANDLER: Malformed URL protection ===
  // Catches decodeURIComponent errors and other request parsing errors
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err instanceof URIError || err instanceof SyntaxError) {
        console.warn(`[SafeError] ${err.message} on ${req.method} ${req.url}`);
        res.status(400).json({ error: "Bad Request", details: err.message });
        return;
      }

      console.error("[Error]", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  );

  // === 404 Handler ===
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found", path: req.path });
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
