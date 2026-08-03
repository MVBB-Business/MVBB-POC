import { describe, expect, it } from "vitest";
import { canAcceptNewOrder, onAssign, onFreed } from "./index";

describe("onAssign", () => {
  it("moves a driver to on_delivery", () => {
    expect(onAssign()).toBe("on_delivery");
  });
});

describe("onFreed", () => {
  it("moves a driver back to available", () => {
    expect(onFreed()).toBe("available");
  });
});

describe("canAcceptNewOrder", () => {
  it("only allows available drivers to accept", () => {
    expect(canAcceptNewOrder("available")).toBe(true);
    expect(canAcceptNewOrder("on_delivery")).toBe(false);
    expect(canAcceptNewOrder("offline")).toBe(false);
    expect(canAcceptNewOrder("deactivated")).toBe(false);
  });
});
