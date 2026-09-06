'use client';

import React from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '@/lib/pwa/usePWAInstall';
import IOSInstallModal from './IOSInstallModal';

export const InstallBanner: React.FC = () => {
  const {
    bannerVisible,
    promptInstall,
    dismissBanner,
    showIOSModal,
    setShowIOSModal,
  } = usePWAInstall();

  if (!bannerVisible) return null;

  return (
    <>
      <aside
        aria-label="App Installation Offer"
        className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white px-3.5 sm:px-6 py-2.5 sm:py-2 flex items-center justify-between shadow-md border-b border-emerald-800/50 z-40 relative animate-in slide-in-from-top duration-300"
      >
        <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Smartphone className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-xs font-extrabold tracking-tight text-white truncate">
                Install Swasth AI App
              </span>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate hidden sm:block">
              Add to Home Screen or Desktop for full-screen view & faster health assistance.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-3">
          <button
            onClick={promptInstall}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss install banner"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
};

export default InstallBanner;
