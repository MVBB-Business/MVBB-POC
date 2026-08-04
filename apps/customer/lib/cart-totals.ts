import { DELIVERY_FEE } from "@mvbb/orders";
import { tierPrice } from "@mvbb/pricing";
import type { Coupon } from "./cart-context";
import type { LiveGrade } from "./use-grades";

export interface CartLineDetail {
  gradeId: string;
  grade: LiveGrade;
  qty: number;
  unit: number;
  lineTotal: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

// Matches the WELCOME5 promo from mvbb-app.jsx CartScreen (prototype ~L491):
// a flat 5% off subtotal, client-side only — there's no coupons table yet.
const COUPON_DISCOUNT_RATE = 0.05;

/** Joins cart lines against live grade data, dropping lines whose grade
 * disappeared from the catalog (e.g. delisted) rather than crashing. */
export function resolveCartLines(
  lines: { gradeId: string; qty: number }[],
  grades: LiveGrade[]
): CartLineDetail[] {
  return lines.flatMap((l) => {
    const grade = grades.find((g) => g.id === l.gradeId);
    if (!grade) return [];
    const unit = tierPrice(grade, l.qty);
    return [{ gradeId: l.gradeId, grade, qty: l.qty, unit, lineTotal: unit * l.qty }];
  });
}

export function computeTotals(lineDetails: CartLineDetail[], coupon: Coupon | null): CartTotals {
  const subtotal = lineDetails.reduce((s, l) => s + l.lineTotal, 0);
  const discount = coupon?.applied ? Math.round(subtotal * COUPON_DISCOUNT_RATE) : 0;
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal - discount + delivery;
  return { subtotal, discount, delivery, total };
}
