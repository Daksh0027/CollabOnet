'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FileSignature, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  UploadCloud, 
  Check, 
  Lock,
  Hash,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Contract } from '@/lib/types';

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params?.id as string;
  const { currentUser } = useAuth();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);

  const fetchContract = async () => {
    try {
      const res = await fetch('/api/v1/contracts');
      const data = await res.json();
      const found = (data.contracts || []).find((c: Contract) => c.id === dealId) || data.contracts[0];
      setContract(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [dealId]);

  const handleSignContract = async (signerRole: 'BRAND' | 'CREATOR') => {
    setSigning(true);
    try {
      const res = await fetch(`/api/v1/contracts/${contract?.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerRole,
          signerName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContract(data.contract);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSigning(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMilestoneId || !proofUrl) return;

    setSubmittingProof(true);
    try {
      const res = await fetch(`/api/v1/milestones/${activeMilestoneId}/submit-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract?.id,
          proofUrl,
          proofDescription,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitModalOpen(false);
        setProofUrl('');
        setProofDescription('');
        fetchContract();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingProof(false);
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      const res = await fetch(`/api/v1/milestones/${milestoneId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchContract();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !contract) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        <div className="text-xs text-neutral-400 font-medium">Loading agreement details...</div>
      </div>
    );
  }

  const isBrandSigned = !!contract.brandSignatureHash;
  const isCreatorSigned = !!contract.creatorSignatureHash;

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
              ESCROW #{contract.id.slice(-8)}
            </span>
            <Badge variant={contract.status === 'COMPLETED' ? 'emerald' : 'accent'} className="text-[10px]">
              {contract.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            {contract.creatorDisplayName} × {contract.branchName}
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Creator: {contract.creatorHandle} • Rep: {contract.assignedRepName}
          </p>
        </div>

        <div className="text-left sm:text-right bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Escrow Lock Amount</div>
          <div className="text-2xl font-black text-neutral-950 tabular-nums">
            {formatCurrency(contract.totalAmount, contract.currency)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5 justify-start sm:justify-end">
            <Lock className="h-3 w-3" />
            Milestone Vault Locked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contract Terms & Signatures */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-[#0057FF]" />
                Legal Agreement Specifications
              </h2>
              <Badge variant="outline" className="text-[10px] font-mono">SHA-256 Standard</Badge>
            </div>

            <div className="text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed bg-neutral-50 p-5 rounded-2xl border border-neutral-200/60 max-h-80 overflow-y-auto font-mono">
              {contract.termsMarkdown}
            </div>
          </div>

          {/* Cryptographic Digital Signatures */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 pb-3">
              <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                SHA-256 Digital Signatures &amp; Audit Trail
              </h2>
            </div>

            <div className="space-y-3">
              {/* Brand Signature Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                    <span>1. Brand Deal Owner: {contract.assignedRepName}</span>
                    {isBrandSigned ? (
                      <Badge variant="emerald" className="text-[9px]">Verified Signed</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">Awaiting Sign</Badge>
                    )}
                  </div>
                  {isBrandSigned ? (
                    <div className="text-[10px] text-neutral-500 font-mono break-all">
                      <code>Hash: {contract.brandSignatureHash}</code>
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-400">Awaiting digital authorization</div>
                  )}
                </div>

                {!isBrandSigned && (currentUser.role === 'SALES_REPRESENTATIVE' || currentUser.role === 'COMPANY_HEAD_ADMIN') && (
                  <Button
                    size="sm"
                    onClick={() => handleSignContract('BRAND')}
                    disabled={signing}
                    className="text-xs h-8 rounded-full px-4 bg-neutral-950 text-white shrink-0"
                  >
                    Sign as Brand Rep
                  </Button>
                )}
              </div>

              {/* Creator Signature Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                    <span>2. Content Creator: {contract.creatorDisplayName}</span>
                    {isCreatorSigned ? (
                      <Badge variant="emerald" className="text-[9px]">Verified Signed</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">Awaiting Sign</Badge>
                    )}
                  </div>
                  {isCreatorSigned ? (
                    <div className="text-[10px] text-neutral-500 font-mono break-all">
                      <code>Hash: {contract.creatorSignatureHash}</code>
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-400">Awaiting creator authorization</div>
                  )}
                </div>

                {!isCreatorSigned && currentUser.role === 'CREATOR' && (
                  <Button
                    size="sm"
                    onClick={() => handleSignContract('CREATOR')}
                    disabled={signing}
                    className="text-xs h-8 rounded-full px-4 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                  >
                    E-Sign Agreement
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Pipeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-950">Milestone Pipeline</h2>
              <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                Escrow Protected
              </span>
            </div>

            <div className="space-y-3">
              {contract.milestones.map((m, idx) => {
                const isSubmitted = m.status === 'SUBMITTED';
                const isApproved = m.status === 'APPROVED';

                return (
                  <div key={m.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-neutral-950">
                          Milestone {idx + 1}: {m.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {m.deliverableType} • Due: {formatDate(m.dueDate)}
                        </div>
                      </div>
                      <Badge variant={isApproved ? 'emerald' : isSubmitted ? 'warning' : 'outline'} className="text-[10px]">
                        {m.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200/60">
                      <span className="text-neutral-500 font-medium">Disbursement:</span>
                      <span className="font-extrabold text-neutral-950 tabular-nums">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>

                    {m.proofUrl && (
                      <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#0057FF] break-all flex items-center justify-between">
                        <span className="truncate mr-2 font-mono text-[11px]">Proof: {m.proofUrl}</span>
                        <a href={m.proofUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 hover:text-neutral-950" />
                        </a>
                      </div>
                    )}

                    <div className="pt-1">
                      {!isApproved && !isSubmitted && currentUser.role === 'CREATOR' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setActiveMilestoneId(m.id);
                            setSubmitModalOpen(true);
                          }}
                          className="w-full text-xs h-8 rounded-full gap-1.5"
                        >
                          <UploadCloud className="h-3 w-3" />
                          Submit Proof
                        </Button>
                      )}

                      {isSubmitted && !isApproved && (currentUser.role === 'SALES_REPRESENTATIVE' || currentUser.role === 'COMPANY_HEAD_ADMIN') && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApproveMilestone(m.id)}
                          className="w-full text-xs h-8 rounded-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="h-3 w-3" />
                          Approve &amp; Release Funds
                        </Button>
                      )}

                      {isApproved && (
                        <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Funds Released to Creator
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Proof Submission Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Deliverable Proof"
        description="Provide unlisted review link or published post URL for verification."
        className="max-w-md"
      >
        <form onSubmit={handleSubmitProof} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-900">Deliverable URL</label>
            <input
              type="url"
              required
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-900">Notes / Segment Timestamps</label>
            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="e.g. 60s integration runs from 03:12 to 04:15."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white transition-all h-24"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setSubmitModalOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submittingProof} className="rounded-full bg-neutral-950 text-white">
              {submittingProof ? 'Submitting...' : 'Submit Deliverable'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
