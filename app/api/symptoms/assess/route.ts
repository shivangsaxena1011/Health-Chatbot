import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { saveSymptomAssessment } from '@/lib/db/repository';
import { assessSymptoms } from '@/lib/symptoms/symptom-checker';
import { sanitizeInput } from '@/lib/security/sanitize';

const symptomSchema = z.object({
  symptoms: z.array(z.string()).min(1, 'Please select at least one symptom'),
  duration: z.string().default('1-3 days'),
  severity: z.enum(['mild', 'moderate', 'severe']).default('mild'),
  feverPresent: z.boolean().default(false),
  difficultyBreathing: z.boolean().default(false),
  chestPain: z.boolean().default(false),
  additionalNotes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = symptomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid assessment parameters' },
        { status: 400 }
      );
    }

    const cleanInput = {
      ...parsed.data,
      symptoms: parsed.data.symptoms.map(s => sanitizeInput(s)),
      additionalNotes: parsed.data.additionalNotes ? sanitizeInput(parsed.data.additionalNotes) : undefined,
    };

    const assessment = assessSymptoms(cleanInput);

    // Persist if authenticated
    const session = await getSessionUser();
    if (session) {
      await saveSymptomAssessment(session.id, {
        primarySymptoms: cleanInput.symptoms,
        duration: cleanInput.duration,
        severity: cleanInput.severity,
        redFlagsDetected: assessment.emergencyReasons,
        possibleTopics: assessment.possibleTopics.map(t => t.condition),
        recommendedAction: assessment.recommendedAction,
        questionsToDoctor: assessment.questionsForDoctor,
      });
    }

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error: any) {
    console.error('Symptom assessment error:', error);
    return NextResponse.json(
      { error: 'An error occurred during symptom assessment processing.' },
      { status: 500 }
    );
  }
}
