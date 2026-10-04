import { AxiosError } from "axios";

/** Shape most backends use for error payloads. Every field is optional. */
type ErrorBody = {
  message?: string | string[];
  error?: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
};

/**
 * Normalised transport error. Every rejection coming out of the axios
 * instance is an `ApiError`, so callers never have to unwrap `AxiosError`.
 */
export class ApiError extends Error {
  /** HTTP status, or 0 when the request never reached the server. */
  readonly status: number;
  /** Machine-readable code from the backend, when it sends one. */
  readonly code?: string;
  /** Per-field validation messages, when the backend sends them. */
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
      fieldErrors?: Record<string, string[]>;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  /** 4xx responses are the caller's fault and should not be retried. */
  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function readMessage(body: ErrorBody | undefined, fallback: string): string {
  if (!body) return fallback;
  if (Array.isArray(body.message)) return body.message.join(", ");
  return body.message ?? body.error ?? fallback;
}

/** Convert anything thrown by axios into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (error instanceof AxiosError) {
    const body = error.response?.data as ErrorBody | undefined;
    const status = error.response?.status ?? 0;

    return new ApiError(
      readMessage(
        body,
        status === 0
          ? "Unable to reach the server. Check your connection."
          : error.message,
      ),
      {
        status,
        code: body?.code ?? error.code,
        fieldErrors: body?.errors,
        cause: error,
      },
    );
  }

  return new ApiError(
    error instanceof Error ? error.message : "Unexpected error",
    { status: 0, cause: error },
  );
}
