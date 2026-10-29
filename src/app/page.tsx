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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEED_BRANCHES, SEED_ORGANIZATION, SEED_COMPETITOR_RADAR } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT RAIL: User Profile & Organization Card */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="linkedin-card overflow-hidden">
          {/* Header Banner: flat LinkedIn navy */}
          <div className="h-14 bg-[#0a66c2]" />
          
          <div className="p-4 pt-0 text-center relative">
            <div className="h-16 w-16 rounded-full bg-white border-2 border-white text-[#0a66c2] font-bold text-xl flex items-center justify-center mx-auto -mt-8">
              {currentUser.avatarFallback}
            </div>

            <h2 className="font-bold text-sm text-[#191919] mt-2 leading-snug">
              {currentUser.name}
            </h2>
            <p className="text-xs text-[#5e5e5e] line-clamp-2 mt-0.5">
              {currentUser.description}
            </p>
            <div className="mt-2 flex justify-center">
              <Badge variant="default" className="text-[10px]">
                {currentUser.personaKey}
              </Badge>
            </div>
          </div>

          <div className="linkedin-divider p-3 text-xs space-y-2 bg-[#fafaf9]">
            <div className="flex items-center justify-between">
              <span className="text-[#5e5e5e]">Organization:</span>
              <span className="font-semibold text-[#191919] truncate max-w-[130px]">
                {currentUser.organizationName || 'Verified Independent'}
              </span>
            </div>
            {currentUser.branchName && (
              <div className="flex items-center justify-between">
                <span className="text-[#5e5e5e]">Branch:</span>
                <span className="font-semibold text-[#191919]">{currentUser.branchName}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#5e5e5e]">Identity State:</span>
              <span className="text-[#057642] font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            </div>
          </div>

          <div className="linkedin-divider p-2">
            <Link
              href="/messages"
              className="flex items-center justify-between p-2 rounded hover:bg-[#f3f2ef] text-xs font-semibold text-[#191919] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-[#0a66c2]" />
                My Deal Rooms
              </span>
              <span className="text-xs text-[#0a66c2] font-bold">1</span>
            </Link>
            <Link
              href="/deals"
              className="flex items-center justify-between p-2 rounded hover:bg-[#f3f2ef] text-xs font-semibold text-[#191919] transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileSignature className="h-3.5 w-3.5 text-[#057642]" />
                Escrow Contracts
              </span>
              <span className="text-xs text-[#057642] font-bold">1 Active</span>
            </Link>
          </div>
        </div>

        <div className="linkedin-card p-3 space-y-2">
          <div className="text-xs font-bold text-[#191919] flex items-center justify-between">
            <span>Branch Budget Governance</span>
            <span className="text-[10px] text-[#5e5e5e]">Q4 2026</span>
          </div>
          <p className="text-[11px] text-[#5e5e5e]">
            North America branch allocation: <strong>$100,000</strong>. Remaining funds protected by platform milestone escrow.
          </p>
          <Link href="/enterprise/dashboard">
            <Button variant="outline" size="sm" className="w-full text-xs mt-1">
              Enterprise Dashboard
            </Button>
          </Link>
        </div>
      </aside>

      {/* CENTER FEED */}
      <main className="lg:col-span-6 space-y-4">
        {/* LinkedIn-style search card */}
        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.avatarFallback}
            </div>
            <Link
              href="/feed"
              className="flex-1 bg-[#f4f2ee] hover:bg-[#ebebeb] border border-[#e0dfdc] rounded-full px-4 py-2 text-xs text-[#5e5e5e] font-medium transition-colors flex items-center justify-between"
            >
              <span>Search creators by natural language, rates, or aesthetic vibe...</span>
              <Sparkles className="h-4 w-4 text-[#0a66c2]" />
            </Link>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-[#f0f0f0] text-xs font-semibold text-[#5e5e5e]">
            <Link href="/feed" className="flex items-center gap-2 p-1.5 rounded hover:bg-[#f3f2ef] transition-colors">
              <Search className="h-4 w-4 text-[#0a66c2]" />
              <span>AI Search</span>
            </Link>
            <Link href="/messages" className="flex items-center gap-2 p-1.5 rounded hover:bg-[#f3f2ef] transition-colors">
              <Lock className="h-4 w-4 text-[#057642]" />
              <span>Isolated Chat</span>
            </Link>
            <Link href="/deals" className="flex items-center gap-2 p-1.5 rounded hover:bg-[#f3f2ef] transition-colors">
              <FileSignature className="h-4 w-4 text-[#915907]" />
              <span>E-Sign Escrow</span>
            </Link>
            <Link href="/onboarding/verify" className="flex items-center gap-2 p-1.5 rounded hover:bg-[#f3f2ef] transition-colors">
              <ShieldCheck className="h-4 w-4 text-[#0a66c2]" />
              <span>Verify</span>
            </Link>
          </div>
        </div>

        {/* Feature 1: Two-Phase Verification */}
        <div className="linkedin-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[6px] bg-[#e6f4ea] text-[#057642] flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#191919]">Two-Phase HITL Verification Moat</h3>
                <span className="text-[11px] text-[#5e5e5e]">Automated Whisper ASR and Auditor Review</span>
              </div>
            </div>
            <Badge variant="accent" className="text-[10px]">Anti-Scam Moat</Badge>
          </div>

          <p className="text-xs text-[#191919] leading-relaxed">
            Eliminate impersonation fraud and botted screenshots. Creators and brand reps record a live video reciting a dynamic 6-word session nonce (e.g. <code className="bg-[#f4f2ee] px-1 py-0.5 rounded text-[#0a66c2]">CollaboNet-Tiger-901-Falcon</code>). OpenAI Whisper transcribes the audio stream with over 95% confidence before Phase 2 admin review.
          </p>

          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] p-3 text-xs text-[#5e5e5e] flex items-center justify-between">
            <span>Dynamic Liveness Nonce: Multi-channel SMS OTP: Corporate Domain DNS Check</span>
            <Link href="/onboarding/verify">
              <Button size="sm" variant="outline" className="text-xs h-7">
                Test Verification
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature 2: Strict Peer Chat Isolation (RLS) */}
        <div className="linkedin-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[6px] bg-[#ebf4fd] text-[#0a66c2] flex items-center justify-center font-bold">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#191919]">Strict Peer Representative Isolation</h3>
                <span className="text-[11px] text-[#5e5e5e]">PostgreSQL 16 Database Row-Level Security (RLS)</span>
              </div>
            </div>
            <Badge variant="default" className="text-[10px]">Security Moat</Badge>
          </div>

          <p className="text-xs text-[#191919] leading-relaxed">
            In multi-branch enterprises (such as Nike NA, APAC, EMEA), representatives negotiate independently. Row-Level Security ensures that <strong>Sales Rep A</strong> can chat with Creator Rohan, while <strong>Sales Rep B</strong> is strictly blocked with a <code className="bg-[#ffedea] text-[#c4242a] px-1 py-0.5 rounded">403 Forbidden</code> response.
          </p>

          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] p-3 flex items-center justify-between">
            <div className="text-xs text-[#5e5e5e]">
              Currently logged in as: <strong className="text-[#191919]">{currentUser.name}</strong>
            </div>
            <Link href="/messages">
              <Button size="sm" variant="primary" className="text-xs h-7">
                Open Isolated Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature 3: Chat-to-Contract & Cryptographic Signing */}
        <div className="linkedin-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[6px] bg-[#fef3d6] text-[#915907] flex items-center justify-center font-bold">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#191919]">One-Click Chat-to-Contract Auto-Draft</h3>
                <span className="text-[11px] text-[#5e5e5e]">SHA-256 Digital Signatures and Milestone Escrow</span>
              </div>
            </div>
            <Badge variant="warning" className="text-[10px]">Instant Extraction</Badge>
          </div>

          <p className="text-xs text-[#191919] leading-relaxed">
            Convert informal negotiation messages into standardized legal agreements in 2 seconds. The AI parses agreed milestone amounts, due dates, format specs, and exclusivity caps directly into ready-to-sign contracts backed by cryptographic digital audit hashes.
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#5e5e5e]">Standardized 48h review window and 2-round revision limits</span>
            <Link href="/deals">
              <Button size="sm" variant="outline" className="text-xs h-7">
                View Contracts
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* RIGHT RAIL */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#191919] flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-[#915907]" />
              Collision Radar
            </h3>
            <Badge variant="warning" className="text-[9px]">Active Watch</Badge>
          </div>

          <p className="text-[11px] text-[#5e5e5e] leading-relaxed">
            Zero-Knowledge coordinator detects when peer branches have previous deal histories with the same creator:
          </p>

          <div className="p-2.5 rounded bg-[#fef3d6]/60 border border-[#f9e2a8] text-xs text-[#915907] space-y-1">
            <div className="font-bold">Rohan Tech Studio</div>
            <div className="text-[11px]">
              APAC branch completed deal at ~$1,750. Avoid internal bidding wars while keeping transcripts 100% private.
            </div>
          </div>
        </div>

        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#191919] flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#0a66c2]" />
              Competitor Sponsorships
            </h3>
            <Badge variant="default" className="text-[9px]">Ad Scanner</Badge>
          </div>

          <div className="space-y-2 text-xs">
            {SEED_COMPETITOR_RADAR.map((item) => (
              <div key={item.id} className="p-2 rounded border border-[#e0dfdc] bg-[#fafaf9]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#191919]">{item.competitorBrandName}</span>
                  <span className="text-[10px] text-[#c4242a] font-semibold">
                    {item.exclusivityDaysRemaining ? `${item.exclusivityDaysRemaining}d remaining` : 'Expired'}
                  </span>
                </div>
                <div className="text-[10px] text-[#5e5e5e] truncate mt-0.5">{item.postUrl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="linkedin-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#c4242a] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#c4242a]" />
              Hall of Shame
            </h3>
            <span className="text-[10px] text-[#5e5e5e]">Public Ledger</span>
          </div>
          <p className="text-[11px] text-[#5e5e5e]">
            Adjudicated defaults and ghosting cases are permanently recorded on the public ledger.
          </p>
          <Link href="/hall-of-shame" className="text-xs text-[#0a66c2] hover:underline font-semibold flex items-center gap-1 mt-1">
            <span>Inspect blacklisted entities</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
