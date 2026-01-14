"use client";

import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type MeResponse = AuthUser;

type LoginResponse = {
  user: AuthUser;
};

type RefreshResponse = {
  user: AuthUser;
};

const AUTH_ME_QUERY_KEY = ["auth", "me"];

async function fetchMe(): Promise<MeResponse> {
  return apiGet<MeResponse>("/auth/me");
}

async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginPayload>("/auth/login", payload);
}

async function logoutRequest(): Promise<void> {
  await apiPost<void, undefined>("/auth/logout");
}

async function refreshRequest(): Promise<RefreshResponse> {
  return apiPost<RefreshResponse, undefined>("/auth/refresh");
}

export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchMe,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });

  const refreshQuery = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refreshRequest,
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (meQuery.data) {
      const intervalMs = 14 * 60 * 1000;

      intervalId = setInterval(() => {
        refreshQuery.refetch().then((result) => {
          if (result.data?.user) {
            queryClient.setQueryData(
              AUTH_ME_QUERY_KEY,
              result.data.user,
            );
          }
        });
      }, intervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [meQuery.data, queryClient, refreshQuery]);

  const isAuthenticated = !!meQuery.data;

  return {
    user: meQuery.data ?? null,
    isAuthenticated,
    isLoading: meQuery.isLoading,
    isRefetching: meQuery.isRefetching,
    loginMutation,
    logoutMutation,
  };
}




