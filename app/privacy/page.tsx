'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  Server,
  EyeOff,
  FileCheck,
  CheckCircle,
} from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function PrivacyPage() {
  const [deletingTarget, setDeletingTarget] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDelete = async (target: 'chats' | 'journal' | 'lab_reports' | 'profile' | 'account') => {
    const confirmText =
      target === 'account'
        ? 'WARNING: This will permanently erase your account, all conversations, lab reports, and journals. This action cannot be undone. Are you sure?'
        : `Are you sure you want to permanently delete your ${target.replace(/_/g, ' ')}?`;

    if (!confirm(confirmText)) return;

    setDeletingTarget(target);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/privacy/delete-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Deletion failed');
      }

      setSuccessMessage(data.message || 'Data successfully deleted.');
      if (target === 'account') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (e: any) {
      alert(`Deletion error: ${e.message}`);
    } finally {
      setDeletingTarget(null);
    }
  };

  const handleExportData = () => {
    window.location.href = '/api/privacy/export';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Privacy &amp; Security Center
              </h1>
              <p className="text-xs text-slate-500">
                Transparent data handling policies, encryption safeguards, and complete user-controlled data deletion.
              </p>
            </div>
          </div>
          <Disclaimer compact />
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Core Privacy Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Zero Client-Side Keys</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Google Gemini API keys and sensitive credentials reside strictly on backend servers. They are never exposed to browser inspection.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Encrypted Auth Sessions</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Session tokens are secured via HttpOnly, SameSite cookies. Passwords are mathematically hashed with bcrypt (12 salt rounds).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">No Data Selling</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your conversational data, journal logs, and laboratory tests are never sold, monetized, or shared with commercial third parties.
            </p>
          </div>
        </div>

        {/* Detailed Disclosure */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            How Your Health Data Is Processed
          </h2>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1">1. AI Processing &amp; Grounding</h4>
              <p>
                When you submit a query, our backend normalizes your text and searches a curated medical knowledge base (WHO, CDC, MedlinePlus, NHS). The query and matched clinical passages are sent securely to Google Gemini for synthesis under strict non-diagnostic system constraints.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1">2. Data Storage &amp; Encryption</h4>
              <p>
                Health profiles, journal vitals, and conversation logs are stored in an encrypted database protected by relational foreign-key authorization checks. Only authenticated sessions can access their own data.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1">3. GDPR &amp; HIPAA-Aligned User Rights</h4>
              <p>
                You retain full sovereign ownership over your health information. You can download a complete JSON archive of your data at any time or permanently wipe specific records using the controls below.
              </p>
            </div>
          </div>
        </div>

        {/* User Data Controls & Permanent Deletion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                User Sovereignty &amp; Data Rights Management
              </h2>
              <p className="text-xs text-slate-500">
                Export or permanently delete your health records on demand.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All My Data (JSON)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Chat History</p>
                <p className="text-[11px] text-slate-500">Erase all conversations and AI responses</p>
              </div>
              <button
                onClick={() => handleDelete('chats')}
                disabled={deletingTarget === 'chats'}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                {deletingTarget === 'chats' ? 'Deleting...' : 'Delete Chats'}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Health Journal</p>
                <p className="text-[11px] text-slate-500">Wipe recorded vitals and trend entries</p>
              </div>
              <button
                onClick={() => handleDelete('journal')}
                disabled={deletingTarget === 'journal'}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                {deletingTarget === 'journal' ? 'Deleting...' : 'Delete Journal'}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Lab Reports</p>
                <p className="text-[11px] text-slate-500">Erase all uploaded lab results</p>
              </div>
              <button
                onClick={() => handleDelete('lab_reports')}
                disabled={deletingTarget === 'lab_reports'}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                {deletingTarget === 'lab_reports' ? 'Deleting...' : 'Delete Lab Reports'}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Health Profile</p>
                <p className="text-[11px] text-slate-500">Reset allergies, conditions &amp; vitals</p>
              </div>
              <button
                onClick={() => handleDelete('profile')}
                disabled={deletingTarget === 'profile'}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                {deletingTarget === 'profile' ? 'Clearing...' : 'Clear Profile'}
              </button>
            </div>
          </div>

          {/* Critical Permanent Account Deletion */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-1.5 text-red-800 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Permanent Account &amp; Complete Data Deletion</span>
              </div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Permanently deletes your account credentials, all logs, conversations, and records from the database.
              </p>
            </div>
            <button
              onClick={() => handleDelete('account')}
              disabled={deletingTarget === 'account'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto"
            >
              {deletingTarget === 'account' ? 'Wiping Everything...' : 'Delete Account & All Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
