"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { C } from "@mvbb/ui";
import { AddLink, BackLink, ListRow, RemoveButton } from "../../lib/list-controls";
import { useProfile, type PaymentMethod, type PaymentMethodType } from "../../lib/profile-context";

const TYPE_LABELS: Record<PaymentMethodType, string> = {
  upi: "UPI",
  card: "Card",
  bank: "Bank transfer",
  paypal: "PayPal",
};

function displayName(m: PaymentMethod): string {
  if (m.type === "card") return `Card •••• ${m.detail}`;
  if (m.type === "bank") return `Bank •••• ${m.detail}`;
  return m.detail;
}

// Ported from mvbb-app.jsx PayMethods (prototype lines ~608-624).
export default function PaymentMethodsPage() {
  const router = useRouter();
  const { profile, loaded, removePaymentMethod, setDefaultPaymentMethod } = useProfile();

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackLink href="/profile" />
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          Payment methods
        </p>

        {profile.paymentMethods.length === 0 ? (
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 16 }}>
            No payment methods saved yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {profile.paymentMethods.map((m) => (
              <ListRow key={m.id}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                    {displayName(m)}
                  </p>
                  <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                    {TYPE_LABELS[m.type]}
                  </p>
                </div>
                {m.isDefault ? (
                  <span
                    className="gb text-xs font-medium"
                    style={{ padding: "4px 10px", borderRadius: 999, background: C.paper, color: C.goldDark, flexShrink: 0 }}
                  >
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefaultPaymentMethod(m.id)}
                    className="gb text-xs font-semibold"
                    style={{ border: "none", background: "none", color: C.goldDark, cursor: "pointer", flexShrink: 0 }}
                  >
                    Set default
                  </button>
                )}
                <RemoveButton onClick={() => removePaymentMethod(m.id)} />
              </ListRow>
            ))}
          </div>
        )}

        <AddLink href="/payment-methods/new">+ Add payment method</AddLink>

        <p className="gb text-xs" style={{ color: C.muted, marginTop: 16 }}>
          Details are masked. No COD — admin confirms payment receipt.
        </p>
      </div>
    </main>
  );
}
