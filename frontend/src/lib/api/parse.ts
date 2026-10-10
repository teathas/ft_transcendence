import type { z, ZodType } from "zod";

import { ApiError } from "./errors";

/**
 * Validate a response body against a schema.
 *
 * A backend that drifts from the contract then fails here, at the boundary,
 * with a clear message — instead of as `undefined is not an object` deep in a
 * component.
 */
export function parseResponse<S extends ZodType>(
  schema: S,
  data: unknown,
  endpoint: string,
): z.infer<S> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(`Unexpected response from ${endpoint}`, {
      status: 0,
      code: "INVALID_RESPONSE",
      cause: result.error,
    });
  }

  return result.data;
}
