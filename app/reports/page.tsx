'use client';

import React, { useState, useEffect } from 'react';
import { Download, Printer, FileText, CheckCircle, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function HealthReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch('/api/reports/generate');
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-100">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Health Awareness Report Generator
              </h1>
              <p className="text-xs text-slate-500">
                Generate and print an evidence-grounded summary of your logged health metrics to bring to your doctor.
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-200 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        <Disclaimer compact />

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-500">
            Generating your consolidated health awareness report...
          </div>
        ) : !report ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-500">
            Please sign in to generate your personalized health awareness summary.
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-6 print:border-none print:shadow-none">
            {/* Report Header */}
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                  Swasth AI 2.0 Patient-Partner Health Summary
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Health Awareness Record
                </h2>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
                <p className="font-bold text-slate-700">Non-Diagnostic Educational Document</p>
              </div>
            </div>

            {/* Patient profile overview */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                User Clinical Profile
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / Sex</span>
                  <span className="font-bold text-slate-800">
                    {report.user.profile.age || 'Not specified'} / {report.user.profile.sex || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Known Allergies</span>
                  <span className="font-bold text-slate-800">
                    {report.user.profile.allergies || 'None reported'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Chronic Conditions</span>
                  <span className="font-bold text-slate-800">
                    {report.user.profile.chronicConditions || 'None reported'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Medications</span>
                  <span className="font-bold text-slate-800">
                    {report.user.profile.currentMedications || 'None reported'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Vitals & Journal Summary */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                Health Journal &amp; Vitals Summary
              </h3>
              {report.healthVitalsSummary.recentEntries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No recent health journal vitals recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Blood Pressure</th>
                        <th className="py-2 px-2">Glucose</th>
                        <th className="py-2 px-2">Sleep</th>
                        <th className="py-2 px-2">Reported Symptoms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.healthVitalsSummary.recentEntries.map((e: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-2 font-medium">
                            {new Date(e.date).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-2 font-bold">
                            {e.systolicBp ? `${e.systolicBp}/${e.diastolicBp} mmHg` : '—'}
                          </td>
                          <td className="py-2.5 px-2 font-bold">
                            {e.bloodGlucoseMgDl ? `${e.bloodGlucoseMgDl} mg/dL` : '—'}
                          </td>
                          <td className="py-2.5 px-2">
                            {e.sleepHours ? `${e.sleepHours} hrs` : '—'}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600">
                            {e.symptoms || 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Lab Investigation Highlights */}
            {report.recentLabReports.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                  Recent Laboratory Investigation Highlights
                </h3>
                <div className="space-y-2">
                  {report.recentLabReports.map((lr: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>{lr.fileName}</span>
                        <span className="text-slate-400 font-normal">{new Date(lr.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600">{lr.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions for Doctor */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span>Recommended Discussion Points For Your Doctor Appointment</span>
              </h4>
              <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside">
                {report.questionsForDoctor.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Trusted sources */}
            <div>
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                Medical Knowledge Grounding Sources
              </h4>
              <p className="text-xs text-slate-500">
                {report.trustedSources.join(' • ')}
              </p>
            </div>

            {/* Official Disclaimer */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed italic">
              {report.legalDisclaimer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
