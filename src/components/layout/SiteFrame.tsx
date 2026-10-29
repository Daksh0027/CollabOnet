'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';

function MarketingHeader() {
  return (
    <header className="marketing-nav">
      <div className="marketing-nav-inner">
        <Link href="/" className="marketing-wordmark" aria-label="CollabOnet home">
          <span className="marketing-wordmark-symbol">C</span>
          <span>CollabOnet</span>
        </Link>
        <nav className="marketing-nav-links" aria-label="Main navigation">
          <a href="#workspaces">For you</a>
          <a href="#product-title">Product</a>
          <a href="#how-it-works">How it works</a>
          <a href="#trust">Trust</a>
        </nav>
        <div className="marketing-nav-actions">
          <Link className="marketing-login-link" href="/dashboard">Open demo</Link>
          <a className="marketing-nav-cta" href="#workspaces">Choose a workspace</a>
        </div>
      </div>
    </header>
  );
}

function InternalFooter() {
  return (
    <footer className="bg-white py-8 text-xs text-neutral-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
            <span className="h-2 w-2 rounded-full bg-[#0057FF]" />
            CollabOnet
          </Link>
          <Link href="/hall-of-shame" className="hover:text-neutral-900">Hall of Shame</Link>
          <Link href="/onboarding/verify" className="hover:text-neutral-900">Verification</Link>
        </div>
        <span>© 2026 CollabOnet</span>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isWorkspace = pathname === '/dashboard';

  return (
    <div className="site-frame">
      {isLanding ? <MarketingHeader /> : isWorkspace ? null : <AppHeader />}
      {isWorkspace ? (
        <div className="site-main site-main-wide">{children}</div>
      ) : (
        <main className={isLanding ? 'site-main site-main-wide' : 'site-main site-main-contained'}>
          {children}
        </main>
      )}
      {!isLanding && !isWorkspace && <InternalFooter />}
    </div>
  );
}
