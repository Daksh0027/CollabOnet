"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AuthModal } from "@/components/AuthModal";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#222326] bg-[#121316] text-xs text-neutral-300 font-mono mb-6">
          <Sparkles size={12} className="text-violet-400" />
          <span>BoardUI Design System • Next.js 15 App</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-100 max-w-3xl mx-auto leading-[1.15]">
          Trust & Transaction Infrastructure for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500">
            Creators & Brands
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Eradicate mediator fraud and payment defaults. Human-verified creator identities,
          isolated enterprise deal rooms, and cryptographically signed escrow agreements.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={() => openAuth("signup")}
            className="w-full sm:w-auto"
          >
            Create an Account
            <ArrowRight size={16} className="ml-1.5" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => openAuth("signin")}
            className="w-full sm:w-auto"
          >
            Sign In to Deal Room
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>2-Phase KYC Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>Fenced Deal Room RBAC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>SHA-256 Contract Seals</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-emerald-400 mb-3.5">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">
            Phase 1: Verification Flow
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Every newly signed up user is held in unverified status until social channel proof & metrics are reviewed by our platform auditor queue.
          </p>
        </Card>

        <Card className="hover:border-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-amber-400 mb-3.5">
            <Lock size={18} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">
            Fenced Deal Rooms & RBAC
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Peer sales representatives cannot snoop on internal negotiations, while talent managers receive masked sponsor POI views.
          </p>
        </Card>

        <Card className="hover:border-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-md bg-[#1c1d22] border border-[#2a2b2f] flex items-center justify-center text-violet-400 mb-3.5">
            <FileCheck size={18} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">
            OpenRouter AI Deal Copilots
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            One-click thread summarization, collision alerts, and instant contract extraction with cryptographic SHA-256 audit stamping.
          </p>
        </Card>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
