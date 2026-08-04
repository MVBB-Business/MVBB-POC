"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { C } from "@mvbb/ui";
import { useProfile } from "../../lib/profile-context";

const MENU_ITEMS = [
  { href: "/addresses", label: "Manage addresses", count: (p: { addresses: unknown[] }) => p.addresses.length },
  { href: "/payment-methods", label: "Payment methods", count: (p: { paymentMethods: unknown[] }) => p.paymentMethods.length },
] as const;

// Ported from mvbb-app.jsx ProfileScreen (prototype lines ~867-890). The
// full menu also lists Orders/Negotiations/Wishlist/Billing — those screens
// are follow-up PRs against this same issue and will be added to MENU_ITEMS
// as they land, rather than linking out to routes that don't exist yet.
export default function ProfilePage() {
  const router = useRouter();
  const { profile, loaded, logout } = useProfile();
  // Suppresses the redirect-guard below during the logout click: logging
  // out clears `profile` while this page is still mounted, which would
  // otherwise race the effect's router.replace("/login") against the
  // logout button's own router.push("/") and send the user to the wrong
  // place.
  const loggingOutRef = useRef(false);

  useEffect(() => {
    if (loaded && !profile && !loggingOutRef.current) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <Link href="/" className="gb text-sm" style={{ color: C.muted }}>
          ← Back
        </Link>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ borderRadius: 16, padding: 16, background: C.garlic }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: C.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="gd text-lg font-bold" style={{ color: C.ink }}>
                {profile.name[0]?.toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="gd text-base font-semibold" style={{ color: C.ivory, margin: 0 }}>
                {profile.name}
              </p>
              <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                +91 {profile.phone}
              </p>
            </div>
            <span
              className="gb text-xs font-semibold"
              style={{ padding: "6px 12px", borderRadius: 999, background: C.gold, color: C.ink, flexShrink: 0 }}
            >
              {profile.accountType}
            </span>
          </div>
          {profile.accountType === "B2B" && profile.businessName && (
            <p className="gb text-xs" style={{ color: C.muted, marginTop: 8, marginBottom: 0 }}>
              {profile.businessName}
              {profile.isHawker ? " · Hawker / street vendor" : ""}
            </p>
          )}
        </div>

        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="gb text-sm font-medium"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              background: C.card,
              border: `1px solid ${C.line}`,
              color: C.ink,
              textDecoration: "none",
            }}
          >
            <span>{item.label}</span>
            <span className="gb text-xs" style={{ color: C.muted }}>
              {item.count(profile)}
            </span>
          </Link>
        ))}

        <a
          href={`https://wa.me/919999999999?text=${encodeURIComponent("Hi MVBB (Lahasun Wala), I need help with my account.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="gb text-sm font-medium"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            background: C.card,
            border: `1px solid ${C.line}`,
            color: C.ink,
            textDecoration: "none",
          }}
        >
          <span>Contact MVBB</span>
          <span className="gb text-xs" style={{ color: C.green }}>
            WhatsApp
          </span>
        </a>

        <button
          type="button"
          onClick={() => {
            loggingOutRef.current = true;
            logout();
            router.push("/");
          }}
          className="gb text-sm font-semibold"
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px 0",
            borderRadius: 999,
            border: `1px solid ${C.rust}`,
            background: "none",
            color: C.rust,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </main>
  );
}
