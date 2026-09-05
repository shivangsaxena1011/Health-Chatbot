'use client';

import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';
import EmergencyAlert from '@/components/chat/EmergencyAlert';

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Sore throat',
  'Runny nose',
  'Headache',
  'Body ache / muscle pain',
  'Fatigue / weakness',
  'Shortness of breath',
  'Chest pain or heaviness',
  'Nausea or vomiting',
  'Diarrhea / loose motions',
  'Stomach cramps',
  'Loss of taste or smell',
  'Dizziness or lightheadedness',
  'Frequent urination',
  'Excessive thirst',
  'Skin rash or itching',
];

export default function SymptomCheckerPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [feverPresent, setFeverPresent] = useState(false);
  const [difficultyBreathing, setDifficultyBreathing] = useState(false);
  const [chestPain, setChestPain] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const addCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAssess = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select or add at least one symptom.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/symptoms/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          feverPresent,
          difficultyBreathing,
          chestPain,
          additionalNotes,
        }),
      });

      const data = await res.json();
      if (data.assessment) {
        setResult(data.assessment);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process symptom assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setDuration('1-3 days');
    setSeverity('mild');
    setFeverPresent(false);
    setDifficultyBreathing(false);
    setChestPain(false);
    setAdditionalNotes('');
    setResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Symptom Awareness Checker
              </h1>
              <p className="text-xs text-slate-500">
                Interactive clinical triage guide for health awareness and doctor consultation preparation.
              </p>
            </div>
          </div>
          <Disclaimer compact />
        </div>

        {/* Results View */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-400">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  Assessment Evaluation
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Assessment</span>
              </button>
            </div>

            {/* Emergency alert if triggered */}
            {result.isEmergency && (
              <EmergencyAlert
                data={{
                  isEmergency: true,
                  severity: 'critical',
                  reasons: result.emergencyReasons,
                  immediateActions: [
                    'Do NOT drive yourself; call emergency services immediately.',
                    'Stop all physical activity and rest in a comfortable position.',
                    'Seek urgent emergency room evaluation without delay.',
                  ],
                  emergencyContacts: [
                    { country: 'IN', number: '112', label: 'National Emergency' },
                    { country: 'IN', number: '102 / 108', label: 'Ambulance' },
                  ],
                }}
              />
            )}

            {/* Urgency recommendation banner */}
            <div
              className={`p-5 rounded-2xl border ${
                result.urgencyLevel === 'immediate_emergency'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : result.urgencyLevel === 'urgent_care'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : result.urgencyLevel === 'routine_consultation'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80">
                  Recommended Urgency: {result.urgencyLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold mt-2 leading-relaxed">
                {result.recommendedAction}
              </p>
            </div>

            {/* Possible Health Awareness Topics */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                Possible Associated Health Topics
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                These symptoms are clinically associated with several conditions (not a definitive diagnosis):
              </p>
              <div className="space-y-3">
                {result.possibleTopics.map((topic: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{topic.condition}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        {topic.sourceOrg} Guideline
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Information Gaps & Red Flags to Watch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  <span>Information Gaps for Your Doctor</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {result.informationGaps.map((g: string, i: number) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-red-50/50 border border-red-200/60 rounded-2xl">
                <h4 className="text-xs font-bold text-red-800 mb-2 flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 mr-1.5" />
                  <span>Red-Flag Symptoms to Watch For</span>
                </h4>
                <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                  {result.redFlagsToWatch.map((rf: string, i: number) => (
                    <li key={i}>{rf}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions to Ask Your Doctor */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl">
              <h4 className="text-xs font-bold text-emerald-900 mb-2">
                Recommended Questions to Discuss With Your Doctor
              </h4>
              <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                {result.questionsForDoctor.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Form */}
        {!result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            {/* Step 1: Select Symptoms */}
            <div>
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                1. Select Experienced Symptoms
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Custom symptom input */}
              <form onSubmit={addCustomSymptom} className="flex gap-2">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Type any other symptom..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-all"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Step 2: Duration & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  How long have symptoms lasted?
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="<24 hours">Less than 24 hours</option>
                  <option value="1-3 days">1 to 3 days</option>
                  <option value="4-7 days">4 to 7 days</option>
                  <option value=">1 week">More than 1 week</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Overall Symptom Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        severity === sev
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Critical Red-Flag Quick Checks */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                3. Critical Safety Screening
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white transition-all">
                <input
                  type="checkbox"
                  checked={chestPain}
                  onChange={(e) => setChestPain(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Experiencing chest pain, tightness, heaviness, or pain radiating to arms/jaw?
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white transition-all">
                <input
                  type="checkbox"
                  checked={difficultyBreathing}
                  onChange={(e) => setDifficultyBreathing(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Experiencing severe shortness of breath, gasping, or struggle to speak full sentences?
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white transition-all">
                <input
                  type="checkbox"
                  checked={feverPresent}
                  onChange={(e) => setFeverPresent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Measurable fever present (above 100.4°F / 38°C)?
                </span>
              </label>
            </div>

            {/* Step 4: Additional Notes */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Additional observations or notes (optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="E.g., symptoms worsen in cold weather, recent travel history, or changes after eating..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                rows={3}
              />
            </div>

            <button
              type="button"
              onClick={handleAssess}
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Analyzing Clinical Evidence...' : 'Run Symptom Assessment'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
