import prisma from './prisma';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { hashPassword } from '../auth/password';

// Dynamic storage fallback path (supports local development and serverless /tmp on Vercel)
function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'swasth-data');
  }
  return path.join(process.cwd(), 'data');
}

interface LocalDatabase {
  users: any[];
  profiles: any[];
  conversations: any[];
  messages: any[];
  journals: any[];
  symptomAssessments: any[];
  labReports: any[];
  auditLogs: any[];
}

let inMemoryDb: LocalDatabase | null = null;

function ensureDataDir(): LocalDatabase {
  if (inMemoryDb) return inMemoryDb;
  const dataDir = getDataDir();
  const dataFile = path.join(dataDir, 'local-db.json');
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
      const initial: LocalDatabase = {
        users: [],
        profiles: [],
        conversations: [],
        messages: [],
        journals: [],
        symptomAssessments: [],
        labReports: [],
        auditLogs: [],
      };
      try {
        fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2), 'utf-8');
      } catch {
        // Disk write may be restricted in some serverless modes
      }
      inMemoryDb = initial;
      return initial;
    }
    const raw = fs.readFileSync(dataFile, 'utf-8');
    const parsed = JSON.parse(raw);
    inMemoryDb = parsed;
    return parsed;
  } catch (err) {
    if (!inMemoryDb) {
      inMemoryDb = {
        users: [],
        profiles: [],
        conversations: [],
        messages: [],
        journals: [],
        symptomAssessments: [],
        labReports: [],
        auditLogs: [],
      };
    }
    return inMemoryDb;
  }
}

function writeData(data: LocalDatabase) {
  inMemoryDb = data;
  const dataDir = getDataDir();
  const dataFile = path.join(dataDir, 'local-db.json');
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In serverless environments, inMemoryDb keeps state for the lifetime of the lambda
  }
}

let isPrismaAvailable: boolean | null = null;

async function checkPrisma(): Promise<boolean> {
  if (isPrismaAvailable !== null) return isPrismaAvailable;
  try {
    await prisma.$queryRaw`SELECT 1`;
    isPrismaAvailable = true;
    return true;
  } catch {
    isPrismaAvailable = false;
    return false;
  }
}

// Ensure default demo user exists
export async function ensureDemoUser(): Promise<void> {
  const email = 'demo@swasth.ai';
  const existing = await findUserByEmail(email);
  if (!existing) {
    const passwordHash = await hashPassword('Demo@1234');
    await createUser({
      email,
      passwordHash,
      name: 'Dr. Swasth Demo User',
      role: 'user',
    });
  }
}

// User Operations
export async function findUserByEmail(email: string) {
  const normEmail = email.toLowerCase().trim();
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.user.findUnique({
        where: { email: normEmail },
        include: { profile: true },
      });
    } catch {
      // fallback
    }
  }
  const db = ensureDataDir();
  const user = db.users.find(u => u.email.toLowerCase() === normEmail);
  if (!user) return null;
  const profile = db.profiles.find(p => p.userId === user.id);
  return { ...user, profile };
}

export async function findUserById(id: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: { profile: true },
      });
    } catch {
      // fallback
    }
  }
  const db = ensureDataDir();
  const user = db.users.find(u => u.id === id);
  if (!user) return null;
  const profile = db.profiles.find(p => p.userId === user.id);
  return { ...user, profile };
}

export async function createUser(data: { email: string; passwordHash: string; name?: string; role?: string }) {
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const normEmail = data.email.toLowerCase().trim();
  const userRecord = {
    id,
    email: normEmail,
    passwordHash: data.passwordHash,
    name: data.name || null,
    role: data.role || 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.user.create({
        data: {
          id,
          email: normEmail,
          passwordHash: data.passwordHash,
          name: data.name,
          role: data.role || 'user',
        },
      });
    } catch {
      // fallback
    }
  }

  const db = ensureDataDir();
  db.users.push(userRecord);
  writeData(db);
  return userRecord;
}

export async function deleteUser(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      await prisma.user.delete({ where: { id: userId } });
      return true;
    } catch {
      // fallback
    }
  }

  const db = ensureDataDir();
  const userConvIds = db.conversations.filter(c => c.userId === userId).map(c => c.id);
  db.users = db.users.filter(u => u.id !== userId);
  db.profiles = db.profiles.filter(p => p.userId !== userId);
  db.conversations = db.conversations.filter(c => c.userId !== userId);
  db.messages = db.messages.filter(m => !userConvIds.includes(m.conversationId));
  db.journals = db.journals.filter(j => j.userId !== userId);
  db.symptomAssessments = db.symptomAssessments.filter(s => s.userId !== userId);
  db.labReports = db.labReports.filter(l => l.userId !== userId);
  writeData(db);
  return true;
}

// Profile Operations
export async function getProfile(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.profile.findUnique({ where: { userId } });
    } catch {
      // fallback
    }
  }
  const db = ensureDataDir();
  return db.profiles.find(p => p.userId === userId) || null;
}

export async function upsertProfile(userId: string, data: any) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.profile.upsert({
        where: { userId },
        update: { ...data, updatedAt: new Date() },
        create: { userId, ...data },
      });
    } catch {
      // fallback
    }
  }
  const db = ensureDataDir();
  let existing = db.profiles.find(p => p.userId === userId);
  if (existing) {
    Object.assign(existing, data, { updatedAt: new Date() });
  } else {
    existing = {
      id: `prof_${Date.now()}`,
      userId,
      ...data,
      updatedAt: new Date(),
    };
    db.profiles.push(existing);
  }
  writeData(db);
  return existing;
}

// Conversation & Message Operations
export async function getUserConversations(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.conversation.findMany({
        where: { userId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
        orderBy: { updatedAt: 'desc' },
      });
    } catch {
      // fallback
    }
  }
  const db = ensureDataDir();
  const convs = db.conversations.filter(c => c.userId === userId);
  return convs.map(c => ({
    ...c,
    messages: db.messages
      .filter(m => m.conversationId === c.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  }));
}

export async function getOrCreateConversation(userId: string, conversationId?: string) {
  const usePrisma = await checkPrisma();
  if (conversationId) {
    if (usePrisma) {
      try {
        const found = await prisma.conversation.findFirst({
          where: { id: conversationId, userId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (found) return found;
      } catch {}
    }
    const db = ensureDataDir();
    const found = db.conversations.find(c => c.id === conversationId && c.userId === userId);
    if (found) {
      const messages = db.messages.filter(m => m.conversationId === found.id);
      return { ...found, messages };
    }
  }

  // Create new conversation
  const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  if (usePrisma) {
    try {
      return await prisma.conversation.create({
        data: { id: newId, userId, title: 'Health Consultation' },
        include: { messages: true },
      });
    } catch {}
  }

  const db = ensureDataDir();
  const conv = {
    id: newId,
    userId,
    title: 'Health Consultation',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [],
  };
  db.conversations.push(conv);
  writeData(db);
  return conv;
}

export async function addMessage(data: {
  conversationId: string;
  role: string;
  content: string;
  language?: string;
  redFlagDetected?: boolean;
  sources?: any;
  suggestedFollowUps?: string[];
}) {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      const msg = await prisma.message.create({
        data: {
          id,
          conversationId: data.conversationId,
          role: data.role,
          content: data.content,
          language: data.language || 'en',
          redFlagDetected: data.redFlagDetected || false,
          sources: data.sources ? JSON.stringify(data.sources) : null,
          suggestedFollowUps: data.suggestedFollowUps ? JSON.stringify(data.suggestedFollowUps) : null,
        },
      });
      await prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });
      return msg;
    } catch {}
  }

  const db = ensureDataDir();
  const msgRecord = {
    id,
    conversationId: data.conversationId,
    role: data.role,
    content: data.content,
    language: data.language || 'en',
    redFlagDetected: data.redFlagDetected || false,
    sources: data.sources ? JSON.stringify(data.sources) : null,
    suggestedFollowUps: data.suggestedFollowUps ? JSON.stringify(data.suggestedFollowUps) : null,
    createdAt: new Date(),
  };
  db.messages.push(msgRecord);
  const conv = db.conversations.find(c => c.id === data.conversationId);
  if (conv) conv.updatedAt = new Date();
  writeData(db);
  return msgRecord;
}

export async function deleteUserConversations(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      await prisma.conversation.deleteMany({ where: { userId } });
      return true;
    } catch {}
  }
  const db = ensureDataDir();
  const convIds = db.conversations.filter(c => c.userId === userId).map(c => c.id);
  db.conversations = db.conversations.filter(c => c.userId !== userId);
  db.messages = db.messages.filter(m => !convIds.includes(m.conversationId));
  writeData(db);
  return true;
}

// Journal Operations
export async function getJournalEntries(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.healthJournal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });
    } catch {}
  }
  const db = ensureDataDir();
  return db.journals
    .filter(j => j.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addJournalEntry(userId: string, data: any) {
  const id = `jrnl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.healthJournal.create({
        data: {
          id,
          userId,
          date: data.date ? new Date(data.date) : new Date(),
          symptoms: data.symptoms,
          painLevel: data.painLevel,
          mood: data.mood,
          sleepHours: data.sleepHours,
          waterIntakeLiters: data.waterIntakeLiters,
          systolicBp: data.systolicBp,
          diastolicBp: data.diastolicBp,
          bloodGlucoseMgDl: data.bloodGlucoseMgDl,
          weightKg: data.weightKg,
          notes: data.notes,
        },
      });
    } catch {}
  }

  const db = ensureDataDir();
  const record = {
    id,
    userId,
    date: data.date ? new Date(data.date) : new Date(),
    symptoms: data.symptoms || null,
    painLevel: data.painLevel ?? 0,
    mood: data.mood || 'good',
    sleepHours: data.sleepHours ?? null,
    waterIntakeLiters: data.waterIntakeLiters ?? null,
    systolicBp: data.systolicBp ?? null,
    diastolicBp: data.diastolicBp ?? null,
    bloodGlucoseMgDl: data.bloodGlucoseMgDl ?? null,
    weightKg: data.weightKg ?? null,
    notes: data.notes || '',
    createdAt: new Date(),
  };
  db.journals.push(record);
  writeData(db);
  return record;
}

export async function deleteJournalEntries(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      await prisma.healthJournal.deleteMany({ where: { userId } });
      return true;
    } catch {}
  }
  const db = ensureDataDir();
  db.journals = db.journals.filter(j => j.userId !== userId);
  writeData(db);
  return true;
}

// Symptom Assessments
export async function saveSymptomAssessment(userId: string, data: any) {
  const id = `symp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.symptomAssessment.create({
        data: {
          id,
          userId,
          primarySymptoms: JSON.stringify(data.primarySymptoms || []),
          duration: data.duration,
          severity: data.severity,
          redFlagsDetected: data.redFlagsDetected ? JSON.stringify(data.redFlagsDetected) : null,
          possibleTopics: data.possibleTopics ? JSON.stringify(data.possibleTopics) : null,
          recommendedAction: data.recommendedAction,
          questionsToDoctor: data.questionsToDoctor ? JSON.stringify(data.questionsToDoctor) : null,
        },
      });
    } catch {}
  }

  const db = ensureDataDir();
  const record = {
    id,
    userId,
    primarySymptoms: JSON.stringify(data.primarySymptoms || []),
    duration: data.duration || '',
    severity: data.severity || 'mild',
    redFlagsDetected: data.redFlagsDetected ? JSON.stringify(data.redFlagsDetected) : null,
    possibleTopics: data.possibleTopics ? JSON.stringify(data.possibleTopics) : null,
    recommendedAction: data.recommendedAction || '',
    questionsToDoctor: data.questionsToDoctor ? JSON.stringify(data.questionsToDoctor) : null,
    createdAt: new Date(),
  };
  db.symptomAssessments.push(record);
  writeData(db);
  return record;
}

export async function getSymptomAssessments(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.symptomAssessment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {}
  }
  const db = ensureDataDir();
  return db.symptomAssessments
    .filter(s => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Lab Reports
export async function saveLabReport(userId: string, report: any) {
  const id = `lab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.labReport.create({
        data: {
          id,
          userId,
          fileName: report.fileName,
          testDate: report.testDate ? new Date(report.testDate) : new Date(),
          labName: report.labName,
          overallSummary: report.overallSummary,
          results: {
            create: (report.results || []).map((r: any) => ({
              testName: r.testName,
              numericValue: typeof r.value === 'number' ? r.value : null,
              stringValue: typeof r.value === 'string' ? r.value : null,
              unit: r.unit,
              referenceRange: r.referenceRange,
              status: r.status,
              explanation: r.explanation,
              questionsToAsk: r.questionsToAsk,
            })),
          },
        },
        include: { results: true },
      });
    } catch {}
  }

  const db = ensureDataDir();
  const reportRecord = {
    id,
    userId,
    fileName: report.fileName,
    testDate: report.testDate ? new Date(report.testDate) : new Date(),
    labName: report.labName || '',
    overallSummary: report.overallSummary || '',
    results: (report.results || []).map((r: any, idx: number) => ({
      id: `res_${id}_${idx}`,
      testName: r.testName,
      numericValue: typeof r.value === 'number' ? r.value : null,
      stringValue: typeof r.value === 'string' ? r.value : null,
      unit: r.unit,
      referenceRange: r.referenceRange,
      status: r.status,
      explanation: r.explanation,
      questionsToAsk: r.questionsToAsk,
    })),
    createdAt: new Date(),
  };
  db.labReports.push(reportRecord);
  writeData(db);
  return reportRecord;
}

export async function getLabReports(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      return await prisma.labReport.findMany({
        where: { userId },
        include: { results: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {}
  }
  const db = ensureDataDir();
  return db.labReports
    .filter(l => l.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteLabReports(userId: string) {
  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      await prisma.labReport.deleteMany({ where: { userId } });
      return true;
    } catch {}
  }
  const db = ensureDataDir();
  db.labReports = db.labReports.filter(l => l.userId !== userId);
  writeData(db);
  return true;
}

// Audit Logs
export async function logAuditEvent(userId: string | null, action: string, metadata?: any, req?: Request) {
  let ipAddress = 'unknown';
  let userAgent = 'unknown';
  if (req) {
    ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    userAgent = req.headers.get('user-agent') || 'unknown';
  }

  const usePrisma = await checkPrisma();
  if (usePrisma) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          ipAddress,
          userAgent,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
      return;
    } catch {}
  }

  const db = ensureDataDir();
  db.auditLogs.push({
    id: `audit_${Date.now()}`,
    userId,
    action,
    ipAddress,
    userAgent,
    metadata: metadata ? JSON.stringify(metadata) : null,
    timestamp: new Date(),
  });
  writeData(db);
}
