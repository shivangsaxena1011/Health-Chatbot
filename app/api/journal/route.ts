import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { getJournalEntries, addJournalEntry } from '@/lib/db/repository';
import { sanitizeInput } from '@/lib/security/sanitize';
import { validateCsrf } from '@/lib/security/csrf';

const journalSchema = z.object({
  date: z.string().optional(),
  symptoms: z.string().optional(),
  painLevel: z.number().min(0).max(10).optional().default(0),
  mood: z.enum(['good', 'neutral', 'poor', 'anxious', 'tired']).optional().default('good'),
  sleepHours: z.number().min(0).max(24).optional(),
  waterIntakeLiters: z.number().min(0).max(20).optional(),
  systolicBp: z.number().min(50).max(300).optional(),
  diastolicBp: z.number().min(30).max(200).optional(),
  bloodGlucoseMgDl: z.number().min(20).max(800).optional(),
  weightKg: z.number().min(10).max(400).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const entries = await getJournalEntries(session.id);
    return NextResponse.json(
      { success: true, entries },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, private' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

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
    const parsed = journalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid journal entry' },
        { status: 400 }
      );
    }

    const cleanData = {
      ...parsed.data,
      symptoms: parsed.data.symptoms ? sanitizeInput(parsed.data.symptoms) : undefined,
      notes: parsed.data.notes ? sanitizeInput(parsed.data.notes) : undefined,
    };

    const entry = await addJournalEntry(session.id, cleanData);
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record journal entry' }, { status: 500 });
  }
}
