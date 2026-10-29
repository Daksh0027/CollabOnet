'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FileSignature, ShieldCheck, CheckCircle2, ArrowRight, Lock, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Contract } from '@/lib/types';

export default function DealsListPage() {
  const { currentUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/contracts')
      .then((res) => res.json())
      .then((data) => {
        setContracts(data.contracts || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active Escrow Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Legal Contracts &amp; Escrow
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Cryptographically signed agreements with SHA-256 digital hashes, multi-party timestamps, and milestone disbursement.
          </p>
        </div>

        <Link href="/messages">
          <Button size="sm" variant="primary" className="rounded-full gap-2 text-xs h-9 px-5 bg-neutral-950 text-white hover:bg-neutral-800">
            <FileSignature className="h-4 w-4 text-[#0057FF]" />
            Extract Deal From Chat
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
          <div className="text-xs text-neutral-400 font-medium">Loading escrow contracts...</div>
        </div>
      ) : contracts.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
          <FileSignature className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-950">No active contracts found</p>
          <p className="text-xs text-neutral-500 mt-1">Start a conversation in a deal room to auto-extract your first contract.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((c) => {
            const isCompleted = c.status === 'COMPLETED';
            const isActive = c.status === 'ACTIVE_IN_PROGRESS';
            const approvedCount = c.milestones.filter((m) => m.status === 'APPROVED').length;
            const progressPercent = Math.round((approvedCount / c.milestones.length) * 100);

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-lg hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={isCompleted ? 'emerald' : isActive ? 'accent' : 'warning'}>
                      {c.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-base font-extrabold text-neutral-950 tabular-nums">
                      {formatCurrency(c.totalAmount, c.currency)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-snug">
                      {c.creatorDisplayName} × {c.branchName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium mt-1">
                      <span>Rep: <strong className="text-neutral-700">{c.assignedRepName}</strong></span>
                      <span>•</span>
                      <span className="font-mono">{c.creatorHandle}</span>
                    </div>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700">Milestone Escrow</span>
                      <span className="font-mono text-neutral-500 text-[11px]">
                        {approvedCount} of {c.milestones.length} Released ({progressPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0057FF] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* SHA-256 Hash Footprint */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono truncate">
                    <Hash className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">sha256:{c.brandSignatureHash || c.creatorSignatureHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <Link href={`/deals/${c.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full justify-between rounded-full text-xs h-9 px-4 border-neutral-200">
                      <span>Inspect Agreement &amp; Audit Trail</span>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
