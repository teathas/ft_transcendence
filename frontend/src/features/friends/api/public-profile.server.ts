import "server-only";

import { cache } from "react";

import { publicProfileSchema } from "../schemas";
import type { PublicProfile } from "../types";

export class PublicProfileNotFoundError extends Error {}

/**
 * Fetches the public projection directly from Nest during server rendering.
 * The internal URL avoids a trip through TLS and nginx inside Docker.
 */
export const getPublicProfile = cache(
  async (userId: string): Promise<PublicProfile> => {
    const baseUrl =
      process.env.INTERNAL_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3001";
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/users/${encodeURIComponent(userId)}`,
      { cache: "no-store", headers: { Accept: "application/json" } },
    );

    if (response.status === 404) throw new PublicProfileNotFoundError();
    if (!response.ok) {
      throw new Error(`Unable to load public profile (${response.status})`);
    }

    return publicProfileSchema.parse(await response.json());
  },
);
