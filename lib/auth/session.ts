import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'swasth_session';
const DEFAULT_AUTH_SECRET = 'swasth_ai_production_resilient_jwt_secret_token_key_2026_secure_hash';

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  return DEFAULT_AUTH_SECRET;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export function signToken(user: SessionUser): string {
  const secret = getAuthSecret();
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const secret = getAuthSecret();
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as any;
    if (!decoded || !decoded.sub) return null;
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user',
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
