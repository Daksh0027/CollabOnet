"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ShieldCheck, UserCheck, Briefcase, Video } from "lucide-react";
import { clsx } from "clsx";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "signin",
  onSuccess,
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"CREATOR" | "TALENT_MANAGER" | "SALES_REP">("CREATOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/v1/auth/signup" : "/api/v1/auth/login";
      const payload =
        mode === "signup"
          ? { email, password, name, role }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onClose();
      if (onSuccess) onSuccess();
      router.push(data.redirect || "/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail("admin@collabonet.com");
    setPassword("admin123");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@collabonet.com", password: "admin123" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onClose();
      router.push(data.redirect || "/admin/verification-queue");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "signin" ? "Sign In to CollaboNet" : "Create your Account"}
      description={
        mode === "signin"
          ? "Enter your credentials to access your deal rooms & dashboard"
          : "Join as a Creator, Talent Manager, or Brand Sponsor"
      }
    >
      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#18191c] p-1 rounded-lg border border-[#222326] mb-4">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
          }}
          className={clsx(
            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
            mode === "signin"
              ? "bg-[#25262a] text-neutral-100 shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={clsx(
            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
            mode === "signup"
              ? "bg-[#25262a] text-neutral-100 shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          )}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-md bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === "signup" && (
          <>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("CREATOR")}
                  className={clsx(
                    "flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all",
                    role === "CREATOR"
                      ? "border-neutral-400 bg-[#1c1d22] text-neutral-100"
                      : "border-[#222326] bg-[#141517] text-neutral-400 hover:text-neutral-300"
                  )}
                >
                  <Video size={16} className="mb-1 text-emerald-400" />
                  <span className="text-[11px] font-medium">Creator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("TALENT_MANAGER")}
                  className={clsx(
                    "flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all",
                    role === "TALENT_MANAGER"
                      ? "border-neutral-400 bg-[#1c1d22] text-neutral-100"
                      : "border-[#222326] bg-[#141517] text-neutral-400 hover:text-neutral-300"
                  )}
                >
                  <UserCheck size={16} className="mb-1 text-amber-400" />
                  <span className="text-[11px] font-medium">Manager</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("SALES_REP")}
                  className={clsx(
                    "flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all",
                    role === "SALES_REP"
                      ? "border-neutral-400 bg-[#1c1d22] text-neutral-100"
                      : "border-[#222326] bg-[#141517] text-neutral-400 hover:text-neutral-300"
                  )}
                >
                  <Briefcase size={16} className="mb-1 text-indigo-400" />
                  <span className="text-[11px] font-medium">Brand Rep</span>
                </button>
              </div>
            </div>

            <Input
              label="Full Name / Display Name"
              placeholder="e.g. Alex Carter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
          {mode === "signin" ? "Sign In" : "Continue to Verification"}
        </Button>
      </form>

      {/* Quick Testing Helper */}
      <div className="mt-5 pt-3 border-t border-[#1f2024] flex items-center justify-between text-xs text-neutral-500">
        <span>Testing as Admin?</span>
        <button
          type="button"
          onClick={handleQuickAdminLogin}
          className="text-neutral-400 hover:text-neutral-200 inline-flex items-center gap-1 font-mono hover:underline"
        >
          <ShieldCheck size={12} className="text-violet-400" />
          Quick Login Admin
        </button>
      </div>
    </Modal>
  );
};
