import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';
import { setSessionCookie } from '@/lib/auth/session';
import { findUserByEmail, createUser, logAuditEvent } from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`signup_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid registration input' },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeInput(parsed.data.email).toLowerCase();
    const cleanName = parsed.data.name ? sanitizeInput(parsed.data.name) : undefined;
    const passwordValidation = validatePasswordStrength(parsed.data.password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.reason }, { status: 400 });
    }

    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await createUser({
      email: cleanEmail,
      passwordHash,
      name: cleanName,
      role: 'user',
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await setSessionCookie(sessionUser);
    await logAuditEvent(user.id, 'SIGNUP_SUCCESS', { email: cleanEmail }, req);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      message: 'Account created successfully',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
