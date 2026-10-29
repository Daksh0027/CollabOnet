'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FileSignature, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="space-y-5">
      <div className="linkedin-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#191919] tracking-tight">Legal Contracts &amp; Escrow</h1>
          <p className="text-xs text-[#5e5e5e] mt-0.5">
            Cryptographically signed agreements with SHA-256 digital hashes and automated milestone disbursement.
          </p>
        </div>
        <Link href="/messages">
          <Button size="sm" variant="outline" className="gap-2 text-xs h-8">
            <FileSignature className="h-4 w-4" />
            Extract New From Chat
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#5e5e5e]">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="linkedin-card p-8 text-center">
          <p className="text-xs text-[#5e5e5e]">No active contracts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => {
            const isCompleted = c.status === 'COMPLETED';
            const isActive = c.status === 'ACTIVE_IN_PROGRESS';

            return (
              <div key={c.id} className="linkedin-card p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={isCompleted ? 'accent' : isActive ? 'info' : 'warning'}>
                      {c.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs text-[#191919] font-bold tabular-nums">
                      {formatCurrency(c.totalAmount, c.currency)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#191919]">
                    {c.creatorDisplayName} × {c.branchName}
                  </h3>

                  <div className="text-xs text-[#5e5e5e] space-y-0.5">
                    <div>Lead Rep: <strong className="text-[#191919]">{c.assignedRepName}</strong></div>
                    <div>Creator: <strong className="text-[#191919]">{c.creatorHandle}</strong></div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#f0f0f0]">
                  <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs">
                    <span className="text-[#5e5e5e]">Milestones: </span>
                    <strong className="text-[#191919]">
                      {c.milestones.filter((m) => m.status === 'APPROVED').length} of {c.milestones.length} Released
                    </strong>
                  </div>

                  <Link href={`/deals/${c.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full justify-between text-xs h-8">
                      <span>Open Deal Room &amp; Signatures</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
