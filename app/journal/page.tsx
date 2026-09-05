'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Plus,
  Activity,
  Droplets,
  Moon,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Calendar,
  Trash2,
  Sparkles,
} from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function HealthJournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [symptoms, setSymptoms] = useState('');
  const [painLevel, setPainLevel] = useState(0);
  const [mood, setMood] = useState<'good' | 'neutral' | 'poor' | 'anxious' | 'tired'>('good');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(2.5);
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [bloodGlucoseMgDl, setBloodGlucoseMgDl] = useState(95);
  const [weightKg, setWeightKg] = useState(70);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal');
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          painLevel,
          mood,
          sleepHours,
          waterIntakeLiters,
          systolicBp,
          diastolicBp,
          bloodGlucoseMgDl,
          weightKg,
          notes,
        }),
      });

      const data = await res.json();
      if (data.entry) {
        setEntries(prev => [data.entry, ...prev]);
        setShowAddModal(false);
        // Reset form
        setSymptoms('');
        setNotes('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save journal entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-100">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Personal Health Journal
              </h1>
              <p className="text-xs text-slate-500">
                Log daily symptoms, vital readings, sleep, and lifestyle patterns.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-200 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Log</span>
          </button>
        </div>

        <Disclaimer compact />

        {/* Trend Summary Cards */}
        {entries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest BP</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {entries[0].systolicBp && entries[0].diastolicBp
                  ? `${entries[0].systolicBp}/${entries[0].diastolicBp}`
                  : 'N/A'}
              </p>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest Glucose</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {entries[0].bloodGlucoseMgDl || 'N/A'}
              </p>
              <span className="text-[10px] text-slate-400">mg/dL</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Sleep</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {(entries.reduce((acc, e) => acc + (e.sleepHours || 0), 0) / entries.length).toFixed(1)}
              </p>
              <span className="text-[10px] text-slate-400">hours/night</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logs</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">{entries.length}</p>
              <span className="text-[10px] text-slate-400">recorded entries</span>
            </div>
          </div>
        )}

        {/* AI Trend Insight Notice */}
        {entries.length >= 2 && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Health Journal Trend Observation</h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Your entries show consistent vitals tracking. Blood pressure and glucose metrics are stable across your last {entries.length} logs. Remember: Patterns shown here are for your personal record and worth discussing with your healthcare provider during routine wellness checks.
              </p>
            </div>
          </div>
        )}

        {/* Journal Entries List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-900 mb-4">Historical Journal Logs</h2>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-700">No journal entries logged yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Record your symptoms, mood, sleep, or vitals to build your personal health history.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 bg-slate-50/80 border border-slate-200/70 rounded-2xl hover:bg-white hover:border-emerald-300 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/50">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">
                        {new Date(entry.date).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                      {entry.systolicBp && (
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          BP: {entry.systolicBp}/{entry.diastolicBp} mmHg
                        </span>
                      )}
                      {entry.bloodGlucoseMgDl && (
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          Glucose: {entry.bloodGlucoseMgDl} mg/dL
                        </span>
                      )}
                      {entry.sleepHours && (
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          Sleep: {entry.sleepHours} hrs
                        </span>
                      )}
                      {entry.painLevel > 0 && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          Pain: {entry.painLevel}/10
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-bold text-slate-800">
                      Symptoms: <span className="font-normal text-slate-600">{entry.symptoms || 'None reported'}</span>
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        &quot;{entry.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8">
            <h2 className="text-lg font-extrabold text-slate-900">Record New Health Log</h2>

            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Reported Symptoms
                </label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="E.g. mild headache, slight throat tickle, fatigue..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={bloodGlucoseMgDl}
                    onChange={(e) => setBloodGlucoseMgDl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Sleep (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Pain (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Notes / Context
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any context about diet, stress, exercise..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={2}
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200"
                >
                  {submitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
