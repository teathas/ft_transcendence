import { z } from "zod";

import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

const apiKeySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  prefix: z.string(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime().nullable(),
  expiresAt: z.iso.datetime().nullable(),
  revokedAt: z.iso.datetime().nullable(),
});

const createdApiKeySchema = apiKeySchema
  .omit({ lastUsedAt: true, revokedAt: true })
  .extend({ key: z.string().startsWith("sr_live_") });

export type ApiKeySummary = z.infer<typeof apiKeySchema>;
export type CreatedApiKey = z.infer<typeof createdApiKeySchema>;

export const apiKeysApi = {
  async list(): Promise<ApiKeySummary[]> {
    const { data } = await api.get("/keys");
    return parseResponse(z.array(apiKeySchema), data, "GET /keys");
  },

  async create(payload: {
    name: string;
    expiresAt?: string;
  }): Promise<CreatedApiKey> {
    const { data } = await api.post("/keys", payload);
    return parseResponse(createdApiKeySchema, data, "POST /keys");
  },

  async revoke(id: string): Promise<void> {
    await api.delete(`/keys/${id}`);
  },
};
