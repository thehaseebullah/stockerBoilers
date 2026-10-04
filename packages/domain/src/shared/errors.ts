export class DomainError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, status: number = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Permission denied", code: string = "FORBIDDEN") {
    super(message, code, 403);
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} was not found`, `${entity.toUpperCase()}_NOT_FOUND`, 404);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, code: string = "CONFLICT") {
    super(message, code, 409);
  }
}

export class ValidationError extends DomainError {
  readonly fields?: Record<string, string[]>;

  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, "VALIDATION_FAILED", 422);
    this.fields = fields;
  }
}
