"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  Clock,
  Filter,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  formData: any;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export default function AdminVerificationQueuePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // First check session
      const meRes = await fetch("/api/v1/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user?.role === "PLATFORM_ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }

      const res = await fetch("/api/v1/admin/verification-queue");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAdminQuickLogin = async () => {
    setLoginLoading(true);
    try {
      await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@collabonet.com", password: "admin123" }),
      });
      setIsAdmin(true);
      fetchTickets();
    } catch (e) {
      console.error(e);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDecision = async (ticketId: string, decision: "APPROVED" | "REJECTED", notes?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/verification/${ticketId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, adminNotes: notes }),
      });

      if (res.ok) {
        const data = await res.json();
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? data.ticket : t))
        );
        setSelectedTicket(data.ticket);
        setRejectModalOpen(false);
        setRejectionNote("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f2024]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100">
              Platform Auditor Queue
            </h1>
            <Badge variant="violet" className="font-mono text-[10px]">
              BOARDUI WORKFLOW
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Review applicant identities, social channel metrics, and issue cryptographic verified badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAdminQuickLogin}
              loading={loginLoading}
              className="font-mono text-xs"
            >
              <ShieldCheck size={13} className="text-violet-400 mr-1.5" />
              Sign in as Admin Auditor
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={fetchTickets}
            className="text-xs"
          >
            <RefreshCw size={12} className="mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={clsx(
              "px-3 py-1 rounded-md text-xs font-mono transition-all",
              filter === tab
                ? "bg-[#25262a] text-neutral-100 border border-neutral-600 font-semibold"
                : "bg-[#141517] text-neutral-400 border border-[#222326] hover:text-neutral-200"
            )}
          >
            {tab} (
            {tab === "ALL"
              ? tickets.length
              : tickets.filter((t) => t.status === tab).length}
            )
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500 font-mono text-xs animate-pulse">
          Loading verification tickets...
        </div>
      ) : filteredTickets.length === 0 ? (
        <Card className="py-12 text-center text-neutral-400">
          <Clock size={28} className="mx-auto mb-2 text-neutral-600" />
          <div className="text-sm font-medium">No tickets match this filter</div>
          <div className="text-xs text-neutral-500 mt-1">
            Submit an onboarding form from the landing page to generate a new verification ticket.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List column */}
          <div className="lg:col-span-2 space-y-2">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={clsx(
                  "p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between",
                  selectedTicket?.id === ticket.id
                    ? "bg-[#18191d] border-neutral-500 shadow-sm"
                    : "bg-[#121316] border-[#222326] hover:bg-[#16171a] hover:border-neutral-700"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-neutral-200">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-neutral-500 text-xs">•</span>
                    <span className="text-xs font-medium text-neutral-300">
                      {ticket.userName}
                    </span>
                    <Badge variant="mono" className="text-[10px]">
                      {ticket.role}
                    </Badge>
                  </div>

                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>
                      {ticket.formData?.handle || ticket.formData?.companyName || "N/A"}
                    </span>
                    {ticket.formData?.primaryPlatform && (
                      <span className="text-neutral-500 font-mono text-[11px]">
                        [{ticket.formData.primaryPlatform}]
                      </span>
                    )}
                    {ticket.formData?.followerCount && (
                      <span className="text-emerald-400/90 font-mono text-[11px]">
                        {ticket.formData.followerCount.toLocaleString()} followers
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ticket.status === "PENDING" && (
                    <Badge variant="warning" className="font-mono text-[10px]">
                      PENDING
                    </Badge>
                  )}
                  {ticket.status === "APPROVED" && (
                    <Badge variant="success" className="font-mono text-[10px]">
                      VERIFIED ✓
                    </Badge>
                  )}
                  {ticket.status === "REJECTED" && (
                    <Badge variant="danger" className="font-mono text-[10px]">
                      REJECTED ✕
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Details Drawer */}
          <div className="lg:col-span-1">
            {selectedTicket ? (
              <Card className="sticky top-20 border-[#222326]">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f2024]">
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-100">
                      {selectedTicket.ticketNumber}
                    </span>
                    <div className="text-[11px] text-neutral-400">
                      {selectedTicket.userEmail}
                    </div>
                  </div>
                  <Badge
                    variant={
                      selectedTicket.status === "APPROVED"
                        ? "success"
                        : selectedTicket.status === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                    className="font-mono text-[10px]"
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Applicant</span>
                    <span className="text-neutral-200 font-medium">
                      {selectedTicket.userName} ({selectedTicket.role})
                    </span>
                  </div>

                  {selectedTicket.formData?.handle && (
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Official Handle</span>
                      <span className="text-neutral-200 font-mono">
                        {selectedTicket.formData.handle}
                      </span>
                    </div>
                  )}

                  {selectedTicket.formData?.profileUrl && (
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Profile URL</span>
                      <a
                        href={selectedTicket.formData.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-400 hover:underline flex items-center gap-1 font-mono break-all"
                      >
                        {selectedTicket.formData.profileUrl}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  {selectedTicket.formData?.followerCount && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1d1e22]">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Reach</span>
                        <span className="font-mono font-semibold text-neutral-100">
                          {selectedTicket.formData.followerCount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Base Rate</span>
                        <span className="font-mono font-semibold text-emerald-400">
                          ${selectedTicket.formData.baseRate?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTicket.formData?.proofUrl && (
                    <div className="pt-2 border-t border-[#1d1e22]">
                      <span className="text-neutral-500 block text-[11px]">Proof of Ownership</span>
                      <a
                        href={selectedTicket.formData.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-mono break-all mt-0.5"
                      >
                        Inspect Proof Media <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  {selectedTicket.adminNotes && (
                    <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300">
                      <span className="font-semibold block mb-0.5">Admin Note:</span>
                      {selectedTicket.adminNotes}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#1f2024] space-y-2">
                  {selectedTicket.status === "PENDING" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
                        onClick={() => handleDecision(selectedTicket.id, "APPROVED")}
                        loading={actionLoading}
                      >
                        <Check size={14} className="mr-1.5" />
                        Approve & Issue Verified Checkmark
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setRejectModalOpen(true)}
                        disabled={actionLoading}
                      >
                        <X size={14} className="mr-1.5" />
                        Reject with Reason
                      </Button>
                    </>
                  )}

                  {selectedTicket.status === "APPROVED" && (
                    <div className="text-center py-2 text-xs text-emerald-400 font-mono">
                      ✓ Profile Verified by {selectedTicket.reviewedBy || "Admin"}
                    </div>
                  )}

                  {selectedTicket.status === "REJECTED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-mono"
                      onClick={() => handleDecision(selectedTicket.id, "APPROVED")}
                      loading={actionLoading}
                    >
                      Re-evaluate & Approve
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="text-center py-16 text-neutral-500 text-xs font-mono border-dashed border-[#222326]">
                Select a ticket to review submission details
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Verification Ticket"
        description="Provide actionable feedback so the applicant can correct their proof."
      >
        <div className="space-y-4">
          <textarea
            className="w-full bg-[#121316] text-neutral-100 placeholder-neutral-500 text-sm p-3 rounded-md border border-[#222326] focus:outline-none focus:border-neutral-500 h-28"
            placeholder="e.g. Could not verify channel bio token; please upload a clear screenshot of your YouTube Studio dashboard."
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                selectedTicket &&
                handleDecision(selectedTicket.id, "REJECTED", rejectionNote)
              }
              loading={actionLoading}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
