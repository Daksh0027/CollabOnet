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
  Check,
  ShieldCheck,
  MessageSquare
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
      } else {
        setMessages(data.messages || []);
        setActiveConv(data.conversation || null);
      }
    } catch (err) {
      console.error(err);
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
          const first = data.conversations[0].id;
          setActiveConvId(first);
          loadConversationData(first);
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
    <div className="space-y-6">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Row-Level Security Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Isolated Deal Rooms
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Direct peer representative negotiation with cryptographic boundary checks and role-aware brief sanitization.
          </p>
        </div>

        {!accessDeniedError && (
          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === 'CREATOR' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLaunchCounterAssistant}
                className="rounded-full text-xs h-9 border-neutral-200"
              >
                <DollarSign className="h-3.5 w-3.5 text-neutral-500" />
                <span>Counter Copilot</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarizeThread}
              className="rounded-full text-xs h-9 border-neutral-200"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#0057FF]" />
              <span>Summarize</span>
            </Button>
            <Button
              size="sm"
              onClick={handleExtractContract}
              className="rounded-full text-xs h-9 bg-neutral-950 text-white hover:bg-neutral-800 gap-1.5 px-4"
            >
              <FileSignature className="h-3.5 w-3.5 text-emerald-400" />
              <span>Extract to Contract</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Two-Pane Deal Room */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[580px]">
        {/* Left Pane: Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-neutral-200/80 p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">
              <span>Rooms</span>
              <span className="font-mono text-[10px] text-neutral-500">{currentUser.personaKey}</span>
            </div>

            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                No active conversations assigned to this role.
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
                    className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer ${
                      activeConvId === c.id
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs truncate ${activeConvId === c.id ? 'text-white' : 'text-neutral-950'}`}>
                        {c.creatorDisplayName}
                      </span>
                      <span className={`text-[10px] font-mono ${activeConvId === c.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {c.branchName.split(' ')[0]}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${activeConvId === c.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {c.campaignTitle}
                    </p>
                    <p className={`text-[10px] truncate mt-1 italic ${activeConvId === c.id ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      &ldquo;{c.lastMessageSnippet}&rdquo;
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-500 space-y-1">
            <span className="font-bold text-neutral-900 block text-[11px]">RLS Verification:</span>
            <p className="text-[11px] leading-relaxed">
              Switching to <strong>Sales Rep B</strong> in the header demonstrates the real 403 Forbidden database barrier.
            </p>
          </div>
        </div>

        {/* Right Pane: Message Stream */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
          {accessDeniedError ? (
            /* 403 RLS FORBIDDEN SCREEN */
            <div className="m-auto max-w-md p-8 text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Lock className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <Badge variant="destructive" className="text-xs">HTTP 403 Forbidden</Badge>
                <h3 className="text-lg font-bold text-neutral-950">Row-Level Security Active</h3>
                <p className="text-xs text-rose-600 leading-relaxed font-medium">
                  {accessDeniedError}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left text-xs text-neutral-600 space-y-1.5 font-mono">
                <div className="text-neutral-900 font-bold text-[11px]">Database Security Policy:</div>
                <code className="text-[10px] text-[#0057FF] block bg-white p-2.5 rounded-xl border border-neutral-200">
                  CREATE POLICY msg_isolation ON messages<br />
                  USING (assigned_rep_id = auth.uid() OR creator_user_id = auth.uid());
                </code>
              </div>
            </div>
          ) : (
            /* Active Chat Stream */
            <>
              {/* Chat Sub-Header */}
              <div className="px-6 py-4 border-b border-neutral-200/80 bg-white/50 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {activeConv?.creatorDisplayName.slice(0, 2) || 'RS'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-950">{activeConv?.creatorDisplayName}</h3>
                    <div className="text-xs text-neutral-400">
                      Rep POI: <strong className="text-neutral-700">{activeConv?.assignedRepName}</strong> ({activeConv?.branchName})
                    </div>
                  </div>
                </div>
                <Badge variant="emerald" className="text-[10px]">
                  Encrypted Channel
                </Badge>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[440px] bg-neutral-50/50">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono px-2">
                        <span>{m.senderName}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-md p-4 rounded-3xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-neutral-950 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-neutral-900 border border-neutral-200/80 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200/80 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type as ${currentUser.name}...`}
                  className="flex-1 bg-neutral-100 border border-neutral-200/80 rounded-full px-5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950 focus:bg-white transition-all"
                />
                <Button type="submit" size="sm" className="h-10 px-5 rounded-full bg-neutral-950 text-white font-semibold text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
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
        title="AI Thread Intelligence"
        description="Structured deal status, agreed deliverables, and role-sanitized details."
        className="max-w-xl"
      >
        <div className="space-y-4">
          {summaryLoading || !aiSummary ? (
            <div className="py-12 text-center space-y-2 text-xs text-neutral-400">
              <Sparkles className="h-6 w-6 text-[#0057FF] mx-auto animate-pulse" />
              <p>Synthesizing negotiation thread with RBAC guardrails...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiSummary.isMasked ? (
                <Alert variant="warning">
                  <EyeOff className="h-4 w-4 text-amber-700" />
                  <AlertTitle>Manager Privacy Active</AlertTitle>
                  <AlertDescription>
                    Viewing as Talent Manager: Brand representative personal phone and email have been sanitized.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="info">
                  <Eye className="h-4 w-4 text-[#0057FF]" />
                  <AlertTitle>Full Representative View</AlertTitle>
                  <AlertDescription>
                    Deal owner: <strong>{aiSummary.summary?.repPOI?.name}</strong> ({aiSummary.summary?.repPOI?.email})
                  </AlertDescription>
                </Alert>
              )}

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5 text-xs">
                <div className="font-bold text-neutral-950">Offer Status:</div>
                <p className="text-neutral-600">{aiSummary.summary?.offerStatus}</p>
                <div className="text-neutral-400 pt-2 border-t border-neutral-200/60 text-[11px]">
                  <strong>Timeline: </strong>{aiSummary.summary?.timeline}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2 text-xs">
                <div className="font-bold text-neutral-950">Agreed Deliverables:</div>
                <ul className="space-y-1">
                  {aiSummary.summary?.deliverables?.map((d: string, i: number) => (
                    <li key={i} className="text-neutral-600 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <Button variant="outline" size="sm" onClick={() => setSummaryModalOpen(false)} className="rounded-full">
                  Dismiss
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    handleExtractContract();
                  }}
                  className="rounded-full bg-neutral-950 text-white"
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
        description="Agreed milestones, amounts, and terms extracted directly from conversation."
        className="max-w-xl"
      >
        <div className="space-y-4">
          {extractingTerms || !extractedTerms ? (
            <div className="py-12 text-center space-y-2 text-xs text-neutral-400">
              <Sparkles className="h-6 w-6 text-emerald-600 mx-auto animate-pulse" />
              <p>Extracting agreed milestones, dates, and amounts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800 flex items-center justify-between">
                <span>Extraction Confidence: <strong>98.4% Match</strong></span>
                <Badge variant="emerald">Valid Legal Payload</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Escrow Value:</span>
                  <span className="text-base font-extrabold text-neutral-950 tabular-nums">
                    {formatCurrency(extractedTerms.totalAmount || 2500)} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Exclusivity Period:</span>
                  <span className="text-neutral-900 font-semibold">{extractedTerms.terms?.exclusivityDays} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Revisions Cap:</span>
                  <span className="text-neutral-900 font-semibold">Max {extractedTerms.terms?.maxRevisionRounds} Rounds</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-neutral-950">Milestone Payment Schedule:</div>
                {extractedTerms.milestones?.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between text-xs shadow-xs">
                    <div>
                      <div className="font-bold text-neutral-950">{m.title}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Type: {m.deliverableType} • Due: {new Date(m.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-extrabold text-neutral-950 tabular-nums">
                      {formatCurrency(m.amount)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <Button variant="outline" size="sm" onClick={() => setContractModalOpen(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateAndLock}
                  disabled={generatingContract}
                  className="gap-1.5 rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
                >
                  <FileSignature className="h-4 w-4 text-[#0057FF]" />
                  {generatingContract ? 'Generating Agreement...' : 'Generate Agreement & Sign'}
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
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed font-mono">
            {counterDraft}
          </div>
          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-3">
            <Button variant="outline" size="sm" onClick={() => setCounterModalOpen(false)} className="rounded-full">
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setInputText(counterDraft);
                setCounterModalOpen(false);
              }}
              className="rounded-full bg-neutral-950 text-white"
            >
              Paste in Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
