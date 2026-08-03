/**
 * Ported from mvbb-app.jsx (assignDriver/unassignDriver/reassignDriver in
 * the root App() component, ~lines 3071-3079).
 *
 * Driver status is a small state machine: offline -> available ->
 * on_delivery -> available (loop), or -> deactivated at any point via admin
 * action. This package models the transitions only; persistence is the
 * caller's job.
 */

export type DriverStatus = "offline" | "available" | "on_delivery" | "deactivated";

/** Driver status after being assigned to an order. */
export function onAssign(): DriverStatus {
  return "on_delivery";
}

/** Driver status after an order is unassigned, reassigned away, or delivered. */
export function onFreed(): DriverStatus {
  return "available";
}

/**
 * Multi-stop route batching is a Phase 2 item (see MVBB-Roadmap) — today a
 * driver takes exactly one active order at a time. This guard enforces that
 * until batching lands.
 */
export function canAcceptNewOrder(status: DriverStatus): boolean {
  return status === "available";
}
