"use client";

import { useMemo, useState } from "react";
import { deriveStock } from "@mvbb/inventory";
import { inr, tierPrice } from "@mvbb/pricing";
import { C, StockBadge } from "@mvbb/ui";
import { SEED_GRADES } from "../lib/seed-grades";

type SortKey = "bestSeller" | "priceLow" | "priceHigh";

const SORT_OPTIONS: [SortKey, string][] = [
  ["bestSeller", "Best sellers"],
  ["priceLow", "Price ↑"],
  ["priceHigh", "Price ↓"],
];

// Ported from mvbb-app.jsx HomeScreen (prototype lines ~368-431). Cart,
// wishlist, and navigation to a product detail screen are left for a
// follow-up PR — this slice covers browse/search/filter/sort against real
// catalog data through the shared pricing/inventory packages.
export default function HomePage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("bestSeller");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(SEED_GRADES.map((g) => g.category)))],
    []
  );

  const list = useMemo(() => {
    let result = SEED_GRADES.filter(
      (g) =>
        (category === "All" || g.category === category) &&
        (g.label.toLowerCase().includes(q.toLowerCase()) ||
          g.tagline.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "priceLow") {
      result = [...result].sort((a, b) => a.tiers[0].price - b.tiers[0].price);
    } else if (sort === "priceHigh") {
      result = [...result].sort((a, b) => b.tiers[0].price - a.tiers[0].price);
    } else {
      result = [...result].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
    }
    return result;
  }, [q, sort, category]);

  return (
    <main className="mvbb-root" style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: "16px 16px 12px" }}>
        <p className="gb text-sm" style={{ color: C.muted }}>
          Namaste 👋
        </p>
        <p className="gd text-xl font-bold" style={{ color: C.ink }}>
          Fresh produce, direct from Guntur
        </p>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: "10px 16px",
            background: C.card,
            border: `1px solid ${C.line}`,
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search grades…"
            className="gb text-sm"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.ink }}
          />
        </div>
      </div>

      {categories.length > 2 && (
        <div style={{ display: "flex", gap: 8, padding: "0 16px 8px", overflowX: "auto" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="gb text-xs font-semibold"
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: category === c ? C.garlic : C.paper,
                color: category === c ? C.gold : C.earth,
                border: `1px solid ${category === c ? C.garlic : C.line}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, padding: "0 16px 16px", overflowX: "auto" }}>
        {SORT_OPTIONS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className="gb text-xs font-medium"
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: sort === key ? C.garlic : C.card,
              color: sort === key ? C.gold : C.muted,
              border: `1px solid ${sort === key ? C.garlic : C.line}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        <p className="gb text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted, marginBottom: 12 }}>
          {category === "All" ? "All products" : category} ({list.length})
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((g) => {
            const stock = deriveStock(g.stockBags);
            const price = tierPrice(g, g.tiers[0].min);
            return (
              <div
                key={g.id}
                style={{ borderRadius: 16, padding: 12, background: C.card, border: `1px solid ${C.line}` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <p className="gd text-base font-semibold" style={{ color: C.ink, margin: 0 }}>
                    {g.label}
                  </p>
                  {g.bestSeller && (
                    <span
                      className="gb text-xs font-semibold"
                      style={{ padding: "2px 8px", borderRadius: 999, background: C.garlic, color: C.gold }}
                    >
                      Best seller
                    </span>
                  )}
                </div>
                <p className="gb text-xs" style={{ color: C.muted, marginBottom: 6 }}>
                  {g.tagline}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span
                    className="gb text-xs"
                    style={{ padding: "2px 8px", borderRadius: 999, background: C.paper, color: C.earth }}
                  >
                    {g.category}
                  </span>
                  <span
                    className="gb text-xs"
                    style={{ padding: "2px 8px", borderRadius: 999, background: C.paper, color: C.earth }}
                  >
                    {g.bulbSize}
                  </span>
                  {g.exportGrade && (
                    <span
                      className="gb text-xs"
                      style={{ padding: "2px 8px", borderRadius: 999, background: "#E7EEE2", color: C.green }}
                    >
                      Export
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="gm text-sm font-semibold" style={{ color: C.goldDark }}>
                    from {inr(price)}/bag
                  </span>
                  <StockBadge stock={stock} />
                </div>
              </div>
            );
          })}
        </div>
        {list.length === 0 && (
          <p className="gb text-sm text-center" style={{ color: C.muted, padding: "32px 0" }}>
            No products match &quot;{q}&quot;
          </p>
        )}
      </div>
    </main>
  );
}
