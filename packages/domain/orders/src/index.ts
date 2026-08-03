/**
 * Ported from mvbb-app.jsx (prototype lines ~66-78, 80, and the
 * advanceStatus/driverMarkPickedUp/driverMarkDelivered functions in the root
 * App() component, ~lines 3048, 3080-3090).
 */

export type VehicleType = "bike" | "auto" | "mini_truck" | "truck";

export const VEHICLE_CAPACITY_BAGS: Record<VehicleType, { min: number; max: number | null }> = {
  bike: { min: 1, max: 2 },
  auto: { min: 3, max: 6 },
  mini_truck: { min: 7, max: 15 },
  truck: { min: 16, max: null },
};

/** Flat per-delivery driver payout, keyed by vehicle type. Distance-based
 * payout is a Phase 2 item — see MVBB-Roadmap. */
export const PAYOUT_RATES: Record<VehicleType, number> = {
  bike: 40,
  auto: 60,
  mini_truck: 100,
  truck: 150,
};

export const DELIVERY_FEE = 120;

/** Picks the vehicle tier needed for a given total bag count on an order. */
export function vehicleForOrder(totalBags: number): VehicleType {
  if (totalBags <= 2) return "bike";
  if (totalBags <= 6) return "auto";
  if (totalBags <= 15) return "mini_truck";
  return "truck";
}

export type OrderStatus = "Packed" | "Out for delivery" | "Delivered" | "Cancelled";

const STATUS_SEQUENCE: OrderStatus[] = ["Packed", "Out for delivery", "Delivered"];

/**
 * Returns the next status in the fulfillment sequence, or the current status
 * if already at (or past) the end (e.g. already Delivered or Cancelled).
 */
export function nextOrderStatus(current: OrderStatus): OrderStatus {
  const i = STATUS_SEQUENCE.indexOf(current);
  if (i === -1 || i >= STATUS_SEQUENCE.length - 1) return current;
  return STATUS_SEQUENCE[i + 1];
}

/** Resolves the payout owed for a delivered order, preferring an
 * admin-configured override rate over the PAYOUT_RATES default. */
export function resolvePayout(
  vehicleType: VehicleType,
  configuredRates: Partial<Record<VehicleType, number>>
): number {
  return configuredRates[vehicleType] ?? PAYOUT_RATES[vehicleType] ?? PAYOUT_RATES.bike;
}
