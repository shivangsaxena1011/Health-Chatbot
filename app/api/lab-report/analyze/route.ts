import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { saveLabReport, getLabReports } from '@/lib/db/repository';
import { parseLabReportText } from '@/lib/lab/lab-parser';
import { sanitizeInput } from '@/lib/security/sanitize';
import { validateCsrf } from '@/lib/security/csrf';

const labSchema = z.object({
  reportText: z.string().min(1, 'Please provide report text to analyze'),
  fileName: z.string().optional().default('Blood_Investigation_Report.pdf'),
  labName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const csrfCheck = await validateCsrf(req);
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: 'CSRF validation failed.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = labSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid lab report data' },
        { status: 400 }
      );
    }

    const cleanText = sanitizeInput(parsed.data.reportText, 20000);
    const analysis = parseLabReportText(cleanText);
    analysis.fileName = parsed.data.fileName;
    if (parsed.data.labName) {
      analysis.labName = sanitizeInput(parsed.data.labName);
    }

    const session = await getSessionUser();
    let savedReport = null;
    if (session) {
      savedReport = await saveLabReport(session.id, analysis);
    }

    return NextResponse.json({
      success: true,
      analysis,
      savedId: savedReport?.id || null,
    });
  } catch (error: any) {
    console.error('Lab report analysis error:', error);
    return NextResponse.json(
      { error: 'An error occurred during lab report analysis.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ reports: [] });
    }
    const reports = await getLabReports(session.id);
    return NextResponse.json(
      { reports },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, private' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab reports' }, { status: 500 });
  }
}
