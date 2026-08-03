import { describe, expect, it } from "vitest";
import { applyOutboundMovement, deriveStock, LOW_STOCK_THRESHOLD } from "./index";

describe("deriveStock", () => {
  it("is out at zero or below", () => {
    expect(deriveStock(0)).toBe("out");
    expect(deriveStock(-5)).toBe("out");
  });

  it("is low below the threshold", () => {
    expect(deriveStock(LOW_STOCK_THRESHOLD - 1)).toBe("low");
  });

  it("is in stock at or above the threshold", () => {
    expect(deriveStock(LOW_STOCK_THRESHOLD)).toBe("in");
  });

  it("respects a custom threshold", () => {
    expect(deriveStock(50, 100)).toBe("low");
  });
});

describe("applyOutboundMovement", () => {
  it("subtracts quantity from current bags", () => {
    expect(applyOutboundMovement(30, 10)).toBe(20);
  });

  it("floors at zero instead of going negative", () => {
    expect(applyOutboundMovement(5, 10)).toBe(0);
  });
});
