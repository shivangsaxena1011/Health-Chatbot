import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../lib/security/sanitize';
import { checkRateLimit } from '../lib/security/rate-limit';

describe('Security & Sanitization Guardrails', () => {
  it('strips script tags and dangerous HTML', () => {
    const malicious = 'Hello <script>alert("xss")</script> World';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).toContain('Hello');
    expect(cleaned).toContain('World');
  });

  it('enforces maximum length boundaries on inputs', () => {
    const longString = 'a'.repeat(5000);
    const cleaned = sanitizeInput(longString, 100);
    expect(cleaned.length).toBe(100);
  });

  it('enforces rate limits per identifier', () => {
    const testId = `test_ratelimit_${Date.now()}`;
    const opts = { limit: 3, windowMs: 10000 };

    expect(checkRateLimit(testId, opts).allowed).toBe(true);
    expect(checkRateLimit(testId, opts).allowed).toBe(true);
    expect(checkRateLimit(testId, opts).allowed).toBe(true);

    const fourth = checkRateLimit(testId, opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });
});
