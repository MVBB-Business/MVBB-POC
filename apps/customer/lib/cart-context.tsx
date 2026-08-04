"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartLine {
  gradeId: string;
  qty: number;
}

export interface Coupon {
  code: string;
  applied: boolean;
  invalid?: boolean;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  coupon: Coupon | null;
  addToCart: (gradeId: string, qty: number) => void;
  updateQty: (gradeId: string, qty: number) => void;
  removeLine: (gradeId: string) => void;
  setCoupon: (coupon: Coupon | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mvbb_customer_cart";
const COUPON_STORAGE_KEY = "mvbb_customer_coupon";

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
      const rawCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (rawCoupon) setCoupon(JSON.parse(rawCoupon));
    } catch {
      // ignore malformed/blocked storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [lines, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (coupon) window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      else window.localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [coupon, loaded]);

  const addToCart = useCallback((gradeId: string, qty: number) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.gradeId === gradeId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { gradeId, qty }];
    });
  }, []);

  const updateQty = useCallback((gradeId: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.gradeId !== gradeId);
      return prev.map((l) => (l.gradeId === gradeId ? { ...l, qty } : l));
    });
  }, []);

  const removeLine = useCallback((gradeId: string) => {
    setLines((prev) => prev.filter((l) => l.gradeId !== gradeId));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setCoupon(null);
  }, []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const value = useMemo(
    () => ({ lines, count, coupon, addToCart, updateQty, removeLine, setCoupon, clear }),
    [lines, count, coupon, addToCart, updateQty, removeLine, setCoupon, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
