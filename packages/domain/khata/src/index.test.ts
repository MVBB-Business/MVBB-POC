import { describe, expect, it } from "vitest";
import { exceedsCreditLimit, recordPayment, recordSale } from "./index";

describe("recordSale", () => {
  it("increases the balance by the sale amount", () => {
    const { newBalance, entry } = recordSale(1000, { id: "e1", amount: 500, orderId: "MVBB1" });
    expect(newBalance).toBe(1500);
    expect(entry.type).toBe("sale");
  });
});

describe("recordPayment", () => {
  it("decreases the balance by the payment amount", () => {
    const { newBalance } = recordPayment(1500, { id: "e2", amount: 500, orderId: "MVBB1" });
    expect(newBalance).toBe(1000);
  });

  it("floors at zero on overpayment", () => {
    const { newBalance } = recordPayment(300, { id: "e3", amount: 500, orderId: "MVBB1" });
    expect(newBalance).toBe(0);
  });
});

describe("exceedsCreditLimit", () => {
  it("flags a sale that would push balance over the limit", () => {
    expect(exceedsCreditLimit(9000, 2000, 10000)).toBe(true);
  });

  it("allows a sale within the limit", () => {
    expect(exceedsCreditLimit(1000, 2000, 10000)).toBe(false);
  });
});
