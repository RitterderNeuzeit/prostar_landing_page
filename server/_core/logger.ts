/**
 * Standardisiertes Logging-System für ProStar Landing Page
 * Version: 1.0.0 - Master Checkpoint
 * 
 * FINAL - Nicht mehr veränderbar ohne Review
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  prefix: string;
  enableDebug?: boolean;
  enableTimestamps?: boolean;
}

class Logger {
  private prefix: string;
  private enableDebug: boolean;
  private enableTimestamps: boolean;

  constructor(config: LoggerConfig) {
    this.prefix = config.prefix;
    this.enableDebug = config.enableDebug ?? process.env.NODE_ENV === 'development';
    this.enableTimestamps = config.enableTimestamps ?? true;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.enableTimestamps ? `[${new Date().toISOString()}]` : '';
    const levelIcon = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    }[level];

    const baseMessage = `${timestamp} ${levelIcon} [${this.prefix}] ${message}`;
    
    if (data !== undefined) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  debug(message: string, data?: any): void {
    if (this.enableDebug) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any): void {
    console.info(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: Error | any): void {
    const errorData = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    
    console.error(this.formatMessage('error', message, errorData));
  }
}

/**
 * Factory-Funktion zur Erstellung von Logger-Instanzen
 */
export function createLogger(prefix: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger({ prefix, ...config });
}

/**
 * Standard-Logger für verschiedene Module
 */
export const loggers = {
  server: createLogger('Server'),
  database: createLogger('Database'),
  email: createLogger('Email'),
  stripe: createLogger('Stripe'),
  auth: createLogger('Auth'),
  course: createLogger('Course'),
  registration: createLogger('Registration')
} as const;
