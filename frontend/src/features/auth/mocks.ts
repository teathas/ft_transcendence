import { ApiError } from "@/lib/api";

import type {
  AuthResponse,
  PasswordChangePayload,
  ProfilePatch,
  User,
} from "./types";

/**
 * Stand-in session used while the backend has no auth endpoints.
 *
 * Enabled by `NEXT_PUBLIC_ENABLE_MOCKS`; delete this file and the branches in
 * `auth.api.ts` once the real endpoints exist.
 */
export const MOCK_USER: User = {
  id: "8f1a0c9e-2b44-4c31-9a77-1d2e3f4a5b60",
  email: "amina@student.42.fr",
  username: "amina",
  avatarUrl: null,
  bio: null,
  termsAccepted: true,
  status: "ONLINE",
  lastSeenAt: new Date().toISOString(),
  createdAt: "2026-09-01T09:12:00.000Z",
  updatedAt: new Date().toISOString(),
};

function settle<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const authMocks = {
  session: () => settle(MOCK_USER),

  authResponse: (username: string): Promise<AuthResponse> =>
    settle({
      accessToken: "mock-access-token",
      user: { ...MOCK_USER, username },
    }),

  updateProfile: (patch: ProfilePatch) => settle({ ...MOCK_USER, ...patch }),

  changePassword: async ({ currentPassword }: PasswordChangePayload) => {
    await settle(null, 600);
    // Gives the error path something to exercise without a backend.
    if (currentPassword !== "password") {
      throw new ApiError("Your current password is not correct.", {
        status: 422,
        fieldErrors: {
          currentPassword: ["Your current password is not correct."],
        },
      });
    }
  },

  deleteAccount: () => settle(undefined, 600),

  uploadAvatar: (file: Blob) =>
    settle({ ...MOCK_USER, avatarUrl: URL.createObjectURL(file) }),
};
