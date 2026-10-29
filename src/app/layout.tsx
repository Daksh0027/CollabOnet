import type { Metadata } from 'next';
import './globals.css';
import './collab-ui.css';
import { AuthProvider } from '@/context/AuthContext';
import { SiteFrame } from '@/components/layout/SiteFrame';

export const metadata: Metadata = {
  title: 'CollabOnet — Creator partnerships, in one place',
  description:
    'A shared workspace for creators, talent managers, and brands to discover partners, agree on terms, and manage escrow-backed milestones.',
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
          <SiteFrame>{children}</SiteFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
