import React from 'react';
import { PhoneCall, AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';
import { EmergencyAlertData } from '@/lib/types/health';

interface EmergencyAlertProps {
  data: EmergencyAlertData;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ data }) => {
  if (!data.isEmergency) return null;

  return (
    <div className="w-full my-4 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-500/20 border-2 border-red-500 overflow-hidden emergency-pulse animate-in fade-in zoom-in-95 duration-300">
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="bg-red-800/80 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ring-1 ring-white/30">
                CRITICAL WARNING
              </span>
              <span className="text-xs font-semibold text-red-100">Immediate Action Required</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold mt-1">Possible Medical Emergency Detected</h3>
            <p className="text-sm text-red-100 mt-1 leading-relaxed">
              Your inquiry triggered clinical red-flag indicators. Do NOT rely on this chatbot. Seek immediate professional emergency medical care.
            </p>
          </div>
        </div>

        {data.reasons && data.reasons.length > 0 && (
          <div className="mt-4 bg-red-700/60 rounded-xl p-3 border border-red-500/50">
            <p className="text-xs font-bold uppercase tracking-wider text-red-200 mb-1 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Red-Flag Indicators
            </p>
            <ul className="text-xs text-red-50 space-y-1 list-disc list-inside">
              {data.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {data.immediateActions && data.immediateActions.length > 0 && (
          <div className="mt-3 bg-red-700/60 rounded-xl p-3 border border-red-500/50">
            <p className="text-xs font-bold uppercase tracking-wider text-red-200 mb-1">
              Urgent Steps
            </p>
            <ul className="text-xs text-red-50 space-y-1">
              {data.immediateActions.map((a, i) => (
                <li key={i} className="flex items-start">
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5 text-red-300" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-red-500/50 flex flex-wrap gap-2 items-center justify-between">
          <div className="text-xs text-red-100 font-medium">
            Call emergency services right now:
          </div>
          <div className="flex flex-wrap gap-2">
            {data.emergencyContacts?.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.number.replace(/\s+/g, '')}`}
                className="inline-flex items-center space-x-1.5 bg-white text-red-700 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow hover:bg-red-50 transition-transform active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>{c.number} ({c.label})</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
