import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'span', 'div',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'b', 'i'
    ],
    ALLOWED_ATTR: ['class', 'style', 'href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Mask API key for display (show only last 4 characters)
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '••••••••';
  return '••••••••' + key.slice(-4);
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKeyFormat(key: string, provider: string): boolean {
  if (!key) return false;

  switch (provider) {
    case 'openai':
      return key.startsWith('sk-') && key.length > 20;
    case 'gemini':
      return key.length > 20; // Gemini keys don't have a specific prefix
    case 'deepseek':
      return key.length > 20;
    default:
      return key.length > 10;
  }
}

/**
 * Secure localStorage wrapper with encryption (basic obfuscation)
 * Note: This is NOT true encryption, just basic obfuscation
 * For production, use proper encryption or server-side storage
 */
export const secureStorage = {
  setItem(key: string, value: string): void {
    try {
      const encoded = btoa(value); // Basic encoding
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  },

  getItem(key: string): string | null {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      return atob(encoded); // Basic decoding
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};

/**
 * Rate limiting helper for API calls
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequests) return 0;

    const oldestRequest = this.requests[0];
    const timeUntilExpiry = this.timeWindow - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilExpiry);
  }

  reset(): void {
    this.requests = [];
  }
}

/**
 * Content Security Policy helper
 */
export function getCSPMeta(): string {
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com;
  `.replace(/\s+/g, ' ').trim();
}
