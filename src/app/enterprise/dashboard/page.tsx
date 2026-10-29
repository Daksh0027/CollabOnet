'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  ArrowRightLeft, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { formatCurrency } from '@/lib/utils';
import { SEED_BRANCHES, SEED_ORGANIZATION, SEED_COMPETITOR_RADAR } from '@/lib/store';

export default function EnterpriseDashboardPage() {
  const { currentUser } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [reassignSuccess, setReassignSuccess] = useState<any | null>(null);

  const [newRepName, setNewRepName] = useState('Bob Miller (Sales Rep B)');
  const [newRepId, setNewRepId] = useState('user_rep_bob');
  const [handoverReason, setHandoverReason] = useState('Alice Zhang transitioning to seasonal Q4 leave: Bob Miller taking ownership.');

  const handleExecuteReassignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setReassigning(true);
    try {
      const res = await fetch('/api/v1/orgs/deals/conv_alice_rohan/reassign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          newRepresentativeId: newRepId,
          newRepresentativeName: newRepName,
          handoverReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReassignSuccess(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReassigning(false);
    }
  };

  const branches = SEED_BRANCHES;
  const filteredBranches = selectedBranchId === 'ALL'
    ? branches
    : branches.filter((b) => b.id === selectedBranchId);

  return (
    <div className="space-y-8">
      {/* Enterprise Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
            Enterprise Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Multi-Branch CMO Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl font-mono">
            {SEED_ORGANIZATION.legalName} • {SEED_ORGANIZATION.corporateDomain}
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setReassignModalOpen(true)}
          className="rounded-full gap-2 text-xs h-9 px-5 bg-neutral-950 text-white hover:bg-neutral-800"
        >
          <ArrowRightLeft className="h-3.5 w-3.5 text-[#0057FF]" />
          <span>Succession Handover</span>
        </Button>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Master Escrow Vault</div>
          <div className="text-2xl font-black text-neutral-950 tabular-nums">
            {formatCurrency(SEED_ORGANIZATION.billingPoolBalance)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Global Treasury Synced
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active Regional Branches</div>
          <div className="text-2xl font-black text-neutral-950 tabular-nums">
            3 Hubs
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">NA • APAC • EMEA</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Monthly Spend</div>
          <div className="text-2xl font-black text-[#0057FF] tabular-nums">
            {formatCurrency(144700)}
          </div>
          <span className="text-[11px] text-neutral-400">58% of Allocated Pool</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Exclusivity Conflicts</div>
          <div className="text-2xl font-black text-amber-600 tabular-nums">
            2 Detected
          </div>
          <span className="text-[11px] text-amber-700">Rival Cooling Periods Tracked</span>
        </div>
      </div>

      {/* Regional Branches Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-bold text-neutral-950">Regional Branch Budgets &amp; Allocation</h2>
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-full border border-neutral-200/60">
            {['ALL', 'branch_nike_na', 'branch_nike_apac', 'branch_nike_emea'].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedBranchId(id)}
                className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all cursor-pointer ${
                  selectedBranchId === id
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {id === 'ALL' ? 'All Hubs' : id.replace('branch_nike_', '').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBranches.map((b) => {
            const usagePercent = Math.round((b.spentThisMonth / b.monthlyBudgetAllocation) * 100);

            return (
              <div key={b.id} className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-neutral-950">{b.branchName}</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{b.locationCity}, {b.locationCountry}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] tabular-nums font-mono">
                    {usagePercent}% utilized
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs tabular-nums">
                    <span className="text-neutral-400">Disbursed: {formatCurrency(b.spentThisMonth)}</span>
                    <span className="text-neutral-950 font-bold">Cap: {formatCurrency(b.monthlyBudgetAllocation)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent > 80 ? 'bg-amber-500' : 'bg-[#0057FF]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                  <span>Authorized Reps: <strong className="text-neutral-700">4</strong></span>
                  <span className="text-emerald-700 font-medium">3 Active Contracts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rival Intelligence & Performance Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              Competitor Sponsorship Radar
            </h2>
            <Badge variant="warning" className="text-[10px]">Automated Scans</Badge>
          </div>
          <p className="text-xs text-neutral-500">
            Continuous social monitoring on competitor keywords: <span className="font-mono text-neutral-800 font-semibold">{SEED_ORGANIZATION.competitorKeywords.join(', ')}</span>.
          </p>

          <div className="space-y-2.5">
            {SEED_COMPETITOR_RADAR.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-950">Brand Conflict: {item.competitorBrandName}</span>
                  <Badge variant={item.exclusivityDaysRemaining ? 'destructive' : 'secondary'} className="text-[10px]">
                    {item.exclusivityDaysRemaining ? `${item.exclusivityDaysRemaining}d Remaining` : 'Expired'}
                  </Badge>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Platform: {item.platform} • Method: {item.detectedVia}
                </div>
                <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#0057FF] hover:underline block truncate font-mono">
                  {item.postUrl}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0057FF]" />
              Executive Velocity Digest
            </h2>
            <Badge variant="accent" className="text-[10px]">Q4 AI Digest</Badge>
          </div>
          <p className="text-xs text-neutral-500">
            Algorithmic benchmark synthesis across global branches:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
              <div className="font-bold text-neutral-950">Deal-Close Velocity:</div>
              <p className="text-neutral-600 leading-relaxed">APAC branch closed deals 22% faster than EMEA this quarter with an average negotiation cycle of 2.4 days.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
              <div className="font-bold text-neutral-950">Rate Efficiency Benchmark:</div>
              <p className="text-neutral-600 leading-relaxed">North America branch is paying within 4% of market average for tech integrations, avoiding overpayment via collision radar.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
              <div className="font-bold text-neutral-950">Revision Friction:</div>
              <p className="text-neutral-600 leading-relaxed">Turnaround maintained at 38 hours, well below the standard 48h automated platform cutoff window.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Succession Modal */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => {
          setReassignModalOpen(false);
          setReassignSuccess(null);
        }}
        title="Zero-Downtime Deal Succession"
        description="Transfer deal ownership to another representative and generate an AI handover briefing."
        className="max-w-xl"
      >
        {reassignSuccess ? (
          <div className="space-y-4">
            <Alert variant="accent">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle>Deal Reassigned Successfully</AlertTitle>
              <AlertDescription>
                Conversation access updated in database. The new representative can immediately chat with the creator without reading historical messages.
              </AlertDescription>
            </Alert>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2 text-xs">
              <div className="font-bold text-neutral-950">AI Handover Briefing:</div>
              <div className="text-neutral-600">
                <strong>Current Stage: </strong>
                {reassignSuccess.handoverAuditLog?.handoverBriefSummary?.dealStage}
              </div>
              <div className="text-neutral-600">
                <strong>Action Items: </strong>
                <ul className="list-disc list-inside mt-1 text-xs text-[#0057FF]">
                  {reassignSuccess.handoverAuditLog?.handoverBriefSummary?.immediateActionItems?.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100">
              <Button
                variant="primary"
                onClick={() => {
                  setReassignModalOpen(false);
                  setReassignSuccess(null);
                }}
                className="rounded-full bg-neutral-950 text-white"
              >
                Dismiss
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleExecuteReassignment} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900">Select Deal</label>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 font-mono">
                Rohan Tech Studio (Nike Air Max Pulse 2026) : Currently Alice Zhang
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900">New Deal Owner</label>
              <select
                value={newRepId}
                onChange={(e) => {
                  setNewRepId(e.target.value);
                  setNewRepName(e.target.value === 'user_rep_bob' ? 'Bob Miller (Sales Rep B)' : 'Charlie Gomez (APAC Rep)');
                }}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
              >
                <option value="user_rep_bob">Bob Miller : North America Branch (Sales Rep B)</option>
                <option value="user_rep_charlie">Charlie Gomez : APAC Branch (Sales Rep C)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900">Succession Justification</label>
              <textarea
                value={handoverReason}
                onChange={(e) => setHandoverReason(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950 h-24"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setReassignModalOpen(false)} className="rounded-full">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={reassigning} className="rounded-full bg-neutral-950 text-white">
                {reassigning ? 'Generating Brief...' : 'Execute Succession'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
