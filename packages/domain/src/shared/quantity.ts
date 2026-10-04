export type UnitOfMeasure = "kg" | "t" | "pcs" | "l" | "h" | "bar" | "kg/h";

/**
 * Quantity value object with explicit unit of measure.
 * Stored as numeric(14,3) in the database.
 */
export class Quantity {
  readonly value: number;
  readonly uom: UnitOfMeasure;

  constructor(value: number | string, uom: UnitOfMeasure) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (!Number.isFinite(num)) {
      throw new Error(`Invalid quantity value: ${value}`);
    }
    this.value = Math.round(num * 1000) / 1000;
    this.uom = uom;
  }

  add(other: Quantity): Quantity {
    this.assertSameUom(other);
    return new Quantity(this.value + other.value, this.uom);
  }

  sub(other: Quantity): Quantity {
    this.assertSameUom(other);
    return new Quantity(this.value - other.value, this.uom);
  }

  mul(factor: number): Quantity {
    return new Quantity(this.value * factor, this.uom);
  }

  equals(other: Quantity): boolean {
    return this.uom === other.uom && Math.abs(this.value - other.value) < 0.0001;
  }

  format(locale: string = "en-US"): string {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(this.value);
    return `${formatted} ${this.uom}`;
  }

  toJSON() {
    return {
      value: this.value,
      uom: this.uom,
    };
  }

  private assertSameUom(other: Quantity): void {
    if (this.uom !== other.uom) {
      throw new Error(`UOM mismatch: cannot operate on ${this.uom} and ${other.uom}`);
    }
  }
}
