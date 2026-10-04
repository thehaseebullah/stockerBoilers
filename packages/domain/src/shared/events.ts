export interface DomainEvent<P = Record<string, unknown>> {
  id?: string | number;
  orgId: string;
  type: string;
  aggregateType: string;
  aggregateId: string;
  payload: P;
  actorId?: string | null;
  source: "console" | "field" | "simulator" | "system";
  traceId?: string | null;
  occurredAt: Date;
  isSandbox?: boolean;
}

export function createEvent<P = Record<string, unknown>>(
  params: Omit<DomainEvent<P>, "occurredAt"> & { occurredAt?: Date }
): DomainEvent<P> {
  return {
    ...params,
    occurredAt: params.occurredAt ?? new Date(),
    isSandbox: params.isSandbox ?? false,
  };
}
