"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartLine {
  gradeId: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  addToCart: (gradeId: string, qty: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mvbb_customer_cart";

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
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

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const value = useMemo(() => ({ lines, count, addToCart }), [lines, count, addToCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
