'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Search, ShieldAlert, AlertTriangle, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';
import { MedicineDetails, DrugInteractionResult } from '@/lib/types/health';

export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<MedicineDetails[]>([]);
  const [selectedForInteraction, setSelectedForInteraction] = useState<string[]>(['Aspirin', 'Ibuprofen']);
  const [interactions, setInteractions] = useState<DrugInteractionResult[]>([]);
  const [evaluatingInteraction, setEvaluatingInteraction] = useState(false);

  const fetchMedicines = async (q: string = '') => {
    try {
      const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.medicines) setMedicines(data.medicines);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMedicines();
    handleCheckInteractions(['Aspirin', 'Ibuprofen']);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines(searchQuery);
  };

  const handleCheckInteractions = async (drugs: string[] = selectedForInteraction) => {
    if (drugs.length < 2) return;
    setEvaluatingInteraction(true);
    try {
      const res = await fetch('/api/medicines/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: drugs }),
      });
      const data = await res.json();
      if (data.interactions) setInteractions(data.interactions);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingInteraction(false);
    }
  };

  const toggleDrugSelection = (drugName: string) => {
    let next: string[];
    if (selectedForInteraction.includes(drugName)) {
      next = selectedForInteraction.filter(d => d !== drugName);
    } else {
      next = [...selectedForInteraction, drugName];
    }
    setSelectedForInteraction(next);
    if (next.length >= 2) {
      handleCheckInteractions(next);
    } else {
      setInteractions([]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-100">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Medicine Information &amp; Interaction Checker
              </h1>
              <p className="text-xs text-slate-500">
                Authoritative pharmacological guide on indications, side effects, precautions, and drug-drug interactions.
              </p>
            </div>
          </div>
          <Disclaimer compact />
        </div>

        {/* Drug-Drug Interaction Checker Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Multi-Medication Interaction Checker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select 2 or more medicines to evaluate clinical interaction risks based on pharmacology references.
              </p>
            </div>
            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {selectedForInteraction.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Aspirin', 'Ibuprofen', 'Metformin', 'Alcohol', 'Atorvastatin', 'Clarithromycin', 'Amlodipine', 'Paracetamol'].map((drug) => {
              const active = selectedForInteraction.includes(drug);
              return (
                <button
                  key={drug}
                  onClick={() => toggleDrugSelection(drug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    active
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {drug} {active ? '✓' : '+'}
                </button>
              );
            })}
          </div>

          {/* Interaction Results */}
          {selectedForInteraction.length < 2 ? (
            <p className="text-xs text-slate-400 italic">Select at least 2 medications above to evaluate interactions.</p>
          ) : evaluatingInteraction ? (
            <p className="text-xs text-slate-500 animate-pulse">Evaluating clinical interactions...</p>
          ) : (
            <div className="space-y-3 pt-2">
              {interactions.map((inter, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${
                    inter.hasInteraction && inter.severity === 'major'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : inter.hasInteraction && inter.severity === 'moderate'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold">
                      {inter.drugs[0]} + {inter.drugs[1]}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        inter.severity === 'major'
                          ? 'bg-red-200 text-red-900'
                          : inter.severity === 'moderate'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {inter.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed mb-1.5">
                    {inter.clinicalSummary}
                  </p>
                  <div className="pt-2 border-t border-black/10 text-[11px]">
                    <span className="font-bold">Clinical Advice: </span>
                    <span>{inter.managementAdvice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine Directory Search */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-slate-900">
              Trusted Medicine Catalog
            </h2>
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search generic or brand name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 hover:bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-50 transition-all"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {med.drugClass}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">
                    {med.genericName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Common Brands: {med.brandNames.join(', ')}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Common Uses
                  </h4>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                    {med.commonUses.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Important Precautions
                  </h4>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                    {med.precautions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Source: {med.trustedSources[0]?.sourceOrg}</span>
                  <a
                    href={med.trustedSources[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View Monograph</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
