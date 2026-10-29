'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Search, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Copy, 
  Check, 
  Tag, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Video 
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
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const samplePrompts = [
    'Find Indian fintech creators who do 60s YouTube integrations under $2,000 with >4% engagement',
    'Tech creators with minimalist aesthetic desk setups in US or India',
    'Lifestyle and fitness creators with >5% engagement and high brand safety score',
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
        chips.push(`Max Rate: $${data.parsedFilters.maxRate.toLocaleString()}`);
      }
      if (data.parsedFilters?.minEngagementRate) {
        chips.push(`Min Engagement: ${(data.parsedFilters.minEngagementRate * 100).toFixed(0)}%`);
      }
      if (data.parsedFilters?.deliverableFormat) {
        chips.push(`Format: ${data.parsedFilters.deliverableFormat}`);
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
    <div className="space-y-6">
      {/* Search Header Container */}
      <div className="linkedin-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#191919] tracking-tight">
              Creator Marketplace &amp; AI Search
            </h1>
            <p className="text-xs text-[#5e5e5e] mt-0.5">
              Structured filters with pgvector cosine vibe similarity and brand safety verification.
            </p>
          </div>
          <Badge variant="accent" className="text-xs self-start sm:self-center">
            Verified Roster Active
          </Badge>
        </div>

        {/* Search Input Box */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-1.5 rounded-[4px] border border-[#b2b2b2] bg-white focus-within:border-[#0a66c2] focus-within:ring-1 focus-within:ring-[#0a66c2] transition-colors">
            <Search className="h-4 w-4 text-[#5e5e5e] ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
              placeholder="e.g. Find Indian fintech creators who do 60s YouTube integrations under $2,000..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-[#191919] placeholder:text-[#5e5e5e] px-2"
            />
            <Button
              size="sm"
              onClick={() => performSearch(query)}
              disabled={loading}
              className="h-8 px-4 text-xs font-semibold"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Active Parsed Badges */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#5e5e5e] mr-1">Parsed Filters:</span>
              {activeChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-[#ebf4fd] text-[#0a66c2] border border-[#cce4f9] font-medium"
                >
                  {chip}
                </span>
              ))}
              <button
                onClick={() => {
                  setQuery('');
                  setActiveChips([]);
                  performSearch('');
                }}
                className="text-xs text-[#0a66c2] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#5e5e5e]">
            <span>Try searching:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  performSearch(p);
                }}
                className="text-xs text-[#0a66c2] hover:bg-[#ebf4fd] border border-[#e0dfdc] rounded-full px-3 py-1 transition-colors"
              >
                {p.slice(0, 48)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#191919]">Ranked Creator Matches</h2>
          <span className="text-xs text-[#5e5e5e]">({creators.length} verified creators)</span>
        </div>
        <span className="text-xs text-[#5e5e5e]">Ranked by Vibe Match &amp; Brand Safety</span>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creators.map((c) => {
          const hasCollision = !!c.internalCollisionNotice;
          const hasRivalAlert = !!c.competitorAlert;

          return (
            <div
              key={c.id}
              className="linkedin-card p-4 flex flex-col justify-between hover:border-[#b2b2b2] transition-colors"
            >
              <div>
                {/* Header Profile info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#f4f2ee] border border-[#e0dfdc] text-[#0a66c2] font-bold text-sm flex items-center justify-center shrink-0">
                      {c.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-[#191919] hover:text-[#0a66c2] transition-colors cursor-pointer" onClick={() => setSelectedCreator(c)}>
                          {c.displayName}
                        </h3>
                        <CheckCircle className="h-3.5 w-3.5 text-[#057642] shrink-0" />
                      </div>
                      <div className="text-xs text-[#5e5e5e]">{c.handle} • {c.city}, {c.countryCode}</div>
                    </div>
                  </div>

                  <Badge variant="accent" className="text-[10px]">
                    {c.aiBrandSafetyScore}% Safety
                  </Badge>
                </div>

                <p className="text-xs text-[#191919] line-clamp-2 mb-3 leading-relaxed">
                  {c.bio}
                </p>

                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.vibeTags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-[11px] bg-[#f4f2ee] text-[#5e5e5e] px-2 py-0.5 rounded border border-[#e0dfdc]">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats Table */}
                <div className="grid grid-cols-3 gap-1 py-2 px-3 rounded bg-[#f9fafb] border border-[#e8e7e3] text-center mb-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[#5e5e5e]">Subscribers</div>
                    <div className="font-bold text-[#191919] tabular-nums">
                      {formatCompactNumber(c.statsCache.subscribers)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#5e5e5e]">Engagement</div>
                    <div className="font-bold text-[#057642] tabular-nums">
                      {(c.statsCache.engagementRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#5e5e5e]">Avg Views</div>
                    <div className="font-bold text-[#191919] tabular-nums">
                      {formatCompactNumber(c.statsCache.avgViews)}
                    </div>
                  </div>
                </div>

                {/* Rates */}
                <div className="flex items-center justify-between text-xs py-1 border-t border-[#f0f0f0]">
                  <span className="text-[#5e5e5e]">60s YouTube Integration:</span>
                  <span className="font-bold text-[#191919] tabular-nums">
                    {c.rates.yt_integrated_60s ? formatCurrency(c.rates.yt_integrated_60s) : 'Rate on request'}
                  </span>
                </div>

                {/* AI Match Explanation */}
                {c.aiMatchReason && (
                  <div className="mt-2 p-2 rounded bg-[#ebf4fd] border border-[#cce4f9] text-[11px] text-[#0a66c2]">
                    <span className="font-semibold">AI Match: </span>
                    {c.aiMatchReason}
                  </div>
                )}

                {/* Zero-Knowledge Collision Warning */}
                {hasCollision && (
                  <div className="mt-2 p-2 rounded bg-[#fef3d6] border border-[#f9e2a8] text-[11px] text-[#915907] flex items-start gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#915907] shrink-0 mt-0.5" />
                    <div>
                      <strong>Cross-Branch Notice: </strong>
                      {c.internalCollisionNotice.branchName} previously worked with this creator at ~${c.internalCollisionNotice.historicalRate}. Avoid internal bidding wars.
                    </div>
                  </div>
                )}

                {/* Rival Exclusivity Alert */}
                {hasRivalAlert && (
                  <div className="mt-2 p-2 rounded bg-[#ffedea] border border-[#fcd4cd] text-[11px] text-[#c4242a] flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-[#c4242a] shrink-0 mt-0.5" />
                    <div>
                      <strong>Exclusivity Warning: </strong>
                      Sponsored post for rival brand <strong>{c.competitorAlert.brand}</strong> published {c.competitorAlert.daysAgo} days ago ({c.competitorAlert.daysRemaining}d cooling remaining).
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#f0f0f0] mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCreator(c)}
                  className="flex-1 text-xs h-8"
                >
                  Intelligence
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCreator(c);
                    handleGeneratePitch(c);
                  }}
                  className="flex-1 text-xs h-8 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Outreach
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
          description={`Verified ${selectedCreator.primaryNiche} creator in ${selectedCreator.city}, ${selectedCreator.countryCode}`}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            {selectedCreator.internalCollisionNotice && (
              <Alert variant="warning">
                <ShieldAlert className="h-4 w-4 text-[#915907]" />
                <AlertTitle>Zero-Knowledge Cross-Branch Collision Alert</AlertTitle>
                <AlertDescription>
                  {selectedCreator.internalCollisionNotice.message}
                </AlertDescription>
              </Alert>
            )}

            {selectedCreator.competitorAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 text-[#c4242a]" />
                <AlertTitle>Competitor Exclusivity Warning</AlertTitle>
                <AlertDescription>
                  {selectedCreator.competitorAlert.warning}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h4 className="text-xs font-semibold text-[#5e5e5e] mb-2">
                Verified Platform Rate Card
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3]">
                  <div className="text-xs text-[#5e5e5e]">Instagram Reel</div>
                  <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">
                    {formatCurrency(selectedCreator.rates.ig_reel || 0)}
                  </div>
                </div>
                <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3]">
                  <div className="text-xs text-[#5e5e5e]">60s YouTube Integration</div>
                  <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">
                    {formatCurrency(selectedCreator.rates.yt_integrated_60s || 0)}
                  </div>
                </div>
                <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3]">
                  <div className="text-xs text-[#5e5e5e]">Dedicated Video</div>
                  <div className="text-sm font-bold text-[#191919] tabular-nums mt-0.5">
                    {formatCurrency(selectedCreator.rates.yt_dedicated || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#5e5e5e] mb-2">
                Audited Content Samples
              </h4>
              <div className="space-y-2">
                {selectedCreator.portfolioSamples.map((sample: any, idx: number) => (
                  <div key={idx} className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#191919]">{sample.title}</div>
                      <div className="text-[11px] text-[#5e5e5e]">{sample.views} • Verified by WorkerSocial sync</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Verified Metric</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
              <Button variant="outline" onClick={() => setSelectedCreator(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleGeneratePitch(selectedCreator)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Draft Personalized Pitch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Outreach Pitch Generator Modal */}
      <Modal
        isOpen={outreachModalOpen}
        onClose={() => setOutreachModalOpen(false)}
        title="AI Personalized Outreach Copilot"
        description="Generates tailored outreach hooks using creator bio, recent content topics, and engagement metrics."
        className="max-w-xl"
      >
        <div className="space-y-4">
          {generatingPitch ? (
            <div className="py-12 text-center space-y-2 text-xs text-[#5e5e5e]">
              <Sparkles className="h-6 w-6 text-[#0a66c2] mx-auto" />
              <p>Synthesizing creator portfolio and campaign brief...</p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs text-[#191919] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {generatedPitch}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0]">
                <span className="text-xs text-[#5e5e5e]">
                  Pre-fills connection pitch
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1.5 text-xs">
                    {copiedPitch ? <Check className="h-3.5 w-3.5 text-[#057642]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedPitch ? 'Copied' : 'Copy Pitch'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setOutreachModalOpen(false);
                      window.location.href = '/messages';
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send &amp; Open Deal Room
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
