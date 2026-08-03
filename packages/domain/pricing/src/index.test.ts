import { describe, expect, it } from "vitest";
import { effectivePrice, inr, tierPrice } from "./index";

const grade = {
  tiers: [
    { min: 1, price: 1450 },
    { min: 5, price: 1380 },
    { min: 10, price: 1320 },
    { min: 25, price: 1260 },
  ],
};

describe("tierPrice", () => {
  it("returns the base tier below the first breakpoint", () => {
    expect(tierPrice(grade, 1)).toBe(1450);
  });

  it("steps down at each breakpoint", () => {
    expect(tierPrice(grade, 5)).toBe(1380);
    expect(tierPrice(grade, 10)).toBe(1320);
    expect(tierPrice(grade, 25)).toBe(1260);
  });

  it("uses the highest tier reached for quantities beyond the last breakpoint", () => {
    expect(tierPrice(grade, 100)).toBe(1260);
  });
});

describe("effectivePrice", () => {
  it("prices B2C at face quantity", () => {
    expect(effectivePrice(grade, 1, "B2C")).toBe(1450);
  });

  it("boosts B2B accounts by 9 bags before pricing", () => {
    // 1 + 9 = 10 bags -> hits the 10-bag tier
    expect(effectivePrice(grade, 1, "B2B")).toBe(1320);
  });
});

describe("inr", () => {
  it("formats with the rupee symbol and Indian digit grouping", () => {
    expect(inr(150000)).toBe("₹1,50,000");
  });
});
