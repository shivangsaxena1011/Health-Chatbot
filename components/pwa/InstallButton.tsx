'use client';

import React from 'react';
import { Download, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/lib/pwa/usePWAInstall';
import IOSInstallModal from './IOSInstallModal';

interface InstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'card' | 'badge';
  className?: string;
}

export const InstallButton: React.FC<InstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const {
    isInstalled,
    promptInstall,
    showIOSModal,
    setShowIOSModal,
  } = usePWAInstall();

  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200/60">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={promptInstall}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 transition-all active:scale-95 shadow-sm ${className}`}
          title="Install Swasth AI App"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={promptInstall}
          className={`w-full flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] ${className}`}
        >
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-200" />
            <span>Install App</span>
          </div>
          <Download className="w-3.5 h-3.5 text-emerald-200" />
        </button>
      )}

      {variant === 'card' && (
        <button
          onClick={promptInstall}
          className={`inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install Web App</span>
        </button>
      )}

      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
};

export default InstallButton;
