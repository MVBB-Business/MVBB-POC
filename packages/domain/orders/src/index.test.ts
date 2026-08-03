import { describe, expect, it } from "vitest";
import { nextOrderStatus, resolvePayout, vehicleForOrder } from "./index";

describe("vehicleForOrder", () => {
  it("maps bag counts to the right vehicle tier", () => {
    expect(vehicleForOrder(2)).toBe("bike");
    expect(vehicleForOrder(6)).toBe("auto");
    expect(vehicleForOrder(15)).toBe("mini_truck");
    expect(vehicleForOrder(16)).toBe("truck");
  });
});

describe("nextOrderStatus", () => {
  it("advances Packed -> Out for delivery -> Delivered", () => {
    expect(nextOrderStatus("Packed")).toBe("Out for delivery");
    expect(nextOrderStatus("Out for delivery")).toBe("Delivered");
  });

  it("does not advance past Delivered", () => {
    expect(nextOrderStatus("Delivered")).toBe("Delivered");
  });

  it("does not advance a cancelled order", () => {
    expect(nextOrderStatus("Cancelled")).toBe("Cancelled");
  });
});

describe("resolvePayout", () => {
  it("prefers a configured override rate", () => {
    expect(resolvePayout("bike", { bike: 55 })).toBe(55);
  });

  it("falls back to the default rate", () => {
    expect(resolvePayout("auto", {})).toBe(60);
  });
});
