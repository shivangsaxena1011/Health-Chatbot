'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  LayoutDashboard,
  Stethoscope,
  BookOpenCheck,
  FileText,
  Pill,
  Download,
  User,
  Info,
  ShieldCheck,
  Sparkles,
  Award,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'AI Health Chat', href: '/', icon: MessageSquare },
    { label: 'Health Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Symptom Checker', href: '/symptoms', icon: Stethoscope },
    { label: 'Health Journal', href: '/journal', icon: BookOpenCheck },
    { label: 'Lab Report Analyzer', href: '/lab-reports', icon: FileText },
    { label: 'Medicine Information', href: '/medicines', icon: Pill },
    { label: 'Health Reports', href: '/reports', icon: Download },
    { label: 'Health Profile', href: '/profile', icon: User },
    { label: 'About & Creator', href: '/about', icon: Award },
    { label: 'How It Works', href: '/how-it-works', icon: Info },
    { label: 'Privacy & Safety', href: '/privacy', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40
          w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col shadow-2xl md:shadow-none h-full overflow-y-auto shrink-0
        `}
      >
        <div className="mb-6">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        {user && (
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Signed In As
            </h4>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name || 'Swasth User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Card */}
        <div className="mt-auto pt-4">
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-emerald-700 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Medical RAG 2.0</span>
            </div>
            <p className="text-xs text-slate-700 leading-snug font-medium">
              Grounded in WHO, CDC, MedlinePlus & NHS public clinical sources.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
