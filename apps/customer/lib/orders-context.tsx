"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { OrderStatus } from "@mvbb/orders";

export type { OrderStatus };

export interface OrderItem {
  gradeId: string;
  name: string;
  qty: number;
  unit: number;
  lineTotal: number;
  negotiated?: boolean;
}

export interface OrderAddress {
  label: string;
  line: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  /** Which profile placed this order -- orders aren't scoped server-side
   * (no auth yet), so screens filter by this against the signed-in
   * profile's phone to keep one browser's demo data from mixing accounts. */
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  address: OrderAddress;
  deliverySlot: string;
  /** Display label only, e.g. "Pay at shop" or "UPI kavya@okbank" -- not a
   * reference to a real payment_methods row (there isn't one server-side). */
  payment: string;
  status: OrderStatus;
  placedAt: number;
  cancelReason?: string;
  review?: { rating: number; text: string };
}

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (order: Omit<Order, "status" | "placedAt">) => Order;
  cancelOrder: (id: string, reason: string) => void;
  submitReview: (id: string, rating: number, text: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const STORAGE_KEY = "mvbb_customer_orders";

// Backs Orders/OrderDetail/Billing/Invoice (mvbb-app.jsx prototype lines
// ~626-867). Same browser-local model as cart-context/profile-context --
// there's still no auth (#5, #14) or orders RLS policy to write real orders
// against (see checkout/page.tsx's file-level comment for why).
//
// Orders only ever reach "Packed" or "Cancelled" here -- "Out for delivery"
// and "Delivered" require a driver to actually be assigned and move the
// order, which needs the Admin/Driver apps (#2, #3) that don't exist yet.
// The OrderDetail/review/reorder UI for those later statuses is still built
// (see app/orders/[id]/page.tsx) so it's ready once real fulfillment lands,
// but nothing in this app can reach it by faking progress client-side.
export function OrdersProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [orders, loaded]);

  const placeOrder = useCallback((order: Omit<Order, "status" | "placedAt">) => {
    const placed: Order = { ...order, status: "Packed", placedAt: Date.now() };
    setOrders((prev) => [placed, ...prev]);
    return placed;
  }, []);

  const cancelOrder = useCallback((id: string, reason: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id && o.status === "Packed" ? { ...o, status: "Cancelled", cancelReason: reason } : o)));
  }, []);

  const submitReview = useCallback((id: string, rating: number, text: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id && o.status === "Delivered" ? { ...o, review: { rating, text } } : o)));
  }, []);

  const value = useMemo(
    () => ({ orders, placeOrder, cancelOrder, submitReview }),
    [orders, placeOrder, cancelOrder, submitReview]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}

/** All orders belonging to the given phone number, newest first. */
export function ordersForPhone(orders: Order[], phone: string | undefined): Order[] {
  if (!phone) return [];
  return orders.filter((o) => o.customerPhone === phone).sort((a, b) => b.placedAt - a.placedAt);
}
