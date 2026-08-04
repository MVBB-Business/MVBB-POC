"use client";

import { C } from "@mvbb/ui";

/** Shared back button (navigates via router.back(), unlike list-controls'
 * BackLink which goes to a fixed href) for the "add a thing" form pages. */
export function BackButton({ onBack }: Readonly<{ onBack: () => void }>) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="gb text-sm"
      style={{ color: C.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      ← Back
    </button>
  );
}

/** Shared full-width pill submit button, disabled-aware. */
export function SubmitButton({
  children,
  disabled,
  onClick,
}: Readonly<{ children: string; disabled?: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="gb text-sm font-semibold"
      style={{
        width: "100%",
        padding: "14px 0",
        borderRadius: 999,
        border: "none",
        marginTop: 8,
        background: disabled ? C.line : C.garlic,
        color: disabled ? C.muted : C.ivory,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

/** Shared labeled text input used across the various "add a thing" forms
 * (address, payment method, login) so the same markup isn't copy-pasted
 * into each one. */
export function Field({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }>) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span className="gb text-xs" style={{ color: C.muted, display: "block", marginBottom: 4 }}>
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="gm text-sm"
        style={{ width: "100%", borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.line}`, background: C.card, color: C.ink }}
      />
    </label>
  );
}
