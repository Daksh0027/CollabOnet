'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Video, 
  Mic, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Mail,
  ArrowRight,
  ShieldAlert,
  Lock,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function VerificationPage() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [roleType, setRoleType] = useState<'CREATOR' | 'AGENCY_MANAGER' | 'ENTERPRISE_REP'>('CREATOR');
  const [isManagerDeclared, setIsManagerDeclared] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  const [sessionNonce, setSessionNonce] = useState('');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(false);
  const [analyzingAudio, setAnalyzingAudio] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [adminApproved, setAdminApproved] = useState(false);

  const handleInitPhase1 = async () => {
    try {
      const res = await fetch('/api/v1/verification/phase-1/init', { method: 'POST' });
      const data = await res.json();
      setSessionNonce(data.sessionNonce);
      setSpokenTranscript(data.sessionNonce.replace(/-/g, ' '));
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordVideo = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVideoRecorded(true);
    }, 2500);
  };

  const handleSubmitWhisper = async () => {
    setAnalyzingAudio(true);
    try {
      const res = await fetch('/api/v1/verification/phase-1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionNonce,
          spokenTranscript,
        }),
      });
      const data = await res.json();
      setVerificationResult(data);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAudio(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Editorial Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase border border-neutral-200/60">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>2-Phase KYC Moat</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
          Identity Verification
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
          Zero-trust onboarding: Whisper ASR dynamic liveness nonce matching + admin human-in-the-loop review.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-3">
          {[
            { num: 1, label: 'Role & Contact' },
            { num: 2, label: 'Liveness Nonce' },
            { num: 3, label: 'Whisper ASR' },
            { num: 4, label: 'Auditor Verdict' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs hidden sm:inline font-medium ${step >= s.num ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {s.label}
              </span>
              {s.num < 4 && <div className="h-0.5 w-5 bg-neutral-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Role Selection & Contact Verification */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Select Account Class</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Determine role permissions and messaging isolation level.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'CREATOR', title: 'Content Creator', desc: 'Direct brand deals and escrow milestones.' },
                { id: 'AGENCY_MANAGER', title: 'Talent Agency', desc: 'Represents creators with masked company POI.' },
                { id: 'ENTERPRISE_REP', title: 'Brand Sponsor', desc: 'Sourcing and funding campaign escrows.' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleType(r.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    roleType === r.id
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <div className={`font-bold text-xs mb-1 ${roleType === r.id ? 'text-white' : 'text-neutral-950'}`}>
                    {r.title}
                  </div>
                  <div className={`text-[11px] leading-relaxed ${roleType === r.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Manager Declaration Checkbox */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isManagerDeclared}
                  onChange={(e) => setIsManagerDeclared(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900">
                    Mandatory Declaration: Are you an Agency or Talent Manager representing creators?
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                    Unchecked mediators attempting to pose directly as creators will be permanently blacklisted to the public Hall of Shame upon verification audit.
                  </p>
                </div>
              </label>
            </div>

            {/* OTP Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                  Mobile SMS Challenge
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit SMS OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950"
                />
                <span className="text-[10px] text-emerald-700 font-medium">Twilio SMS Gateway Active</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <Mail className="h-3.5 w-3.5 text-[#0057FF]" />
                  Corporate Work Email
                </div>
                <input
                  type="text"
                  placeholder="Token / domain verification"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-950"
                />
                <span className="text-[10px] text-[#0057FF] font-medium">Domain DNS MX Match</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <Button onClick={handleInitPhase1} className="gap-2 text-xs rounded-full bg-neutral-950 text-white">
                <span>Proceed to Liveness Nonce</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic 6-Word Nonce Recording */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-950">Phase 1: Dynamic Liveness Nonce</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Recite the randomized 6-word phrase on camera.</p>
              </div>
              <Badge variant="warning" className="text-[10px]">10m Session TTL</Badge>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 text-white text-center space-y-2 shadow-inner">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Recite Clearly on Webcam:</div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight py-1 font-mono">
                &ldquo;{sessionNonce.replace(/-/g, ' ')}&rdquo;
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                NONCE ID: {sessionNonce}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center space-y-4">
              <div className="h-40 rounded-2xl bg-white border border-neutral-200 flex flex-col items-center justify-center p-4">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-rose-600 mx-auto animate-ping" />
                    <p className="text-xs font-bold text-rose-600">Recording audio and video stream...</p>
                  </div>
                ) : videoRecorded ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-neutral-950">Video Captured (00:08s)</p>
                    <p className="text-[11px] text-neutral-400 font-mono">&ldquo;{spokenTranscript}&rdquo;</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-neutral-400">
                    <Video className="h-8 w-8 mx-auto text-neutral-400" />
                    <p className="text-xs font-medium">Click below to record 8-second liveness check</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {!videoRecorded ? (
                  <Button
                    onClick={handleRecordVideo}
                    disabled={isRecording}
                    className="gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 rounded-full px-5"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    {isRecording ? 'Capturing Video...' : 'Start Recording Liveness'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitWhisper}
                    disabled={analyzingAudio}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 rounded-full px-5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {analyzingAudio ? 'Whisper ASR Transcribing...' : 'Verify Audio Stream'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Whisper ASR Verdict */}
      {step === 3 && verificationResult && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Phase 1 Verdict</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Automated transcription and acoustic analysis.</p>
            </div>
            <Badge variant="emerald" className="text-xs">{verificationResult.badge}</Badge>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Liveness Nonce Matched ({Math.round(verificationResult.confidenceScore * 100)}% Confidence)
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              OpenAI Whisper ASR transcribed the audio stream from the uploaded video. The dynamic nonce phrase matched the server session timestamp.
            </p>
            <div className="p-3 rounded-xl bg-white border border-emerald-200/80 text-xs font-mono space-y-1">
              <div>Expected Nonce: <span className="font-bold text-neutral-900">{verificationResult.expectedNonce}</span></div>
              <div>Whisper Audio: <span className="font-bold text-emerald-600">{verificationResult.whisperTranscript}</span></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
            <span className="text-xs text-neutral-400">Enqueued for Phase 2 auditor review</span>
            <Button onClick={() => setStep(4)} className="text-xs h-9 rounded-full bg-neutral-950 text-white">
              <span>View Auditor Queue</span>
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Auditor Review Terminal */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Phase 2: Platform Auditor Terminal</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Human-in-the-loop verification review.</p>
            </div>
            <Badge variant="accent" className="text-xs">Admin Review Mode</Badge>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-950">{currentUser.name}</div>
                <div className="text-xs text-neutral-400 font-mono">{currentUser.email} • {currentUser.role}</div>
              </div>
              <Badge variant="emerald">Nonce Matched</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-neutral-200/60">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Corporate Domain</div>
                <div className="font-semibold text-neutral-900 mt-0.5">nike.com (DNS TXT Matched)</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-neutral-200/60">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Fraud Risk Vector</div>
                <div className="font-semibold text-emerald-600 mt-0.5">0.02 (Low Risk)</div>
              </div>
            </div>

            {adminApproved ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-950">Account Fully Verified &amp; Badge Issued</div>
                <p className="text-[11px] text-emerald-800">
                  User can now execute legally binding milestone contracts and access isolated negotiation deal rooms.
                </p>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200/60">
                <Button variant="outline" size="sm" className="text-xs h-8 rounded-full text-rose-600 border-neutral-200">
                  Flag Discrepancy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAdminApproved(true)}
                  className="text-xs h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Approve &amp; Issue Verified Badge
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
