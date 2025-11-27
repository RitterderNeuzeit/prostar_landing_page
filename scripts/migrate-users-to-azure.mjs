#!/usr/bin/env node

/**
 * Migriert User-Daten aus tmp/users.json in die Azure MySQL-Datenbank
 * 
 * Usage: node scripts/migrate-users-to-azure.mjs
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lade .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL nicht gefunden in .env');
  process.exit(1);
}

// Parse DATABASE_URL
// Format: mysql://user:password@host:port/database?params
const urlMatch = DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)/);
if (!urlMatch) {
  console.error('❌ Ungültiges DATABASE_URL Format');
  console.error(`   DATABASE_URL: ${DATABASE_URL}`);
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;

console.log('🚀 ProStar User Migration zu Azure MySQL');
console.log('==========================================');
console.log(`📊 Host: ${host}`);
console.log(`📊 Database: ${database}`);
console.log('');

// Lade users.json
const usersFile = path.join(__dirname, '..', 'tmp', 'users.json');
if (!fs.existsSync(usersFile)) {
  console.log('⚠️  Keine tmp/users.json gefunden - keine Migration nötig');
  process.exit(0);
}

const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
const users = Object.values(usersData.users || {});

console.log(`📁 Gefunden: ${users.length} User in tmp/users.json`);

if (users.length === 0) {
  console.log('✅ Keine User zu migrieren');
  process.exit(0);
}

// Verbinde zu MySQL
let connection;
try {
  connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: {
      rejectUnauthorized: false // Azure MySQL benötigt SSL
    }
  });
  
  console.log('✅ Verbunden mit Azure MySQL');
} catch (error) {
  console.error('❌ Verbindung fehlgeschlagen:', error.message);
  process.exit(1);
}

// Migriere User
let migrated = 0;
let skipped = 0;

for (const user of users) {
  try {
    // Prüfe ob User bereits existiert
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE openId = ?',
      [user.openId]
    );
    
    if (existing.length > 0) {
      console.log(`⏭️  User ${user.email} existiert bereits - überspringe`);
      skipped++;
      continue;
    }
    
    // Füge User ein (konvertiere ISO-Strings zu MySQL DATETIME)
    const lastSignedIn = new Date(user.lastSignedIn).toISOString().slice(0, 19).replace('T', ' ');
    const createdAt = new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ');
    
    await connection.execute(
      `INSERT INTO users 
       (openId, name, email, loginMethod, role, passwordHash, lastSignedIn, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.openId,
        user.name || null,
        user.email || null,
        user.loginMethod || 'local',
        user.role || 'user',
        user.passwordHash || null,
        lastSignedIn,
        createdAt,
        createdAt
      ]
    );
    
    console.log(`✅ Migriert: ${user.email} (${user.openId})`);
    migrated++;
    
  } catch (error) {
    console.error(`❌ Fehler bei ${user.email}:`, error.message);
  }
}

await connection.end();

console.log('');
console.log('==========================================');
console.log(`✅ Migration abgeschlossen!`);
console.log(`   Migriert: ${migrated} User`);
console.log(`   Übersprungen: ${skipped} User`);
console.log('');
console.log('💡 Nächste Schritte:');
console.log('   1. Starte den Server neu: pnpm dev');
console.log('   2. Teste den Login mit deinen Zugangsdaten');
console.log('   3. Die Daten werden nun in Azure MySQL gespeichert');
