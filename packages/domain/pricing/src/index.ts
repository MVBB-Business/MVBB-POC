/**
 * Ported from mvbb-app.jsx (prototype lines ~55-94).
 * Bulk pricing is tiered by quantity; B2B accounts get an effective +9 bag
 * quantity boost so registered businesses land in a better tier without a
 * separate B2B price list to maintain.
 */

export type AccountType = "B2B" | "B2C";

export interface PriceTier {
  min: number;
  price: number;
}

export interface Grade {
  id: string;
  tiers: PriceTier[];
}

const B2B_TIER_BOOST_BAGS = 9;

/** Returns the per-bag price for quantity `q` against grade `g`'s tier table. */
export function tierPrice(g: Pick<Grade, "tiers">, q: number): number {
  let price = g.tiers[0].price;
  for (const t of g.tiers) {
    if (q >= t.min) price = t.price;
  }
  return price;
}

/**
 * The price a customer actually pays: B2B accounts are priced as if they
 * ordered `q + 9` bags, rewarding registered businesses without a separate
 * price list.
 */
export function effectivePrice(
  g: Pick<Grade, "tiers">,
  q: number,
  accountType: AccountType | undefined
): number {
  return accountType === "B2B"
    ? tierPrice(g, q + B2B_TIER_BOOST_BAGS)
    : tierPrice(g, q);
}

/** Formats a number as Indian-locale rupees, e.g. inr(1500) -> "₹1,500". */
export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
