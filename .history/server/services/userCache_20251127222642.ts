import fs from 'fs';
import path from 'path';

export interface CachedUser {
  openId: string;
  email: string;
  name?: string;
  loginMethod?: string;
  role: 'user' | 'admin';
  passwordHash?: string;
  lastSignedIn: Date;
  createdAt: Date;
}

class UserCache {
  private cache: Map<string, CachedUser>;
  private emailIndex: Map<string, string>; // email -> openId
  private cacheFile: string;

  constructor() {
    this.cache = new Map();
    this.emailIndex = new Map();
    this.cacheFile = path.join(process.cwd(), 'tmp', 'users.json');
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        const parsed = JSON.parse(data);
        
        // Restore users map
        if (parsed.users) {
          Object.entries(parsed.users).forEach(([openId, userData]: [string, any]) => {
            this.cache.set(openId, {
              ...userData,
              lastSignedIn: new Date(userData.lastSignedIn),
              createdAt: new Date(userData.createdAt),
            });
          });
        }

        // Restore email index
        if (parsed.emailIndex) {
          Object.entries(parsed.emailIndex).forEach(([email, openId]: [string, any]) => {
            this.emailIndex.set(email, openId);
          });
        }

        console.log(`📂 [UserCache] Loaded ${this.cache.size} users from ${this.cacheFile}`);
      }
    } catch (error) {
      console.error('⚠️ [UserCache] Failed to load from file:', error);
    }
  }

  private saveToFile() {
    try {
      const dir = path.dirname(this.cacheFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const data = {
        users: Object.fromEntries(this.cache.entries()),
        emailIndex: Object.fromEntries(this.emailIndex.entries()),
        savedAt: new Date().toISOString(),
      };

      fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`💾 [UserCache] Saved ${this.cache.size} users to ${this.cacheFile}`);
    } catch (error) {
      console.error('⚠️ [UserCache] Failed to save to file:', error);
    }
  }

  upsert(user: CachedUser): void {
    const now = new Date();
    
    // If user exists, update it
    const existing = this.cache.get(user.openId);
    if (existing) {
      const updated: CachedUser = {
        ...existing,
        ...user,
        createdAt: existing.createdAt, // Keep original creation date
        lastSignedIn: user.lastSignedIn || now,
      };
      this.cache.set(user.openId, updated);
      
      // Update email index if email changed
      if (user.email && user.email !== existing.email) {
        if (existing.email) {
          this.emailIndex.delete(existing.email.toLowerCase());
        }
        this.emailIndex.set(user.email.toLowerCase(), user.openId);
      }
    } else {
      // New user
      const newUser: CachedUser = {
        ...user,
        createdAt: now,
        lastSignedIn: user.lastSignedIn || now,
      };
      this.cache.set(user.openId, newUser);
      
      if (user.email) {
        this.emailIndex.set(user.email.toLowerCase(), user.openId);
      }
    }

    this.saveToFile();
    console.log(`✅ [UserCache] Upserted user: ${user.openId} (${user.email})`);
  }

  getByOpenId(openId: string): CachedUser | undefined {
    return this.cache.get(openId);
  }

  getByEmail(email: string): CachedUser | undefined {
    const normalized = email.toLowerCase();
    const openId = this.emailIndex.get(normalized);
    if (!openId) return undefined;
    return this.cache.get(openId);
  }

  has(openId: string): boolean {
    return this.cache.has(openId);
  }

  hasEmail(email: string): boolean {
    return this.emailIndex.has(email.toLowerCase());
  }

  clear(): void {
    this.cache.clear();
    this.emailIndex.clear();
    this.saveToFile();
  }

  size(): number {
    return this.cache.size;
  }
}

export const userCache = new UserCache();
