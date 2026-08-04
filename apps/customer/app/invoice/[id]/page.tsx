"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { BackLink } from "../../../lib/list-controls";
import { useOrders } from "../../../lib/orders-context";
import { useProfile } from "../../../lib/profile-context";
import { SummaryRow } from "../../../lib/summary-row";

// Ported from mvbb-app.jsx InvoiceScreen (prototype lines ~641-660). The
// prototype offers a "Download PDF invoice" button (downloadPdf helper,
// defined elsewhere in the prototype but not ported) -- window.print() gets
// the same job done (save-as-PDF from the browser's print dialog) without
// pulling in a PDF-generation library for one button.
export default function InvoicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const { orders } = useOrders();

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  const order = orders.find((o) => o.id === params.id);
  if (!order || order.customerPhone !== profile.phone) notFound();

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }} className="no-print">
        <BackLink href={`/orders/${order.id}`} />
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ borderRadius: 16, padding: 20, background: C.card, border: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p className="gd text-lg font-bold" style={{ color: C.ink, margin: 0 }}>
                MVBB
              </p>
              <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                MG Wholesale Complex
                <br />
                Guntur, AP · GSTIN: N/A (0%)
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="gb text-xs font-semibold" style={{ color: C.ink, margin: 0 }}>
                INVOICE
              </p>
              <p className="gm text-xs" style={{ color: C.muted, margin: 0 }}>
                {order.id}
              </p>
              <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <p className="gb text-xs font-semibold uppercase" style={{ color: C.muted, marginBottom: 4 }}>
            Billed to
          </p>
          <p className="gb text-sm" style={{ color: C.ink, marginBottom: 16 }}>
            {profile.name}, {order.address.line}, {order.address.city} – {order.address.pincode}
          </p>

          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 12 }}>
            {order.items.map((it, i) => (
              <div
                key={it.gradeId}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: i ? `1px solid ${C.line}` : "none" }}
              >
                <span className="gb text-xs" style={{ color: C.ink }}>
                  {it.name} × {it.qty}
                </span>
                <span className="gm text-xs" style={{ color: C.muted }}>
                  {inr(it.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <SummaryRow label="Subtotal" value={inr(order.subtotal)} />
          {order.discount > 0 && <SummaryRow label="Discount" value={`−${inr(order.discount)}`} />}
          <SummaryRow label="Delivery" value={inr(order.delivery)} />
          <div style={{ borderTop: `1px solid ${C.line}`, margin: "8px 0" }} />
          <SummaryRow label="Total" value={inr(order.total)} bold />

          <p className="gb text-xs" style={{ color: C.muted, marginTop: 12 }}>
            Paid via {order.payment}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="gb text-sm font-semibold no-print"
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px 0",
            borderRadius: 999,
            border: "none",
            background: C.garlic,
            color: C.ivory,
            cursor: "pointer",
          }}
        >
          Print / save as PDF
        </button>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
