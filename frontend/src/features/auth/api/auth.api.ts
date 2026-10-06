import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";
import { env } from "@/lib/env";

import { authMocks } from "../mocks";
import { loginResponseSchema, userSchema } from "../schemas";
import type {
  AuthResponse,
  LoginPayload,
  ProfilePatch,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  /**
   * The backend returns the token alone, so the current user is fetched right
   * after. Keeping that here means the rest of the app still receives one
   * `{ accessToken, user }` object.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (env.enableMocks) return authMocks.authResponse(payload.email);

    const { data } = await api.post("/auth/login", payload);
    const { accessToken } = parseResponse(
      loginResponseSchema,
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

  /**
   * `POST /auth/register` creates the account but issues no token, so the
   * credentials are immediately exchanged for one — otherwise a brand-new user
   * would land on the sign-in screen.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (env.enableMocks) return authMocks.authResponse(payload.username);

    const { data } = await api.post("/auth/register", payload);
    parseResponse(userSchema, data, "POST /auth/register");

    return authApi.login({ email: payload.email, password: payload.password });
  },

  async logout(): Promise<void> {
    if (env.enableMocks) return;

    // A 401 here just means the session is already gone, so there is no
    // point refreshing a token we are about to drop.
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

  /** Only `username` and `bio` are accepted — email is not changeable. */
  async updateProfile(payload: ProfilePatch): Promise<User> {
    if (env.enableMocks) return authMocks.updateProfile(payload);

    const { data } = await api.patch("/users/me", payload);
    return parseResponse(userSchema, data, "PATCH /users/me");
  },

  async session(): Promise<User> {
    if (env.enableMocks) return authMocks.session();

    const { data } = await api.get("/users/me");
    return parseResponse(userSchema, data, "GET /users/me");
  },
};
