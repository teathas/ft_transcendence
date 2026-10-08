"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { isApiError, tokenStore } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";

import { authApi, resetSessionRestore } from "../api/auth.api";
import { sessionCache } from "../session-cache";
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

  // Keep the cached copy in step with the server's answer.
  useEffect(() => {
    if (query.data) sessionCache.write(query.data);
  }, [query.data]);

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

function useAuthSuccess() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (result: AuthResponse, destination: string) => {
    tokenStore.set(result.accessToken);
    sessionCache.write(result.user);
    queryClient.setQueryData(queryKeys.auth.session(), result.user);
    router.replace(destination as Parameters<typeof router.replace>[0]);
  };
}

export function useLogin() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result) => onSuccess(result, routes.dashboard),
  });
}

export function useRegister() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (result) => onSuccess(result, routes.onboarding),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, filename }: { file: Blob; filename: string }) =>
      authApi.uploadAvatar(file, filename),
    onSuccess: (user) => {
      sessionCache.write(user);
      queryClient.setQueryData(queryKeys.auth.session(), user);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => {
      sessionCache.write(user);
      queryClient.setQueryData(queryKeys.auth.session(), user);
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
      sessionCache.clear();
      resetSessionRestore();
      queryClient.clear();
      router.replace(routes.login);
    },
  });
}
