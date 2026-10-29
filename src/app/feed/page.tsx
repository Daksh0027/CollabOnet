'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Search, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  Tag, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Video,
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';
import { CreatorProfile } from '@/lib/types';

export default function FeedPage() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const categories = [
    'All',
    'Tech & Hardware',
    'Fintech',
    'Fitness',
    'Design & Creative',
    'Gaming',
    'Lifestyle',
  ];

  const samplePrompts = [
    'Indian fintech creators with >4% engagement under $2,000',
    'Minimalist desk setup & cinematic tech in US / India',
    'Fitness athletes with >5% engagement and high brand safety',
  ];

  const performSearch = async (promptText: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/marketplace/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          branchId: currentUser.branchId || 'branch_nike_na',
        }),
      });
      const data = await res.json();
      setCreators(data.creators || []);

      const chips: string[] = [];
      if (data.parsedFilters?.niches?.length) {
        data.parsedFilters.niches.forEach((n: string) => chips.push(`Niche: ${n}`));
      }
      if (data.parsedFilters?.countryCode) {
        chips.push(`Country: ${data.parsedFilters.countryCode}`);
      }
      if (data.parsedFilters?.maxRate) {
        chips.push(`Max: $${data.parsedFilters.maxRate.toLocaleString()}`);
      }
      if (data.parsedFilters?.minEngagementRate) {
        chips.push(`Min Eng: ${(data.parsedFilters.minEngagementRate * 100).toFixed(0)}%`);
      }
      if (data.appliedAestheticKeywords?.length) {
        data.appliedAestheticKeywords.forEach((k: string) => chips.push(`Vibe: ${k}`));
      }
      setActiveChips(chips);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch('');
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setQuery('');
      performSearch('');
    } else {
      setQuery(cat);
      performSearch(cat);
    }
  };

  const handleGeneratePitch = async (creator: CreatorProfile) => {
    setGeneratingPitch(true);
    setOutreachModalOpen(true);
    try {
      const res = await fetch('/api/v1/copilot/outreach-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: creator.id,
          campaignTitle: 'Nike Air Max Pulse 2026',
        }),
      });
      const data = await res.json();
      setGeneratedPitch(data.pitch || '');
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPitch(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-3 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
            Curated Creator Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Discover Verified Talent.
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Explore zero-scam influencer rosters with verified audience benchmarks, cryptographic KYC, and live escrow protection.
          </p>
        </div>

        {/* Global Live Stats Ticker */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-3 px-5 border border-neutral-200/80 shadow-xs text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Creators Indexed</div>
            <div className="font-extrabold text-neutral-950 text-base tabular-nums">1,420+</div>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Avg Safety Score</div>
            <div className="font-extrabold text-emerald-600 text-base tabular-nums">97.4%</div>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Default Rate</div>
            <div className="font-extrabold text-[#0057FF] text-base tabular-nums">0.0%</div>
          </div>
        </div>
      </div>

      {/* Behance-Style Category Filter Chips & AI Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Minimalist Search Box */}
        <div className="relative flex items-center bg-white rounded-2xl border border-neutral-200/80 p-2 shadow-xs focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all">
          <Search className="h-4 w-4 text-neutral-400 ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
            placeholder="Type a natural query: e.g. 'Indian fintech creators under $2,000 with >4% engagement'..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-neutral-900 placeholder:text-neutral-400 px-3 py-1"
          />
          <Button
            size="sm"
            onClick={() => performSearch(query)}
            disabled={loading}
            className="h-8 px-4 rounded-xl text-xs font-semibold"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Parsed Badges */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-medium">Applied Filters:</span>
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-medium border border-neutral-200"
              >
                {chip}
              </span>
            ))}
            <button
              onClick={() => {
                setQuery('');
                setActiveChips([]);
                setActiveCategory('All');
                performSearch('');
              }}
              className="text-xs text-[#0057FF] hover:underline font-medium ml-1"
            >
              Reset
            </button>
          </div>
        )}

        {/* Sample Prompt Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          <span>Suggestions:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                performSearch(p);
              }}
              className="text-xs text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200/60 rounded-full px-3 py-1 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
        <span className="font-semibold text-neutral-900">
          {creators.length} Curated Creators
        </span>
        <span>Ranked by Brand Safety &amp; Cosine Vibe Similarity</span>
      </div>

      {/* Behance-Style Visual Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((c) => {
          const hasCollision = !!c.internalCollisionNotice;
          const hasRivalAlert = !!c.competitorAlert;
          const coverImage = c.coverImageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
          const avatarImage = c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

          return (
            <div
              key={c.id}
              className="group bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 16:9 Visual Showcase Cover Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => setSelectedCreator(c)}>
                  <img
                    src={coverImage}
                    alt={c.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide uppercase border border-white/10">
                      {c.primaryNiche}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-tight shadow-sm flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {c.aiBrandSafetyScore}% Safety
                    </span>
                  </div>

                  {/* Bottom Rate Badge on Banner */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-neutral-900 font-bold text-xs shadow-md tabular-nums">
                      {c.rates.yt_integrated_60s ? formatCurrency(c.rates.yt_integrated_60s) : 'Rate on request'}
                    </span>
                  </div>
                </div>

                {/* Card Content & Profile */}
                <div className="p-5 pt-3">
                  {/* Avatar & Identifiers */}
                  <div className="flex items-start justify-between gap-3 -mt-9 relative z-10 mb-3">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-neutral-100 shrink-0">
                      <img src={avatarImage} alt={c.displayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1 mt-6">
                      <span className="text-[11px] text-neutral-400 font-medium">{c.city}, {c.countryCode}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedCreator(c)}>
                      <h3 className="font-bold text-base text-neutral-950 group-hover:text-[#0057FF] transition-colors leading-snug">
                        {c.displayName}
                      </h3>
                      <CheckCircle2 className="h-4 w-4 text-[#0057FF] shrink-0" />
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">{c.handle}</div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 mt-2.5 leading-relaxed">
                    {c.bio}
                  </p>

                  {/* Vibe Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.vibeTags.slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full border border-neutral-200/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Audience Data Matrix */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center mt-4">
                    <div>
                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Reach</div>
                      <div className="font-extrabold text-neutral-950 text-xs tabular-nums mt-0.5">
                        {formatCompactNumber(c.statsCache.subscribers)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Avg Views</div>
                      <div className="font-extrabold text-neutral-950 text-xs tabular-nums mt-0.5">
                        {formatCompactNumber(c.statsCache.avgViews)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Engagement</div>
                      <div className="font-extrabold text-emerald-600 text-xs tabular-nums mt-0.5">
                        {(c.statsCache.engagementRate * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Warnings & Notices */}
                  {hasCollision && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <strong>Cross-Branch Deal: </strong>
                        {c.internalCollisionNotice.branchName} hired at ~${c.internalCollisionNotice.historicalRate}.
                      </div>
                    </div>
                  )}

                  {hasRivalAlert && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <strong>Exclusivity Warning: </strong>
                        Active contract with {c.competitorAlert.brand} ({c.competitorAlert.daysRemaining}d remaining).
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCreator(c)}
                  className="flex-1 rounded-full text-xs h-9 border-neutral-200"
                >
                  Portfolio
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCreator(c);
                    handleGeneratePitch(c);
                  }}
                  className="flex-1 rounded-full text-xs h-9 gap-1.5 bg-neutral-950 text-white hover:bg-neutral-800"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#0057FF]" />
                  Pitch Deal
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creator Detail Modal */}
      {selectedCreator && (
        <Modal
          isOpen={!!selectedCreator && !outreachModalOpen}
          onClose={() => setSelectedCreator(null)}
          title={selectedCreator.displayName}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm shrink-0">
                <img
                  src={selectedCreator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={selectedCreator.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-neutral-950">{selectedCreator.displayName}</h3>
                <div className="text-xs text-neutral-500 font-mono">{selectedCreator.handle} • {selectedCreator.city}, {selectedCreator.countryCode}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="emerald" className="text-[10px]">
                    {selectedCreator.aiBrandSafetyScore}% Safety Score
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {selectedCreator.primaryNiche}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              {selectedCreator.bio}
            </p>

            {/* Standard Rates */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-neutral-900">Standard Card Rates</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="text-neutral-500 text-[10px]">Instagram Reel</div>
                  <div className="font-bold text-neutral-900 tabular-nums">
                    {selectedCreator.rates.ig_reel ? formatCurrency(selectedCreator.rates.ig_reel) : 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="text-neutral-500 text-[10px]">60s YouTube Integration</div>
                  <div className="font-bold text-neutral-900 tabular-nums">
                    {selectedCreator.rates.yt_integrated_60s ? formatCurrency(selectedCreator.rates.yt_integrated_60s) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Samples */}
            {selectedCreator.portfolioSamples?.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-neutral-900">Recent Production Samples</div>
                <div className="space-y-1.5">
                  {selectedCreator.portfolioSamples.map((sample: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 text-xs hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-[#0057FF]" />
                        <span className="font-medium text-neutral-900">{sample.title}</span>
                      </div>
                      <span className="text-neutral-400 font-mono text-[11px]">{sample.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCreator(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGeneratePitch(selectedCreator)}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#0057FF]" />
                Draft Outreach Pitch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Outreach Pitch Generator Modal */}
      <Modal
        isOpen={outreachModalOpen}
        onClose={() => setOutreachModalOpen(false)}
        title="AI Campaign Pitch Copilot"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Personalized outreach synthesized from creator's recent benchmarks, vibe aesthetics, and campaign brief terms.
          </p>

          {generatingPitch ? (
            <div className="p-8 text-center space-y-2">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
              <div className="text-xs text-neutral-500">Synthesizing personalized outreach pitch...</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={generatedPitch}
                  onChange={(e) => setGeneratedPitch(e.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs font-mono text-neutral-900 leading-relaxed outline-none focus:border-[#0057FF] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-1.5 text-xs rounded-full"
                >
                  {copiedPitch ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedPitch ? 'Copied to Clipboard' : 'Copy Pitch'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOutreachModalOpen(false)}
                    className="rounded-full"
                  >
                    Done
                  </Button>
                  <Link href="/messages">
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-1.5 rounded-full bg-neutral-950 text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Open Deal Room
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
