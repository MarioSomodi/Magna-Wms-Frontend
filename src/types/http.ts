/** RFC 7807 Problem Details standard, extended with backend-specific fields */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  correlationId?: string;
  code?: number;
  errors?: Record<string, string[]>;
}

/** Unified result wrapper for API calls */
export type ApiResult<T> =
  | { ok: true; data: T; headers: Headers }
  | { ok: false; problem: ProblemDetails; status: number };

export type ServerActionResult =
  | { ok: true }
  | { ok: false; error: string }
  | { problem: ProblemDetails };
