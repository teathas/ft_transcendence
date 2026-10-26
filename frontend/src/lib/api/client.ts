import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/lib/env";

import { connectionStore } from "./connection";
import { isApiError, toApiError } from "./errors";
import { secondsUntilExpiry, tokenStore } from "./tokens";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Opt this request out of the automatic 401 -> refresh -> retry flow. */
    skipAuthRefresh?: boolean;
  }
}

/**
 * The single axios instance for the whole app. Import this — never `axios`
 * directly (ESLint enforces it) — so every call shares the base URL,
 * credentials, auth header and error normalisation.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  // Sends the HttpOnly refresh cookie on refresh/logout requests. The access
  // token remains explicit in the Authorization header.
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ── Token renewal ────────────────────────────────────────────────────────────
//
// When the access token has expired, requests fail with 401. The first one
// starts a refresh (`isRefreshing`); the ones failing meanwhile wait in
// `refreshQueue`. When the refresh ends, the queue is drained: every waiting
// request is retried with the new token (or rejected if there is none).

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function drainQueue(token: string | null) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

let onUnauthorized: (() => void) | null = null;

/**
 * Register what should happen when the session is really over (the refresh was
 * refused) — usually clearing client state and going to the login page.
 */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/** Asks the server for a new access token. Null when there is none to be had. */
async function requestNewToken(): Promise<string | null> {
  try {
    const { data } = await api.post<{ accessToken: string }>(
      "/auth/refresh",
      undefined,
      { skipAuthRefresh: true },
    );
    tokenStore.set(data.accessToken);
    return data.accessToken;
  } catch (error) {
    // 401: the session is over, so sign out. Anything else (no answer, a
    // restarting server) says nothing about the session: keep it.
    if (isApiError(error) && error.isUnauthorized && tokenStore.get()) {
      tokenStore.clear();
      onUnauthorized?.();
    }
    return null;
  }
}

/** Renews the token, or joins the renewal already running. */
function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }

  isRefreshing = true;
  return requestNewToken().then((token) => {
    drainQueue(token);
    isRefreshing = false;
    return token;
  });
}

/**
 * A token good for a few more seconds, renewed first if it is not. For what
 * does not go through axios — websockets send the token in their handshake.
 */
export async function getValidToken(): Promise<string | null> {
  const token = tokenStore.get();
  if (!token) return null;
  if (secondsUntilExpiry(token) > 10) return token;
  return refreshAccessToken();
}

// ── Interceptors ─────────────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/** A 401 on these means "refused" (wrong password…), not "token expired". */
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

api.interceptors.response.use(
  (response) => {
    connectionStore.set(true);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // No response at all: the backend is unreachable. A status code of any kind
    // means it answered. A cancelled request says nothing either way.
    if (!axios.isCancel(error)) connectionStore.set(Boolean(error.response));

    // A request that left without a token was never signed in: renewing for it
    // would only ask the server for a refresh it will refuse, again and again.
    const hadToken = Boolean(original?.headers?.get("Authorization"));

    const mustRefresh =
      error.response?.status === 401 &&
      original &&
      hadToken &&
      !original._retry &&
      !original.skipAuthRefresh &&
      !AUTH_ROUTES.some((route) => original.url?.includes(route));

    if (!mustRefresh) return Promise.reject(toApiError(error));

    original._retry = true;
    const token = await refreshAccessToken();
    if (!token) return Promise.reject(toApiError(error));

    original.headers.set("Authorization", `Bearer ${token}`);
    return api(original);
  },
);
