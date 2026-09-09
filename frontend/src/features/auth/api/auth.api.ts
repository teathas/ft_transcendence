import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import { authResponseSchema, userSchema } from "../schemas";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post("/auth/login", payload);
    return parseResponse(authResponseSchema, data, "POST /auth/login");
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post("/auth/register", payload);
    return parseResponse(authResponseSchema, data, "POST /auth/register");
  },

  async logout(): Promise<void> {
    // A 401 here just means the session is already gone.
    await api.post("/auth/logout", undefined, { skipAuthRefresh: true });
  },

  async session(): Promise<User> {
    const { data } = await api.get("/auth/me");
    return parseResponse(userSchema, data, "GET /auth/me");
  },
};
