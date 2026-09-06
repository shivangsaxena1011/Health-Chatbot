import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Swasth AI 2.0 — Advanced AI Health Awareness Platform',
  description: 'Evidence-grounded multilingual health awareness, medical RAG, symptom awareness checker, and trusted clinical sources. Architected by Shivang Saxena.',
  keywords: ['health chatbot', 'medical RAG', 'symptom checker', 'health awareness', 'multilingual AI health', 'Swasth AI', 'Shivang Saxena'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
