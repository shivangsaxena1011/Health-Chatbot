'use client';

import React from 'react';
import { X, Share, PlusSquare, HeartPulse, CheckCircle2 } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 id="ios-install-title" className="text-base font-extrabold text-slate-900">
              Install Swasth AI
            </h3>
            <p className="text-xs text-slate-500">Add to iPhone / iPad Home Screen</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                Tap the <strong className="text-emerald-700 inline-flex items-center bg-white px-1.5 py-0.5 rounded border border-slate-200"><Share className="w-3.5 h-3.5 mr-1" /> Share</strong> button at the bottom of Safari.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                Scroll down and tap <strong className="text-emerald-700 inline-flex items-center bg-white px-1.5 py-0.5 rounded border border-slate-200"><PlusSquare className="w-3.5 h-3.5 mr-1" /> Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                Tap <strong className="text-emerald-700">Add</strong> in the top right corner.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Launch directly from your home screen for full-screen mode and faster startup!</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition-transform active:scale-95 shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default IOSInstallModal;
