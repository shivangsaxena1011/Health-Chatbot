'use client';

import React from 'react';
import {
  Brain,
  Languages,
  Mic,
  ShieldAlert,
  Database,
  Search,
  CheckCircle2,
  FileText,
  HeartPulse,
} from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-100">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                How Swasth AI 2.0 Works
              </h1>
              <p className="text-xs text-slate-500">
                Evidence-grounded medical RAG, real-time safety classification, and semantic intelligence.
              </p>
            </div>
          </div>
          <Disclaimer compact />
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Real Medical Knowledge RAG
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike chatbots that hallucinate or rely purely on generic training data, Swasth AI 2.0 retrieves passages from authoritative public health entities: the World Health Organization (WHO), Centers for Disease Control (CDC), NIH MedlinePlus, and the NHS.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Semantic Vector Understanding
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our embedding pipeline maps natural paraphrases and colloquial descriptions to formal clinical concepts. If a user asks about &quot;sugar problem&quot; or &quot;bp badha hua hai,&quot; vector cosine similarity retrieves evidence on Diabetes Mellitus and Hypertension.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Deterministic Emergency Guardrails
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Emergency detection does not depend solely on AI whims. A deterministic safety engine intercepts red-flag symptoms (chest pain radiating to arms, FAST stroke markers, severe hemorrhage, respiratory failure) and highlights urgent local helplines (112, 911, 999).
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Multilingual &amp; Hinglish Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full support for English, Hindi, Spanish, French, German, Chinese, and Arabic. Queries formulated in mixed languages (e.g. &quot;mujhe 3 din se fever hai&quot;) are accurately interpreted and responded to in clear, accessible native prose.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Voice Input &amp; Speech Output
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built-in audio capture with MediaRecorder and Web Speech API enables users who cannot type or prefer spoken conversation to describe symptoms hands-free, complete with togglable text-to-speech audio playback.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              6. Lab Analysis &amp; Drug Interactions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated extraction of lab test parameters (Hemoglobin, Glucose, Cholesterol, TSH, Platelets) preserving the diagnostic laboratory&apos;s own reference ranges, accompanied by a pharmacological multi-drug interaction safety checker.
            </p>
          </section>
        </div>

        {/* Architectural Flowchart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            System Request Lifecycle
          </h2>
          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto leading-relaxed shadow-inner">
            <pre>{`User Query (Text or Voice)
  ↓
Backend API Route (/api/chat)
  ↓
Safety Sanitization & Rate Limiter
  ↓
Deterministic Emergency Classifier ──[Emergency Detected]─→ Emergency Alert Panel (112 / 911)
  ↓
RAG Vector Retrieval (WHO / CDC / MedlinePlus / NHS Chunks)
  ↓
Prompt Context Assembly + User Profile (Optional)
  ↓
Google Gemini 2.5 / Grounded Synthesis Engine (Server-Side)
  ↓
Post-Processing Non-Diagnostic Guardrails
  ↓
Structured Response + Verified Citations + Medical Disclaimer`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
