import type { z } from "zod";

import type {
  friendSchema,
  friendsSummarySchema,
  personSchema,
  publicUserSchema,
  relationshipSchema,
  requestSchema,
} from "./schemas";

export type PublicUser = z.infer<typeof publicUserSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Person = z.infer<typeof personSchema>;
export type Friend = z.infer<typeof friendSchema>;
export type FriendRequest = z.infer<typeof requestSchema>;
export type FriendsSummary = z.infer<typeof friendsSummarySchema>;

export type Page<Item> = { items: Item[]; total: number };

export type RequestKind = "received" | "sent";
export type FriendSort = "recent" | "name";
export type RelationshipFilter = "all" | Relationship;

/** What each list view asks for; mirrored in the query string. */
export type ListQuery = { search: string; page: number; pageSize: number };
export type FriendsQuery = ListQuery & { sort: FriendSort };
export type PeopleQuery = ListQuery & { relationship: RelationshipFilter };
