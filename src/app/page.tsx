'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  FileSignature, 
  Building2, 
  Calendar, 
  Users2, 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Shield,
  ArrowUpRight,
  Flame,
  Check,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEED_BRANCHES, SEED_ORGANIZATION, SEED_COMPETITOR_RADAR, SEED_CREATORS } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-10">
      {/* Editorial Minimalist Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase border border-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF] animate-pulse" />
            Verified Escrow Protocol v1.0
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
            The Trust Layer for Creator Sponsorships.
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl">
            Direct brand-to-creator deals with 2-phase cryptographic KYC, dual-access agency privacy, and SHA-256 milestone escrow contracts. No scam mediators.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link href="/feed">
              <Button size="lg" className="rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs gap-2 px-6">
                Explore Creator Index
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button size="lg" variant="outline" className="rounded-full border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-6">
                Active Escrow Deals
              </Button>
            </Link>
            <Link href="/onboarding/verify">
              <Button size="lg" variant="ghost" className="rounded-full text-neutral-400 hover:text-white text-xs gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Run KYC Check
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Subtle Geometric Grid Overlay */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden lg:block bg-[radial-gradient(#0057FF_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      {/* Live Protocol Metric Matrix */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Escrow Pool Available</div>
          <div className="text-2xl font-extrabold text-neutral-950 tabular-nums mt-1">
            {formatCurrency(SEED_ORGANIZATION.billingPoolBalance)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            100% Funds Secured
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Verified Creators</div>
          <div className="text-2xl font-extrabold text-neutral-950 tabular-nums mt-1">
            1,420
          </div>
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1 mt-1">
            2-Phase Video KYC Verified
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg Brand Safety</div>
          <div className="text-2xl font-extrabold text-neutral-950 tabular-nums mt-1">
            97.8%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            AI Automated Screening
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Mediator Fee Skim</div>
          <div className="text-2xl font-extrabold text-[#0057FF] tabular-nums mt-1">
            0.0%
          </div>
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1 mt-1">
            Zero Hidden Kickbacks
          </span>
        </div>
      </section>

      {/* Behance-Style Featured Creator Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              Curated Talent Spotlight
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified creator portfolios available for immediate milestone escrow booking.
            </p>
          </div>
          <Link
            href="/feed"
            className="text-xs font-semibold text-[#0057FF] hover:underline flex items-center gap-1"
          >
            <span>View Full Roster ({SEED_CREATORS.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_CREATORS.slice(0, 3).map((creator) => (
            <div
              key={creator.id}
              className="group bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={creator.coverImageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
                    alt={creator.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold uppercase border border-white/10">
                      {creator.primaryNiche}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      {creator.aiBrandSafetyScore}% Safety
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-3">
                  <div className="flex items-start gap-3 -mt-8 relative z-10 mb-2">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-neutral-100 shrink-0">
                      <img
                        src={creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={creator.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-neutral-950 group-hover:text-[#0057FF] transition-colors">
                      {creator.displayName}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0057FF]" />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">{creator.handle}</div>

                  <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed">
                    {creator.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-neutral-50 text-center text-xs">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-neutral-400">Reach</div>
                      <div className="font-extrabold text-neutral-950 tabular-nums">
                        {creator.statsCache.subscribers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-neutral-400">Rate (60s)</div>
                      <div className="font-extrabold text-[#0057FF] tabular-nums">
                        {creator.rates.yt_integrated_60s ? formatCurrency(creator.rates.yt_integrated_60s) : 'Custom'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link href="/feed" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-8">
                    View Showcase
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid: Core Security Moats & Live Governance Radar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Security Architecture Highlights */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-neutral-200/80 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              Protocol Architecture
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Engineered to replace vulnerable informal chats with cryptographically enforceable workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Moat 1: 2-Phase Verification */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-neutral-950">2-Phase KYC Moat</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Liveness video check with randomized nonces verified via Whisper ASR + admin 1-on-1 human confirmation.
                </p>
              </div>
              <Link href="/onboarding/verify">
                <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-8">
                  Launch KYC
                </Button>
              </Link>
            </div>

            {/* Moat 2: Dual Access RLS */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-[#0057FF]/10 text-[#0057FF] flex items-center justify-center font-bold">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-neutral-950">Dual-Access Isolation</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Row-level security shields creators while restricting agencies to high-level deal approvals without channel hijack.
                </p>
              </div>
              <Link href="/messages">
                <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-8">
                  Deal Rooms
                </Button>
              </Link>
            </div>

            {/* Moat 3: Instant Contract Extraction */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <FileSignature className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-neutral-950">Chat-to-Contract</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  AI extracts key terms directly into legally binding agreements with SHA-256 document fingerprinting.
                </p>
              </div>
              <Link href="/deals">
                <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-8">
                  View Contracts
                </Button>
              </Link>
            </div>
          </div>

          {/* Active User Context Banner */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-neutral-950 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {currentUser.avatarFallback}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-950">{currentUser.name}</span>
                  <Badge variant="accent" className="text-[10px]">{currentUser.personaKey}</Badge>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">{currentUser.description}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/messages">
                <Button size="sm" className="rounded-full bg-neutral-950 text-white text-xs h-8">
                  Open Chats
                </Button>
              </Link>
              <Link href="/enterprise/dashboard">
                <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                  Enterprise
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Radar, Budget & Hall of Shame */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-neutral-200/80 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              Live Radar
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Automated exclusivity alerts and public accountability.
            </p>
          </div>

          {/* Competitor Radar Card */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Collision &amp; Exclusivity
              </h3>
              <span className="text-[10px] text-neutral-400 font-medium">Real-time</span>
            </div>

            <div className="space-y-2.5">
              {SEED_COMPETITOR_RADAR.slice(0, 2).map((item) => {
                const creator = SEED_CREATORS.find((c) => c.id === item.creatorId);
                return (
                  <div key={item.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-neutral-900">
                      <span>{creator ? creator.displayName : 'Verified Creator'}</span>
                      <span className="text-[10px] text-rose-600 font-bold uppercase">{item.competitorBrandName}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Detected via {item.detectedVia}. Exclusivity: <strong className="text-neutral-900">{item.exclusivityDaysRemaining || 0} days</strong> remaining.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hall of Shame Spotlight */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-rose-600 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-rose-600" />
                The Hall of Shame
              </h3>
              <Badge variant="destructive" className="text-[9px]">Adjudicated</Badge>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Public fraud ledger documenting mediator fee-skims, non-payments, and breaches after expired 72-hour grace periods.
            </p>

            <Link href="/hall-of-shame" className="block">
              <Button size="sm" variant="outline" className="w-full rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 text-xs h-8">
                Inspect Public Blacklist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
