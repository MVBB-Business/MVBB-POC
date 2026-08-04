"use client";

import { C } from "@mvbb/ui";

/** Shared label/value row used in every order-totals summary (Cart,
 * Checkout, OrderDetail, Invoice) so the same markup isn't copy-pasted
 * into each one. */
export function SummaryRow({
  label,
  value,
  bold,
  light,
}: Readonly<{ label: string; value: string; bold?: boolean; light?: boolean }>) {
  let color: string = C.muted;
  if (light) color = C.ivory;
  else if (bold) color = C.ink;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
      <span className="gb text-sm" style={{ color: light ? C.ivory : C.muted }}>
        {label}
      </span>
      <span className={bold ? "gm text-base font-bold" : "gb text-sm"} style={{ color }}>
        {value}
      </span>
    </div>
  );
}
