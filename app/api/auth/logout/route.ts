import { NextResponse } from 'next/server';
import { clearSessionCookie, getSessionUser } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/db/repository';
import { validateCsrf } from '@/lib/security/csrf';

export async function POST(req: Request) {
  try {
    const csrfCheck = await validateCsrf(req);
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: 'CSRF validation failed.' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (user) {
      await logAuditEvent(user.id, 'LOGOUT', null, req);
    }
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
