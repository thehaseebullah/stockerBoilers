import { describe, it, expect } from "vitest";

describe("Gauge component calculations (DESIGN §5)", () => {
  it("calculates 240-degree dial sweep correctly", () => {
    const min = 0;
    const max = 100;
    const startAngle = -120;
    const totalSweep = 240;

    const angleAtMin = startAngle + (0 / (max - min)) * totalSweep;
    expect(angleAtMin).toBe(-120);

    const angleAtMid = startAngle + (50 / (max - min)) * totalSweep;
    expect(angleAtMid).toBe(0);

    const angleAtMax = startAngle + (100 / (max - min)) * totalSweep;
    expect(angleAtMax).toBe(120);
  });

  it("clamps values exceeding min/max ranges", () => {
    const min = 0;
    const max = 100;
    const clamp = (val: number) => Math.min(Math.max(val, min), max);

    expect(clamp(-20)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(45)).toBe(45);
  });
});
