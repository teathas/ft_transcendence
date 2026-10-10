"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { routes } from "@/config/routes";
import { isApiError, tokenStore } from "@/lib/api";
import { useLocaleRouter } from "@/i18n/navigation";
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
  const router = useLocaleRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result: AuthResponse) => {
      tokenStore.set(result.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), result.user);
      router.replace(routes.dashboard);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useLocaleRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (result: AuthResponse) => {
      tokenStore.set(result.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), result.user);
      router.replace(routes.onboarding);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.session(), user);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, filename }: { file: Blob; filename: string }) =>
      authApi.uploadAvatar(file, filename),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.session(), user);
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authApi.changePassword });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useLocaleRouter();

  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      tokenStore.clear();
      queryClient.clear();
      router.replace(routes.register);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useLocaleRouter();

  return useMutation({
    mutationFn: authApi.logout,
    // Drop local state whether or not the server call succeeded.
    onSettled: () => {
      tokenStore.clear();
      queryClient.clear();
      router.replace(routes.login);
    },
  });
}
