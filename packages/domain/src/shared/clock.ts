export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class MockClock implements Clock {
  private currentTime: Date;

  constructor(initialTime: Date = new Date()) {
    this.currentTime = new Date(initialTime);
  }

  now(): Date {
    return new Date(this.currentTime);
  }

  advance(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }

  setTime(time: Date): void {
    this.currentTime = new Date(time);
  }
}

export const defaultClock: Clock = new SystemClock();
