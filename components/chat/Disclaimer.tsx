import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DisclaimerProps {
  compact?: boolean;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Medical Awareness Notice:</span> Swasth AI provides educational guidance only and does NOT provide medical diagnosis, clinical treatment, or prescriptions. Always consult a licensed doctor for health concerns.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-xl my-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="ml-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-amber-900">
              Important Health Awareness Notice
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1" /> Non-Diagnostic
            </span>
          </div>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Swasth AI 2.0 is an evidence-grounded informational platform for health awareness, symptom understanding, and preventive guidance. It is <strong className="font-bold">not a replacement for a doctor or emergency medical service</strong>. Never disregard professional clinical advice or delay seeking it because of information read on this platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
