'use client';

import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, HelpCircle, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';
import { LabAnalysisResult } from '@/lib/types/health';

const SAMPLE_REPORTS = [
  {
    title: 'Complete Blood Count (CBC) Sample',
    text: `CENTRAL CLINICAL LABORATORY
PATIENT INVESTIGATION REPORT
Test Name                  Result    Unit        Reference Interval
Hemoglobin (Hb)            10.8      g/dL        12.0 - 16.0
Total Platelet Count       135       10^3/mcL    150 - 450
Serum Creatinine           0.9       mg/dL       0.6 - 1.2
Fasting Blood Sugar (FBS)  115       mg/dL       70 - 99`,
  },
  {
    title: 'Routine Health Checkup Sample',
    text: `METROPOLITAN DIAGNOSTICS
COMPREHENSIVE METABOLIC PANEL
Test Name                  Result    Unit        Biological Reference
Fasting Blood Sugar (FBS)  88        mg/dL       70 - 99
Glycated Hemoglobin (HbA1c)5.4       %           4.0 - 5.6
Total Cholesterol          182       mg/dL       125 - 200
Thyroid Stimulating (TSH)  2.1       mIU/L       0.4 - 4.5
Hemoglobin (Hb)            14.2      g/dL        13.0 - 17.0`,
  },
];

export default function LabReportsPage() {
  const [reportText, setReportText] = useState('');
  const [fileName, setFileName] = useState('Laboratory_Investigation.txt');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LabAnalysisResult | null>(null);

  const handleAnalyze = async (textToUse: string = reportText) => {
    if (!textToUse.trim()) {
      alert('Please enter or paste your lab report text.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/lab-report/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: textToUse,
          fileName,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
      alert('Error analyzing lab report');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleText: string, sampleTitle: string) => {
    setReportText(sampleText);
    setFileName(`${sampleTitle.replace(/\s+/g, '_')}.txt`);
    handleAnalyze(sampleText);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Lab Report Analyzer
              </h1>
              <p className="text-xs text-slate-500">
                Extract values, compare against preserved laboratory reference ranges, and understand blood test parameters in simple language.
              </p>
            </div>
          </div>
          <Disclaimer compact />
        </div>

        {/* Sample Loaders */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/70 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Instant Test Drive With Sample Lab Reports</span>
            </h4>
            <p className="text-[11px] text-purple-800">
              Don&apos;t have a report on hand? Click below to instantly load and test with realistic clinical reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_REPORTS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadSample(s.text, s.title)}
                className="px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-400 text-purple-900 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            Paste Laboratory Investigation Results
          </label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Paste your laboratory test results here (e.g. Hemoglobin 11.2 g/dL, Fasting Glucose 110 mg/dL, Platelets 140)..."
            rows={5}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !reportText.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{loading ? 'Extracting & Analyzing Report...' : 'Analyze Laboratory Report'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Analysis Results
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">{analysis.fileName}</h2>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold">
                <span className="text-slate-500">Extraction Confidence:</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {(analysis.confidenceScore * 100).toFixed(0)}% Reliable
                </span>
              </div>
            </div>

            {/* Overall summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
              {analysis.overallSummary}
            </div>

            {/* Table of extracted values with preserved reference range */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Lab Reference Range</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-900">{r.testName}</td>
                      <td className="py-3 px-3 font-mono font-extrabold text-slate-800">
                        {r.value} {r.unit}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{r.referenceRange}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            r.status === 'normal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'low'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {r.status === 'normal' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Explanations per parameter */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Plain-Language Parameter Explanations
              </h3>
              {analysis.results.map((r, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-slate-900">{r.testName}</p>
                  <p className="text-slate-600 leading-relaxed">{r.explanation}</p>
                </div>
              ))}
            </div>

            {/* Questions for Doctor */}
            {analysis.questionsForDoctor && analysis.questionsForDoctor.length > 0 && (
              <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl">
                <h4 className="text-xs font-bold text-purple-950 mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 text-purple-600 mr-1.5" />
                  <span>Important Questions to Ask Your Doctor About This Report</span>
                </h4>
                <ul className="text-xs text-purple-900 space-y-1 list-disc list-inside">
                  {analysis.questionsForDoctor.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            <div className="pt-2">
              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Trusted Reference Guidelines
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.sources?.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs text-slate-700 font-semibold"
                  >
                    <span>{s.sourceOrg}: {s.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
