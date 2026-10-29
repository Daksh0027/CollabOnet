"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Video,
  UserCheck,
  Briefcase,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function OnboardingVerifyPage() {
  const router = useRouter();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
    verificationStatus: string;
    rejectionReason?: string;
  } | null>(null);

  // Form State
  const [primaryPlatform, setPrimaryPlatform] = useState("YOUTUBE");
  const [handle, setHandle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [niche, setNiche] = useState("Tech & Gadgets");
  const [followerCount, setFollowerCount] = useState<number>(50000);
  const [avgViews, setAvgViews] = useState<number>(12000);
  const [baseRate, setBaseRate] = useState<number>(1500);
  const [proofUrl, setProofUrl] = useState("");

  // Manager state
  const [agencyName, setAgencyName] = useState("");
  const [agencyWebsite, setAgencyWebsite] = useState("");
  const [rosterSize, setRosterSize] = useState<number>(5);
  const [representationDocUrl, setRepresentationDocUrl] = useState("");

  // Brand Rep state
  const [companyName, setCompanyName] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [campaignBudgetRange, setCampaignBudgetRange] = useState("$5,000 - $25,000");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/v1/auth/me");
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setUser(data.user);

        if (data.user.verificationStatus === "VERIFIED") {
          router.push("/feed");
        } else if (data.user.verificationStatus === "PENDING_REVIEW") {
          router.push("/onboarding/pending");
        }
      } catch {
        router.push("/");
      } finally {
        setSessionLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    let payload: any = {};
    if (user?.role === "CREATOR") {
      payload = {
        primaryPlatform,
        handle,
        profileUrl,
        niche: [niche],
        followerCount: Number(followerCount),
        avgViews: Number(avgViews),
        baseRate: Number(baseRate),
        proofUrl,
      };
    } else if (user?.role === "TALENT_MANAGER") {
      payload = {
        agencyName,
        agencyWebsite,
        rosterSize: Number(rosterSize),
        representationDocUrl,
      };
    } else {
      payload = {
        companyName,
        officialWebsite,
        workEmail,
        registrationNumber,
        campaignBudgetRange,
      };
    }

    try {
      const res = await fetch("/api/v1/verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      router.push("/onboarding/pending");
    } catch (err: any) {
      setError(err.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-neutral-400 text-sm font-mono animate-pulse">
          Loading verification profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-800/60 bg-amber-950/40 text-xs text-amber-400 font-mono mb-3">
          <AlertCircle size={12} />
          <span>Status: Unverified Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
          Complete Profile Verification
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-lg mx-auto">
          To protect creators and brand sponsors from fraud, all accounts must submit official verification details before marketplace access is granted.
        </p>
      </div>

      {user?.rejectionReason && (
        <div className="mb-6 p-4 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
          <div className="font-semibold mb-1">Previous Application Returned with Feedback:</div>
          <div>{user.rejectionReason}</div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-md bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
          {error}
        </div>
      )}

      <Card className="border-[#222326]">
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2024] mb-6">
          <div className="flex items-center gap-2">
            {user?.role === "CREATOR" && <Video size={18} className="text-emerald-400" />}
            {user?.role === "TALENT_MANAGER" && <UserCheck size={18} className="text-amber-400" />}
            {user?.role === "SALES_REP" && <Briefcase size={18} className="text-indigo-400" />}
            <span className="text-sm font-semibold text-neutral-200">
              {user?.role === "CREATOR"
                ? "Creator Social Identity & Reach"
                : user?.role === "TALENT_MANAGER"
                ? "Talent Agency & Roster Details"
                : "Brand Sponsor Corporate Verification"}
            </span>
          </div>
          <Badge variant="mono" className="uppercase text-[10px]">
            {user?.role}
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Creator Form */}
          {user?.role === "CREATOR" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Primary Social Platform
                  </label>
                  <select
                    value={primaryPlatform}
                    onChange={(e) => setPrimaryPlatform(e.target.value)}
                    className="w-full bg-[#121316] text-neutral-100 text-sm px-3 py-2 rounded-md border border-[#222326] focus:outline-none focus:border-neutral-500"
                  >
                    <option value="YOUTUBE">YouTube</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                <Input
                  label="Official Handle / Username"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  helperText="Exact handle on the primary platform"
                  required
                />
              </div>

              <Input
                label="Full Channel / Profile URL"
                placeholder="https://youtube.com/@yourhandle"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Followers / Subscribers"
                  type="number"
                  placeholder="50000"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(Number(e.target.value))}
                  required
                />

                <Input
                  label="Avg. Views per Post"
                  type="number"
                  placeholder="15000"
                  value={avgViews}
                  onChange={(e) => setAvgViews(Number(e.target.value))}
                  required
                />

                <Input
                  label="Base Commercial Rate ($)"
                  type="number"
                  placeholder="1500"
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  helperText="Default per deliverable"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Content Niche / Category
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-[#121316] text-neutral-100 text-sm px-3 py-2 rounded-md border border-[#222326] focus:outline-none focus:border-neutral-500"
                >
                  <option value="Tech & Gadgets">Tech & Gadgets</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Finance & Crypto">Finance & Crypto</option>
                  <option value="Lifestyle & Fashion">Lifestyle & Fashion</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Education & Code">Education & Code</option>
                </select>
              </div>

              <Input
                label="Proof of Ownership (Screenshot or Video URL)"
                placeholder="https://drive.google.com/... or paste image link"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                helperText="Link showing creator studio dashboard or bio verification"
                required
              />
            </>
          )}

          {/* Talent Manager Form */}
          {user?.role === "TALENT_MANAGER" && (
            <>
              <Input
                label="Agency / Management Company Name"
                placeholder="e.g. Apex Talent Management"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />

              <Input
                label="Agency Website URL"
                placeholder="https://apextalent.io"
                value={agencyWebsite}
                onChange={(e) => setAgencyWebsite(e.target.value)}
                required
              />

              <Input
                label="Roster Size (Represented Creators)"
                type="number"
                placeholder="10"
                value={rosterSize}
                onChange={(e) => setRosterSize(Number(e.target.value))}
                required
              />

              <Input
                label="Representation Agreement / Authorization Letter Link"
                placeholder="https://storage.../authorization.pdf"
                value={representationDocUrl}
                onChange={(e) => setRepresentationDocUrl(e.target.value)}
                helperText="Link to sample representation mandate or portfolio sheet"
                required
              />
            </>
          )}

          {/* Brand Rep Form */}
          {user?.role === "SALES_REP" && (
            <>
              <Input
                label="Company / Brand Name"
                placeholder="e.g. Nike Global"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <Input
                label="Official Corporate Website"
                placeholder="https://nike.com"
                value={officialWebsite}
                onChange={(e) => setOfficialWebsite(e.target.value)}
                required
              />

              <Input
                label="Work Email Address (Domain Verified)"
                type="email"
                placeholder="sarah@nike.com"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                helperText="Must match your corporate domain"
                required
              />

              <Input
                label="Business Registration Number (Tax ID / CIN / GSTIN)"
                placeholder="US-EIN-98765432"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </>
          )}

          <div className="pt-4 border-t border-[#1f2024] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Encrypted Submission • Admin Reviewed</span>
            </div>

            <Button type="submit" variant="primary" loading={submitting}>
              Submit Verification Ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
