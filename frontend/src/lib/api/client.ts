import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/lib/env";

import { toApiError } from "./errors";
import { tokenStore } from "./tokens";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Opt this request out of the automatic 401 -> refresh -> retry flow. */
    skipAuthRefresh?: boolean;
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

/**
 * The single axios instance for the whole app. Import this — never `axios`
 * directly (ESLint enforces it) — so every call shares the base URL,
 * credentials, auth header and error normalisation.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  // Send the httpOnly refresh/session cookie to the backend.
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;

/**
 * Register what should happen when a refresh attempt finally fails — usually
 * clearing client state and redirecting to the login page.
 */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

let refreshPromise: Promise<string | null> | null = null;

async function requestNewAccessToken(): Promise<string | null> {
  try {
    const { data } = await api.post<{ accessToken: string }>(
      "/auth/refresh",
      undefined,
      // Without this, a 401 from the refresh call would recurse.
      { skipAuthRefresh: true },
    );
    tokenStore.set(data.accessToken);
    return data.accessToken;
  } catch {
    tokenStore.clear();
    return null;
  }
}

/** Concurrent 401s share one refresh round-trip instead of stampeding. */
function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= requestNewAccessToken().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const config = (error as AxiosError).config as RetriableConfig | undefined;
    const status = (error as AxiosError).response?.status;

    if (
      status === 401 &&
      config &&
      !config._retried &&
      !config.skipAuthRefresh
    ) {
      config._retried = true;

      const token = await refreshAccessToken();
      if (token) {
        const headers = AxiosHeaders.from(config.headers);
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
        return api.request(config);
      }

      onUnauthorized?.();
    }

    return Promise.reject(toApiError(error));
  },
);
