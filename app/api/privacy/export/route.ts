import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import {
  findUserById,
  getProfile,
  getUserConversations,
  getJournalEntries,
  getSymptomAssessments,
  getLabReports,
  logAuditEvent,
} from '@/lib/db/repository';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const [user, profile, conversations, journals, assessments, labReports] = await Promise.all([
      findUserById(session.id),
      getProfile(session.id),
      getUserConversations(session.id),
      getJournalEntries(session.id),
      getSymptomAssessments(session.id),
      getLabReports(session.id),
    ]);

    await logAuditEvent(session.id, 'EXPORT_PERSONAL_DATA', null, req);

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      platform: 'Swasth AI 2.0',
      gdprDataExport: true,
      account: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        createdAt: user?.createdAt,
      },
      healthProfile: profile,
      chatConversations: conversations,
      healthJournalEntries: journals,
      symptomAssessments: assessments,
      laboratoryReports: labReports,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="swasth_health_data_export_${Date.now()}.json"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Failed to generate data export' }, { status: 500 });
  }
}
