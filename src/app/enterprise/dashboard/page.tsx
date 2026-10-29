'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  ArrowRightLeft, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2
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
    <div className="space-y-6">
      {/* Enterprise Executive Header */}
      <div className="linkedin-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#191919] tracking-tight">Enterprise Multi-Branch Executive Hub</h1>
            <Badge variant="info" className="text-xs">Global CMO View</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            {SEED_ORGANIZATION.legalName} • Corporate Domain: {SEED_ORGANIZATION.corporateDomain}
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setReassignModalOpen(true)}
          className="gap-2 text-xs h-8"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Deal Succession Handover
        </Button>
      </div>

      {/* Top Level Metric Cards (KPI container split by 1px rules) */}
      <div className="linkedin-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e7e3]">
        <div className="p-4 space-y-1">
          <div className="text-xs text-[#5e5e5e]">Master Escrow Balance</div>
          <div className="text-xl font-bold text-[#191919] tabular-nums">
            {formatCurrency(SEED_ORGANIZATION.billingPoolBalance)}
          </div>
          <span className="text-[11px] text-[#057642] flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Centralized Global Wallet
          </span>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs text-[#5e5e5e]">Active Regional Branches</div>
          <div className="text-xl font-bold text-[#191919] tabular-nums">
            3 Workspaces
          </div>
          <span className="text-[11px] text-[#5e5e5e]">NA, APAC, EMEA</span>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs text-[#5e5e5e]">Total Monthly Spend</div>
          <div className="text-xl font-bold text-[#0a66c2] tabular-nums">
            {formatCurrency(144700)}
          </div>
          <span className="text-[11px] text-[#5e5e5e]">58% of Allocated Pool</span>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs text-[#5e5e5e]">Rival Exclusivity Conflicts</div>
          <div className="text-xl font-bold text-[#915907] tabular-nums">
            2 Detected
          </div>
          <span className="text-[11px] text-[#915907]">Puma and Under Armour Scans</span>
        </div>
      </div>

      {/* Regional Branches Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#191919]">Regional Branch Budgets &amp; Activity</h2>
          <div className="flex items-center gap-1 bg-[#f4f2ee] p-1 rounded border border-[#e0dfdc]">
            {['ALL', 'branch_nike_na', 'branch_nike_apac', 'branch_nike_emea'].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedBranchId(id)}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                  selectedBranchId === id
                    ? 'bg-white text-[#0a66c2] border border-[#e0dfdc]'
                    : 'text-[#5e5e5e] hover:text-[#191919]'
                }`}
              >
                {id === 'ALL' ? 'All Branches' : id.replace('branch_nike_', '').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredBranches.map((b) => {
            const usagePercent = Math.round((b.spentThisMonth / b.monthlyBudgetAllocation) * 100);

            return (
              <div key={b.id} className="linkedin-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#191919]">{b.branchName}</h3>
                    <p className="text-xs text-[#5e5e5e]">{b.locationCity}, {b.locationCountry}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] tabular-nums">
                    {usagePercent}% utilized
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs tabular-nums">
                    <span className="text-[#5e5e5e]">Spent: {formatCurrency(b.spentThisMonth)}</span>
                    <span className="text-[#191919] font-semibold">Max: {formatCurrency(b.monthlyBudgetAllocation)}</span>
                  </div>
                  <div className="h-2 w-full bg-[#f4f2ee] rounded-full overflow-hidden border border-[#e0dfdc]">
                    <div
                      className={`h-full rounded-full transition-colors ${
                        usagePercent > 80 ? 'bg-[#915907]' : 'bg-[#0a66c2]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#5e5e5e]">
                  <span>Reps: <strong>4 Deal Owners</strong></span>
                  <span className="text-[#057642] font-semibold">Active Deals: 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rival Intelligence Radar & Executive ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2">
            <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#915907]" />
              Competitor Sponsorship Radar
            </h2>
            <Badge variant="warning" className="text-[10px]">Automated Ad Scan</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            WorkerSocial scanner actively monitors competitor keywords ({SEED_ORGANIZATION.competitorKeywords.join(', ')}) across YouTube and Instagram:
          </p>

          <div className="space-y-2">
            {SEED_COMPETITOR_RADAR.map((item) => (
              <div key={item.id} className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#191919]">Rival Brand: {item.competitorBrandName}</span>
                  <Badge variant={item.exclusivityDaysRemaining ? 'destructive' : 'secondary'} className="text-[10px]">
                    {item.exclusivityDaysRemaining ? `${item.exclusivityDaysRemaining}d Exclusivity Left` : 'Cooling Expired'}
                  </Badge>
                </div>
                <div className="text-[11px] text-[#5e5e5e]">
                  Platform: {item.platform} • Method: {item.detectedVia}
                </div>
                <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#0a66c2] hover:underline block truncate">
                  {item.postUrl}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="linkedin-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2">
            <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0a66c2]" />
              Executive ROI &amp; Velocity Synthesizer
            </h2>
            <Badge variant="accent" className="text-[10px]">Q4 AI Digest</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            Performance benchmarking across regional offices:
          </p>

          <div className="space-y-2.5 text-xs text-[#191919]">
            <div className="p-3 rounded bg-[#ebf4fd] border border-[#cce4f9] space-y-1">
              <div className="font-semibold text-[#0a66c2]">Deal-Close Velocity:</div>
              <p className="text-[#191919]">APAC branch closed deals 22% faster than EMEA this quarter with an average negotiation cycle of 2.4 days.</p>
            </div>

            <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1">
              <div className="font-semibold text-[#191919]">Rate Efficiency Benchmark:</div>
              <p className="text-[#5e5e5e]">North America branch is paying within 4% of market average for tech integrations, avoiding overpayment via Zero-Knowledge Collision radar.</p>
            </div>

            <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1">
              <div className="font-semibold text-[#191919]">Revision Friction:</div>
              <p className="text-[#5e5e5e]">Contract-to-Approval turnaround maintained at 38 hours, well below the standard 48h automated platform cutoff window.</p>
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
        title="Zero-Downtime Deal Reassignment"
        description="Transfer deal ownership to another representative and generate an AI handover briefing."
        className="max-w-xl"
      >
        {reassignSuccess ? (
          <div className="space-y-3">
            <Alert variant="accent">
              <CheckCircle2 className="h-4 w-4 text-[#057642]" />
              <AlertTitle>Deal Reassigned Successfully</AlertTitle>
              <AlertDescription>
                Conversation access updated in database. The new representative can immediately chat with the creator without reading historical messages.
              </AlertDescription>
            </Alert>

            <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5 text-xs">
              <div className="font-semibold text-[#191919]">AI Handover Briefing:</div>
              <div className="text-[#5e5e5e]">
                <strong>Current Stage: </strong>
                {reassignSuccess.handoverAuditLog?.handoverBriefSummary?.dealStage}
              </div>
              <div className="text-[#5e5e5e]">
                <strong>Immediate Action Items: </strong>
                <ul className="list-disc list-inside mt-1 text-xs text-[#0a66c2]">
                  {reassignSuccess.handoverAuditLog?.handoverBriefSummary?.immediateActionItems?.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f0f0f0]">
              <Button
                variant="primary"
                onClick={() => {
                  setReassignModalOpen(false);
                  setReassignSuccess(null);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleExecuteReassignment} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#191919]">Select Deal</label>
              <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs text-[#191919]">
                Rohan Tech Studio (Nike Air Max Pulse 2026) : Currently Alice Zhang
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#191919]">New Deal Owner</label>
              <select
                value={newRepId}
                onChange={(e) => {
                  setNewRepId(e.target.value);
                  setNewRepName(e.target.value === 'user_rep_bob' ? 'Bob Miller (Sales Rep B)' : 'Charlie Gomez (APAC Rep)');
                }}
                className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] outline-none focus:border-[#0a66c2]"
              >
                <option value="user_rep_bob">Bob Miller : North America Branch (Sales Rep B)</option>
                <option value="user_rep_charlie">Charlie Gomez : APAC Branch (Sales Rep C)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#191919]">Reason for Succession</label>
              <textarea
                value={handoverReason}
                onChange={(e) => setHandoverReason(e.target.value)}
                required
                className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] outline-none focus:border-[#0a66c2] h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
              <Button type="button" variant="outline" onClick={() => setReassignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={reassigning}>
                {reassigning ? 'Generating Brief...' : 'Execute Reassignment'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
