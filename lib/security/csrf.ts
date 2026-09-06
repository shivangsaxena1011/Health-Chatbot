import { headers } from 'next/headers';

/**
 * Validates request origin against allowed host to prevent Cross-Site Request Forgery (CSRF).
 * Browsers always send 'Origin' or 'Referer' on fetch/form POST/PUT/DELETE requests.
 */
export async function validateCsrf(req?: Request): Promise<{ valid: boolean; reason?: string }> {
  // Safe methods don't require CSRF validation
  if (req && ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return { valid: true };
  }

  const headerStore = await headers();
  const origin = req ? req.headers.get('origin') : headerStore.get('origin');
  const host = req ? req.headers.get('host') : headerStore.get('host');
  const referer = req ? req.headers.get('referer') : headerStore.get('referer');
  const customHeader = req ? req.headers.get('x-requested-with') : headerStore.get('x-requested-with');

  // If custom X-Requested-With header is present (standard for SPA fetch requests),
  // browser security model prevents simple cross-origin forms from setting it without CORS preflight
  if (customHeader) {
    return { valid: true };
  }

  // Check Origin if present
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (host && originUrl.host.toLowerCase() === host.toLowerCase()) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: 'Invalid origin header format' };
    }
  }

  // Check Referer fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (host && refererUrl.host.toLowerCase() === host.toLowerCase()) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: 'Invalid referer header format' };
    }
  }

  // In standard local development or when origin matches
  if (process.env.NODE_ENV !== 'production') {
    return { valid: true };
  }

  // If both origin and referer are absent on a state-changing mutation in production, fail safely
  if (!origin && !referer) {
    return { valid: false, reason: 'Missing CSRF origin or referer header' };
  }

  return { valid: false, reason: 'Cross-origin request rejected' };
}
