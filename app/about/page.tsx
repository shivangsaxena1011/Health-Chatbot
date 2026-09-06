'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  ExternalLink,
  MessageSquare,
  Lock,
  Code2,
  Award,
} from 'lucide-react';
import Disclaimer from '@/components/chat/Disclaimer';

export default function AboutPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Health Awareness Inquiry',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const developerEmail = 'shivangsaxena102006@gmail.com';
  const linkedinUrl = 'https://www.linkedin.com/in/shivang-saxena1/';
  const githubUrl = 'https://github.com/shivangsaxena1011';
  const repoUrl = 'https://github.com/shivangsaxena1011/Health-Chatbot';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    // Simulate instant secure processing and open mail client fallback
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      const mailtoLink = `mailto:${developerEmail}?subject=${encodeURIComponent(
        `[Swasth AI 2.0] ${formData.subject} - from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.subject}\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoLink, '_blank');
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-emerald-200" />
              <span>Creator & Platform Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              About Swasth AI 2.0 & Developer
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Swasth AI 2.0 was designed and developed from the ground up as an advanced, secure, and evidence-grounded health awareness platform, engineered to empower individuals with verified clinical knowledge, emergency detection, and proactive health metrics.
            </p>
          </div>
        </div>

        <Disclaimer compact />

        {/* Developer Spotlight Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-50 shrink-0">
                SS
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Shivang Saxena
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Lead Developer & Architect
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-600 font-bold mt-0.5">
                  Full-Stack AI Software Engineer & Systems Designer
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Creator of Swasth AI 2.0 — Evidence-Grounded Healthcare Awareness
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-95"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
              </button>

              <a
                href={`mailto:${developerEmail}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          {/* Bio & Vision */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Architectural Vision & Mission
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                As the author and lead engineer behind <strong>Swasth AI 2.0</strong>, my vision is to harness advanced large language models responsibly by anchoring them to verified public health authorities like the <strong>World Health Organization (WHO)</strong>, <strong>CDC</strong>, <strong>MedlinePlus</strong>, and the <strong>NHS</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                This platform is built with an unwavering commitment to <strong>privacy sovereignty</strong>: eliminating third-party tracking, providing zero client-side credential exposure, and guaranteeing complete GDPR data portability and one-click total deletion.
              </p>
            </div>

            {/* Quick Stats / Info Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Direct Contact & Socials
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">Email:</span>
                  <span className="font-bold text-slate-800 select-all">{developerEmail}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">LinkedIn:</span>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center space-x-1"
                  >
                    <span>shivang-saxena1</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">GitHub:</span>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center space-x-1"
                  >
                    <span>shivangsaxena1011</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">Repository:</span>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Health-Chatbot</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">License:</span>
                  <span className="font-bold text-slate-800">MIT Open Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: 'Zero-Trust Security',
              desc: 'No client key leaks. Strict server-side API proxying, HttpOnly JWT cookies, CSRF protection, and clickjacking defense.',
            },
            {
              icon: Cpu,
              title: 'Evidence-Grounded RAG',
              desc: 'Dense vector embeddings mapped to official WHO, CDC, MedlinePlus, and NHS fact sheets preventing LLM hallucinations.',
            },
            {
              icon: Globe,
              title: 'Adaptive Multi-Device UI',
              desc: 'Fluid responsive layout adapting automatically between PC laptops, tablets, and mobile smartphones with 1-tap navigation.',
            },
            {
              icon: Lock,
              title: 'Privacy Sovereignty',
              desc: 'One-click full account wipe, complete GDPR JSON export, and encrypted bcrypt password hashing.',
            },
            {
              icon: Database,
              title: 'Serverless Resilience',
              desc: 'Dual-tier architecture supporting both Prisma PostgreSQL and zero-configuration serverless in-memory storage on Vercel.',
            },
            {
              icon: Code2,
              title: 'Clean Modern Stack',
              desc: 'Built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Google Gemini 2.5, and Prisma ORM.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Us Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>Contact Shivang Saxena / Send Feedback</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have questions, technical suggestions, or feedback about Swasth AI 2.0? Fill out the form below to get in touch directly.
            </p>

            {submitted ? (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Message Dispatched!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out. An email draft has been generated for <strong>{developerEmail}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="General Health Awareness Inquiry">General Health Awareness Inquiry</option>
                    <option value="Technical Collaboration & Architecture">Technical Collaboration & Architecture</option>
                    <option value="Feature Request or Enhancement">Feature Request or Enhancement</option>
                    <option value="Security or Bug Report">Security or Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your inquiry or feedback here..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] text-slate-400">
                    Direct recipient: <strong className="text-slate-600">{developerEmail}</strong>
                  </p>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
