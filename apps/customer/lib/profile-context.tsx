"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AccountType = "B2B" | "B2C";

export interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
  pincode: string;
  phone?: string;
}

export type PaymentMethodType = "upi" | "card" | "bank" | "paypal";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  /** UPI id, card last-4, bank account last-4, or PayPal email — never a
   * full card/account number. Ported from the prototype's AddPayment,
   * which discards everything but the last 4 digits on save (see
   * app/address-payment/page.tsx). */
  detail: string;
  isDefault: boolean;
}

export interface Profile {
  phone: string;
  name: string;
  accountType: AccountType;
  businessName?: string;
  isHawker?: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

interface ProfileContextValue {
  profile: Profile | null;
  /** False until the initial localStorage read has completed. Screens that
   * redirect based on "am I logged in" (e.g. /profile) must wait for this
   * before deciding — on a fresh page load, profile starts null for a tick
   * before the storage read resolves, and redirecting on that tick would
   * bounce a logged-in user back to /login every time. */
  loaded: boolean;
  setProfile: (profile: Profile | null) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, "id" | "isDefault">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "mvbb_customer_profile";

function uid() {
  return crypto.randomUUID();
}

// Backs the mock login flow in app/login/page.tsx. There's no real auth yet
// (#5 real SMS/OTP, #14 real session/role enforcement) — this is a
// browser-local stand-in, same model as cart-context, so the rest of the
// customer app (Checkout, Orders, Wishlist…) has somewhere to read "am I
// logged in, and as who" from until real auth lands. Addresses and payment
// methods live on the profile itself, same as the prototype -- there's no
// separate backend table for them yet either.
export function ProfileProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Normalizes profiles saved before addresses/paymentMethods existed
        // on this record, so a stale localStorage entry from an earlier
        // build doesn't crash the first .map() over either array.
        setProfile({ addresses: [], paymentMethods: [], ...parsed });
      }
    } catch {
      // ignore malformed/blocked storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (profile) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [profile, loaded]);

  const logout = useCallback(() => {
    setProfile(null);
  }, []);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setProfile((prev) => (prev ? { ...prev, addresses: [...prev.addresses, { id: uid(), ...address }] } : prev));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setProfile((prev) => (prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) } : prev));
  }, []);

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, "id" | "isDefault">) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const isDefault = prev.paymentMethods.length === 0;
      return { ...prev, paymentMethods: [...prev.paymentMethods, { id: uid(), isDefault, ...method }] };
    });
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setProfile((prev) => (prev ? { ...prev, paymentMethods: prev.paymentMethods.filter((m) => m.id !== id) } : prev));
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setProfile((prev) =>
      prev
        ? { ...prev, paymentMethods: prev.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })) }
        : prev
    );
  }, []);

  const value = useMemo(
    () => ({
      profile,
      loaded,
      setProfile,
      logout,
      addAddress,
      removeAddress,
      addPaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
    }),
    [profile, loaded, logout, addAddress, removeAddress, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
