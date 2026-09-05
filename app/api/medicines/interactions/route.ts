import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkDrugInteractions } from '@/lib/medicines/medicine-service';
import { sanitizeInput } from '@/lib/security/sanitize';

const interactionSchema = z.object({
  medicines: z.array(z.string()).min(2, 'Please select at least two medicines to evaluate interactions'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = interactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid medication list' },
        { status: 400 }
      );
    }

    const cleanList = parsed.data.medicines.map(m => sanitizeInput(m));
    const interactions = checkDrugInteractions(cleanList);

    return NextResponse.json({
      success: true,
      interactions,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze drug interactions' }, { status: 500 });
  }
}
