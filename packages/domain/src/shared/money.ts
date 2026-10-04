/**
 * Non-negotiable 1: Money is bigint minor units plus a currency code.
 * Never number floats for stored or computed money.
 */
export class Money {
  readonly amountMinor: bigint;
  readonly currency: string;

  constructor(amountMinor: bigint | number | string, currency: string = "USD") {
    this.amountMinor = BigInt(amountMinor);
    this.currency = currency.toUpperCase();
    if (this.currency.length !== 3) {
      throw new Error(`Invalid currency code: ${currency}. Expected 3-letter ISO code.`);
    }
  }

  static fromMinor(amountMinor: bigint | number | string, currency: string = "USD"): Money {
    return new Money(amountMinor, currency);
  }

  static zero(currency: string = "USD"): Money {
    return new Money(0n, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  sub(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor - other.amountMinor, this.currency);
  }

  mul(factor: bigint | number): Money {
    if (typeof factor === "number") {
      if (!Number.isFinite(factor)) {
        throw new Error("Cannot multiply Money by non-finite number");
      }
      // Rounded to nearest minor unit
      const result = Math.round(Number(this.amountMinor) * factor);
      return new Money(BigInt(result), this.currency);
    }
    return new Money(this.amountMinor * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.amountMinor === other.amountMinor;
  }

  isZero(): boolean {
    return this.amountMinor === 0n;
  }

  isPositive(): boolean {
    return this.amountMinor > 0n;
  }

  isNegative(): boolean {
    return this.amountMinor < 0n;
  }

  format(locale: string = "en-US", options?: Intl.NumberFormatOptions): string {
    const major = Number(this.amountMinor) / 100;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.currency,
      ...options,
    }).format(major);
  }

  formatAmountOnly(locale: string = "en-US"): string {
    const major = Number(this.amountMinor) / 100;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(major);
  }

  toJSON() {
    return {
      amountMinor: this.amountMinor.toString(),
      currency: this.currency,
    };
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: cannot operate on ${this.currency} and ${other.currency}`);
    }
  }
}
