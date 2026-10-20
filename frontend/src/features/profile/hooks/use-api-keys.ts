"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { apiKeysApi } from "../api/api-keys.api";

export function useApiKeys() {
  return useQuery({
    queryKey: queryKeys.apiKeys.list(),
    queryFn: apiKeysApi.list,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiKeysApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all }),
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiKeysApi.revoke,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all }),
  });
}
