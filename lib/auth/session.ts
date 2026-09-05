import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'swasth_session';
const DEFAULT_SECRET = 'swasth_super_secure_jwt_secret_change_in_production_min_32_chars';

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export function signToken(user: SessionUser): string {
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
    const decoded = jwt.verify(token, secret) as any;
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
