import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { getProfile, upsertProfile } from '@/lib/db/repository';
import { sanitizeInput } from '@/lib/security/sanitize';

const profileSchema = z.object({
  age: z.number().min(1).max(120).optional(),
  sex: z.string().optional(),
  heightCm: z.number().min(30).max(280).optional(),
  weightKg: z.number().min(2).max(400).optional(),
  bloodType: z.string().optional(),
  allergies: z.string().max(500).optional(),
  chronicConditions: z.string().max(500).optional(),
  currentMedications: z.string().max(500).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(50).optional(),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const profile = await getProfile(session.id);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid profile data' },
        { status: 400 }
      );
    }

    const cleanData: any = {};
    for (const [key, value] of Object.entries(parsed.data)) {
      if (typeof value === 'string') {
        cleanData[key] = sanitizeInput(value);
      } else {
        cleanData[key] = value;
      }
    }

    const profile = await upsertProfile(session.id, cleanData);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
