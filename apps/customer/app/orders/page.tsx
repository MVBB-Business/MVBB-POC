"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";
import { BackLink } from "../../lib/list-controls";
import { ordersForPhone, useOrders, type Order } from "../../lib/orders-context";
import { useProfile } from "../../lib/profile-context";

type Tab = "active" | "completed" | "cancelled";

const TABS: [Tab, string][] = [
  ["active", "Active"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
];

function statusColor(status: Order["status"]): string {
  if (status === "Cancelled") return C.rust;
  if (status === "Delivered") return C.green;
  return C.goldDark;
}

function inTab(order: Order, tab: Tab): boolean {
  if (tab === "active") return order.status === "Packed" || order.status === "Out for delivery";
  if (tab === "completed") return order.status === "Delivered";
  return order.status === "Cancelled";
}

// Ported from mvbb-app.jsx OrdersScreen (prototype lines ~684-704).
export default function OrdersPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const { orders } = useOrders();
  const [tab, setTab] = useState<Tab>("active");

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  const mine = ordersForPhone(orders, profile.phone);
  const grouped: Record<Tab, Order[]> = {
    active: mine.filter((o) => inTab(o, "active")),
    completed: mine.filter((o) => inTab(o, "completed")),
    cancelled: mine.filter((o) => inTab(o, "cancelled")),
  };
  const shown = grouped[tab];

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackLink href="/profile" />
      </div>

      <div style={{ padding: "0 16px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          My orders
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="gb text-xs font-medium"
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: tab === key ? C.garlic : C.card,
                color: tab === key ? C.gold : C.muted,
                border: `1px solid ${tab === key ? C.garlic : C.line}`,
                cursor: "pointer",
              }}
            >
              {label} ({grouped[key].length})
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="gb text-sm" style={{ color: C.muted, paddingBottom: 24 }}>
            No {tab} orders.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 24 }}>
            {shown.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                style={{
                  display: "block",
                  borderRadius: 12,
                  padding: 12,
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p className="gm text-xs font-semibold" style={{ color: C.ink, margin: 0 }}>
                      {o.id}
                    </p>
                    <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                      {o.items.length} item{o.items.length > 1 ? "s" : ""} ·{" "}
                      {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="gm text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                      {inr(o.total)}
                    </p>
                    <span
                      className="gb text-xs font-medium"
                      style={{ padding: "2px 8px", borderRadius: 999, color: statusColor(o.status), background: C.paper }}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
