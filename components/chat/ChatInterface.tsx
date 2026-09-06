'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Trash2, Lightbulb, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { ChatMessage, Language } from '@/lib/types/health';
import ChatBubble from './ChatBubble';
import Disclaimer from './Disclaimer';

interface ChatInterfaceProps {
  selectedLanguage: Language;
  user: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedLanguage, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am Swasth AI 2.0, your evidence-grounded health awareness assistant.
How can I assist you with your health questions today? I can provide educational information regarding symptoms, preventive habits, and when to seek clinical care.

नमस्ते! मैं स्वस्थ AI 2.0 हूँ। आज मैं स्वास्थ्य जागरूकता और लक्षणों को समझने में आपकी क्या मदद कर सकता हूँ?`,
      language: selectedLanguage.name,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string = input) => {
    const query = textToSend.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      language: selectedLanguage.name,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: selectedLanguage.name,
          conversationId,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to receive response');
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages(prev => [...prev, data.message]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to the health knowledge base: ${error.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear all conversation messages?')) {
      setConversationId(undefined);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! How can I assist you with your health awareness today?',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Voice Recording with MediaRecorder and Web Speech recognition fallback
  const startRecording = async () => {
    try {
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;

        if (selectedLanguage.code === 'hi') {
          recognition.lang = 'hi-IN';
        } else if (selectedLanguage.code === 'es') {
          recognition.lang = 'es-ES';
        } else if (selectedLanguage.code === 'fr') {
          recognition.lang = 'fr-FR';
        } else if (selectedLanguage.code === 'de') {
          recognition.lang = 'de-DE';
        } else {
          recognition.lang = 'en-US';
        }

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSend(transcript);
          }
          stopRecording();
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition fallback error:', err);
          stopRecording();
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
        return;
      }

      // MediaRecorder fallback
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please check browser microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const suggestedTopics = [
    { title: 'Diabetes Symptoms', query: 'What are common symptoms of high blood sugar or diabetes?' },
    { title: 'Hypertension Awareness', query: 'How can I prevent elevated blood pressure through lifestyle?' },
    { title: 'Cold vs Flu vs COVID', query: 'What is the clinical difference between common cold and influenza?' },
    { title: 'Dengue Warning Signs', query: 'What are the red-flag warning signs of severe Dengue fever?' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50">
      {/* Header Bar within Chat */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold text-slate-700">Swasth RAG Active</span>
          <span className="text-slate-400">|</span>
          <span>Target Language: <strong className="text-emerald-700">{selectedLanguage.name}</strong></span>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center space-x-1 text-slate-400 hover:text-red-600 transition-colors p-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-32 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          <Disclaimer />

          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onSelectSuggestion={(q) => handleSend(q)}
              />
            ))}
          </div>

          {/* Quick-start topics when only welcome message is present */}
          {messages.length === 1 && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-center mb-4 flex items-center justify-center">
                <span className="h-px w-8 bg-slate-200 mr-3"></span>
                Quick-Start Health Inquiries
                <span className="h-px w-8 bg-slate-200 ml-3"></span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
                {suggestedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(topic.query)}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-50 transition-all group flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{topic.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{topic.query}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typing / Processing Indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6 mt-4 ml-10">
              <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs font-medium text-slate-600">
                  Retrieving trusted medical evidence & analyzing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative flex items-center group"
          >
            <div className="relative flex-1 shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden bg-white border border-slate-200 group-focus-within:border-emerald-500 transition-all ring-0 group-focus-within:ring-4 group-focus-within:ring-emerald-500/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, health tips, or diseases in your language..."
                className="w-full bg-transparent border-none px-4 sm:px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                disabled={isLoading || isRecording}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2.5 rounded-xl transition-all ${
                    isRecording
                      ? 'text-white bg-red-500 animate-pulse'
                      : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={isRecording ? 'Stop Voice Recording' : 'Start Voice Input'}
                  disabled={isLoading}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || isRecording}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isLoading || !input.trim() || isRecording
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Voice Recording Modal overlay */}
      {isRecording && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm w-full mx-4 ring-1 ring-emerald-100">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-red-200 text-white">
                <Mic className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Listening...</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Recording time: {recordingSeconds}s
            </p>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Describe your symptoms or ask your health question in <strong className="text-emerald-700">{selectedLanguage.name}</strong> or mixed language (Hinglish).
            </p>
            <button
              onClick={stopRecording}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center space-x-2"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop & Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
