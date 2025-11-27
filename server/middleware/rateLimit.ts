/**
 * Simple in-memory rate limiter (IP + route key)
 * Not for multi-instance production without external store (e.g. Redis).
 */
import type { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  expiresAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '60000'); // default 60s
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '10'); // default 10 per window

export function rateLimit(keyResolver?: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const keyBase = keyResolver ? keyResolver(req) : req.ip;
    const routeKey = `${keyBase}:${req.path}`;
    const now = Date.now();
    let bucket = buckets.get(routeKey);

    if (!bucket || bucket.expiresAt < now) {
      bucket = { count: 0, expiresAt: now + WINDOW_MS };
      buckets.set(routeKey, bucket);
    }

    bucket.count += 1;
    if (bucket.count > MAX_REQUESTS) {
      res.status(429).json({ success: false, error: 'Rate limit erreicht. Bitte später erneut versuchen.' });
      return;
    }
    next();
  };
}

export function getRateLimitStats() {
  return { buckets: buckets.size };
}
