import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { findUserById, getProfile } from '@/lib/db/repository';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await findUserById(session.id);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const profile = await getProfile(user.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
