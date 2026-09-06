import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser, clearSessionCookie } from '@/lib/auth/session';
import {
  deleteUserConversations,
  deleteJournalEntries,
  deleteLabReports,
  upsertProfile,
  deleteUser,
  logAuditEvent,
} from '@/lib/db/repository';
import { validateCsrf } from '@/lib/security/csrf';

const deleteSchema = z.object({
  target: z.enum(['chats', 'journal', 'lab_reports', 'profile', 'account']),
});

export async function POST(req: Request) {
  try {
    const csrfCheck = await validateCsrf(req);
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: 'CSRF validation failed.' }, { status: 403 });
    }

    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid deletion target' }, { status: 400 });
    }

    const target = parsed.data.target;

    switch (target) {
      case 'chats':
        await deleteUserConversations(session.id);
        await logAuditEvent(session.id, 'DELETE_CHAT_HISTORY', null, req);
        return NextResponse.json({ success: true, message: 'All chat conversations deleted permanently.' });

      case 'journal':
        await deleteJournalEntries(session.id);
        await logAuditEvent(session.id, 'DELETE_JOURNAL_ENTRIES', null, req);
        return NextResponse.json({ success: true, message: 'All health journal logs deleted permanently.' });

      case 'lab_reports':
        await deleteLabReports(session.id);
        await logAuditEvent(session.id, 'DELETE_LAB_REPORTS', null, req);
        return NextResponse.json({ success: true, message: 'All uploaded lab reports deleted permanently.' });

      case 'profile':
        await upsertProfile(session.id, {
          age: null,
          sex: null,
          heightCm: null,
          weightKg: null,
          bloodType: null,
          allergies: null,
          chronicConditions: null,
          currentMedications: null,
          emergencyContactName: null,
          emergencyContactPhone: null,
        });
        await logAuditEvent(session.id, 'CLEAR_HEALTH_PROFILE', null, req);
        return NextResponse.json({ success: true, message: 'Health profile cleared successfully.' });

      case 'account':
        await logAuditEvent(session.id, 'DELETE_ACCOUNT_COMPLETE', null, req);
        await deleteUser(session.id);
        await clearSessionCookie();
        return NextResponse.json({ success: true, message: 'User account and all health data deleted permanently.' });

      default:
        return NextResponse.json({ error: 'Unsupported target' }, { status: 400 });
    }
  } catch (error) {
    console.error('Data deletion error:', error);
    return NextResponse.json({ error: 'An error occurred during data deletion' }, { status: 500 });
  }
}
