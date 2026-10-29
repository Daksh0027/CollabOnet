import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'CollabOnet — Curated Creator Marketplace & Escrow Ledger',
  description:
    'Minimal, direct collaboration platform for creators, managers, and brand sponsors. Zero-scam 2-phase KYC, escrow-backed deals, and dual-access messaging.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9f9fb] text-[#09090b] min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <AppHeader />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-neutral-200/80 bg-white/60 backdrop-blur-sm py-8 text-xs text-neutral-500 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0057FF]" />
                  CollabOnet
                </span>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">Protocol</span>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">Escrow Specs</span>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">Hall of Shame</span>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">Privacy &amp; Terms</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SHA-256 Escrow Engine Active
                </span>
                <span className="text-neutral-400">© 2026 CollabOnet</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
