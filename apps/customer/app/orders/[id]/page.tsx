"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { useCart } from "../../../lib/cart-context";
import { BackLink } from "../../../lib/list-controls";
import { useOrders } from "../../../lib/orders-context";
import { useProfile } from "../../../lib/profile-context";
import { SummaryRow } from "../../../lib/summary-row";

const STEPS = ["Packed", "Out for delivery", "Delivered"] as const;
const CANCEL_REASONS = ["Ordered by mistake", "Price changed", "Found better price", "Other"];

// Ported from mvbb-app.jsx OrderDetail (prototype lines ~795-865). The
// driver-tracking block from the prototype is left out here — there's no
// driver ever assigned to an order without the Admin/Driver apps (#2, #3),
// so that whole section would only ever render its empty state.
export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const { orders, cancelOrder, submitReview } = useOrders();
  const { addToCart } = useCart();
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  const found = orders.find((o) => o.id === params.id);
  if (!found || found.customerPhone !== profile.phone) notFound();
  const order = found;

  const stepIndex = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  const cancelled = order.status === "Cancelled";
  const delivered = order.status === "Delivered";

  function reorder() {
    order.items.forEach((it) => addToCart(it.gradeId, it.qty));
    router.push("/cart");
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackLink href="/orders" />
        <p className="gd text-lg font-bold" style={{ color: C.ink, margin: "8px 0 0" }}>
          {order.id}
        </p>
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        {cancelled ? (
          <div style={{ borderRadius: 12, padding: 16, marginBottom: 16, background: "#F5E3DD" }}>
            <p className="gb text-sm font-semibold" style={{ color: C.rust, margin: 0 }}>
              Order cancelled
            </p>
            {order.cancelReason && (
              <p className="gb text-xs" style={{ color: C.rust, margin: "4px 0 0" }}>
                {order.cancelReason}
              </p>
            )}
          </div>
        ) : (
          <div style={{ borderRadius: 12, padding: 16, marginBottom: 16, background: C.garlic }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              {STEPS.map((s, i) => (
                <span key={s} className="gb text-xs" style={{ color: i <= stepIndex ? C.ivory : C.muted, textAlign: "center", flex: 1 }}>
                  {s}
                </span>
              ))}
            </div>
            <p className="gb text-xs text-center" style={{ color: C.muted, margin: 0 }}>
              Delivery slot: {order.deliverySlot}
            </p>
          </div>
        )}

        <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
          Items
        </p>
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 16 }}>
          {order.items.map((it, i) => (
            <div
              key={it.gradeId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: C.card,
                borderTop: i ? `1px solid ${C.line}` : "none",
              }}
            >
              <span className="gb text-sm" style={{ color: C.ink }}>
                {it.name} × {it.qty}
                {it.negotiated && (
                  <span className="gb text-xs" style={{ color: C.goldDark, marginLeft: 4 }}>
                    (negotiated)
                  </span>
                )}
              </span>
              <span className="gm text-sm" style={{ color: C.muted }}>
                {inr(it.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, background: C.card, marginBottom: 16 }}>
          <SummaryRow label="Subtotal" value={inr(order.subtotal)} />
          {order.discount > 0 && <SummaryRow label="Discount" value={`−${inr(order.discount)}`} />}
          <SummaryRow label="Delivery" value={inr(order.delivery)} />
          <div style={{ borderTop: `1px solid ${C.line}`, margin: "8px 0" }} />
          <SummaryRow label="Total" value={inr(order.total)} bold />
        </div>

        <Link
          href={`/invoice/${order.id}`}
          className="gb text-sm font-semibold"
          style={{
            display: "block",
            textAlign: "center",
            padding: "12px 0",
            borderRadius: 999,
            border: `1px solid ${C.line}`,
            color: C.ink,
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          View invoice
        </Link>

        <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, background: C.card, marginBottom: 16 }}>
          <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: "0 0 4px" }}>
            {order.address.label}
          </p>
          <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
            {order.address.line}, {order.address.city} – {order.address.pincode}
          </p>
          <p className="gb text-xs" style={{ color: C.muted, margin: "8px 0 0" }}>
            Paid via {order.payment}
          </p>
        </div>

        {order.status === "Packed" && !cancelling && (
          <button
            type="button"
            onClick={() => setCancelling(true)}
            className="gb text-sm font-semibold"
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 999,
              border: `1px solid ${C.rust}`,
              background: "none",
              color: C.rust,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            Cancel order
          </button>
        )}

        {cancelling && (
          <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, background: C.card, marginBottom: 16 }}>
            <p className="gb text-sm font-semibold" style={{ color: C.ink, marginBottom: 8 }}>
              Why?
            </p>
            {CANCEL_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className="gb text-sm"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: 8,
                  marginBottom: 4,
                  border: "none",
                  background: reason === r ? C.garlic : C.paper,
                  color: reason === r ? C.gold : C.garlic,
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setCancelling(false)}
                className="gb text-sm font-semibold"
                style={{ flex: 1, padding: "10px 0", borderRadius: 999, border: `1px solid ${C.line}`, background: "none", color: C.ink, cursor: "pointer" }}
              >
                Keep order
              </button>
              <button
                type="button"
                disabled={!reason}
                onClick={() => {
                  cancelOrder(order.id, reason);
                  setCancelling(false);
                }}
                className="gb text-sm font-semibold"
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 999,
                  border: "none",
                  background: reason ? C.rust : C.line,
                  color: reason ? C.white : C.muted,
                  cursor: reason ? "pointer" : "not-allowed",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {delivered && (
          <button
            type="button"
            onClick={reorder}
            className="gb text-sm font-semibold"
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 999,
              border: `1px solid ${C.line}`,
              background: "none",
              color: C.ink,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            Reorder these items
          </button>
        )}

        {delivered && (
          <div style={{ borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, background: C.card }}>
            {order.review ? (
              <>
                <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 4 }}>
                  Your review
                </p>
                <p className="gb text-sm" style={{ color: C.ink, margin: 0 }}>
                  {"★".repeat(order.review.rating)}
                  {"☆".repeat(5 - order.review.rating)}
                </p>
                {order.review.text && (
                  <p className="gb text-sm" style={{ color: C.muted, marginTop: 4 }}>
                    {order.review.text}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="gb text-sm font-semibold" style={{ color: C.ink, marginBottom: 8 }}>
                  Rate the garlic
                </p>
                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      style={{ border: "none", background: "none", cursor: "pointer", padding: 0, fontSize: 22, color: C.gold }}
                    >
                      {n <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Quality, freshness…"
                  className="gb text-sm"
                  style={{ width: "100%", minHeight: 60, borderRadius: 8, padding: 12, border: `1px solid ${C.line}`, background: C.paper, color: C.ink, marginBottom: 12 }}
                />
                <button
                  type="button"
                  disabled={!rating}
                  onClick={() => submitReview(order.id, rating, reviewText)}
                  className="gb text-sm font-semibold"
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 999,
                    border: "none",
                    background: rating ? C.garlic : C.line,
                    color: rating ? C.ivory : C.muted,
                    cursor: rating ? "pointer" : "not-allowed",
                  }}
                >
                  Submit review
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
