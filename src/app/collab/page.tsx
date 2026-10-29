'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users2, 
  Sparkles, 
  Zap, 
  Send,
  ArrowRightLeft,
  CheckCircle2,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEED_CREATORS } from '@/lib/store';

export default function CollabPage() {
  const { currentUser } = useAuth();
  const [creatorAId, setCreatorAId] = useState(SEED_CREATORS[0].id);
  const [creatorBId, setCreatorBId] = useState(SEED_CREATORS[1].id);
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<any[] | null>(null);

  const handleGenerateConcepts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/copilot/collab-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorAId, creatorBId }),
      });
      const data = await res.json();
      setConcepts(data.collaborationConcepts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const creatorA = SEED_CREATORS.find((c) => c.id === creatorAId) || SEED_CREATORS[0];
  const creatorB = SEED_CREATORS.find((c) => c.id === creatorBId) || SEED_CREATORS[1];

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
            Peer Barter Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Creator-to-Creator Collab Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Cross-pollinate audiences with fellow verified creators. AI synthesizes complementary niches into zero-dollar co-productions.
          </p>
        </div>

        <Button
          onClick={handleGenerateConcepts}
          disabled={loading}
          className="rounded-full gap-2 text-xs h-9 px-5 bg-neutral-950 text-white hover:bg-neutral-800"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#0057FF]" />
          {loading ? 'Synthesizing...' : 'Generate Co-Productions'}
        </Button>
      </div>

      {/* Creator Pair Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Creator A Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Host Creator (A)</span>
            <Badge variant="accent">{creatorA.primaryNiche}</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-neutral-200 shrink-0">
              <img
                src={creatorA.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={creatorA.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <select
                value={creatorAId}
                onChange={(e) => setCreatorAId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-neutral-900"
              >
                {SEED_CREATORS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName} ({c.handle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subscribers:</span>
              <span className="font-bold text-neutral-900 tabular-nums">{creatorA.statsCache.subscribers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Engagement:</span>
              <span className="font-bold text-emerald-600 tabular-nums">{(creatorA.statsCache.engagementRate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60">
              Vibes: {creatorA.vibeTags.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>

        {/* Creator B Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Partner Creator (B)</span>
            <Badge variant="emerald">{creatorB.primaryNiche}</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-neutral-200 shrink-0">
              <img
                src={creatorB.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                alt={creatorB.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <select
                value={creatorBId}
                onChange={(e) => setCreatorBId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-neutral-900"
              >
                {SEED_CREATORS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName} ({c.handle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subscribers:</span>
              <span className="font-bold text-neutral-900 tabular-nums">{creatorB.statsCache.subscribers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Engagement:</span>
              <span className="font-bold text-emerald-600 tabular-nums">{(creatorB.statsCache.engagementRate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60">
              Vibes: {creatorB.vibeTags.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Concepts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#0057FF]" />
          AI Synthesized Co-Production Concepts
        </h2>

        {!concepts ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-200 bg-white text-xs text-neutral-400 space-y-2">
            <ArrowRightLeft className="h-6 w-6 text-neutral-300 mx-auto" />
            <p className="font-medium text-neutral-700">Ready to synthesize collaborative opportunities</p>
            <p className="text-neutral-400 text-[11px]">Select any two creators above and hit &ldquo;Generate Co-Productions&rdquo;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map((concept, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Concept {idx + 1}</span>
                    <Badge variant="accent" className="text-[10px]">{concept.format.split(' ')[0]}</Badge>
                  </div>

                  <h3 className="font-bold text-base text-neutral-950 leading-snug">{concept.title}</h3>
                  <div className="text-xs text-[#0057FF] font-semibold">{concept.format}</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{concept.conceptPitch}</p>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-800 leading-snug">
                    <strong>Synergy: </strong>{concept.crossAudienceSynergy}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-9 gap-1.5 border-neutral-200">
                  <Send className="h-3 w-3 text-neutral-500" />
                  Initiate Collab in Chat
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
