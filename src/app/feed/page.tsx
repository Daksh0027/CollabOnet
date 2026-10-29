"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  MessageSquare,
  FileCheck,
  Calendar,
} from "lucide-react";

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/v1/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/");
        }
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-neutral-400 text-sm font-mono animate-pulse">
          Loading workspace...
        </div>
      </div>
    );
  }

  const isVerified = user?.verificationStatus === "VERIFIED";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Top Banner */}
      {isVerified ? (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#121316] to-[#121316] border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-100">
                  Welcome to CollaboNet, {user.name}
                </h1>
                <Badge variant="success" className="font-mono text-[10px]">
                  VERIFIED CHECKMARK ISSUED
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Your profile has been verified by the Platform Compliance Auditor. Full marketplace and deal room access is active.
              </p>
            </div>
          </div>

          <Badge variant="mono" className="font-mono">
            ROLE: {user.role}
          </Badge>
        </div>
      ) : (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#121316] to-[#121316] border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-100">
                  Verification Pending
                </h1>
                <Badge variant="warning" className="font-mono text-[10px]">
                  {user?.verificationStatus}
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                You must complete profile verification before participating in deal rooms.
              </p>
            </div>
          </div>

          <Link href="/onboarding/verify">
            <Button variant="primary" size="sm">
              Complete Verification Form <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Grid of Unlocked Workspaces */}
      <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 font-mono">
        Your Deal Flow Hub
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-neutral-700 transition-all">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-emerald-400 mb-3">
            <MessageSquare size={16} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-100">
            Fenced Deal Rooms
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time isolated negotiations with anti-scam payment interceptors and Manager POI masking.
          </p>
        </Card>

        <Card className="hover:border-neutral-700 transition-all">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-violet-400 mb-3">
            <FileCheck size={16} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-100">
            SHA-256 E-Signing
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            OpenRouter-powered Chat-to-Contract generation with cryptographic digital signatures.
          </p>
        </Card>

        <Card className="hover:border-neutral-700 transition-all">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-amber-400 mb-3">
            <Calendar size={16} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-100">
            Milestone Escrow
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            3-stage deliverable approvals (Script $\to$ Rough Cut $\to$ Live Post verification).
          </p>
        </Card>
      </div>
    </div>
  );
}
