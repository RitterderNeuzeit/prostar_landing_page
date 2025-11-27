#!/usr/bin/env node

/**
 * Erstellt das Schema in der Azure MySQL-Datenbank
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONNECTION_CONFIG = {
  host: 'prostar-mysql-server.mysql.database.azure.com',
  port: 3306,
  user: 'prostaradmin',
  password: 'ProStar2025DB!',
  database: 'prostar_db',
  ssl: {
    rejectUnauthorized: false
  }
};

console.log('🚀 Azure MySQL Schema Setup');
console.log('============================');
console.log(`📊 Host: ${CONNECTION_CONFIG.host}`);
console.log(`📊 Database: ${CONNECTION_CONFIG.database}`);
console.log('');

async function runMigration() {
  let connection;
  
  try {
    // Verbinde
    console.log('🔌 Verbinde mit Azure MySQL...');
    connection = await mysql.createConnection(CONNECTION_CONFIG);
    console.log('✅ Verbunden!');
    console.log('');
    
    // Lade Schema
    const schemaPath = path.join(__dirname, '..', 'drizzle', 'azure-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by statements (;)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Führe ${statements.length} SQL-Statements aus...`);
    console.log('');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.startsWith('CREATE TABLE')) {
        const tableName = stmt.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i)[1];
        console.log(`   ${i + 1}. Erstelle Tabelle: ${tableName}`);
      } else {
        console.log(`   ${i + 1}. Führe Statement aus...`);
      }
      
      try {
        await connection.execute(stmt);
      } catch (error) {
        if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
          throw error;
        }
        console.log(`      → Tabelle existiert bereits`);
      }
    }
    
    console.log('');
    console.log('✅ Schema erfolgreich erstellt!');
    console.log('');
    
    // Zeige Tabellen
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Vorhandene Tabellen:');
    tables.forEach((row, i) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${i + 1}. ${tableName}`);
    });
    
  } catch (error) {
    console.error('');
    console.error('❌ Fehler:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  
  console.log('');
  console.log('============================');
  console.log('✅ Setup abgeschlossen!');
  console.log('');
  console.log('💡 Nächste Schritte:');
  console.log('   1. Migriere User: node scripts/migrate-users-to-azure.mjs');
  console.log('   2. Starte Server: pnpm dev');
  console.log('   3. Teste Login/Registrierung');
}

runMigration();
