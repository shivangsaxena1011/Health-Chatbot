export function sanitizeInput(input: unknown, maxLength: number = 4000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Trim whitespace
  let clean = input.trim();

  // Enforce max length
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  // Strip null bytes and dangerous control characters
  clean = clean.replace(/\0/g, '');

  // Strip obvious script tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return clean;
}
