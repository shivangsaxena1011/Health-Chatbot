'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Stethoscope,
  LayoutDashboard,
  BookOpenCheck,
  Menu,
} from 'lucide-react';

interface MobileNavProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMenu, isMenuOpen }) => {
  const pathname = usePathname();

  const items = [
    { label: 'Chat', href: '/', icon: MessageSquare },
    { label: 'Symptoms', href: '/symptoms', icon: Stethoscope },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Journal', href: '/journal', icon: BookOpenCheck },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 py-1 flex items-center justify-around select-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open Full Navigation Menu"
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
          isMenuOpen
            ? 'text-emerald-700 font-extrabold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <div
          className={`p-1 rounded-lg transition-colors ${
            isMenuOpen ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
          }`}
        >
          <Menu className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">More</span>
      </button>
    </nav>
  );
};

export default MobileNav;
