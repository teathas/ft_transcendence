import "server-only";

import type { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

import { api } from "./client";

/**
 * Axios does not have a browser cookie jar on the server, so Server
 * Components and Route Handlers must forward the incoming request's cookies
 * explicitly.
 *
 * ```ts
 * const { data } = await api.get("/users/me", await serverConfig());
 * ```
 */
export async function serverConfig(
  config: AxiosRequestConfig = {},
): Promise<AxiosRequestConfig> {
  const cookieStore = await cookies();
  const cookie = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return {
    ...config,
    headers: { ...config.headers, ...(cookie ? { Cookie: cookie } : {}) },
  };
}

export { api };
