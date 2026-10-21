"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "@/components/ui/toast";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { queryKeys } from "@/lib/query/keys";

import { friendsApi } from "../api/friends.api";
import type {
  FriendsQuery,
  ListQuery,
  PeopleQuery,
  PublicProfile,
  RequestKind,
} from "../types";

// `keepPreviousData`: moving to the next page keeps the current one on screen
// until the new one arrives, instead of collapsing to skeletons.

/** `enabled` is false for a tab that is not on screen, so it asks nothing. */
export function useFriends(query: FriendsQuery, enabled = true) {
  return useQuery({
    enabled,
    queryKey: queryKeys.friends.list(query),
    queryFn: () => friendsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useRequests(
  kind: RequestKind,
  query: ListQuery,
  enabled = true,
) {
  return useQuery({
    enabled,
    queryKey: queryKeys.friends.requests(kind, query),
    queryFn: () => friendsApi.requests(kind, query),
    placeholderData: keepPreviousData,
  });
}

/** Nothing is asked until something is typed: the API needs a `q`. */
export function usePeople(query: PeopleQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.search(query),
    queryFn: () => friendsApi.search(query),
    enabled: enabled && query.search.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}

export function usePublicProfile(userId: string, initialData?: PublicProfile) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => friendsApi.profile(userId),
    retry: false,
    initialData,
  });
}

/** Counts for the tabs and the sidebar badges; refreshed every 15 s. */
export function useFriendsSummary() {
  return useQuery({
    queryKey: queryKeys.friends.summary(),
    queryFn: friendsApi.summary,
    refetchInterval: 15_000,
  });
}

/**
 * Every action here changes what several lists show — a request moves from one
 * tab to another, a search hit changes relationship — so each one refreshes all
 * of them. They are only refetched if something is on screen.
 */
function useRefreshAfter() {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.friends.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
  };
}

export function useSendRequest() {
  const refresh = useRefreshAfter();
  const toast = useToast();
  const d = useDict();

  return useMutation({
    mutationFn: ({ userId }: { userId: string; name: string }) =>
      friendsApi.sendRequest(userId),
    onSuccess: (_request, { name }) => {
      toast(t(d.friends.toast.requestSent, { name }));
      refresh();
    },
  });
}

export function useAcceptRequest() {
  const refresh = useRefreshAfter();
  const toast = useToast();
  const d = useDict();

  return useMutation({
    mutationFn: ({ requestId }: { requestId: string; name: string }) =>
      friendsApi.accept(requestId),
    onSuccess: (_accepted, { name }) => {
      toast(t(d.friends.toast.accepted, { name }));
      refresh();
    },
  });
}

export function useRejectRequest() {
  const refresh = useRefreshAfter();
  return useMutation({ mutationFn: friendsApi.reject, onSuccess: refresh });
}

export function useCancelRequest() {
  const refresh = useRefreshAfter();
  return useMutation({ mutationFn: friendsApi.cancel, onSuccess: refresh });
}

export function useRemoveFriend() {
  const refresh = useRefreshAfter();
  return useMutation({ mutationFn: friendsApi.remove, onSuccess: refresh });
}
