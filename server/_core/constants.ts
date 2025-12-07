/**
 * Zentrale Konstanten für ProStar Landing Page
 * Version: 1.0.0 - Master Checkpoint
 * 
 * FINAL - Nicht mehr veränderbar ohne Review
 */

/**
 * Kurs-Konfiguration
 */
export const COURSE_CONFIG = {
  NAME: 'ProStar AI Kurs',
  PRICE: 497,
  CURRENCY: 'EUR',
  ACCESS_KEY_LENGTH: 8,
  ACCESS_KEY_EXPIRY_DAYS: 365,
  MAX_REGISTRATION_ATTEMPTS: 3
} as const;

/**
 * Email-Konfiguration
 */
export const EMAIL_CONFIG = {
  FROM_NAME: 'ProStar AI',
  SUBJECT_PREFIX: '[ProStar AI]',
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
  TIMEOUT_MS: 10000
} as const;

/**
 * Server-Konfiguration
 */
export const SERVER_CONFIG = {
  DEFAULT_PORT: 3000,
  PORT_RANGE_START: 3000,
  PORT_RANGE_END: 3010,
  CORS_MAX_AGE: 86400,
  SESSION_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 Tage
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 Minuten
  RATE_LIMIT_MAX_REQUESTS: 100
} as const;

/**
 * Datenbank-Konfiguration
 */
export const DATABASE_CONFIG = {
  CONNECTION_TIMEOUT_MS: 10000,
  QUERY_TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000
} as const;

/**
 * Stripe-Konfiguration
 */
export const STRIPE_CONFIG = {
  SUCCESS_URL_PATH: '/success',
  CANCEL_URL_PATH: '/',
  CHECKOUT_SESSION_EXPIRY_HOURS: 24
} as const;

/**
 * Validierungs-Regeln
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  ACCESS_KEY_FORMAT: /^[A-Z0-9]{8}$/
} as const;

/**
 * Cache-Konfiguration
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 5 * 60 * 1000, // 5 Minuten
  REGISTRATION_TTL_MS: 30 * 60 * 1000, // 30 Minuten
  MAX_CACHE_SIZE: 1000
} as const;

/**
 * Pfade und URLs
 */
export const PATHS = {
  CLIENT_DIST: 'dist',
  PUBLIC_ASSETS: 'client/public',
  CONTENT: 'content',
  DRIZZLE_MIGRATIONS: 'drizzle/migrations'
} as const;

/**
 * Feature-Flags
 */
export const FEATURES = {
  ENABLE_STRIPE: true,
  ENABLE_EMAIL: true,
  ENABLE_REGISTRATION_CACHE: true,
  ENABLE_DATABASE: true,
  ENABLE_ANALYTICS: false
} as const;
