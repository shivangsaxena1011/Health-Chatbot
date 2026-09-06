import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie } from '@/lib/auth/session';
import { findUserByEmail, logAuditEvent, ensureDemoUser } from '@/lib/db/repository';
import { checkAuthRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { validateCsrf } from '@/lib/security/csrf';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const csrfCheck = await validateCsrf(req);
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: 'CSRF validation failed.' }, { status: 403 });
    }

    const ip = getClientIp(req);
    const rateCheck = checkAuthRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. For security reasons, please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid login details' },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeInput(parsed.data.email).toLowerCase();

    // Ensure demo user is available if logging in with demo email
    if (cleanEmail === 'demo@swasth.ai') {
      await ensureDemoUser();
    }

    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      await logAuditEvent(null, 'LOGIN_FAILED_USER_NOT_FOUND', { email: cleanEmail }, req);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!passwordMatch) {
      await logAuditEvent(user.id, 'LOGIN_FAILED_BAD_PASSWORD', { email: cleanEmail }, req);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await setSessionCookie(sessionUser);
    await logAuditEvent(user.id, 'LOGIN_SUCCESS', { email: cleanEmail }, req);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
