import mysql from "mysql2/promise";

/**
 * Auto-migrate database tables on startup
 * Creates tables if they don't exist
 */
export async function autoMigrate() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ [DB] DATABASE_URL not set, skipping auto-migration");
    return { success: false, reason: "no_database_url" };
  }

  let connection;
  try {
    // Parse DATABASE_URL (format: mysql://user:pass@host:port/dbname)
    const dbUrl = new URL(process.env.DATABASE_URL);
    const config = {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), // remove leading /
    };

    connection = await mysql.createConnection(config);
    
    console.log("🔄 [DB] Starting auto-migration...");

    // Create registrations table
    await connection.execute(`
      sql: `
        CREATE TABLE IF NOT EXISTS registrations (
          id VARCHAR(191) PRIMARY KEY,
          access_key VARCHAR(128) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          course_name VARCHAR(255) NOT NULL DEFAULT 'free-mini-course',
          status ENUM('pending', 'active', 'expired', 'cancelled', 'used') NOT NULL DEFAULT 'active',
          email_sent_at TIMESTAMP NULL,
          accessed_at TIMESTAMP NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          KEY idx_access_key (access_key),
          KEY idx_email (email),
          KEY idx_status (status),
          KEY idx_expires_at (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      params: [],
    });

    console.log("✅ [DB] Table 'registrations' ready");

    // Create password_reset_tokens table
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id VARCHAR(191) PRIMARY KEY,
          token VARCHAR(128) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL,
          used TINYINT(1) NOT NULL DEFAULT 0,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_token (token),
          KEY idx_email (email),
          KEY idx_expires_at (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      params: [],
    });

    console.log("✅ [DB] Table 'password_reset_tokens' ready");

    // Ensure passwordHash column exists in users table
    try {
      await db.execute({
        sql: `
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(128) NULL
        `,
        params: [],
      });
      console.log("✅ [DB] Column 'passwordHash' ready in users table");
    } catch (error: any) {
      // Column might already exist, that's fine
      if (!error.message?.includes("Duplicate column")) {
        console.warn("⚠️ [DB] Could not add passwordHash column:", error.message);
      }
    }

    console.log("✅ [DB] Auto-migration completed successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ [DB] Auto-migration failed:", error);
    return { success: false, error };
  }
}
