import { describe, it, expect } from "vitest";
import { Money } from "./money";
import { Quantity } from "./quantity";

describe("Money value object", () => {
  it("stores amount as bigint minor units", () => {
    const m = new Money(50000n, "USD");
    expect(m.amountMinor).toBe(50000n);
    expect(m.currency).toBe("USD");
  });

  it("adds and subtracts correctly", () => {
    const a = new Money(1000n, "EUR");
    const b = new Money(550n, "EUR");
    const sum = a.add(b);
    expect(sum.amountMinor).toBe(1550n);

    const diff = a.sub(b);
    expect(diff.amountMinor).toBe(450n);
  });

  it("throws on currency mismatch", () => {
    const a = new Money(1000n, "EUR");
    const b = new Money(1000n, "USD");
    expect(() => a.add(b)).toThrow("Currency mismatch");
  });

  it("formats currency properly", () => {
    const m = new Money(123456n, "USD");
    expect(m.formatAmountOnly()).toBe("1,234.56");
  });
});

describe("Quantity value object", () => {
  it("stores and formats quantities with units", () => {
    const q1 = new Quantity(9600, "kg");
    const q2 = new Quantity(400, "kg");
    const total = q1.add(q2);
    expect(total.value).toBe(10000);
    expect(total.uom).toBe("kg");
    expect(total.format()).toBe("10,000 kg");
  });
});
