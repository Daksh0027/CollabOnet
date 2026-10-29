'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Scale, 
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { SEED_HALL_OF_SHAME } from '@/lib/store';
import { HallOfShameEntry } from '@/lib/types';

export default function HallOfShamePage() {
  const [entries, setEntries] = useState<HallOfShameEntry[]>(SEED_HALL_OF_SHAME);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="linkedin-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-l-[#c4242a]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#191919] tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#c4242a]" />
              The Platform Hall of Shame
            </h1>
            <Badge variant="destructive" className="text-xs">Public Accountability Ledger</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e] max-w-2xl">
            Immutable directory of adjudicated contract breaches, payment defaults, and ghosting incidents. Adjudicated under platform terms after an expired 72-hour grace period.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-[#5e5e5e]">Total Adjudicated Losses:</div>
          <div className="text-lg font-bold text-[#c4242a] tabular-nums">
            {formatCurrency(12700)}
          </div>
          <span className="text-[11px] text-[#717171]">2 Permanent Blacklists</span>
        </div>
      </div>

      {/* Tribunal Notice */}
      <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs text-[#5e5e5e] flex items-start gap-2.5">
        <Scale className="h-4 w-4 text-[#0a66c2] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#191919]">CollaboNet Tribunal Standard Operating Procedure:</span>
          <p className="text-[11px] leading-relaxed">
            Every entry requires signed milestone escrow contracts, cryptographic hash proofs, chat transcripts, and reverse-image evidence. A mandatory 72-hour mediation window is granted prior to public ledger publication.
          </p>
        </div>
      </div>

      {/* Grid of Shame Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="linkedin-card p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="destructive" className="text-[10px] mb-1">
                    {entry.offenseCategory}
                  </Badge>
                  <h3 className="font-bold text-base text-[#191919]">{entry.offenderName}</h3>
                  <span className="text-xs text-[#c4242a]">{entry.offenderHandle}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5e5e5e]">Claim Amount</span>
                  <div className="text-sm font-bold text-[#c4242a] tabular-nums">
                    {formatCurrency(entry.totalClaimValue)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#191919] leading-relaxed bg-[#f9fafb] p-3 rounded border border-[#e8e7e3]">
                {entry.summaryOfBreach}
              </p>

              {/* AI Neutral Chronological Timeline */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-[#191919] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#0a66c2]" />
                  AI Dispute Evidence Timeline:
                </div>
                <div className="space-y-1 pl-2 border-l-2 border-[#e8e7e3]">
                  {entry.aiEvidenceTimeline.map((item, idx) => (
                    <div key={idx} className="text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#717171]">{item.date}</span>
                        <span className="font-medium text-[#191919]">{item.event}</span>
                      </div>
                      <div className="text-[10px] text-[#5e5e5e] italic">
                        Proof: {item.verifiedProof}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[11px]">
              <span className="text-[#5e5e5e]">Reporter: <strong className="text-[#191919]">{entry.reporterName}</strong></span>
              <span className="text-[#057642] font-semibold">Adjudicated by {entry.adjudicatedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
