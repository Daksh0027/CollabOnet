'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users2, 
  Sparkles, 
  Zap, 
  Send
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
    <div className="space-y-6">
      {/* Header */}
      <div className="linkedin-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#191919] tracking-tight">Creator Peer Barter Collab Hub</h1>
            <Badge variant="accent" className="text-xs">Zero Dollar Exchange</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            Cross-pollinate audiences with fellow verified creators. AI synthesizes complementary niches into co-productions.
          </p>
        </div>

        <Button
          onClick={handleGenerateConcepts}
          disabled={loading}
          className="gap-2 text-xs h-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {loading ? 'Synthesizing...' : 'Generate Barter Concepts'}
        </Button>
      </div>

      {/* Creator Selector Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Creator A */}
        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0a66c2]">Creator A (Lead Host)</span>
            <Badge variant="outline">{creatorA.primaryNiche}</Badge>
          </div>

          <select
            value={creatorAId}
            onChange={(e) => setCreatorAId(e.target.value)}
            className="w-full bg-[#f4f2ee] border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] font-medium outline-none focus:border-[#0a66c2]"
          >
            {SEED_CREATORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName} ({c.handle}) : {c.primaryNiche} in {c.city}
              </option>
            ))}
          </select>

          <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#5e5e5e]">Audience:</span>
              <span className="font-bold text-[#191919] tabular-nums">{creatorA.statsCache.subscribers.toLocaleString()} subs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e5e5e]">Engagement:</span>
              <span className="font-bold text-[#057642] tabular-nums">{(creatorA.statsCache.engagementRate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[11px] text-[#5e5e5e] pt-1 border-t border-[#e8e7e3]">
              Vibes: {creatorA.vibeTags.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>

        {/* Creator B */}
        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#057642]">Creator B (Co-Host)</span>
            <Badge variant="outline">{creatorB.primaryNiche}</Badge>
          </div>

          <select
            value={creatorBId}
            onChange={(e) => setCreatorBId(e.target.value)}
            className="w-full bg-[#f4f2ee] border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] font-medium outline-none focus:border-[#0a66c2]"
          >
            {SEED_CREATORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName} ({c.handle}) : {c.primaryNiche} in {c.city}
              </option>
            ))}
          </select>

          <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#5e5e5e]">Audience:</span>
              <span className="font-bold text-[#191919] tabular-nums">{creatorB.statsCache.subscribers.toLocaleString()} subs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e5e5e]">Engagement:</span>
              <span className="font-bold text-[#057642] tabular-nums">{(creatorB.statsCache.engagementRate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-[11px] text-[#5e5e5e] pt-1 border-t border-[#e8e7e3]">
              Vibes: {creatorB.vibeTags.slice(0, 3).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Concepts */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#915907]" />
          AI Synthesized Zero-Dollar Collab Blueprints
        </h2>

        {!concepts ? (
          <div className="p-8 text-center rounded-[8px] border border-dashed border-[#e0dfdc] bg-white text-xs text-[#5e5e5e]">
            Click &ldquo;Generate Barter Concepts&rdquo; to analyze audience match between {creatorA.displayName} and {creatorB.displayName}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {concepts.map((concept, idx) => (
              <div key={idx} className="linkedin-card p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#0a66c2] font-semibold">Concept #{idx + 1}</span>
                    <Badge variant="accent" className="text-[9px]">{concept.format.split(' ')[0]}</Badge>
                  </div>

                  <h3 className="font-bold text-xs text-[#191919]">{concept.title}</h3>
                  <div className="text-[11px] text-[#0a66c2] font-medium">{concept.format}</div>
                  <p className="text-xs text-[#5e5e5e] leading-relaxed">{concept.conceptPitch}</p>

                  <div className="p-2 rounded bg-[#f0fbf4] border border-[#c6ebd1] text-[11px] text-[#057642]">
                    <strong>Audience match: </strong>{concept.crossAudienceSynergy}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5 mt-2">
                  <Send className="h-3 w-3" />
                  Send Collab Pitch in Chat
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
