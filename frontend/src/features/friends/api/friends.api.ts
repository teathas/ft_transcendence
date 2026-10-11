import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import {
  acceptedRequestSchema,
  friendSchema,
  friendsSummarySchema,
  pageOf,
  personSchema,
  requestSchema,
  sentRequestSchema,
} from "../schemas";
import type {
  Friend,
  FriendRequest,
  FriendsQuery,
  FriendsSummary,
  ListQuery,
  Page,
  PeopleQuery,
  Person,
  RequestKind,
} from "../types";

/** An empty search is left out of the URL rather than sent as `search=`. */
const text = (search: string) => search.trim() || undefined;

/** One function per backend route; the shapes come from `../schemas`. */
export const friendsApi = {
  async list(query: FriendsQuery): Promise<Page<Friend>> {
    const { data } = await api.get("/friends", {
      params: { ...query, search: text(query.search) },
    });
    return parseResponse(pageOf(friendSchema), data, "GET /friends");
  },

  async requests(
    kind: RequestKind,
    query: ListQuery,
  ): Promise<Page<FriendRequest>> {
    const { data } = await api.get(`/friends/requests/${kind}`, {
      params: { ...query, search: text(query.search) },
    });
    return parseResponse(
      pageOf(requestSchema),
      data,
      `GET /friends/requests/${kind}`,
    );
  },

  /** People by username. The API insists on a non-empty `q`. */
  async search(query: PeopleQuery): Promise<Page<Person>> {
    const { search, relationship, ...paging } = query;
    const { data } = await api.get("/users/search", {
      params: {
        ...paging,
        q: search.trim(),
        relationship: relationship === "all" ? undefined : relationship,
      },
    });
    return parseResponse(pageOf(personSchema), data, "GET /users/search");
  },

  async summary(): Promise<FriendsSummary> {
    const { data } = await api.get("/friends/summary");
    return parseResponse(friendsSummarySchema, data, "GET /friends/summary");
  },

  async sendRequest(addresseeId: string) {
    const { data } = await api.post("/friends/requests", { addresseeId });
    return parseResponse(sentRequestSchema, data, "POST /friends/requests");
  },

  async accept(requestId: string) {
    const { data } = await api.post(`/friends/requests/${requestId}/accept`);
    return parseResponse(
      acceptedRequestSchema,
      data,
      "POST /friends/requests/:id/accept",
    );
  },

  /** `reject` is the addressee saying no. */
  async reject(requestId: string): Promise<void> {
    await api.post(`/friends/requests/${requestId}/reject`);
  },

  /** `cancel` is the requester taking the request back. */
  async cancel(requestId: string): Promise<void> {
    await api.delete(`/friends/requests/${requestId}`);
  },

  async remove(friendshipId: string): Promise<void> {
    await api.delete(`/friends/${friendshipId}`);
  },
};
