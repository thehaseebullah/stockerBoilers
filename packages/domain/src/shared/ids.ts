import { uuidv7 } from "uuidv7";

/**
 * UUIDv7 time-ordered primary key generator
 * (ARCHITECTURE §7.1)
 */
export function generateId(): string {
  return uuidv7();
}

export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
