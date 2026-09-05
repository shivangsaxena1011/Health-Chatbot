import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../lib/auth/password';
import { signToken, verifyToken } from '../lib/auth/session';

describe('Authentication & Security Layer', () => {
  it('hashes passwords using bcrypt and verifies correctly', async () => {
    const raw = 'SuperSecret1234!';
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    expect(hashed.startsWith('$2')).toBe(true);

    const match = await verifyPassword(raw, hashed);
    expect(match).toBe(true);

    const wrongMatch = await verifyPassword('WrongPassword123!', hashed);
    expect(wrongMatch).toBe(false);
  });

  it('validates password strength rules', () => {
    expect(validatePasswordStrength('short').valid).toBe(false);
    expect(validatePasswordStrength('nouppercase123').valid).toBe(false);
    expect(validatePasswordStrength('NOLOWERCASE123').valid).toBe(false);
    expect(validatePasswordStrength('NoDigitsHere!').valid).toBe(false);
    expect(validatePasswordStrength('ValidPass1234!').valid).toBe(true);
  });

  it('signs and verifies JWT tokens securely', () => {
    const user = {
      id: 'test_user_123',
      email: 'tester@swasth.ai',
      name: 'Test Pilot',
      role: 'user',
    };

    const token = signToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(user.id);
    expect(decoded?.email).toBe(user.email);
  });

  it('rejects tampered tokens', () => {
    const user = { id: 'u1', email: 'u1@swasth.ai', role: 'user' };
    const token = signToken(user);
    const tampered = token.slice(0, -5) + 'abcde';
    expect(verifyToken(tampered)).toBeNull();
  });
});
