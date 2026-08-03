/**
 * Ported from mvbb-app.jsx (credit ledger logic inlined in placeOrder and
 * recordPayment in the root App() component, ~lines 3014, 3051-3062).
 *
 * In the prototype this mutated a `khataEntries` array on the in-memory user
 * object directly. Here it's pure: given a balance and an event, compute the
 * new balance and the ledger entry to persist. The caller (API layer) owns
 * writing both to the database, ideally in one transaction.
 */

export type KhataEntryType = "sale" | "payment";

export interface KhataEntry {
  id: string;
  date: number;
  type: KhataEntryType;
  amount: number;
  orderId: string;
  note: string;
}

export interface KhataResult {
  entry: KhataEntry;
  newBalance: number;
}

/** A credit sale (Pay-at-shop / Credit order) increases what the customer owes. */
export function recordSale(
  currentBalance: number,
  args: { id: string; amount: number; orderId: string; now?: number }
): KhataResult {
  const now = args.now ?? Date.now();
  return {
    entry: {
      id: args.id,
      date: now,
      type: "sale",
      amount: args.amount,
      orderId: args.orderId,
      note: `Order ${args.orderId}`,
    },
    newBalance: currentBalance + args.amount,
  };
}

/** A payment reduces what the customer owes, floored at zero. */
export function recordPayment(
  currentBalance: number,
  args: { id: string; amount: number; orderId: string; method?: string; now?: number }
): KhataResult {
  const now = args.now ?? Date.now();
  return {
    entry: {
      id: args.id,
      date: now,
      type: "payment",
      amount: args.amount,
      orderId: args.orderId,
      note: args.method ?? "Cash at shop",
    },
    newBalance: Math.max(0, currentBalance - args.amount),
  };
}

/** Whether a would-be sale would push the customer over their credit limit. */
export function exceedsCreditLimit(
  currentBalance: number,
  saleAmount: number,
  creditLimit: number
): boolean {
  return currentBalance + saleAmount > creditLimit;
}
