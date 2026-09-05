import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth/session';
import { getProfile, getOrCreateConversation, addMessage } from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { detectEmergency } from '@/lib/ai/emergency-engine';
import { retrieveRelevantMedicalContext } from '@/lib/rag/retriever';
import { aiProvider } from '@/lib/ai/gemini-provider';

const chatSchema = z.object({
  query: z.string().min(1, 'Please enter a health inquiry').max(4000),
  language: z.string().default('English'),
  conversationId: z.string().optional(),
  history: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const identifier = session ? `user_${session.id}` : `ip_${req.headers.get('x-forwarded-for') || '127.0.0.1'}`;

    const rateCheck = checkRateLimit(identifier, { limit: 30, windowMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'AI request limit reached. Please wait a moment before sending another query.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid request format' },
        { status: 400 }
      );
    }

    const cleanQuery = sanitizeInput(parsed.data.query);
    const targetLanguage = parsed.data.language || 'English';

    // 1. Fetch user health profile if logged in
    let profileData: any = undefined;
    let conversation: any = null;

    if (session) {
      const prof = await getProfile(session.id);
      if (prof) {
        profileData = {
          age: prof.age,
          sex: prof.sex,
          chronicConditions: prof.chronicConditions,
          allergies: prof.allergies,
          currentMedications: prof.currentMedications,
        };
      }
      conversation = await getOrCreateConversation(session.id, parsed.data.conversationId);
      // Persist user message
      await addMessage({
        conversationId: conversation.id,
        role: 'user',
        content: cleanQuery,
        language: targetLanguage,
      });
    }

    // 2. Deterministic Emergency / Red-flag check
    const emergencyInfo = detectEmergency(cleanQuery);

    // 3. Medical Knowledge Retrieval (RAG)
    const retrievedDocs = retrieveRelevantMedicalContext(cleanQuery, 3);

    // 4. Generate AI Health Awareness response via server-side Gemini/grounded engine
    const aiResponse = await aiProvider.generateHealthResponse({
      messages: parsed.data.history,
      query: cleanQuery,
      language: targetLanguage,
      userProfile: profileData,
      retrievedDocs,
      redFlagInfo: emergencyInfo.isEmergency ? emergencyInfo : undefined,
    });

    // 5. Persist assistant message if authenticated
    if (session && conversation) {
      await addMessage({
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse.content,
        language: targetLanguage,
        redFlagDetected: emergencyInfo.isEmergency,
        sources: aiResponse.sources,
        suggestedFollowUps: aiResponse.suggestedFollowUps,
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation?.id || null,
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: aiResponse.content,
        language: targetLanguage,
        timestamp: new Date().toISOString(),
        redFlagDetected: emergencyInfo.isEmergency,
        emergencyInfo: emergencyInfo.isEmergency ? emergencyInfo : undefined,
        sources: aiResponse.sources,
        suggestedFollowUps: aiResponse.suggestedFollowUps,
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An unexpected technical issue occurred while connecting to the Swasth AI knowledge base.' },
      { status: 500 }
    );
  }
}
