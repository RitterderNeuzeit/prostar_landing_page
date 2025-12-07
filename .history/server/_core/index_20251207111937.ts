import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import checkoutRoutes from "../routes/checkout";
import stripeRoutes from "../routes/stripe";
import { autoMigrate } from "../services/autoMigrate";

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
  console.log("🚀 [Server] Starting ProStar Landing Page...");
  
  // Run auto-migration (optional - won't block if DB unavailable)
  const migrationResult = await autoMigrate();
  if (!migrationResult.success) {
    console.warn("⚠️ [Server] Starting without database - using in-memory fallback");
  }
  
  // Initialize course service (chooses DB or cache)
  const { initCourseService } = await import("../services/courseServiceAuto");
  await initCourseService();
  
  const app = express();
  const server = createServer(app);
  
  // Trust proxy for production deployments
  app.set('trust proxy', 1);
  
  // CORS configuration for custom subdomain
  const allowedOrigins = [
    'https://kurs.prostarmarketing.de',
    'https://prostarmarketing.de',
    'https://www.prostarmarketing.de',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  // Add Railway domain if present (for direct access during deployment)
  if (process.env.RAILWAY_STATIC_URL) {
    allowedOrigins.push(`https://${process.env.RAILWAY_STATIC_URL}`);
  }
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  // Configure body parser with larger size limit for file uploads
  // Stripe webhook needs raw body, so register it before JSON parser
  app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), (req, res, next) => {
    next();
  });
  
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  
  // Security headers for direct access
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Checkout routes
  app.use("/api/checkout", checkoutRoutes);
  // Stripe routes
  app.use("/api/stripe", stripeRoutes);
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
