"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { BackLink } from "../../lib/list-controls";
import { ordersForPhone, useOrders } from "../../lib/orders-context";
import { useProfile } from "../../lib/profile-context";

// Ported from mvbb-app.jsx BillingScreen (prototype lines ~626-639).
export default function BillingPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const { orders } = useOrders();

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  const mine = ordersForPhone(orders, profile.phone);

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackLink href="/profile" />
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          Billing history
        </p>

        {mine.length === 0 ? (
          <p className="gb text-sm" style={{ color: C.muted }}>
            No invoices yet — place an order to see billing history here.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mine.map((o) => (
              <Link
                key={o.id}
                href={`/invoice/${o.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 12,
                  padding: 12,
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  textDecoration: "none",
                }}
              >
                <div>
                  <p className="gm text-xs font-semibold" style={{ color: C.ink, margin: 0 }}>
                    {o.id}
                  </p>
                  <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                    {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className="gm text-sm font-semibold" style={{ color: C.ink }}>
                  {inr(o.total)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
