interface RateLimitRecord {
  timestamps: number[];
}

const tracker = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of tracker.entries()) {
      record.timestamps = record.timestamps.filter(ts => now - ts < 60000);
      if (record.timestamps.length === 0) {
        tracker.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowMs?: number; // window in ms
}

export function getClientIp(req?: Request): string {
  if (!req) return '127.0.0.1';
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Return first client IP in chain
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = options.limit ?? 20;
  const windowMs = options.windowMs ?? 60000;
  const now = Date.now();

  let record = tracker.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    tracker.set(identifier, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetTime = oldest ? oldest + windowMs : now + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetTime: now + windowMs,
  };
}

/**
 * Brute-force protection for authentication endpoints (Login/Signup).
 * Max 5 failed/incoming requests per 10 minutes per IP.
 */
export function checkAuthRateLimit(ip: string) {
  return checkRateLimit(`auth_${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
}

/**
 * AI Query rate limit to protect LLM quota and server performance.
 * Max 20 requests per 1 minute.
 */
export function checkChatRateLimit(identifier: string) {
  return checkRateLimit(`chat_${identifier}`, { limit: 20, windowMs: 60 * 1000 });
}
