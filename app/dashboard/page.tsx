'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Activity,
  MessageSquare,
  Stethoscope,
  BookOpenCheck,
  FileText,
  Pill,
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Droplets,
  Moon,
  Smile,
  Award,
} from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [journals, setJournals] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, jRes, labRes, assessRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/journal'),
          fetch('/api/lab-report/analyze'),
          fetch('/api/symptoms/assess'),
        ]);

        const meData = await meRes.json();
        if (meData.authenticated) setUser(meData.user);

        const jData = await jRes.json();
        if (jData.entries) setJournals(jData.entries);

        const labData = await labRes.json();
        if (labData.reports) setReports(labData.reports);

        const assessData = await assessRes.json();
        if (assessData.assessments) setAssessments(assessData.assessments);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const latestJournal = journals[0] || null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
              <span>Personal Health Intelligence Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || user?.email?.split('@')[0] || 'Health Seeker'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              Track your daily wellness metrics, evaluate symptom patterns, and access evidence-grounded health knowledge.
            </p>
          </div>
          <Link
            href="/"
            className="self-start md:self-auto inline-flex items-center space-x-2 px-5 py-3 bg-white text-emerald-800 text-xs font-extrabold rounded-2xl shadow hover:bg-emerald-50 transition-transform active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Start AI Consultation</span>
          </Link>
        </div>

        <Disclaimer compact />

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            { title: 'AI Health Chat', desc: 'Ask symptoms & tips', href: '/', icon: MessageSquare, color: 'emerald' },
            { title: 'Symptom Checker', desc: 'Guided assessment', href: '/symptoms', icon: Stethoscope, color: 'blue' },
            { title: 'Health Journal', desc: 'Log daily vitals', href: '/journal', icon: BookOpenCheck, color: 'teal' },
            { title: 'Lab Analyzer', desc: 'Understand blood tests', href: '/lab-reports', icon: FileText, color: 'purple' },
            { title: 'Medicines', desc: 'Uses & interactions', href: '/medicines', icon: Pill, color: 'amber' },
            { title: 'Health Summary', desc: 'Export summary', href: '/reports', icon: Download, color: 'rose' },
            { title: 'About & Creator', desc: 'Shivang Saxena', href: '/about', icon: Award, color: 'emerald' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-50 transition-all flex flex-col items-start group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-600 flex items-center justify-center mb-2.5 transition-colors shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {action.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{action.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* Vitals Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Blood Pressure</span>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {latestJournal?.systolicBp && latestJournal?.diastolicBp
                  ? `${latestJournal.systolicBp}/${latestJournal.diastolicBp}`
                  : '120/80'}
              </span>
              <span className="text-xs text-slate-400 font-medium">mmHg</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {latestJournal ? 'Latest recorded reading' : 'Standard target baseline'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Fasting Glucose</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {latestJournal?.bloodGlucoseMgDl || '92'}
              </span>
              <span className="text-xs text-slate-400 font-medium">mg/dL</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Normal fasting: 70–99 mg/dL</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Sleep Rest</span>
              <Moon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {latestJournal?.sleepHours || '7.5'}
              </span>
              <span className="text-xs text-slate-400 font-medium">hours</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Recommended: 7–9 hrs nightly</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Daily Hydration</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {latestJournal?.waterIntakeLiters || '2.5'}
              </span>
              <span className="text-xs text-slate-400 font-medium">liters</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Target: 2.5–3.0 L/day</p>
          </div>
        </div>

        {/* Triple Section: Recent Journal, Lab Reports & Symptom Checks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Journal Timeline Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <BookOpenCheck className="w-4 h-4 text-emerald-600" />
                <span>Recent Health Journal</span>
              </h3>
              <Link href="/journal" className="text-xs font-bold text-emerald-600 hover:underline flex items-center">
                <span>View All</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {journals.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No health logs recorded yet. Start by tracking your symptoms or vitals today.
              </div>
            ) : (
              <div className="space-y-3">
                {journals.slice(0, 3).map((j, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(j.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {j.symptoms || 'Daily Wellness Check'}
                      </p>
                      {j.notes && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{j.notes}</p>}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        BP: {j.systolicBp || 120}/{j.diastolicBp || 80}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Lab Reports Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Analyzed Lab Reports</span>
              </h3>
              <Link href="/lab-reports" className="text-xs font-bold text-emerald-600 hover:underline flex items-center">
                <span>Upload Report</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No lab documents uploaded yet. Upload a blood test or CBC report to extract values.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((r, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">{r.fileName}</p>
                      <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.overallSummary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Symptom Assessments Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Symptom Assessments</span>
              </h3>
              <Link href="/symptoms" className="text-xs font-bold text-emerald-600 hover:underline flex items-center">
                <span>Assess</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {assessments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No recent assessments. Complete a guided symptom assessment to get triage advice.
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 3).map((a, idx) => {
                  const urgencyBadgeColor =
                    a.urgency === 'emergency'
                      ? 'bg-red-100 text-red-700'
                      : a.urgency === 'urgent'
                      ? 'bg-amber-100 text-amber-800'
                      : a.urgency === 'routine'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800';

                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">{a.primarySymptom}</p>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${urgencyBadgeColor}`}>
                          {a.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{a.recommendedAction}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
