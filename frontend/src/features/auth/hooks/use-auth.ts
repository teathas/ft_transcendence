"use client";

import { useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { isApiError, tokenStore } from "@/lib/api";
import { browserLocale } from "@/i18n/config";
import { localeHref, useLocaleRouter } from "@/i18n/navigation";
import { queryKeys } from "@/lib/query/keys";
import { resetCache } from "@/lib/query/persister";

import { authApi } from "../api/auth.api";
import type { AuthResponse } from "../types";

/** Current user, or `undefined` while loading / when signed out. */
export function useSession() {
  // Without a token there is no session to ask for. Some components using this
  // hook are always mounted, the login page included: asking anyway made each
  // failure start a refresh, then a cache reset, then the same request again.
  const token = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.get,
    () => null,
  );
  const query = useQuery({
    enabled: Boolean(token),
    queryKey: queryKeys.auth.session(),
    queryFn: authApi.session,
    // A 401 here is the answer, not a failure worth retrying.
    retry: false,
  });

  return {
    user: query.data,
    isAuthenticated: Boolean(query.data),
    isSignedOut:
      !token || (isApiError(query.error) && query.error.isUnauthorized),
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
      // Drop anything a previous user left in the stored cache.
      resetCache(queryClient);
      tokenStore.set(result.accessToken);
      queryClient.setQueryData(queryKeys.auth.session(), result.user);
      // The account's language, or the browser's when none was ever chosen.
      const locale = result.user.language ?? browserLocale();
      router.replace(localeHref(routes.dashboard, locale) as Route);
    },
  });
}

export function useRegister() {
  const router = useLocaleRouter();
  const toast = useToast();
  const d = useDict();

  return useMutation({
    mutationFn: authApi.register,
    // The account exists but nobody is signed in: say so, then ask for the
    // credentials on the login page.
    onSuccess: () => {
      toast(d.auth.register.created);
      router.replace(routes.login);
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

export function useRemoveAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.removeAvatar,
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
      resetCache(queryClient);
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
      resetCache(queryClient);
      router.replace(routes.login);
    },
  });
}
