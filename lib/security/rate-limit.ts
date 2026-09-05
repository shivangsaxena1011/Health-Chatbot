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

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = options.limit ?? 20; // 20 requests
  const windowMs = options.windowMs ?? 60000; // per 1 minute
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
    remaining: limit - record.timestamps.length,
    resetTime: now + windowMs,
  };
}
