"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { AuthModal } from "./AuthModal";
import { Shield, CheckCircle2, Clock, AlertTriangle, LogOut } from "lucide-react";

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  verificationStatus: string;
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <Badge variant="success" className="gap-1 font-mono">
            <CheckCircle2 size={11} /> VERIFIED
          </Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge variant="warning" className="gap-1 font-mono">
            <Clock size={11} /> IN REVIEW
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="danger" className="gap-1 font-mono">
            <AlertTriangle size={11} /> REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="mono" className="gap-1 font-mono">
            UNVERIFIED
          </Badge>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1f2024] bg-[#0c0d0e]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-md bg-[#18191c] border border-[#2a2b2f] flex items-center justify-center text-white font-bold text-xs tracking-wider group-hover:border-neutral-500 transition-colors">
                CN
              </div>
              <span className="font-semibold text-sm tracking-tight text-neutral-100">
                CollaboNet
              </span>
            </Link>

            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#18191c] text-neutral-400 border border-[#26272b]">
              Linear Dark
            </span>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-7 w-20 bg-[#16171a] animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {/* Status indicator */}
                {getStatusBadge(user.verificationStatus)}

                {/* Role indicator */}
                <Badge variant="default" className="font-mono uppercase">
                  {user.role.replace("_", " ")}
                </Badge>

                {/* Direct quick links */}
                {user.role === "PLATFORM_ADMIN" ? (
                  <Link href="/admin/verification-queue">
                    <Button variant="secondary" size="sm" className="font-mono text-xs">
                      <Shield size={12} className="text-violet-400 mr-1" />
                      Admin Queue
                    </Button>
                  </Link>
                ) : user.verificationStatus === "UNVERIFIED" ? (
                  <Link href="/onboarding/verify">
                    <Button variant="primary" size="sm" className="text-xs">
                      Verify Profile
                    </Button>
                  </Link>
                ) : user.verificationStatus === "PENDING_REVIEW" ? (
                  <Link href="/onboarding/pending">
                    <Button variant="secondary" size="sm" className="text-xs font-mono">
                      View Ticket
                    </Button>
                  </Link>
                ) : (
                  <Link href="/feed">
                    <Button variant="secondary" size="sm" className="text-xs">
                      Marketplace
                    </Button>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-md hover:bg-[#18191c] transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthModalOpen(true);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={fetchSession}
      />
    </>
  );
};
