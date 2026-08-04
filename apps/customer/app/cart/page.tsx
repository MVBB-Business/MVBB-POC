"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { useCart } from "../../lib/cart-context";
import { computeTotals, resolveCartLines } from "../../lib/cart-totals";
import { useGrades } from "../../lib/use-grades";

const WELCOME_CODE = "WELCOME5";

// Ported from mvbb-app.jsx CartScreen (prototype lines ~486-523), against the
// live Supabase catalog and the local cart-context instead of the shared
// in-memory `lines` prop.
export default function CartPage() {
  const router = useRouter();
  const { lines, coupon, updateQty, removeLine, setCoupon } = useCart();
  const { grades, loading, error } = useGrades();
  const [couponInput, setCouponInput] = useState(coupon?.code ?? "");

  const lineDetails = useMemo(() => resolveCartLines(lines, grades), [lines, grades]);
  const totals = useMemo(() => computeTotals(lineDetails, coupon), [lineDetails, coupon]);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    setCoupon(code === WELCOME_CODE ? { code, applied: true } : { code, applied: false, invalid: true });
  }

  function proceedToCheckout() {
    router.push("/checkout");
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <Link href="/" className="gb text-sm" style={{ color: C.muted }}>
          ← Back
        </Link>
        <p className="gd text-xl font-bold" style={{ color: C.ink, margin: "8px 0 0" }}>
          Your cart
        </p>
      </div>

      {loading && (
        <p className="gb text-sm text-center" style={{ color: C.muted, padding: "32px 0" }}>
          Loading cart…
        </p>
      )}
      {error && (
        <p className="gb text-sm text-center" style={{ color: C.rust, padding: "32px 0" }}>
          Couldn&apos;t load products: {error}
        </p>
      )}

      {!loading && !error && lineDetails.length === 0 && (
        <div style={{ padding: "48px 16px", textAlign: "center" }}>
          <p className="gd text-base font-semibold" style={{ color: C.ink, marginBottom: 4 }}>
            Cart is empty
          </p>
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 16 }}>
            Browse garlic grades to get started.
          </p>
          <Link
            href="/"
            className="gb text-sm font-semibold"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              borderRadius: 999,
              background: C.garlic,
              color: C.ivory,
              textDecoration: "none",
            }}
          >
            Browse
          </Link>
        </div>
      )}

      {!loading && !error && lineDetails.length > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lineDetails.map((l) => (
              <div
                key={l.gradeId}
                style={{
                  display: "flex",
                  gap: 12,
                  borderRadius: 16,
                  padding: 12,
                  background: C.card,
                  border: `1px solid ${C.line}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: l.grade.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span className="gd text-lg font-bold" style={{ color: C.ink }}>
                    {l.grade.label[0]}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <p className="gd text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                        {l.grade.label}
                      </p>
                      <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                        {inr(l.unit)}/bag · {l.grade.bulbSize}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(l.gradeId)}
                      aria-label={`Remove ${l.grade.label}`}
                      className="gb text-xs font-semibold"
                      style={{ border: "none", background: "none", color: C.rust, cursor: "pointer", padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => updateQty(l.gradeId, l.qty - 1)}
                        aria-label="Decrease quantity"
                        className="gb text-sm font-semibold"
                        style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.line}`, background: C.paper }}
                      >
                        −
                      </button>
                      <span className="gm text-sm font-semibold" style={{ color: C.ink, minWidth: 20, textAlign: "center" }}>
                        {l.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(l.gradeId, l.qty + 1)}
                        aria-label="Increase quantity"
                        className="gb text-sm font-semibold"
                        style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.line}`, background: C.paper }}
                      >
                        +
                      </button>
                    </div>
                    <span className="gm text-sm font-semibold" style={{ color: C.ink }}>
                      {inr(l.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderRadius: 16, padding: 12, marginTop: 12, background: C.card, border: `1px solid ${C.line}` }}>
            <p className="gb text-xs font-medium" style={{ color: C.muted, marginBottom: 8 }}>
              Coupon code
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. WELCOME5"
                className="gm text-sm"
                style={{ flex: 1, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.line}`, background: C.paper, color: C.ink }}
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="gb text-xs font-semibold"
                style={{ padding: "0 16px", borderRadius: 8, border: "none", background: C.garlic, color: C.gold, cursor: "pointer" }}
              >
                Apply
              </button>
            </div>
            {coupon?.invalid && (
              <p className="gb text-xs" style={{ color: C.rust, marginTop: 8 }}>
                Invalid code.
              </p>
            )}
            {coupon?.applied && (
              <p className="gb text-xs" style={{ color: C.green, marginTop: 8 }}>
                5% discount applied!
              </p>
            )}
          </div>

          <div style={{ borderRadius: 16, padding: 16, marginTop: 12, background: C.garlic }}>
            <SummaryRow label="Subtotal" value={inr(totals.subtotal)} />
            {totals.discount > 0 && <SummaryRow label="Discount" value={`−${inr(totals.discount)}`} />}
            <SummaryRow label="Delivery" value={inr(totals.delivery)} />
            <div style={{ borderTop: `1px solid ${C.garlicLight}`, margin: "8px 0" }} />
            <SummaryRow label="Total" value={inr(totals.total)} bold />
          </div>

          <button
            type="button"
            onClick={proceedToCheckout}
            className="gb text-sm font-semibold"
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px 0",
              borderRadius: 999,
              border: "none",
              background: C.garlic,
              color: C.ivory,
              cursor: "pointer",
            }}
          >
            Proceed to checkout →
          </button>
        </div>
      )}
    </main>
  );
}

function SummaryRow({ label, value, bold }: Readonly<{ label: string; value: string; bold?: boolean }>) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
      <span className="gb text-sm" style={{ color: C.ivory }}>
        {label}
      </span>
      <span className={bold ? "gm text-base font-bold" : "gb text-sm"} style={{ color: C.ivory }}>
        {value}
      </span>
    </div>
  );
}
