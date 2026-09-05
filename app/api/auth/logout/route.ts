import { NextResponse } from 'next/server';
import { clearSessionCookie, getSessionUser } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/db/repository';

export async function POST(req: Request) {
  try {
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
