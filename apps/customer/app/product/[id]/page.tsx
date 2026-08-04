"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { deriveStock } from "@mvbb/inventory";
import { inr, tierPrice } from "@mvbb/pricing";
import { C, StockBadge } from "@mvbb/ui";
import { useCart } from "../../../lib/cart-context";
import { useGrade, type LiveGrade } from "../../../lib/use-grades";

const SPEC_ROWS = (g: LiveGrade) =>
  [
    ["Quality", g.quality],
    ["Bulb size", g.bulbSize],
    ["Cloves", g.cloves],
    ["Moisture", g.moisture],
    ["Shelf life", g.shelfLife],
    ["Origin", g.origin],
  ] as const;

// Ported from mvbb-app.jsx ProductDetail (prototype lines ~431-486).
// Wishlist, negotiate, and notify-me-when-in-stock are left out — they need
// the login/profile system, which isn't built yet.
export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { grade, loading, error, notFound: gradeNotFound } = useGrade(params.id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (gradeNotFound) notFound();

  if (loading) {
    return (
      <main style={{ background: C.paper, minHeight: "100vh", padding: 16 }}>
        <p className="gb text-sm" style={{ color: C.muted }}>
          Loading…
        </p>
      </main>
    );
  }

  if (error || !grade) {
    return (
      <main style={{ background: C.paper, minHeight: "100vh", padding: 16 }}>
        <p className="gb text-sm" style={{ color: C.rust }}>
          Couldn&apos;t load this product: {error}
        </p>
      </main>
    );
  }

  const stock = deriveStock(grade.stockBags);
  const unit = tierPrice(grade, qty);

  const gradeId = grade.id;
  function handleAddToCart() {
    addToCart(gradeId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  let addToCartLabel = "Add to cart";
  if (stock === "out") {
    addToCartLabel = "Sold out";
  } else if (added) {
    addToCartLabel = "Added ✓";
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <Link href="/" className="gb text-sm" style={{ color: C.muted }}>
          ← Back
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px 0",
          background: grade.color,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: C.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="gd text-3xl font-bold" style={{ color: C.ink }}>
            {grade.label[0]}
          </span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <p className="gd text-2xl font-bold" style={{ color: C.ink, margin: 0 }}>
            {grade.label}
          </p>
          <StockBadge stock={stock} />
        </div>
        <p className="gb text-sm" style={{ color: C.muted, marginBottom: 16 }}>
          {grade.tagline}
        </p>
        <p className="gb text-sm" style={{ color: C.earth, marginBottom: 20, lineHeight: 1.6 }}>
          {grade.description}
        </p>

        <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
          Specifications
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {SPEC_ROWS(grade).map(([k, v]) => (
            <div key={k} style={{ borderRadius: 8, padding: "8px 12px", background: C.card, border: `1px solid ${C.line}` }}>
              <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                {k}
              </p>
              <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                {v}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {grade.exportGrade && (
            <span className="gb text-xs font-medium" style={{ padding: "6px 12px", borderRadius: 999, background: "#E7EEE2", color: C.green }}>
              Export grade
            </span>
          )}
          {grade.bestSeller && (
            <span className="gb text-xs font-medium" style={{ padding: "6px 12px", borderRadius: 999, background: C.garlic, color: C.gold }}>
              Best seller
            </span>
          )}
        </div>

        <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 8 }}>
          Bulk pricing (per bag)
        </p>
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 20 }}>
          {grade.tiers.map((t, i) => {
            const active = unit === t.price;
            const savePct = i > 0 ? Math.round((1 - t.price / grade.tiers[0].price) * 100) : null;
            return (
              <div
                key={t.min}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  background: active ? C.garlic : C.card,
                  borderTop: i ? `1px solid ${C.line}` : "none",
                }}
              >
                <span className="gb text-sm" style={{ color: active ? C.ivory : C.muted }}>
                  {t.min}+ bag{t.min > 1 ? "s" : ""}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {savePct !== null && (
                    <span className="gb text-xs" style={{ color: active ? C.gold : C.green }}>
                      Save {savePct}%
                    </span>
                  )}
                  <span className="gm text-sm font-semibold" style={{ color: active ? C.gold : C.garlic }}>
                    {inr(t.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <p className="gb text-xs" style={{ color: C.muted, marginBottom: 6 }}>
              Bags (min. 1 bag)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="gb text-sm font-semibold"
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.line}`, background: C.card }}
              >
                −
              </button>
              <span className="gm text-base font-semibold" style={{ color: C.ink, minWidth: 24, textAlign: "center" }}>
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="gb text-sm font-semibold"
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.line}`, background: C.card }}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="gb text-xs" style={{ color: C.muted, marginBottom: 4 }}>
              Total
            </p>
            <p className="gm text-xl font-semibold" style={{ color: C.ink, margin: 0 }}>
              {inr(unit * qty)}
            </p>
          </div>
        </div>

        <p className="gb text-xs" style={{ color: C.muted, marginBottom: 20 }}>
          MVBB has no minimum order quantity requirement beyond 1 bag — order as little or as much as you need.
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock === "out"}
          className="gb text-sm font-semibold"
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 999,
            border: "none",
            background: stock === "out" ? C.line : C.garlic,
            color: stock === "out" ? C.muted : C.ivory,
            cursor: stock === "out" ? "not-allowed" : "pointer",
          }}
        >
          {addToCartLabel}
        </button>
      </div>
    </main>
  );
}
