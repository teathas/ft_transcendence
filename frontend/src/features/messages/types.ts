import type { z } from "zod";

import type {
  conversationSchema,
  messageSchema,
  threadPageSchema,
} from "./schemas";

export type DirectMessage = z.infer<typeof messageSchema>;
export type ThreadPage = z.infer<typeof threadPageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
