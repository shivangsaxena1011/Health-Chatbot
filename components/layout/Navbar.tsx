'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, Globe, PhoneCall, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/types/health';

interface NavbarProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLanguage,
  onSelectLanguage,
  isSidebarOpen,
  onToggleSidebar,
  user,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30 shrink-0">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-md ring-2 ring-emerald-50 text-white group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">Swasth AI</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">2.0</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase hidden sm:block">
              Evidence-Grounded Health Awareness
            </p>
          </div>
        </Link>
      </div>

      {/* Center Emergency Badge */}
      <div className="hidden lg:flex items-center space-x-2 bg-red-50 border border-red-200/80 px-3 py-1.5 rounded-full text-xs text-red-700">
        <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-bounce" />
        <span className="font-bold">Medical Emergency? Call 112 / 911</span>
      </div>

      {/* Right Controls: Language & Session */}
      <div className="flex items-center space-x-2.5">
        {/* Language Selector */}
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={selectedLanguage.code}
            onChange={(e) => {
              const lang = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
              if (lang) onSelectLanguage(lang);
            }}
            className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all shadow-sm"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* User Auth Info */}
        {user ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <Link
              href="/profile"
              className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
              title="View Profile"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                {user.name || user.email.split('@')[0]}
              </span>
            </Link>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
