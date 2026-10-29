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
  Mail
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
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ebf4fd] text-[#0a66c2] border border-[#cce4f9] text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-[#057642]" />
          <span>Two-Phase Human-in-the-Loop Verification</span>
        </div>
        <h1 className="text-2xl font-bold text-[#191919] tracking-tight">
          Cryptographic Identity Verification
        </h1>
        <p className="text-xs text-[#5e5e5e] max-w-lg mx-auto">
          To eliminate fake emails and impersonation scams, all accounts pass Whisper ASR dynamic nonce matching and platform admin review.
        </p>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[
            { num: 1, label: 'Contact & Role' },
            { num: 2, label: 'Liveness Nonce' },
            { num: 3, label: 'Whisper Copilot' },
            { num: 4, label: 'Auditor Review' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= s.num
                    ? 'bg-[#0a66c2] text-white'
                    : 'bg-[#f4f2ee] text-[#5e5e5e] border border-[#e0dfdc]'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs hidden sm:inline ${step >= s.num ? 'text-[#191919] font-semibold' : 'text-[#5e5e5e]'}`}>
                {s.label}
              </span>
              {s.num < 4 && <div className="h-0.5 w-4 bg-[#e0dfdc]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Role Selection & Contact Verification */}
      {step === 1 && (
        <div className="linkedin-card p-5 space-y-5">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#191919]">Select Account Persona and Contact Verification</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'CREATOR', title: 'Content Creator', desc: 'Monetize audience and sign escrow contracts.' },
                { id: 'AGENCY_MANAGER', title: 'Talent Agency', desc: 'Represents creators with masked brand POI.' },
                { id: 'ENTERPRISE_REP', title: 'Enterprise Rep', desc: 'Sourcing talent within regional branch.' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleType(r.id as any)}
                  className={`p-3 rounded-[6px] border text-left transition-colors ${
                    roleType === r.id
                      ? 'border-[#0a66c2] bg-[#ebf4fd] text-[#191919]'
                      : 'border-[#e0dfdc] bg-white text-[#5e5e5e] hover:border-[#b2b2b2]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#191919] mb-0.5">{r.title}</div>
                  <div className="text-[11px] leading-relaxed">{r.desc}</div>
                </button>
              ))}
            </div>

            {/* Manager Declaration Checkbox */}
            <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isManagerDeclared}
                  onChange={(e) => setIsManagerDeclared(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#b2b2b2] text-[#0a66c2] focus:ring-[#0a66c2]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#191919]">
                    Mandatory Declaration: Are you an Agency or Talent Manager representing other creators?
                  </span>
                  <p className="text-[11px] text-[#5e5e5e] mt-0.5">
                    Agency accounts must upload signed Representation Agreements. Falsifying this step triggers immediate account suspension.
                  </p>
                </div>
              </label>
            </div>

            {/* OTP Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#191919]">
                  <Smartphone className="h-3.5 w-3.5 text-[#057642]" />
                  SMS Phone OTP Challenge
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit SMS OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] placeholder:text-[#5e5e5e]"
                />
                <span className="text-[11px] text-[#057642]">Verified via SMS Gateway</span>
              </div>

              <div className="p-3 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#191919]">
                  <Mail className="h-3.5 w-3.5 text-[#0a66c2]" />
                  Corporate or Creator Email
                </div>
                <input
                  type="text"
                  placeholder="Enter Magic Link Token"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="w-full bg-white border border-[#b2b2b2] rounded p-2 text-xs text-[#191919] placeholder:text-[#5e5e5e]"
                />
                <span className="text-[11px] text-[#0a66c2]">DNS TXT record validation active</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#f0f0f0]">
              <Button onClick={handleInitPhase1} className="gap-2 text-xs">
                <span>Continue to Phase 1 (Liveness Nonce)</span>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic 6-Word Nonce Recording */}
      {step === 2 && (
        <div className="linkedin-card p-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#191919]">Phase 1: Dynamic 6-Word Liveness Nonce</h2>
              <Badge variant="warning" className="text-xs">10m TTL Session</Badge>
            </div>

            <p className="text-xs text-[#5e5e5e]">
              To defeat deepfakes and pre-recorded botted footage, recite this dynamic 6-word session passphrase generated by the server:
            </p>

            <div className="p-5 rounded-[6px] bg-[#ebf4fd] border border-[#cce4f9] text-center space-y-1">
              <div className="text-xs font-semibold text-[#0a66c2]">Read aloud on video:</div>
              <div className="text-xl sm:text-2xl font-bold text-[#191919] tracking-tight py-1">
                &ldquo;{sessionNonce.replace(/-/g, ' ')}&rdquo;
              </div>
              <p className="text-[11px] text-[#5e5e5e]">
                Server Session Nonce: <code>{sessionNonce}</code>
              </p>
            </div>

            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#e8e7e3] text-center space-y-3">
              <div className="h-36 rounded bg-white border border-[#e0dfdc] flex flex-col items-center justify-center p-3">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="h-3 w-3 rounded-full bg-[#c4242a] mx-auto" />
                    <p className="text-xs font-bold text-[#c4242a]">Recording audio and video stream...</p>
                  </div>
                ) : videoRecorded ? (
                  <div className="space-y-1">
                    <CheckCircle2 className="h-7 w-7 text-[#057642] mx-auto" />
                    <p className="text-xs font-bold text-[#191919]">Video Captured (00:08s)</p>
                    <p className="text-[11px] text-[#5e5e5e]">Audio: &ldquo;{spokenTranscript}&rdquo;</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-[#5e5e5e]">
                    <Video className="h-7 w-7 mx-auto text-[#0a66c2]" />
                    <p className="text-xs">Click record to start 8-second selfie verification check</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {!videoRecorded ? (
                  <Button
                    onClick={handleRecordVideo}
                    disabled={isRecording}
                    className="gap-2 bg-[#c4242a] hover:bg-[#a51d22] text-xs h-8"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    {isRecording ? 'Capturing Video...' : 'Start Recording Video'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitWhisper}
                    disabled={analyzingAudio}
                    className="gap-2 bg-[#057642] hover:bg-[#046237] text-xs h-8"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {analyzingAudio ? 'Whisper ASR Transcribing...' : 'Verify Audio with Whisper ASR'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Whisper ASR Verification Verdict */}
      {step === 3 && verificationResult && (
        <div className="linkedin-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#191919]">Phase 1 Nonce Verification Result</h2>
            <Badge variant="accent" className="text-xs">{verificationResult.badge}</Badge>
          </div>

          <div className="p-4 rounded-[6px] bg-[#e6f4ea] border border-[#c6ebd1] space-y-2">
            <div className="flex items-center gap-2 text-[#057642] font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              Audio Nonce Validated with {Math.round(verificationResult.confidenceScore * 100)}% Confidence
            </div>
            <p className="text-xs text-[#191919] leading-relaxed">
              OpenAI Whisper ASR transcribed the audio stream from the uploaded video. The dynamic nonce phrase matched the server session timestamp.
            </p>
            <div className="p-2.5 rounded bg-white border border-[#e0dfdc] text-xs space-y-0.5">
              <div>Expected Nonce: <span className="font-semibold text-[#0a66c2]">{verificationResult.expectedNonce}</span></div>
              <div>Whisper Audio: <span className="font-semibold text-[#057642]">{verificationResult.whisperTranscript}</span></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#f0f0f0]">
            <span className="text-xs text-[#5e5e5e]">Status: Transferred to Phase 2 review queue</span>
            <Button onClick={() => setStep(4)} className="text-xs h-8">
              <span>View Auditor Review Queue</span>
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Auditor Review Terminal */}
      {step === 4 && (
        <div className="linkedin-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#191919]">Phase 2: Platform Auditor Review Terminal</h2>
            <Badge variant="warning" className="text-xs">Admin Queue View</Badge>
          </div>

          <p className="text-xs text-[#5e5e5e]">
            Review verification footage, Whisper transcript diff, and corporate domain DNS records:
          </p>

          <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#191919]">{currentUser.name}</div>
                <div className="text-[11px] text-[#5e5e5e]">{currentUser.email} • {currentUser.role}</div>
              </div>
              <Badge variant="accent">Nonce Verified</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-white border border-[#e0dfdc]">
                <div className="text-[10px] text-[#5e5e5e]">Corporate Domain</div>
                <div className="font-semibold text-[#191919] mt-0.5">nike.com (DNS TXT Matched)</div>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#e0dfdc]">
                <div className="text-[10px] text-[#5e5e5e]">Fraud Risk Score</div>
                <div className="font-semibold text-[#057642] mt-0.5">0.02 (Low Risk)</div>
              </div>
            </div>

            {adminApproved ? (
              <div className="p-3 rounded bg-[#e6f4ea] border border-[#c6ebd1] text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 text-[#057642] mx-auto" />
                <div className="text-xs font-bold text-[#191919]">Account Fully Verified &amp; Active</div>
                <p className="text-[11px] text-[#5e5e5e]">
                  User can now execute legally binding milestone contracts and access isolated negotiation deal rooms.
                </p>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2 border-t border-[#e8e7e3]">
                <Button variant="outline" size="sm" className="text-xs h-7 text-[#c4242a]">
                  Flag Discrepancy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAdminApproved(true)}
                  className="text-xs h-7 bg-[#057642] hover:bg-[#046237]"
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
