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

class InMemoryRegistrationCache {
  private cache = new Map<string, CachedRegistration>();
  private emailIndex = new Map<string, string[]>(); // email -> accessKeys[]

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
