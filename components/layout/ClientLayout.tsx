'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/types/health';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current auth status
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        window.location.href = '/login';
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-x-hidden overflow-y-hidden w-full max-w-full">
      <Navbar
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden relative w-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
        />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-x-hidden overflow-y-auto relative pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <MobileNav
        onOpenMenu={() => setIsSidebarOpen(true)}
        isMenuOpen={isSidebarOpen}
      />
    </div>
  );
}
