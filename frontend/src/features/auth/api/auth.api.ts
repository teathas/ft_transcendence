import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";
import { env } from "@/lib/env";

import { authMocks } from "../mocks";
import { authResponseSchema, userSchema } from "../schemas";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (env.enableMocks) return authMocks.authResponse(payload.username);

    const { data } = await api.post("/auth/login", payload);
    return parseResponse(authResponseSchema, data, "POST /auth/login");
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (env.enableMocks) return authMocks.authResponse(payload.username);

    const { data } = await api.post("/auth/register", payload);
    return parseResponse(authResponseSchema, data, "POST /auth/register");
  },

  async logout(): Promise<void> {
    if (env.enableMocks) return;

    // A 401 here just means the session is already gone.
    await api.post("/auth/logout", undefined, { skipAuthRefresh: true });
  },

  async uploadAvatar(file: Blob, filename: string): Promise<User> {
    if (env.enableMocks) return authMocks.uploadAvatar(file);

    const body = new FormData();
    body.append("avatar", file, filename);

    const { data } = await api.post("/users/me/avatar", body, {
      // The instance defaults to JSON; the browser must set multipart itself
      // so the boundary token is generated.
      headers: { "Content-Type": "multipart/form-data" },
    });
    return parseResponse(userSchema, data, "POST /users/me/avatar");
  },

  async updateProfile(payload: { avatarUrl: string | null }): Promise<User> {
    if (env.enableMocks) return authMocks.updateProfile(payload.avatarUrl);

    const { data } = await api.patch("/users/me", payload);
    return parseResponse(userSchema, data, "PATCH /users/me");
  },

  async session(): Promise<User> {
    if (env.enableMocks) return authMocks.session();

    const { data } = await api.get("/auth/me");
    return parseResponse(userSchema, data, "GET /auth/me");
  },
};
