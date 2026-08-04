"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { C } from "@mvbb/ui";

/** Shared building blocks for the Addresses/Payment methods list screens
 * (and any future saved-item list), so the row/card/link markup isn't
 * copy-pasted into each one. */

export function BackLink({ href }: Readonly<{ href: string }>) {
  return (
    <Link href={href} className="gb text-sm" style={{ color: C.muted }}>
      ← Back
    </Link>
  );
}

export function ListRow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 12,
        padding: 12,
        background: C.card,
        border: `1px solid ${C.line}`,
      }}
    >
      {children}
    </div>
  );
}

export function RemoveButton({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gb text-xs font-semibold"
      style={{ border: "none", background: "none", color: C.rust, cursor: "pointer", flexShrink: 0 }}
    >
      Remove
    </button>
  );
}

export function AddLink({ href, children }: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <Link
      href={href}
      className="gb text-sm font-semibold"
      style={{
        display: "block",
        textAlign: "center",
        padding: "14px 0",
        borderRadius: 999,
        background: C.garlic,
        color: C.ivory,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}
