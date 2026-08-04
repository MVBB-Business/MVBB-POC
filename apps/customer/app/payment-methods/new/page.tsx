"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { C } from "@mvbb/ui";
import { BackButton, Field, SubmitButton } from "../../../lib/form-field";
import { useProfile, type PaymentMethodType } from "../../../lib/profile-context";

const TYPES: { key: PaymentMethodType; label: string }[] = [
  { key: "upi", label: "UPI" },
  { key: "card", label: "Card" },
  { key: "bank", label: "Bank" },
  { key: "paypal", label: "PayPal" },
];

const UPI_RE = /^[\w.-]{2,}@\w{2,}$/;

// A simple structural check (has an @, a . after it, no spaces) rather than
// one combined regex -- SonarCloud flags chained [^x]+ character classes
// like /^[^\s@]+@[^\s@]+\.[^\s@]+$/ as super-linear/backtracking-prone, and
// splitting it out is both safer and just as correct for this non-critical
// client-side check (PayPal's own signup flow is the real validator).
function isEmail(value: string): boolean {
  if (/\s/.test(value)) return false;
  const at = value.indexOf("@");
  if (at <= 0 || at === value.length - 1) return false;
  const domain = value.slice(at + 1);
  const dot = domain.indexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

// Ported from mvbb-app.jsx AddPayment (prototype lines ~589-607). Only the
// last 4 digits of a card/account number are ever kept -- see
// profile-context.tsx's PaymentMethod.detail.
export default function AddPaymentMethodPage() {
  const router = useRouter();
  const { profile, loaded, addPaymentMethod } = useProfile();
  const [type, setType] = useState<PaymentMethodType>("upi");
  const [upi, setUpi] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  function changeType(next: PaymentMethodType) {
    setType(next);
    setUpi("");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setBankName("");
    setBankAccount("");
    setBankIfsc("");
    setPaypalEmail("");
  }

  function validate(): boolean {
    if (type === "upi") return UPI_RE.test(upi);
    if (type === "card") return Boolean(cardName.trim()) && cardNumber.replace(/\D/g, "").length >= 12 && /^\d{2}\/\d{2}$/.test(cardExpiry);
    if (type === "bank") return Boolean(bankName.trim()) && bankAccount.replace(/\D/g, "").length >= 6 && bankIfsc.trim().length >= 6;
    return isEmail(paypalEmail);
  }

  const canSave = validate();

  function save() {
    if (!canSave) return;
    let detail = "";
    if (type === "upi") detail = upi;
    if (type === "card") detail = cardNumber.replace(/\D/g, "").slice(-4);
    if (type === "bank") detail = bankAccount.replace(/\D/g, "").slice(-4);
    if (type === "paypal") detail = paypalEmail;
    addPaymentMethod({ type, detail });
    router.back();
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackButton onBack={() => router.back()} />
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          Add payment method
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => changeType(t.key)}
              className="gb text-xs font-medium"
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: type === t.key ? C.garlic : C.card,
                color: type === t.key ? C.gold : C.muted,
                border: `1px solid ${type === t.key ? C.garlic : C.line}`,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {type === "upi" && <Field label="UPI ID" value={upi} onChange={setUpi} placeholder="yourname@okbank" />}

        {type === "card" && (
          <>
            <Field label="Name on card" value={cardName} onChange={setCardName} placeholder="Ramesh Kumar" />
            <Field label="Card number" value={cardNumber} onChange={setCardNumber} placeholder="1234 5678 9012 3456" />
            <Field label="Expiry (MM/YY)" value={cardExpiry} onChange={setCardExpiry} placeholder="08/29" />
            <p className="gb text-xs" style={{ color: C.muted, marginTop: -8, marginBottom: 16 }}>
              CVV is never stored.
            </p>
          </>
        )}

        {type === "bank" && (
          <>
            <Field label="Account holder" value={bankName} onChange={setBankName} placeholder="Ramesh Kumar" />
            <Field label="Account number" value={bankAccount} onChange={setBankAccount} placeholder="000123456789" />
            <Field label="IFSC" value={bankIfsc} onChange={setBankIfsc} placeholder="HDFC0001234" />
          </>
        )}

        {type === "paypal" && <Field label="PayPal email" value={paypalEmail} onChange={setPaypalEmail} placeholder="you@email.com" />}

        <SubmitButton disabled={!canSave} onClick={save}>
          Save payment method
        </SubmitButton>
      </div>
    </main>
  );
}
