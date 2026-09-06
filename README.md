# Swasth AI 2.0 — Advanced AI Health Awareness & Assistance Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **IMPORTANT MEDICAL DISCLAIMER**: Swasth AI 2.0 is an evidence-grounded health awareness, education, and triage assistance platform. **It does NOT provide medical diagnosis, clinical treatment plans, or prescription recommendations, and is not a substitute for a qualified medical doctor or emergency services.** If you are experiencing a medical emergency (such as severe chest pain, stroke symptoms, difficulty breathing, or heavy bleeding), stop using this app and call emergency services (**112 in India, 911 in the US, 999 in the UK**) immediately.

---

## 1. Project Overview & Problem Statement

### The Problem in Legacy Health Chatbots
Early health chatbot implementations (including Swasth AI 1.0) faced major structural weaknesses:
1. **Frontend API Key Exposure**: Secrets like `GEMINI_API_KEY` were bundled into client JavaScript, allowing anyone to extract keys via DevTools.
2. **Mock Authentication**: Used `localStorage` flags without real password hashing, server-side session cookies, or CSRF defense.
3. **Pseudo Semantic Search**: Claimed semantic retrieval but only fed hardcoded system prompts to an LLM without authentic vector embeddings or knowledge indexing.
4. **Ungrounded Hallucinations**: Generic LLMs hallucinated medical facts and invented clinical advice without verifiable citations from recognized authorities.
5. **No Red-Flag Safety Layer**: Relied entirely on non-deterministic LLM tokens for emergency detection, risking burying life-threatening alerts in paragraphs of text.

### The Solution: Swasth AI 2.0
Swasth AI 2.0 transforms the prototype into a production-grade, full-stack health awareness architecture:
- **Server-Side AI Gateway**: All Google Gemini 2.5 calls execute exclusively on the Next.js server layer.
- **Genuine Medical RAG Pipeline**: Ingests authoritative clinical factsheets from the **WHO, CDC, NIH / MedlinePlus, and NHS** with vector embeddings and cosine similarity retrieval.
- **Bcrypt & HttpOnly Sessions**: Industrial password hashing (bcrypt, salt rounds 12) with tamper-resistant JWTs stored in HttpOnly, SameSite cookies.
- **Deterministic Emergency Engine**: Real-time rule-based classifier that intercepts red flags (cardiac, stroke, respiratory, anaphylaxis, self-harm) and immediately displays local emergency phone numbers.
- **Interactive Health Modules**: Guided Symptom Awareness Checker, Lab Report Analyzer with preserved lab reference ranges, Medicine Information & Multi-Drug Interaction Checker, Health Journal with vitals tracking, and a full Privacy Center.

---

## 2. Key Features

| Feature | Description |
| :--- | :--- |
| **AI Health Chat** | Conversational assistant grounded in medical evidence with suggested follow-ups and source citations. |
| **Medical RAG Engine** | Semantic vector similarity search retrieving vetted public-health literature. |
| **Symptom Checker** | Multi-step triage wizard analyzing duration, severity, fever, and red-flags. |
| **Emergency Engine** | Deterministic detection of life-threatening signs with regional 112/911 helpline routing. |
| **Voice Assistant** | Hands-free MediaRecorder speech input & Web Speech API text-to-speech audio output. |
| **Multilingual Engine** | Native support for English, Hindi (हिन्दी), Spanish, French, German, Chinese, and Arabic + Hinglish. |
| **Lab Report Analyzer** | Extracts test parameters (Hb, Glucose, TSH, Platelets) preserving lab reference intervals. |
| **Medicine Catalog** | Pharmacology database with indications, precautions, side effects, and warnings. |
| **Drug Interaction Checker** | Multi-drug safety evaluator flagging major/moderate clinical interactions (e.g. Aspirin + Ibuprofen). |
| **Health Journal** | Daily tracking of blood pressure, blood glucose, sleep, pain scale, and lifestyle trends. |
| **Health Dashboard** | Central command center showing vitals overviews, recent symptoms, and quick action cards. |
| **Health Summary Report** | Printable/exportable patient health record designed for doctor appointment discussions. |
| **PWA Web App Installation** | Installable Progressive Web App on Mobile (Android & iOS Safari) and Desktop (Chrome/Edge/Mac/PC) with offline shell. |
| **Privacy & Security Center** | Granular data deletion (chats, journal, reports, profile, or account wipe) and GDPR JSON export. |

---

## 3. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Browser                                │
│  - React 19 + Tailwind CSS + Lucide Icons                               │
│  - Multilingual Selector (7 Languages + Hinglish)                       │
│  - Voice Input (MediaRecorder / Web Speech API)                         │
│  - Text-to-Speech Output Toggle (Web Speech Synthesis)                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS + HttpOnly Session Cookie
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Next.js 15 Server Layer (API Routes)                 │
│  - Rate Limiter (sliding-window per IP/User identifier)                │
│  - Zod Input Sanitization & Content Security Guardrails                 │
│  - Session Authentication Middleware (Bcrypt + JWT)                     │
└───────┬────────────────────────────┬────────────────────────────┬───────┘
        │                            │                            │
        ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│ Auth & Users │             │ Safety Layer │             │ Medical RAG  │
│ - bcrypt     │             │ - Red-Flag   │             │ - Embeddings │
│ - HttpOnly   │             │   Classifier │             │ - Vector Sim │
│ - Audit Logs │             │ - Non-Diag   │             │ - WHO, CDC,  │
└───────┬──────┘             │   Guardrails │             │   NIH docs   │
        │                    └───────┬──────┘             └───────┬──────┘
        ▼                            ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Google Gemini 2.5 Flash / Grounded AI                │
│ - Server-Side Google GenAI SDK (Zero browser API key exposure)          │
│ - Strict non-diagnostic system prompts & evidence citation grounding    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Data Persistence Layer                          │
│  - Prisma ORM configured for PostgreSQL + pgvector                      │
│  - High-availability hybrid fallback for zero-dependency local dev     │
│  - Models: User, Profile, Conversation, Message, HealthJournal,         │
│            SymptomAssessment, LabReport, LabResult, AuditLog            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Medical Knowledge RAG Architecture

```
User Query: "My sugar is high and I feel very thirsty all the time"
       ↓
Query Normalization & Semantic Concept Mapping (sugar → Diabetes Mellitus)
       ↓
Vector Embedding Generation (Dense 128-dimensional vector space)
       ↓
Cosine Similarity Retrieval over Trusted Corpus:
  • WHO Diabetes Factsheet
  • CDC Prediabetes & Glucose Screening
  • NIH MedlinePlus Diabetes Symptoms
       ↓
Context Assembly:
  [Source 1: WHO - Diabetes Factsheet] + [User Clinical Profile]
       ↓
Google Gemini 2.5 Flash (Server-Side)
       ↓
Post-Processing Non-Diagnostic Safety Check
       ↓
Structured Output:
  • Summary (Educational overview)
  • What This Can Mean (Metabolic explanations)
  • Common Symptoms & Signs (Polyuria, polydipsia)
  • General Low-Risk Guidance (Hydration, lifestyle)
  • When to Seek Medical Attention (Red flags)
  • Trusted Sources with Verified Links ([WHO], [CDC])
  • Medical Disclaimer
```

---

## 5. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Plus Jakarta Sans.
- **Backend**: Next.js API Routes (Node.js runtime), Zod schema validation, sliding-window rate limiting.
- **AI & NLP**: Google GenAI SDK (`@google/genai`, `gemini-2.5-flash`), server-side RAG vector retriever.
- **Security & Auth**: Bcrypt.js (12 salt rounds), JSON Web Tokens (`jsonwebtoken`), HttpOnly secure session cookies.
- **Database & ORM**: PostgreSQL, Prisma ORM 6, resilient hybrid persistence adapter for local preview.
- **Testing**: Vitest 3.2 (26 comprehensive automated test suites).

---

## 6. Installation & Local Development

### Prerequisites
- Node.js 18.x, 20.x, or 22+ (tested on Node v24)
- npm or pnpm
- (Optional) PostgreSQL instance with pgvector

### Step 1: Clone Repository
```bash
git clone https://github.com/shivangsaxena1011/Health-Chatbot.git
cd Health-Chatbot
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the variables:
```env
# Database connection (PostgreSQL with pgvector)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swasth_ai_db?schema=public"

# Google Gemini API Key (Server-Side ONLY)
GEMINI_API_KEY="your-gemini-api-key"

# JWT Secret for Session Cookies
AUTH_SECRET="swasth_super_secure_jwt_secret_change_in_production_min_32_chars"

# Node Environment
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_EMERGENCY_COUNTRY="IN"
```

### Step 4: Seed Database
Populates the demo user account and medical corpus:
```bash
npm run db:seed
```
Pre-configured demo credentials:
- **Email**: `demo@swasth.ai`
- **Password**: `Demo@1234`

### Step 5: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Verification & Build

Run TypeScript type check:
```bash
npm run type-check
```

Run production build:
```bash
npm run build
```

---

## 8. Deployment

Swasth AI 2.0 is built natively for standard serverless or containerized deployment:
- **Vercel**: Deploy with one click; configure `DATABASE_URL`, `GEMINI_API_KEY`, and `AUTH_SECRET` in Project Settings.
- **Render / Railway / Docker**: Use standard Node.js runtime or `Dockerfile` with `npm run build && npm start`.
- **Database**: Connect to any managed PostgreSQL instance (Supabase, Neon, AWS RDS, Railway Postgres).

---

## 9. Privacy, Security & Data Sovereignty

- **Zero Client Key Exposure**: Browser clients never receive or execute Gemini credentials.
- **HttpOnly Cookies**: Prevents JavaScript XSS theft of session credentials.
- **Audit Logging**: Sensitive actions (login, export, data wipe) write immutable audit logs.
- **Self-Service Deletion**: Users can purge chats, journals, lab reports, profile, or their entire account with one click.
- **GDPR / HIPAA Alignment**: Transparent data handling, zero commercial data sharing, and full JSON data portability.

---

## 10. What Swasth AI 2.0 DOES and DOES NOT Do

| What Swasth AI 2.0 DOES | What Swasth AI 2.0 DOES NOT Do |
| :--- | :--- |
| ✅ Provide public-health evidence from WHO & CDC | ❌ Formulate a formal medical diagnosis |
| ✅ Explain common medical lab test parameters | ❌ Prescribe prescription drugs or dosages |
| ✅ Flag emergency red-flag symptoms with helplines | ❌ Replace an emergency room or hospital care |
| ✅ Offer guided symptom awareness questions | ❌ Make unsupported health claims |
| ✅ Help users prepare informed questions for doctors | ❌ Act as a licensed doctor-patient relationship |

---

## 11. Author, Lead Architect & Contact

**Swasth AI 2.0** was architected and built by:

- **Developer & Architect**: Shivang Saxena
- **Email**: [shivangsaxena102006@gmail.com](mailto:shivangsaxena102006@gmail.com)
- **LinkedIn**: [https://www.linkedin.com/in/shivang-saxena1/](https://www.linkedin.com/in/shivang-saxena1/)
- **GitHub Profile**: [@shivangsaxena1011](https://github.com/shivangsaxena1011)
- **Project Repository**: [https://github.com/shivangsaxena1011/Health-Chatbot](https://github.com/shivangsaxena1011/Health-Chatbot)
- **In-App About & Contact**: Visit the live `/about` page to view platform architecture highlights or submit direct feedback.

---

## 12. License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

