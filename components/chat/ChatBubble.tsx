import React, { useState, useEffect } from 'react';
import { Bot, User, Copy, Check, Volume2, VolumeX, ExternalLink, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '@/lib/types/health';
import EmergencyAlert from './EmergencyAlert';

interface ChatBubbleProps {
  message: ChatMessage;
  onSelectSuggestion?: (query: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSelectSuggestion }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Clean markdown headings for speech synthesis
    const cleanForSpeech = message.content
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanForSpeech);
    if (message.language === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else if (message.language === 'Spanish') {
      utterance.lang = 'es-ES';
    } else if (message.language === 'French') {
      utterance.lang = 'fr-FR';
    } else if (message.language === 'German') {
      utterance.lang = 'de-DE';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const formattedTime = () => {
    if (!mounted || !message.timestamp) return '';
    const d = new Date(message.timestamp);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] group ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl shadow-sm ${
            isAssistant
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 mr-2.5 mt-1 text-white'
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 ml-2.5 mt-1 text-white'
          }`}
        >
          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        <div className={`flex flex-col flex-1 min-w-0 ${isAssistant ? 'items-start' : 'items-end'}`}>
          {/* Emergency Alert Banner if red flag detected */}
          {isAssistant && message.emergencyInfo && (
            <EmergencyAlert data={message.emergencyInfo} />
          )}

          {/* Bubble content */}
          <div
            className={`px-5 py-4 rounded-2xl shadow-sm text-[14px] leading-relaxed relative w-full ${
              isAssistant
                ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                : 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100'
            }`}
          >
            <div className="whitespace-pre-wrap break-words font-normal space-y-2">
              {message.content}
            </div>

            {/* Grounded Sources section */}
            {isAssistant && message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{showSources ? 'Hide Grounded Medical Sources' : `View Grounded Medical Sources (${message.sources.length})`}</span>
                </button>

                {showSources && (
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
                    {message.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-start justify-between group/link"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            {s.sourceOrg}
                          </span>
                          <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-2">
                            {s.title}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-emerald-600 shrink-0 ml-2 mt-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assistant Action Buttons: Copy, TTS */}
            {isAssistant && message.id !== 'welcome' && (
              <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1.5 rounded-lg border shadow-sm transition-all ${
                    isPlayingAudio
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-emerald-600 border-slate-200'
                  }`}
                  title={isPlayingAudio ? 'Stop reading' : 'Read aloud'}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-emerald-600 border border-slate-200 shadow-sm transition-all"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Suggested Follow-ups */}
          {isAssistant && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectSuggestion && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion(q)}
                  className="text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-all text-left active:scale-95"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          )}

          {/* Time & status badge */}
          <div
            className={`flex items-center mt-1 px-1 space-x-2 text-[10px] font-bold tracking-tight text-slate-400 uppercase ${
              isAssistant ? 'text-slate-400' : 'text-emerald-600'
            }`}
          >
            <span>{formattedTime()}</span>
            {isAssistant && copied && (
              <>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-emerald-600 font-bold">Copied</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
