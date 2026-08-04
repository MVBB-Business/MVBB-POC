"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { C } from "@mvbb/ui";
import { BackButton, Field, SubmitButton } from "../../../lib/form-field";
import { useProfile } from "../../../lib/profile-context";

// Ported from mvbb-app.jsx AddAddress (prototype lines ~574-587).
export default function AddAddressPage() {
  const router = useRouter();
  const { profile, loaded, addAddress } = useProfile();
  const [label, setLabel] = useState("");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (loaded && !profile) router.replace("/login");
  }, [loaded, profile, router]);

  if (!profile) return null;

  const canSave = Boolean(label.trim()) && Boolean(line.trim()) && Boolean(city.trim()) && pincode.length === 6;

  function save() {
    if (!canSave) return;
    addAddress({ label: label.trim(), line: line.trim(), city: city.trim(), pincode, ...(phone.trim() ? { phone: phone.trim() } : {}) });
    router.back();
  }

  return (
    <main style={{ background: C.paper, minHeight: "100vh" }}>
      <div style={{ padding: 16 }}>
        <BackButton onBack={() => router.back()} />
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <p className="gd text-xl font-bold" style={{ color: C.ink, marginBottom: 16 }}>
          Add address
        </p>

        <Field label="Label" value={label} onChange={setLabel} placeholder="Shop, Warehouse…" />
        <Field label="Address" value={line} onChange={setLine} placeholder="Street / locality" />
        <Field label="City" value={city} onChange={setCity} placeholder="Guntur" />
        <Field label="Pincode" value={pincode} onChange={(v) => setPincode(v.replace(/\D/g, "").slice(0, 6))} placeholder="522001" />
        <Field label="Contact (optional)" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />

        <SubmitButton disabled={!canSave} onClick={save}>
          Save address
        </SubmitButton>
      </div>
    </main>
  );
}
