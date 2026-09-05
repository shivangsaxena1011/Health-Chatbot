'use client';

import React, { useState, useEffect } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/types/health';

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatInterface selectedLanguage={selectedLanguage} user={user} />
    </div>
  );
}
