import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import { tokenResponseSchema, userSchema } from "../schemas";
import type {
  AuthResponse,
  LoginPayload,
  PasswordChangePayload,
  ProfilePatch,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  /**
   * `POST /auth/login` returns the token alone, so the user is fetched right
   * after — with the token passed explicitly, since it is not stored yet.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post("/auth/login", payload);
    const { accessToken } = parseResponse(
      tokenResponseSchema,
      data,
      "POST /auth/login",
    );

    const { data: me } = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {
      accessToken,
      user: parseResponse(userSchema, me, "GET /users/me"),
    };
  },

  /** Creates the account. No token is issued: the user signs in afterwards. */
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post("/auth/register", payload);
    return parseResponse(userSchema, data, "POST /auth/register");
  },

  async logout(): Promise<void> {
    // A 401 here just means the session is already gone.
    await api.post("/auth/logout", undefined, { skipAuthRefresh: true });
  },

  async uploadAvatar(file: Blob, filename: string): Promise<User> {
    const body = new FormData();
    body.append("avatar", file, filename);

    const { data } = await api.post("/users/me/avatar", body, {
      // The instance defaults to JSON; the browser must set multipart itself
      // so the boundary token is generated.
      headers: { "Content-Type": "multipart/form-data" },
    });
    return parseResponse(userSchema, data, "POST /users/me/avatar");
  },

  async updateProfile(payload: ProfilePatch): Promise<User> {
    const { data } = await api.patch("/users/me", payload);
    return parseResponse(userSchema, data, "PATCH /users/me");
  },

  async removeAvatar(): Promise<User> {
    const { data } = await api.delete("/users/me/avatar");
    return parseResponse(userSchema, data, "DELETE /users/me/avatar");
  },

  /** A wrong current password is a 400, so it never looks like an expired session. */
  async changePassword(payload: PasswordChangePayload): Promise<void> {
    await api.patch("/users/me/password", payload);
  },

  async deleteAccount(): Promise<void> {
    await api.delete("/users/me", { skipAuthRefresh: true });
  },

  async session(): Promise<User> {
    const { data } = await api.get("/users/me");
    return parseResponse(userSchema, data, "GET /users/me");
  },
};
