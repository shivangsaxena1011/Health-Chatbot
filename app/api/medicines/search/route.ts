import { NextResponse } from 'next/server';
import { searchMedicines } from '@/lib/medicines/medicine-service';
import { sanitizeInput } from '@/lib/security/sanitize';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = sanitizeInput(searchParams.get('q') || '');
    const results = searchMedicines(query);
    return NextResponse.json({
      success: true,
      medicines: results,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search medicines' }, { status: 500 });
  }
}
