"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPendingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<string>("PENDING_REVIEW");

  const checkStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/verification/status");
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data.userVerificationStatus);
        setTicketData(data.ticket);

        if (data.userVerificationStatus === "VERIFIED") {
          router.push("/feed");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-neutral-400 text-sm font-mono animate-pulse">
          Fetching ticket status...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-amber-950/40 border border-amber-800/60 flex items-center justify-center text-amber-400 mx-auto mb-4 animate-pulse">
          <Clock size={24} />
        </div>

        <h1 className="text-2xl font-bold text-neutral-100">
          Verification Ticket Under Review
        </h1>
        <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
          Your profile verification request has been enqueued to the Platform Auditor Queue.
        </p>
      </div>

      <Card className="border-[#222326]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1f2024] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Ticket Reference:</span>
            <span className="font-mono text-xs text-neutral-100 font-semibold bg-[#1a1b1f] px-2 py-0.5 rounded border border-[#2a2b2f]">
              {ticketData?.ticketNumber || "TICK-PENDING"}
            </span>
          </div>

          <Badge variant="warning" className="gap-1 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
            PENDING APPROVAL
          </Badge>
        </div>

        {ticketData && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-md bg-[#0f1012] border border-[#1d1e22]">
              <div>
                <span className="text-neutral-500 block">Submitted Handle</span>
                <span className="text-neutral-200 font-mono font-medium">
                  {ticketData.formData?.handle || ticketData.formData?.companyName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Platform / Category</span>
                <span className="text-neutral-200 font-mono">
                  {ticketData.formData?.primaryPlatform || ticketData.role}
                </span>
              </div>
              {ticketData.formData?.followerCount && (
                <div>
                  <span className="text-neutral-500 block">Audience Reach</span>
                  <span className="text-neutral-200 font-mono">
                    {ticketData.formData.followerCount.toLocaleString()} followers
                  </span>
                </div>
              )}
              {ticketData.formData?.baseRate && (
                <div>
                  <span className="text-neutral-500 block">Base Commercial Rate</span>
                  <span className="text-neutral-200 font-mono">
                    ${ticketData.formData.baseRate.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Once an auditor checks your channel metrics and ownership proof, your account
              will be upgraded to <strong className="text-emerald-400 font-mono">VERIFIED</strong> and full marketplace & deal room access will be unlocked automatically.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#1f2024] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            loading={refreshing}
            className="w-full sm:w-auto text-xs"
          >
            <RefreshCw size={12} className="mr-1.5" />
            Refresh Status
          </Button>

          {/* Quick link for testing */}
          <Link href="/admin/verification-queue" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full text-xs font-mono">
              <ShieldCheck size={12} className="text-violet-400 mr-1.5" />
              Open Admin Queue (Testing)
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
