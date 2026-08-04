"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { useCart } from "../../lib/cart-context";
import { computeTotals, resolveCartLines } from "../../lib/cart-totals";
import { useOrders } from "../../lib/orders-context";
import { useProfile, type PaymentMethod } from "../../lib/profile-context";
import { SummaryRow } from "../../lib/summary-row";
import { useGrades } from "../../lib/use-grades";

function paymentLabel(payAtShop: boolean, method: PaymentMethod | null | undefined): string {
  if (payAtShop || !method) return "Pay at shop";
  if (method.type === "card") return `Card •••• ${method.detail}`;
  if (method.type === "bank") return `Bank •••• ${method.detail}`;
  return method.detail;
}

const SLOTS = ["Anytime", "Morning (8am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

// Ported from mvbb-app.jsx Checkout (prototype lines ~524-573), now picking
// from the saved addresses/payment methods added in this PR (profile-context)
// instead of taking a one-off inline address, matching the prototype more
// closely. Checkout requires being signed in, since there's nowhere else to
// keep a saved address for a guest.
//
// Placing an order does NOT write to Supabase: `orders` has RLS enabled with
// zero policies (verified — anon insert is rejected), and it should stay
// that way until there's real auth to scope `customer_id` to the signed-in
// user server-side. Writing a permissive insert policy now would let anyone
// create orders as anyone, with client-computed totals. This screen instead
// saves the order via orders-context (browser-local, same model as
// cart-context/profile-context) and clears the cart, matching the
// prototype's own non-persistent storage model for Phase 1 demo parity.
export default function CheckoutPage() {
  const { lines, coupon, clear } = useCart();
  const { profile } = useProfile();
  const { placeOrder: saveOrder } = useOrders();
  const { grades, loading, error } = useGrades();
  const [addressId, setAddressId] = useState<string | null>(profile?.addresses[0]?.id ?? null);
  const [paymentId, setPaymentId] = useState<string | null>(
    profile?.paymentMethods.find((m) => m.isDefault)?.id ?? profile?.paymentMethods[0]?.id ?? null
  );
  const [payAtShop, setPayAtShop] = useState(profile ? profile.paymentMethods.length === 0 : false);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [placed, setPlaced] = useState<{ orderId: string } | null>(null);

  // Picks up an address/payment method added via "+ Add new…" and returned
  // from — those routes navigate back into this same page instance rather
  // than remounting it, so the useState initializers above only ran once,
  // before the new entry existed.
  useEffect(() => {
    if (!profile) return;
    if (!addressId && profile.addresses.length > 0) setAddressId(profile.addresses[0].id);
    if (!payAtShop && !paymentId && profile.paymentMethods.length > 0) {
      setPaymentId(profile.paymentMethods.find((m) => m.isDefault)?.id ?? profile.paymentMethods[0].id);
    }
  }, [profile, addressId, paymentId, payAtShop]);

  const lineDetails = useMemo(() => resolveCartLines(lines, grades), [lines, grades]);
  const totals = useMemo(() => computeTotals(lineDetails, coupon), [lineDetails, coupon]);

  const address = profile?.addresses.find((a) => a.id === addressId) ?? null;
  const paymentMethod = profile?.paymentMethods.find((m) => m.id === paymentId) ?? null;
  const canPlace = Boolean(address) && (payAtShop || Boolean(paymentMethod)) && lineDetails.length > 0;

  function placeOrder() {
    if (!canPlace || !address || !profile) return;
    // crypto.randomUUID() rather than Math.random() — this id is only ever
    // shown locally (nothing is persisted server-side, see the file-level
    // comment above), but there's no reason to reach for a weaker generator.
    const orderId = "MVBB" + crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
    saveOrder({
      id: orderId,
      customerPhone: profile.phone,
      items: lineDetails.map((l) => ({
        gradeId: l.gradeId,
        name: l.grade.label,
        qty: l.qty,
        unit: l.unit,
        lineTotal: l.lineTotal,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      delivery: totals.delivery,
      total: totals.total,
      address: { label: address.label, line: address.line, city: address.city, pincode: address.pincode },
      deliverySlot: slot,
      payment: paymentLabel(payAtShop, paymentMethod),
    });
    setPlaced({ orderId });
    clear();
  }

  if (placed) return <OrderPlaced orderId={placed.orderId} slot={slot} />;

  if (!profile) {
    return (
      <main style={{ background: C.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: 24, textAlign: "center", maxWidth: 320 }}>
          <p className="gd text-lg font-bold" style={{ color: C.ink, marginBottom: 8 }}>
            Sign in to check out
          </p>
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 20 }}>
            Your cart is saved — sign in and come back to finish checking out.
          </p>
          <Link
            href="/login"
            className="gb text-sm font-semibold"
            style={{ display: "inline-block", padding: "10px 24px", borderRadius: 999, background: C.garlic, color: C.ivory, textDecoration: "none" }}
          >
            Sign in
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
          <AddressSection addresses={profile.addresses} addressId={addressId} onSelect={setAddressId} />
          <SlotSection slot={slot} onSelect={setSlot} />
          <PaymentSection
            paymentMethods={profile.paymentMethods}
            paymentId={paymentId}
            payAtShop={payAtShop}
            onSelect={(id) => {
              setPaymentId(id);
              setPayAtShop(false);
            }}
            onSelectPayAtShop={() => setPayAtShop(true)}
          />

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

function OrderPlaced({ orderId, slot }: Readonly<{ orderId: string; slot: string }>) {
  return (
    <main style={{ background: C.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: 24, textAlign: "center", maxWidth: 320 }}>
        <p className="gd text-2xl font-bold" style={{ color: C.ink, marginBottom: 8 }}>
          Order placed 🎉
        </p>
        <p className="gb text-sm" style={{ color: C.muted, marginBottom: 4 }}>
          Order #{orderId}
        </p>
        <p className="gb text-sm" style={{ color: C.muted, marginBottom: 24 }}>
          Delivery slot: {slot}
        </p>
        <Link
          href="/"
          className="gb text-sm font-semibold"
          style={{ display: "inline-block", padding: "10px 24px", borderRadius: 999, background: C.garlic, color: C.ivory, textDecoration: "none" }}
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}

function AddressSection({
  addresses,
  addressId,
  onSelect,
}: Readonly<{ addresses: { id: string; label: string; line: string; city: string; pincode: string }[]; addressId: string | null; onSelect: (id: string) => void }>) {
  return (
    <>
      <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
        Deliver to
      </p>
      {addresses.length === 0 && (
        <p className="gb text-sm" style={{ color: C.muted, marginBottom: 8 }}>
          No saved address.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
        {addresses.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className="gb text-sm"
            style={{
              textAlign: "left",
              borderRadius: 12,
              padding: 12,
              background: C.card,
              border: `1px solid ${addressId === a.id ? C.gold : C.line}`,
              cursor: "pointer",
            }}
          >
            <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
              {a.label}
            </p>
            <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
              {a.line}, {a.city} – {a.pincode}
            </p>
          </button>
        ))}
      </div>
      <Link href="/addresses/new" className="gb text-xs font-semibold" style={{ color: C.goldDark, display: "block", marginBottom: 20 }}>
        + Add new address
      </Link>
    </>
  );
}

function SlotSection({ slot, onSelect }: Readonly<{ slot: string; onSelect: (s: string) => void }>) {
  return (
    <>
      <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
        Delivery time
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
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
    </>
  );
}

function PaymentSection({
  paymentMethods,
  paymentId,
  payAtShop,
  onSelect,
  onSelectPayAtShop,
}: Readonly<{
  paymentMethods: { id: string; type: string; detail: string; isDefault: boolean }[];
  paymentId: string | null;
  payAtShop: boolean;
  onSelect: (id: string) => void;
  onSelectPayAtShop: () => void;
}>) {
  return (
    <>
      <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
        Payment method
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
        {paymentMethods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className="gb text-sm"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "left",
              borderRadius: 12,
              padding: 12,
              background: C.card,
              border: `1px solid ${!payAtShop && paymentId === m.id ? C.gold : C.line}`,
              cursor: "pointer",
            }}
          >
            <span style={{ color: C.ink }}>
              {m.type === "card" || m.type === "bank" ? `${m.type} •••• ${m.detail}` : m.detail}
            </span>
            {m.isDefault && (
              <span className="gb text-xs font-medium" style={{ padding: "2px 8px", borderRadius: 999, background: C.paper, color: C.goldDark }}>
                Default
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={onSelectPayAtShop}
          className="gb text-sm"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            borderRadius: 12,
            padding: 12,
            background: C.card,
            border: `1px solid ${payAtShop ? C.gold : C.line}`,
            cursor: "pointer",
          }}
        >
          <span className="gb text-sm font-semibold" style={{ color: C.ink }}>
            Pay at shop
          </span>
          <span className="gb text-xs" style={{ color: C.muted }}>
            Cash, UPI in person, or call to arrange
          </span>
        </button>
      </div>
      <Link href="/payment-methods/new" className="gb text-xs font-semibold" style={{ color: C.goldDark, display: "block" }}>
        + Add payment method
      </Link>
      <p className="gb text-xs" style={{ color: C.muted, margin: "8px 0 20px" }}>
        No cash on delivery to the driver — &quot;Pay at shop&quot; settles directly with MVBB, not the delivery driver.
      </p>
    </>
  );
}
