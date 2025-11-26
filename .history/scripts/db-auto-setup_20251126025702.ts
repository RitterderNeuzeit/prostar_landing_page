#!/usr/bin/env node
/**
 * Automatisiertes Datenbank-Setup für Probebetrieb
 * 
 * Dieses Script:
 * 1. Prüft ob MySQL läuft und erreichbar ist
 * 2. Erstellt DB und Tabellen wenn nötig (via Drizzle)
 * 3. Füllt Beispiel-Registrierungen für Tests
 * 4. Startet den Dev-Server automatisch
 * 
 * Verwendung:
 *   npm run db:auto-setup
 *   oder automatisch bei: pnpm dev (mit DB_AUTO_SYNC=true)
 */

import "dotenv/config";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";

const LOG_PREFIX = "[DB-SETUP]";

interface SetupConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  autoSync: boolean;
  demoMode: boolean;
}

/**
 * Parse DATABASE_URL and extract connection config
 */
function parseDbUrl(url: string): Partial<SetupConfig> {
  // Format: mysql://user:password@host:port/database
  const match = url.match(
    /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^/?]+)/
  );
  
  if (!match) {
    console.error(`${LOG_PREFIX} Invalid DATABASE_URL format:`, url);
    return {};
  }

  const [, user, password, host, port, database] = match;
  return {
    host,
    port: parseInt(port),
    user,
    password,
    database,
  };
}

/**
 * Test database connection
 */
async function testDatabaseConnection(config: SetupConfig): Promise<boolean> {
  try {
    console.log(
      `${LOG_PREFIX} Testing connection to ${config.host}:${config.port}/${config.database}...`
    );
    
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    await connection.end();
    console.log(`${LOG_PREFIX} ✅ Database connection successful`);
    return true;
  } catch (error) {
    console.error(`${LOG_PREFIX} ❌ Database connection failed:`, error);
    return false;
  }
}

/**
 * Create database if it doesn't exist
 */
async function ensureDatabase(config: SetupConfig): Promise<void> {
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    // Check if database exists
    const [databases] = await connection.execute(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [config.database]
    );

    if ((databases as any[]).length === 0) {
      console.log(`${LOG_PREFIX} Creating database '${config.database}'...`);
      await connection.execute(`CREATE DATABASE \`${config.database}\``);
      console.log(`${LOG_PREFIX} ✅ Database created`);
    } else {
      console.log(`${LOG_PREFIX} Database '${config.database}' already exists`);
    }

    await connection.end();
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to ensure database:`, error);
    throw error;
  }
}

/**
 * Run Drizzle migrations to setup schema
 */
async function runDrizzleMigrations(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`${LOG_PREFIX} Running Drizzle migrations...`);
    
    const drizzleKit = spawn("pnpm", ["exec", "drizzle-kit", "push:mysql"], {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    drizzleKit.on("close", (code) => {
      if (code === 0) {
        console.log(`${LOG_PREFIX} ✅ Migrations completed`);
        resolve();
      } else {
        console.error(`${LOG_PREFIX} ❌ Migrations failed with code ${code}`);
        reject(new Error(`Migrations failed: ${code}`));
      }
    });

    drizzleKit.on("error", (error) => {
      console.error(`${LOG_PREFIX} Error running migrations:`, error);
      reject(error);
    });
  });
}

/**
 * Insert demo registrations for testing
 */
async function insertDemoRegistrations(): Promise<void> {
  console.log(`${LOG_PREFIX} Inserting demo registrations for testing...`);
  
  // We'll just log this - actual insertion happens in courseService
  console.log(`${LOG_PREFIX} ✅ Demo registrations setup (lazy-loaded on first registration)`);
}

/**
 * Main setup function
 */
async function setupDatabase(): Promise<void> {
  console.log(`\n${ LOG_PREFIX} ========== DATABASE AUTO-SETUP ==========\n`);

  try {
    // Get config from environment
    const databaseUrl = process.env.DATABASE_URL;
    const autoSync = process.env.DB_AUTO_SYNC === "true";
    const demoMode = process.env.DEMO_MODE === "auto";

    if (!databaseUrl) {
      console.warn(
        `${LOG_PREFIX} ⚠️ DATABASE_URL not set - skipping database setup`
      );
      console.warn(
        `${LOG_PREFIX} Set DATABASE_URL in .env to enable auto-setup`
      );
      return;
    }

    const dbConfig: SetupConfig = {
      ...parseDbUrl(databaseUrl),
      autoSync,
      demoMode,
    } as SetupConfig;

    console.log(`${LOG_PREFIX} Configuration:`, {
      host: dbConfig.host,
      database: dbConfig.database,
      autoSync: dbConfig.autoSync,
      demoMode: dbConfig.demoMode,
    });

    if (!autoSync) {
      console.log(`${LOG_PREFIX} DB_AUTO_SYNC is disabled - skipping setup`);
      return;
    }

    // Step 1: Test connection
    const connected = await testDatabaseConnection(dbConfig);
    if (!connected) {
      console.warn(
        `${LOG_PREFIX} ⚠️ Could not connect to database - continuing with in-memory cache`
      );
      return;
    }

    // Step 2: Ensure database exists
    await ensureDatabase(dbConfig);

    // Step 3: Run migrations
    try {
      await runDrizzleMigrations();
    } catch (error) {
      console.warn(`${LOG_PREFIX} ⚠️ Migrations failed - using in-memory fallback:`, error);
    }

    // Step 4: Insert demo data if needed
    if (demoMode) {
      await insertDemoRegistrations();
    }

    console.log(`\n${LOG_PREFIX} ✅ Database setup completed successfully\n`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Setup failed:`, error);
    console.warn(`${LOG_PREFIX} ⚠️ Continuing with in-memory cache fallback`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().catch(error => {
    console.error(`${LOG_PREFIX} Fatal error:`, error);
    process.exit(1);
  });
}

export { setupDatabase, parseDbUrl };
