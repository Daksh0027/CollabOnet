'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Scale, 
  Clock,
  ShieldAlert,
  FileText,
  Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { SEED_HALL_OF_SHAME } from '@/lib/store';
import { HallOfShameEntry } from '@/lib/types';

export default function HallOfShamePage() {
  const [entries, setEntries] = useState<HallOfShameEntry[]>(SEED_HALL_OF_SHAME);

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-rose-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Public Fraud Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight flex items-center gap-2">
            The Hall of Shame
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Immutable public directory of adjudicated contract defaults, fee skim scams, and ghosted brand campaigns.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 text-right shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Adjudicated Losses</div>
          <div className="text-xl font-extrabold text-rose-600 tabular-nums">
            {formatCurrency(12700)}
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">2 Permanent Blacklists</span>
        </div>
      </div>

      {/* Tribunal Policy Strip */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-start gap-3 shadow-sm">
        <Scale className="h-4 w-4 text-[#0057FF] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-white tracking-wide">CollabOnet Tribunal Arbitration Standard:</div>
          <p className="text-neutral-400 leading-relaxed text-[11px]">
            Every listed entity was provided a mandatory 72-hour arbitration grace period. Publication occurs only after evidentiary review of signed SHA-256 contracts, unfulfilled deliverables, or unauthorized mediator fees.
          </p>
        </div>
      </div>

      {/* Grid of Shame Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="destructive" className="text-[10px] mb-2 font-bold uppercase tracking-wider">
                    {entry.offenseCategory}
                  </Badge>
                  <h3 className="font-extrabold text-lg text-neutral-950 leading-tight">
                    {entry.offenderName}
                  </h3>
                  <div className="text-xs text-rose-600 font-mono mt-0.5">{entry.offenderHandle}</div>
                </div>

                <div className="text-right bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                  <div className="text-[9px] font-bold text-rose-800 uppercase tracking-wider">Claim Value</div>
                  <div className="text-sm font-extrabold text-rose-600 tabular-nums">
                    {formatCurrency(entry.totalClaimValue)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/60">
                {entry.summaryOfBreach}
              </p>

              {/* Evidence Timeline */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#0057FF]" />
                  <span>Adjudicated Evidence Timeline</span>
                </div>
                <div className="space-y-2 pl-3 border-l-2 border-neutral-200 text-[11px]">
                  {entry.aiEvidenceTimeline.map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 font-mono text-[10px]">{item.date}</span>
                        <span className="font-semibold text-neutral-800">{item.event}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Proof: {item.verifiedProof}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Reported by: <strong className="text-neutral-700">{entry.reporterName}</strong></span>
              <span className="text-emerald-700 font-medium">Adjudicated: {entry.adjudicatedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
