/**
 * In-Memory Registration Cache
 * 
 * Fallback-Mechanismus wenn MySQL/Database offline ist:
 * - Speichert Registrierungen im RAM (werden bei Server-Restart gelöscht)
 * - Verhindert, dass E-Mails gesendet werden ohne DB-Record
 * - Ermöglicht vollständige E2E-Tests auch ohne DB
 * 
 * WICHTIG: NUR für Development/Testing!
 * Produktion MUSS eine persistente DB haben!
 * 
 * Methoden:
 * - set(accessKey, registration): Speichern + Email-Index aktualisieren
 * - get(accessKey): Nach Key suchen
 * - getByEmail(email): Alle Keys für Email
 * - update(accessKey, partial): Teilweise Update
 * - clear(): Alle Einträge löschen
 * - stats(): Statistiken (total, emails, expired)
 */

interface CachedRegistration {
  id: string;
  accessKey: string;
  name: string;
  email: string;
  courseName: string;
  status: "pending" | "active" | "expired" | "cancelled" | "used";
  emailSent: Date | null;
  accessedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'tmp', 'registrations.json');

class InMemoryRegistrationCache {
  private cache = new Map<string, CachedRegistration>();
  private emailIndex = new Map<string, string[]>(); // email -> accessKeys[]

  constructor() {
    this.loadFromFile();
  }

  /**
   * Load cache from file on startup
   */
  private loadFromFile(): void {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        
        // Restore cache
        for (const [key, reg] of Object.entries(parsed.registrations || {})) {
          const registration = reg as CachedRegistration;
          // Convert date strings back to Date objects
          registration.emailSent = registration.emailSent ? new Date(registration.emailSent) : null;
          registration.accessedAt = registration.accessedAt ? new Date(registration.accessedAt) : null;
          registration.expiresAt = new Date(registration.expiresAt);
          registration.createdAt = new Date(registration.createdAt);
          registration.updatedAt = new Date(registration.updatedAt);
          
          this.cache.set(key, registration);
        }
        
        // Restore email index
        for (const [email, keys] of Object.entries(parsed.emailIndex || {})) {
          this.emailIndex.set(email, keys as string[]);
        }
        
        console.log(`✅ [Cache] Loaded ${this.cache.size} registrations from file`);
      }
    } catch (error) {
      console.error('❌ [Cache] Failed to load from file:', error);
    }
  }

  /**
   * Save cache to file
   */
  private saveToFile(): void {
    try {
      // Ensure tmp directory exists
      const dir = path.dirname(CACHE_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const data = {
        registrations: Object.fromEntries(this.cache),
        emailIndex: Object.fromEntries(this.emailIndex),
        savedAt: new Date().toISOString(),
      };
      
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
      console.log(`💾 [Cache] Saved ${this.cache.size} registrations to file`);
    } catch (error) {
      console.error('❌ [Cache] Failed to save to file:', error);
    }
  }

  /**
   * Add or update a registration
   */
  set(accessKey: string, registration: CachedRegistration): void {
    this.cache.set(accessKey, registration);
    
    // Update email index
    if (!this.emailIndex.has(registration.email)) {
      this.emailIndex.set(registration.email, []);
    }
    const keys = this.emailIndex.get(registration.email)!;
    if (!keys.includes(accessKey)) {
      keys.push(accessKey);
    }
    
    console.log(`[In-Memory Cache] Registered: ${accessKey} for ${registration.email}`);
    
    // Persist to file
    this.saveToFile();
  }

  /**
   * Get registration by access key
   */
  get(accessKey: string): CachedRegistration | null {
    return this.cache.get(accessKey) || null;
  }

  /**
   * Get all registrations for an email
   */
  getByEmail(email: string): CachedRegistration[] {
    const keys = this.emailIndex.get(email) || [];
    return keys.map(key => this.cache.get(key)).filter(Boolean) as CachedRegistration[];
  }

  /**
   * Update registration
   */
  update(accessKey: string, partial: Partial<CachedRegistration>): CachedRegistration | null {
    const existing = this.cache.get(accessKey);
    if (!existing) return null;
    
    const updated = { ...existing, ...partial, updatedAt: new Date() };
    this.cache.set(accessKey, updated);
    
    // Persist to file
    this.saveToFile();
    
    return updated;
  }

  /**
   * Get all registrations (for debugging)
   */
  getAll(): CachedRegistration[] {
    return Array.from(this.cache.values());
  }

  /**
   * Clear all (for testing)
   */
  clear(): void {
    this.cache.clear();
    this.emailIndex.clear();
    console.log("[In-Memory Cache] Cleared all registrations");
  }

  /**
   * Get cache statistics
   */
  stats(): { total: number; emails: number; expired: number } {
    const now = new Date();
    const expired = Array.from(this.cache.values()).filter(
      reg => new Date(reg.expiresAt) < now
    ).length;
    
    return {
      total: this.cache.size,
      emails: this.emailIndex.size,
      expired,
    };
  }
}

// Export singleton
export const registrationCache = new InMemoryRegistrationCache();

/**
 * Log current cache state (for debugging)
 */
export function logRegistrationCache(): void {
  const stats = registrationCache.stats();
  console.log("\n📊 [Registration Cache Stats]:");
  console.log(`   Total registrations: ${stats.total}`);
  console.log(`   Unique emails: ${stats.emails}`);
  console.log(`   Expired: ${stats.expired}`);
  
  if (stats.total > 0) {
    console.log("\n   Recent registrations:");
    registrationCache.getAll()
      .slice(-5)
      .forEach(reg => {
        console.log(`   - ${reg.email}: ${reg.accessKey.substring(0, 12)}... (${reg.status})`);
      });
  }
}
