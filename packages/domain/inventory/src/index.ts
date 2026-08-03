/**
 * Ported from mvbb-app.jsx (prototype lines ~96-97, stock movement logic
 * inlined in placeOrder/createManualOrder).
 */

export type StockLevel = "in" | "low" | "out";

export interface StockMovement {
  id: string;
  type: "in" | "out";
  bags: number;
  source: string;
  customer?: string;
  date: number;
}

export const LOW_STOCK_THRESHOLD = 20;

/** Derives a traffic-light stock label from a raw bag count. */
export function deriveStock(
  bags: number,
  threshold: number = LOW_STOCK_THRESHOLD
): StockLevel {
  if (bags <= 0) return "out";
  if (bags < threshold) return "low";
  return "in";
}

/**
 * Applies an outbound movement (e.g. an order line) to a bag count, floored
 * at zero — mirrors the Math.max(0, ...) guard in the prototype's order
 * placement logic so stock never goes negative from a race or over-sell.
 */
export function applyOutboundMovement(currentBags: number, qty: number): number {
  return Math.max(0, currentBags - qty);
}

/**
 * Applies an inbound movement (e.g. a shipment receipt or a return) to a bag
 * count.
 */
export function applyInboundMovement(currentBags: number, qty: number): number {
  return currentBags + qty;
}
