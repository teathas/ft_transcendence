"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { isApiError, tokenStore } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";

import { authApi } from "../api/auth.api";
import type { AuthResponse } from "../types";

/** Current user, or `undefined` while loading / when signed out. */
export function useSession() {
  const query = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: authApi.session,
    // A 401 here is the answer, not a failure worth retrying.
    retry: false,
    staleTime: 5 * 60_000,
  });

  return {
    user: query.data,
    isAuthenticated: Boolean(query.data),
    isSignedOut: isApiError(query.error) && query.error.isUnauthorized,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result: AuthResponse) => {
      tokenStore.set(result.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), result.user);
      router.replace("/");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (result: AuthResponse) => {
      tokenStore.set(result.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), result.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    // Drop local state whether or not the server call succeeded.
    onSettled: () => {
      tokenStore.clear();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
