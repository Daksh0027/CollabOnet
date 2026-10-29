import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'CollaboNet — Professional Operating System for Creators & Brands',
  description:
    'Secure transaction infrastructure, Whisper ASR verification, strict rep isolation, hybrid semantic search, and chat-to-contract extraction.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f4f2ee] text-[#191919] min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <AppHeader />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5">
            {children}
          </main>
          <footer className="border-t border-[#e0dfdc] bg-white py-5 text-xs text-[#5e5e5e]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-5">
                <span className="font-semibold text-[#191919]">CollaboNet Enterprise</span>
                <span className="text-[#5e5e5e]">About</span>
                <span className="text-[#5e5e5e]">Accessibility</span>
                <span className="text-[#5e5e5e]">Privacy &amp; Terms</span>
                <span className="text-[#5e5e5e]">Security &amp; RLS</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[#057642]" />
                <span className="text-[#057642] font-semibold">PostgreSQL RLS &amp; AI Gateway Active</span>
                <span className="text-[#717171] ml-2">© 2026 CollaboNet Corporation</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
