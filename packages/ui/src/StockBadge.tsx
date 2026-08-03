import type { StockLevel } from "@mvbb/inventory";

/** Ported from mvbb-app.jsx SBadge (prototype line ~227). */
const STOCK_STYLES: Record<StockLevel, { label: string; bg: string; fg: string }> = {
  in: { label: "In stock", bg: "#E7EEE2", fg: "var(--c-green)" },
  low: { label: "Low stock", bg: "#FBF0DC", fg: "var(--c-goldDark)" },
  out: { label: "Sold out", bg: "#F5E3DD", fg: "var(--c-rust)" },
};

export function StockBadge({ stock }: { stock: StockLevel }) {
  const s = STOCK_STYLES[stock] ?? STOCK_STYLES.in;
  return (
    <span
      className="gb text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
