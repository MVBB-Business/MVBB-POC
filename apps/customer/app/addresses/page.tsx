"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { C } from "@mvbb/ui";
import { AddLink, BackLink, ListRow, RemoveButton } from "../../lib/list-controls";
import { useProfile } from "../../lib/profile-context";

// Ported from mvbb-app.jsx ManageAddr (prototype lines ~917-924).
export default function AddressesPage() {
  const router = useRouter();
  const { profile, loaded, removeAddress } = useProfile();

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackLink href="/profile" />
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          Addresses
        </p>

        {profile.addresses.length === 0 ? (
          <p className="gb text-sm" style={{ color: C.muted, marginBottom: 16 }}>
            No addresses saved yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {profile.addresses.map((a) => (
              <ListRow key={a.id}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="gb text-sm font-semibold" style={{ color: C.ink, margin: 0 }}>
                    {a.label}
                  </p>
                  <p className="gb text-xs" style={{ color: C.muted, margin: 0 }}>
                    {a.line}, {a.city} – {a.pincode}
                  </p>
                </div>
                <RemoveButton onClick={() => removeAddress(a.id)} />
              </ListRow>
            ))}
          </div>
        )}

        <AddLink href="/addresses/new">+ Add address</AddLink>
      </div>
    </main>
  );
}
