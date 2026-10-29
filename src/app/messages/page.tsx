'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  Send, 
  FileSignature, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  DollarSign, 
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Message, Conversation } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_alice_rohan');
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  
  // AI Summary Drawer State
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Contract Extraction Drawer State
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [extractedTerms, setExtractedTerms] = useState<any | null>(null);
  const [extractingTerms, setExtractingTerms] = useState(false);
  const [generatingContract, setGeneratingContract] = useState(false);

  // Counter-offer state for creators
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterDraft, setCounterDraft] = useState('');

  const loadConversationData = async (convId: string) => {
    setAccessDeniedError(null);
    try {
      const res = await fetch(`/api/v1/conversations/${convId}/messages`, {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setAccessDeniedError(data.error || 'Access Denied');
        setMessages([]);
        setActiveConv(null);
        return;
      }

      setMessages(data.messages || []);
      setActiveConv(data.conversation);
    } catch (err: any) {
      setAccessDeniedError(err.message);
    }
  };

  useEffect(() => {
    fetch('/api/v1/conversations', {
      headers: {
        'x-user-id': currentUser.id,
        'x-user-role': currentUser.role,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
          loadConversationData(data.conversations[0].id);
        } else {
          loadConversationData(activeConvId);
        }
      });
  }, [currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const res = await fetch(`/api/v1/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
        body: JSON.stringify({
          content: inputText,
          senderName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSummarizeThread = async () => {
    setSummaryLoading(true);
    setSummaryModalOpen(true);
    try {
      const res = await fetch(`/api/v1/conversations/${activeConvId}/ai-summarize`, {
        method: 'POST',
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
      });
      const data = await res.json();
      setAiSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExtractContract = async () => {
    setExtractingTerms(true);
    setContractModalOpen(true);
    try {
      const res = await fetch(`/api/v1/conversations/${activeConvId}/ai-extract`, {
        method: 'POST',
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
      });
      const data = await res.json();
      setExtractedTerms(data.contractDraftPayload);
    } catch (err) {
      console.error(err);
    } finally {
      setExtractingTerms(false);
    }
  };

  const handleGenerateAndLock = async () => {
    setGeneratingContract(true);
    try {
      const res = await fetch('/api/v1/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
        body: JSON.stringify({
          conversationId: activeConvId,
          extractedTerms,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = `/deals/${data.contract.id}`;
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingContract(false);
    }
  };

  const handleLaunchCounterAssistant = async () => {
    setCounterModalOpen(true);
    try {
      const res = await fetch('/api/v1/copilot/counter-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandOfferAmount: 2200,
          requestedDeliverables: '1x 60s YouTube Integration + 2x IG Stories',
          creatorBaseRate: 2800,
        }),
      });
      const data = await res.json();
      setCounterDraft(data.draftMessage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Deal Room Header Bar */}
      <div className="linkedin-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#191919] tracking-tight">Isolated Deal Rooms</h1>
            <Badge variant="accent" className="text-xs">PostgreSQL RLS Active</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e] mt-0.5">
            Peer representative conversations are strictly isolated. Talent managers receive PII-sanitized briefs.
          </p>
        </div>

        {!accessDeniedError && (
          <div className="flex items-center gap-2">
            {currentUser.role === 'CREATOR' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLaunchCounterAssistant}
                className="text-xs h-8"
              >
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Smart Counter-Offer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarizeThread}
              className="text-xs h-8"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-[#0a66c2]" />
              Summarize Thread
            </Button>
            <Button
              size="sm"
              onClick={handleExtractContract}
              className="text-xs h-8 bg-[#057642] hover:bg-[#046237]"
            >
              <FileSignature className="h-3.5 w-3.5 mr-1" />
              Extract to Contract
            </Button>
          </div>
        )}
      </div>

      {/* Main Deal Room Two-Pane Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[560px]">
        {/* Left Pane: Conversations List */}
        <div className="lg:col-span-1 linkedin-card p-3 space-y-2">
          <div className="text-xs font-semibold text-[#5e5e5e] px-2 pt-1 flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[11px] text-[#717171]">{currentUser.personaKey}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#5e5e5e]">
              No conversations assigned to this role.
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConvId(c.id);
                    loadConversationData(c.id);
                  }}
                  className={`w-full text-left p-3 rounded-[6px] transition-colors ${
                    activeConvId === c.id
                      ? 'bg-[#ebf4fd] text-[#0a66c2]'
                      : 'hover:bg-[#f3f2ef] text-[#191919]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate text-[#191919]">{c.creatorDisplayName}</span>
                    <span className="text-[10px] text-[#5e5e5e]">{c.branchName.split(' ')[0]}</span>
                  </div>
                  <p className="text-[11px] text-[#5e5e5e] truncate mt-0.5">{c.campaignTitle}</p>
                  <p className="text-[11px] text-[#717171] truncate mt-0.5 italic">&ldquo;{c.lastMessageSnippet}&rdquo;</p>
                </button>
              ))}
            </div>
          )}

          <div className="p-3 rounded bg-[#f4f2ee] border border-[#e0dfdc] text-xs text-[#5e5e5e] space-y-1.5 mt-4">
            <span className="font-semibold text-[#191919] block">Test RLS Guardrails:</span>
            <p>
              Switch to <strong>Sales Rep B</strong> in the top header to witness the 403 Forbidden barrier protecting Alice&apos;s deal.
            </p>
          </div>
        </div>

        {/* Right Pane: Message Stream OR 403 Forbidden Screen */}
        <div className="lg:col-span-3 linkedin-card flex flex-col justify-between overflow-hidden">
          {accessDeniedError ? (
            /* 403 RLS FORBIDDEN SCREEN */
            <div className="m-auto max-w-md p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="h-12 w-12 rounded-full bg-[#ffedea] text-[#c4242a] flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <Badge variant="destructive" className="text-xs">HTTP 403 Forbidden</Badge>
                <h3 className="text-base font-bold text-[#191919]">Row-Level Security Violation</h3>
                <p className="text-xs text-[#c4242a] leading-relaxed">
                  {accessDeniedError}
                </p>
              </div>
              <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] text-left text-xs text-[#5e5e5e] space-y-1">
                <div className="text-[#191919] font-semibold text-xs">Enforced Database Policy:</div>
                <code className="text-xs text-[#0a66c2] block">
                  CREATE POLICY message_access_policy ON messages<br />
                  USING (assigned_rep_id = auth.uid() OR creator_user_id = auth.uid());
                </code>
                <p className="text-xs text-[#717171] mt-1">
                  Sales Rep B cannot view or inspect peer sales representatives within the same corporate tenant.
                </p>
              </div>
            </div>
          ) : (
            /* Active Chat Stream */
            <>
              {/* Chat Sub-Header */}
              <div className="px-4 py-3 border-b border-[#e8e7e3] bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#f4f2ee] border border-[#e0dfdc] flex items-center justify-center font-bold text-xs text-[#0a66c2]">
                    {activeConv?.creatorDisplayName.slice(0, 2) || 'RS'}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#191919]">{activeConv?.creatorDisplayName}</h3>
                    <span className="text-[11px] text-[#5e5e5e]">
                      Assigned POI: <strong>{activeConv?.assignedRepName}</strong> ({activeConv?.branchName})
                    </span>
                  </div>
                </div>
                <Badge variant="accent" className="text-[10px]">Verified Channel</Badge>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px] bg-[#f9fafb]">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#717171] px-1">
                        <span>{m.senderName}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-lg p-3 rounded-[8px] text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#0a66c2] text-white rounded-tr-none'
                            : 'bg-white text-[#191919] border border-[#e0dfdc] rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#e8e7e3] bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message as ${currentUser.name}...`}
                  className="flex-1 bg-[#f4f2ee] border border-[#e0dfdc] rounded-full px-4 py-2 text-xs text-[#191919] placeholder:text-[#5e5e5e] outline-none focus:border-[#0a66c2] focus:bg-white transition-colors"
                />
                <Button type="submit" size="sm" className="h-8 px-4 text-xs font-semibold gap-1.5">
                  <Send className="h-3 w-3" />
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Role-Aware AI Thread Summarizer Modal */}
      <Modal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="Role-Aware AI Thread Summary"
        description="Structured deal status, agreed deliverables, and role-sanitized representative details."
        className="max-w-xl"
      >
        <div className="space-y-4">
          {summaryLoading || !aiSummary ? (
            <div className="py-10 text-center space-y-2 text-xs text-[#5e5e5e]">
              <Sparkles className="h-6 w-6 text-[#0a66c2] mx-auto" />
              <p>Synthesizing negotiation thread with RBAC guardrails...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiSummary.isMasked ? (
                <Alert variant="warning">
                  <EyeOff className="h-4 w-4 text-[#915907]" />
                  <AlertTitle>Manager Privacy Moat Active</AlertTitle>
                  <AlertDescription>
                    Viewing as Talent Manager: Brand representative personal phone and email have been sanitized by the RBAC Data Masking Engine.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="info">
                  <Eye className="h-4 w-4 text-[#0a66c2]" />
                  <AlertTitle>Full Representative View</AlertTitle>
                  <AlertDescription>
                    Deal owner: <strong>{aiSummary.summary?.repPOI?.name}</strong> ({aiSummary.summary?.repPOI?.email})
                  </AlertDescription>
                </Alert>
              )}

              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5 text-xs">
                <div className="font-semibold text-[#191919]">Deal State:</div>
                <p className="text-[#5e5e5e]">{aiSummary.summary?.offerStatus}</p>
                <div className="text-[#717171] pt-1 border-t border-[#e8e7e3]">
                  <strong>Timeline: </strong>{aiSummary.summary?.timeline}
                </div>
              </div>

              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-2 text-xs">
                <div className="font-semibold text-[#191919]">Agreed Deliverables:</div>
                <ul className="space-y-1">
                  {aiSummary.summary?.deliverables?.map((d: string, i: number) => (
                    <li key={i} className="text-[#5e5e5e] flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#057642] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {aiSummary.pendingBlockers?.length > 0 && (
                <div className="p-3 rounded bg-[#fef3d6] border border-[#f9e2a8] text-xs text-[#915907]">
                  <strong>Pending Action Items:</strong>
                  <ul className="list-disc list-inside mt-1 text-xs space-y-0.5">
                    {aiSummary.pendingBlockers.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
                <Button variant="outline" onClick={() => setSummaryModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    handleExtractContract();
                  }}
                >
                  Proceed to Contract Draft
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* "Chat-to-Contract" Extraction Modal */}
      <Modal
        isOpen={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        title="Chat-to-Contract Auto-Draft"
        description="Agreed milestones, amounts, and exclusivity terms pre-filled from conversation."
        className="max-w-xl"
      >
        <div className="space-y-4">
          {extractingTerms || !extractedTerms ? (
            <div className="py-10 text-center space-y-2 text-xs text-[#5e5e5e]">
              <Sparkles className="h-6 w-6 text-[#057642] mx-auto" />
              <p>Extracting agreed milestones, dates, and amounts...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2.5 rounded bg-[#e6f4ea] border border-[#c6ebd1] text-xs text-[#057642] flex items-center justify-between">
                <span>Confidence Score: <strong>98.4% Match</strong></span>
                <Badge variant="accent">Standard Legal Format</Badge>
              </div>

              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5e5e5e]">Total Escrow Amount:</span>
                  <span className="text-sm font-bold text-[#191919] tabular-nums">
                    {formatCurrency(extractedTerms.totalAmount || 2500)} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5e5e5e]">Exclusivity Period:</span>
                  <span className="text-[#191919]">{extractedTerms.terms?.exclusivityDays} Days (Athletic Footwear)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5e5e5e]">Revision Cap:</span>
                  <span className="text-[#191919]">Max {extractedTerms.terms?.maxRevisionRounds} Rounds</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#191919]">Extracted Milestone Schedule:</div>
                {extractedTerms.milestones?.map((m: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-white border border-[#e0dfdc] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#191919]">{m.title}</div>
                      <div className="text-[11px] text-[#5e5e5e]">
                        Type: {m.deliverableType} • Due: {new Date(m.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-bold text-[#191919] tabular-nums">
                      {formatCurrency(m.amount)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
                <Button variant="outline" onClick={() => setContractModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerateAndLock}
                  disabled={generatingContract}
                  className="gap-1.5 bg-[#057642] hover:bg-[#046237]"
                >
                  <FileSignature className="h-4 w-4" />
                  {generatingContract ? 'Generating...' : 'Generate Legal PDF & Sign'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Creator Smart Counter-Offer Modal */}
      <Modal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        title="Smart Counter-Offer Assistant"
        description="Generates a polite counter-offer backed by your verified platform rates."
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] text-xs text-[#191919] whitespace-pre-wrap leading-relaxed">
            {counterDraft}
          </div>
          <div className="flex justify-end gap-2 border-t border-[#f0f0f0] pt-2">
            <Button variant="outline" onClick={() => setCounterModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setInputText(counterDraft);
                setCounterModalOpen(false);
              }}
            >
              Use this message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
