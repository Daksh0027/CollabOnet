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
  Lock
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
    return <div className="py-12 text-center text-xs text-[#5e5e5e]">Loading agreement details...</div>;
  }

  const isBrandSigned = !!contract.brandSignatureHash;
  const isCreatorSigned = !!contract.creatorSignatureHash;

  return (
    <div className="space-y-6">
      {/* Deal Header */}
      <div className="linkedin-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#191919] tracking-tight">Deal Room #{contract.id.slice(-6)}</h1>
            <Badge variant={contract.status === 'COMPLETED' ? 'accent' : 'info'} className="text-xs">
              {contract.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            {contract.creatorDisplayName} ({contract.creatorHandle}) × {contract.branchName}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-[#5e5e5e]">Escrow Value:</div>
          <div className="text-xl font-bold text-[#191919] tabular-nums">
            {formatCurrency(contract.totalAmount, contract.currency)}
          </div>
          <span className="text-xs text-[#057642] flex items-center gap-1 mt-0.5">
            <Lock className="h-3 w-3" />
            Branch Budget Allocation Locked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Contract Terms & Signatures */}
        <div className="lg:col-span-2 space-y-5">
          <div className="linkedin-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2">
              <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-[#0a66c2]" />
                Legal Agreement Specifications
              </h2>
              <Badge variant="outline" className="text-[10px]">Standardized Tier 1</Badge>
            </div>

            <div className="text-xs text-[#191919] whitespace-pre-wrap leading-relaxed bg-[#f9fafb] p-4 rounded-[6px] border border-[#e8e7e3] max-h-80 overflow-y-auto">
              {contract.termsMarkdown}
            </div>
          </div>

          {/* Cryptographic Digital Signatures */}
          <div className="linkedin-card p-4 space-y-3">
            <div className="border-b border-[#f0f0f0] pb-2">
              <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#057642]" />
                SHA-256 Digital Signatures &amp; Audit Trail
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-[#191919] flex items-center gap-2">
                    <span>1. Brand Deal Owner: {contract.assignedRepName}</span>
                    {isBrandSigned ? (
                      <Badge variant="accent" className="text-[9px]">Verified Signed</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">Pending Sign</Badge>
                    )}
                  </div>
                  {isBrandSigned ? (
                    <div className="text-[10px] text-[#057642] break-all">
                      <code>Hash: {contract.brandSignatureHash}</code>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#5e5e5e]">Awaiting digital authorization</div>
                  )}
                </div>

                {!isBrandSigned && (currentUser.role === 'SALES_REPRESENTATIVE' || currentUser.role === 'COMPANY_HEAD_ADMIN') && (
                  <Button
                    size="sm"
                    onClick={() => handleSignContract('BRAND')}
                    disabled={signing}
                    className="text-xs h-7 shrink-0"
                  >
                    Sign as Brand Rep
                  </Button>
                )}
              </div>

              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-[#191919] flex items-center gap-2">
                    <span>2. Content Creator: {contract.creatorDisplayName}</span>
                    {isCreatorSigned ? (
                      <Badge variant="accent" className="text-[9px]">Verified Signed</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">Pending Sign</Badge>
                    )}
                  </div>
                  {isCreatorSigned ? (
                    <div className="text-[10px] text-[#057642] break-all">
                      <code>Hash: {contract.creatorSignatureHash}</code>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#5e5e5e]">Awaiting creator authorization</div>
                  )}
                </div>

                {!isCreatorSigned && currentUser.role === 'CREATOR' && (
                  <Button
                    size="sm"
                    onClick={() => handleSignContract('CREATOR')}
                    disabled={signing}
                    className="text-xs h-7 bg-[#057642] hover:bg-[#046237] shrink-0"
                  >
                    E-Sign Agreement
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Pipeline */}
        <div className="space-y-4">
          <div className="linkedin-card p-4 space-y-3">
            <div className="border-b border-[#f0f0f0] pb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#191919]">Milestone Pipeline</h2>
              <span className="text-xs text-[#057642] font-semibold">
                Escrow Protected
              </span>
            </div>

            <div className="space-y-3">
              {contract.milestones.map((m, idx) => {
                const isSubmitted = m.status === 'SUBMITTED';
                const isApproved = m.status === 'APPROVED';

                return (
                  <div key={m.id} className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#191919]">
                          Milestone {idx + 1}: {m.title}
                        </div>
                        <div className="text-[11px] text-[#5e5e5e]">
                          Format: {m.deliverableType} • Due: {formatDate(m.dueDate)}
                        </div>
                      </div>
                      <Badge variant={isApproved ? 'accent' : isSubmitted ? 'warning' : 'outline'} className="text-[10px]">
                        {m.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e8e7e3]">
                      <span className="text-[#5e5e5e]">Disbursement:</span>
                      <span className="font-bold text-[#191919] tabular-nums">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>

                    {m.proofUrl && (
                      <div className="p-2 rounded bg-white border border-[#e0dfdc] text-xs text-[#0a66c2] break-all flex items-center justify-between">
                        <span className="truncate mr-2">Proof: {m.proofUrl}</span>
                        <a href={m.proofUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
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
                          className="w-full text-xs h-7 gap-1.5"
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
                          className="w-full text-xs h-7 gap-1.5 bg-[#057642] hover:bg-[#046237]"
                        >
                          <Check className="h-3 w-3" />
                          Approve &amp; Release Funds
                        </Button>
                      )}

                      {isApproved && (
                        <div className="text-xs text-[#057642] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Funds Disbursed to Creator
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
        title="Submit Milestone Deliverable Proof"
        description="Provide unlisted review link or live URL for brand review."
        className="max-w-md"
      >
        <form onSubmit={handleSubmitProof} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#191919]">Deliverable Link / URL</label>
            <input
              type="url"
              required
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] placeholder:text-[#5e5e5e] outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#191919]">Notes / Timestamps</label>
            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="e.g. 60s integration runs from 03:12 to 04:15."
              className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] placeholder:text-[#5e5e5e] outline-none focus:border-[#0a66c2] h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
            <Button type="button" variant="outline" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingProof}>
              {submittingProof ? 'Submitting...' : 'Confirm Submission'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
