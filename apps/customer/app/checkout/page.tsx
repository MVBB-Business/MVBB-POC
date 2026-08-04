"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { useCart } from "../../lib/cart-context";
import { computeTotals, resolveCartLines } from "../../lib/cart-totals";
import { useGrades } from "../../lib/use-grades";

const SLOTS = ["Anytime", "Morning (8am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

interface Address {
  label: string;
  line: string;
  city: string;
  pincode: string;
  phone: string;
}

const EMPTY_ADDRESS: Address = { label: "", line: "", city: "", pincode: "", phone: "" };

// Ported from mvbb-app.jsx Checkout (prototype lines ~524-573). The prototype
// picks from `profile.addresses`/`profile.paymentMethods` saved on a user
// profile — that needs real auth (#5, #14), which isn't built yet, so this
// takes a single address inline instead of a saved-address list, and offers
// only "Pay at shop" (saved cards/UPI/bank need the same profile system).
//
// Placing an order does NOT write to Supabase: `orders` has RLS enabled with
// zero policies (verified — anon insert is rejected), and it should stay
// that way until there's real auth to scope `customer_id` to the signed-in
// user server-side. Writing a permissive insert policy now would let anyone
// create orders as anyone, with client-computed totals. This screen instead
// shows a local confirmation and clears the cart, matching the prototype's
// own non-persistent (browser-local) storage model for Phase 1 demo parity.
export default function CheckoutPage() {
  const { lines, coupon, clear } = useCart();
  const { grades, loading, error } = useGrades();
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [placed, setPlaced] = useState<{ orderId: string } | null>(null);

  const lineDetails = useMemo(() => resolveCartLines(lines, grades), [lines, grades]);
  const totals = useMemo(() => computeTotals(lineDetails, coupon), [lineDetails, coupon]);

  const addressComplete = Boolean(address.label && address.line && address.city && address.pincode.length === 6);
  const canPlace = addressComplete && lineDetails.length > 0;

  function updateAddress<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  function placeOrder() {
    if (!canPlace) return;
    // crypto.randomUUID() rather than Math.random() — this id is only ever
    // shown locally (nothing is persisted, see the file-level comment
    // above), but there's no reason to reach for a weaker generator here.
    const orderId = "MVBB" + crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
    setPlaced({ orderId });
    clear();
  }

  if (placed) {
    return (
      <main style={{ background: C.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: 24, textAlign: "center", maxWidth: 320 }}>
          <p className="gd text-2xl font-bold" style={{ color: C.ink, marginBottom: 8 }}>
            Order placed 🎉
          </p>
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 4 }}>
            Order #{placed.orderId}
          </p>
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 24 }}>
            Delivery slot: {slot}
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
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <Link href="/cart" className="gb text-sm" style={{ color: C.muted }}>
          ← Back
        </Link>
        <p className="gd text-xl font-bold" style={{ color: C.ink, margin: "8px 0 0" }}>
          Checkout
        </p>
      </div>

      {loading && (
        <p className="gb text-sm text-center" style={{ color: C.muted, padding: "32px 0" }}>
          Loading…
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
            Your cart is empty
          </p>
          <Link href="/" className="gb text-sm font-semibold" style={{ color: C.goldDark }}>
            Browse products
          </Link>
        </div>
      )}

      {!loading && !error && lineDetails.length > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
            Deliver to
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            <Field label="Label" value={address.label} onChange={(v) => updateAddress("label", v)} placeholder="Shop, Warehouse…" />
            <Field label="Address" value={address.line} onChange={(v) => updateAddress("line", v)} placeholder="Street / locality" />
            <Field label="City" value={address.city} onChange={(v) => updateAddress("city", v)} placeholder="Guntur" />
            <Field
              label="Pincode"
              value={address.pincode}
              onChange={(v) => updateAddress("pincode", v.replace(/\D/g, "").slice(0, 6))}
              placeholder="522001"
            />
            <Field
              label="Contact (optional)"
              value={address.phone}
              onChange={(v) => updateAddress("phone", v)}
              placeholder="+91 98765 43210"
            />
          </div>

          <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
            Delivery time
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className="gb text-xs font-medium"
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: slot === s ? C.garlic : C.card,
                  color: slot === s ? C.gold : C.muted,
                  border: `1px solid ${slot === s ? C.garlic : C.line}`,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
            Payment method
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
              background: C.card,
              border: `1px solid ${C.gold}`,
            }}
          >
            <div>
              <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                Pay at shop
              </p>
              <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                Cash, UPI in person, or call to arrange
              </p>
            </div>
          </div>
          <p className="gb text-xs" style={{ color: C.muted, marginBottom: 20 }}>
            No cash on delivery to the driver — &quot;Pay at shop&quot; settles directly with MVBB, not the delivery
            driver. Saved cards/UPI are coming once account login ships.
          </p>

          <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, background: C.card, marginBottom: 16 }}>
            <SummaryRow label="Subtotal" value={inr(totals.subtotal)} />
            {totals.discount > 0 && <SummaryRow label="Discount" value={`−${inr(totals.discount)}`} />}
            <SummaryRow label="Delivery" value={inr(totals.delivery)} />
            <div style={{ borderTop: `1px solid ${C.line}`, margin: "8px 0" }} />
            <SummaryRow label="Total" value={inr(totals.total)} bold />
          </div>

          <button
            type="button"
            disabled={!canPlace}
            onClick={placeOrder}
            className="gb text-sm font-semibold"
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 999,
              border: "none",
              background: canPlace ? C.garlic : C.line,
              color: canPlace ? C.ivory : C.muted,
              cursor: canPlace ? "pointer" : "not-allowed",
            }}
          >
            Place order
          </button>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}>) {
  return (
    <label style={{ display: "block" }}>
      <span className="gb text-xs" style={{ color: C.muted, display: "block", marginBottom: 4 }}>
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="gm text-sm"
        style={{ width: "100%", borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.line}`, background: C.paper, color: C.ink }}
      />
    </label>
  );
}

function SummaryRow({ label, value, bold }: Readonly<{ label: string; value: string; bold?: boolean }>) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
      <span className="gb text-sm" style={{ color: C.muted }}>
        {label}
      </span>
      <span className={bold ? "gm text-base font-bold" : "gb text-sm"} style={{ color: C.ink }}>
        {value}
      </span>
    </div>
  );
}
