"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { C } from "@mvbb/ui";
import { useProfile, type AccountType } from "../../lib/profile-context";

type Step = "type" | "phone" | "otp" | "name";

const HEADINGS: Record<Step, string> = {
  type: "Welcome to MVBB",
  phone: "Sign in to MVBB",
  otp: "Verify your number",
  name: "One last step",
};

function deriveStep(accountType: AccountType | null, phoneSubmitted: boolean, phone: string, otpVerified: boolean): Step {
  if (!accountType) return "type";
  if (otpVerified) return "name";
  return phoneSubmitted && phone.length === 10 ? "otp" : "phone";
}

// Ported from mvbb-app.jsx LoginScreen (prototype lines ~249-367). The
// prototype gates OTP behind an admin-approval queue (signupReqs) that lives
// in the Admin dashboard — that's #2, not built yet, so this skips straight
// from phone to OTP. OTP itself stays a demo stand-in ("any 4 digits work"
// in the prototype too) until #5 (real SMS/OTP provider) lands; nothing here
// is real authentication — see profile-context.tsx.
export default function LoginPage() {
  const router = useRouter();
  const { setProfile } = useProfile();

  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isHawker, setIsHawker] = useState(false);

  const step = deriveStep(accountType, phoneSubmitted, phone, otpVerified);

  function finish() {
    if (!accountType || !name.trim()) return;
    if (accountType === "B2B" && !businessName.trim()) return;
    setProfile({
      phone,
      name: name.trim(),
      accountType,
      ...(accountType === "B2B" ? { businessName: businessName.trim(), isHawker } : {}),
    });
    router.push("/");
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="gd text-2xl font-bold" style={{ color: C.garlic }}>
          🧄 MVBB
        </span>
        {accountType && step !== "type" && <AccountTypeBadge accountType={accountType} />}
      </div>

      <p className="gd text-2xl font-bold" style={{ color: C.ink, margin: "16px 0 4px" }}>
        {HEADINGS[step]}
      </p>
      <p className="gb text-sm" style={{ color: C.muted, marginBottom: 24 }}>
        <StepSubtitle step={step} phone={phone} accountType={accountType} />
      </p>

      {step === "type" && <TypeStep onPick={setAccountType} />}

      {step === "phone" && (
        <PhoneStep
          phone={phone}
          onChangePhone={setPhone}
          onSubmit={() => setPhoneSubmitted(true)}
          onChangeAccountType={() => setAccountType(null)}
        />
      )}

      {step === "otp" && (
        <OtpStep
          otp={otp}
          onChangeOtp={setOtp}
          onVerify={() => setOtpVerified(true)}
          onUseDifferentNumber={() => {
            setPhone("");
            setPhoneSubmitted(false);
            setOtp(["", "", "", ""]);
          }}
        />
      )}

      {step === "name" && (
        <NameStep
          accountType={accountType}
          name={name}
          onChangeName={setName}
          businessName={businessName}
          onChangeBusinessName={setBusinessName}
          isHawker={isHawker}
          onChangeIsHawker={setIsHawker}
          onFinish={finish}
        />
      )}
    </main>
  );
}

function AccountTypeBadge({ accountType }: Readonly<{ accountType: AccountType }>) {
  return (
    <span
      className="gb text-xs font-semibold"
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        background: accountType === "B2B" ? C.garlic : C.card,
        color: accountType === "B2B" ? C.gold : C.muted,
        border: `1px solid ${accountType === "B2B" ? C.garlic : C.line}`,
      }}
    >
      {accountType}
    </span>
  );
}

function StepSubtitle({ step, phone, accountType }: Readonly<{ step: Step; phone: string; accountType: AccountType | null }>) {
  if (step === "type") return "Tell us how you'll be buying, so we can set up the right pricing and account type.";
  if (step === "phone") return "Premium garlic, direct from Guntur wholesale complex.";
  if (step === "otp") return `OTP sent to +91 ${phone}. Demo — any 4 digits work.`;
  return accountType === "B2B" ? "A few business details." : "What should we call you?";
}

function TypeStep({ onPick }: Readonly<{ onPick: (t: AccountType) => void }>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button
        type="button"
        onClick={() => onPick("B2C")}
        className="gb text-sm font-semibold"
        style={{ textAlign: "left", borderRadius: 12, padding: 16, background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}
      >
        <p style={{ color: C.ink, margin: 0 }}>I&apos;m a consumer</p>
        <p className="gb text-xs font-normal" style={{ color: C.muted, margin: 0 }}>
          Buying garlic for home or personal use (B2C)
        </p>
      </button>
      <button
        type="button"
        onClick={() => onPick("B2B")}
        className="gb text-sm font-semibold"
        style={{ textAlign: "left", borderRadius: 12, padding: 16, background: C.garlic, border: `1px solid ${C.garlic}`, cursor: "pointer" }}
      >
        <p style={{ color: C.ivory, margin: 0 }}>I&apos;m a business</p>
        <p className="gb text-xs font-normal" style={{ color: C.muted, margin: 0 }}>
          Shops, hawkers, hotels &amp; bulk buyers (B2B)
        </p>
      </button>
    </div>
  );
}

function PhoneStep({
  phone,
  onChangePhone,
  onSubmit,
  onChangeAccountType,
}: Readonly<{
  phone: string;
  onChangePhone: (v: string) => void;
  onSubmit: () => void;
  onChangeAccountType: () => void;
}>) {
  const canSubmit = phone.length === 10;
  return (
    <>
      <label style={{ display: "block", marginBottom: 16 }}>
        <span className="gb text-xs" style={{ color: C.muted, display: "block", marginBottom: 4 }}>
          Mobile number
        </span>
        <input
          value={phone}
          onChange={(e) => onChangePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="98765 43210"
          className="gm text-sm"
          style={{ width: "100%", borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.line}`, background: C.card, color: C.ink }}
        />
      </label>
      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="gb text-sm font-semibold"
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 999,
          border: "none",
          marginBottom: 12,
          background: canSubmit ? C.garlic : C.line,
          color: canSubmit ? C.ivory : C.muted,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Request OTP
      </button>
      <button
        type="button"
        onClick={onChangeAccountType}
        className="gb text-xs font-semibold"
        style={{ border: "none", background: "none", color: C.muted, cursor: "pointer", padding: 0 }}
      >
        ← Change account type
      </button>
    </>
  );
}

const OTP_SLOTS = ["first", "second", "third", "fourth"] as const;

function OtpStep({
  otp,
  onChangeOtp,
  onVerify,
  onUseDifferentNumber,
}: Readonly<{
  otp: string[];
  onChangeOtp: (next: string[]) => void;
  onVerify: () => void;
  onUseDifferentNumber: () => void;
}>) {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const canVerify = otp.every(Boolean);

  function handleChange(i: number, raw: string) {
    const val = raw.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = val;
    onChangeOtp(next);
    if (val && otpRefs.current[i + 1]) otpRefs.current[i + 1]?.focus();
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {OTP_SLOTS.map((slot, i) => (
          <input
            key={slot}
            ref={(el) => {
              otpRefs.current[i] = el;
            }}
            value={otp[i]}
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
            className="gm text-lg text-center"
            style={{ width: 48, height: 56, borderRadius: 12, border: `1px solid ${C.line}`, background: C.card, color: C.ink, outline: "none" }}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!canVerify}
        onClick={onVerify}
        className="gb text-sm font-semibold"
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 999,
          border: "none",
          background: canVerify ? C.garlic : C.line,
          color: canVerify ? C.ivory : C.muted,
          cursor: canVerify ? "pointer" : "not-allowed",
        }}
      >
        Verify &amp; continue
      </button>
      <button
        type="button"
        onClick={onUseDifferentNumber}
        className="gb text-xs font-semibold"
        style={{ border: "none", background: "none", color: C.muted, cursor: "pointer", padding: 0, marginTop: 12 }}
      >
        ← Use a different number
      </button>
    </>
  );
}

function NameStep({
  accountType,
  name,
  onChangeName,
  businessName,
  onChangeBusinessName,
  isHawker,
  onChangeIsHawker,
  onFinish,
}: Readonly<{
  accountType: AccountType | null;
  name: string;
  onChangeName: (v: string) => void;
  businessName: string;
  onChangeBusinessName: (v: string) => void;
  isHawker: boolean;
  onChangeIsHawker: (v: boolean) => void;
  onFinish: () => void;
}>) {
  const needsBusinessName = accountType === "B2B" && !businessName.trim();
  const canFinish = Boolean(name.trim()) && !needsBusinessName;

  return (
    <>
      <label style={{ display: "block", marginBottom: 16 }}>
        <span className="gb text-xs" style={{ color: C.muted, display: "block", marginBottom: 4 }}>
          Your name
        </span>
        <input
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="e.g. Ramesh Kumar"
          className="gm text-sm"
          style={{ width: "100%", borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.line}`, background: C.card, color: C.ink }}
        />
      </label>
      {accountType === "B2B" && (
        <>
          <label style={{ display: "block", marginBottom: 16 }}>
            <span className="gb text-xs" style={{ color: C.muted, display: "block", marginBottom: 4 }}>
              Business / shop name
            </span>
            <input
              value={businessName}
              onChange={(e) => onChangeBusinessName(e.target.value)}
              placeholder="e.g. Ramesh Traders"
              className="gm text-sm"
              style={{ width: "100%", borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.line}`, background: C.card, color: C.ink }}
            />
          </label>
          <label className="gb text-sm" style={{ display: "flex", alignItems: "center", gap: 8, color: C.ink, marginBottom: 16 }}>
            <input type="checkbox" checked={isHawker} onChange={(e) => onChangeIsHawker(e.target.checked)} />
            <span>I&apos;m a hawker / street vendor (not a registered shop)</span>
          </label>
        </>
      )}
      <button
        type="button"
        disabled={!canFinish}
        onClick={onFinish}
        className="gb text-sm font-semibold"
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 999,
          border: "none",
          background: canFinish ? C.garlic : C.line,
          color: canFinish ? C.ivory : C.muted,
          cursor: canFinish ? "pointer" : "not-allowed",
        }}
      >
        Start shopping
      </button>
    </>
  );
}
