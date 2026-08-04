"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AccountType = "B2B" | "B2C";

export interface Profile {
  phone: string;
  name: string;
  accountType: AccountType;
  businessName?: string;
  isHawker?: boolean;
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
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "mvbb_customer_profile";

// Backs the mock login flow in app/login/page.tsx. There's no real auth yet
// (#5 real SMS/OTP, #14 real session/role enforcement) — this is a
// browser-local stand-in, same model as cart-context, so the rest of the
// customer app (Checkout, Orders, Wishlist…) has somewhere to read "am I
// logged in, and as who" from until real auth lands.
export function ProfileProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
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

  const value = useMemo(
    () => ({ profile, loaded, setProfile, logout }),
    [profile, loaded, setProfile, logout]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
