import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login,
  register,
  logout,
  refresh,
  linkTelegram,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "../api/auth";
import { getTelegramInitData } from "../lib/telegram";

const ME_QUERY_KEY = ["me"];

async function tryLinkTelegram() {
  const initData = getTelegramInitData();

  if (!initData) {
    console.warn("Telegram initData not found");
    return null;
  }

  try {
    const result = await linkTelegram(initData);
    console.log("Telegram linked", result);
    return result;
  } catch (error) {
    console.error("Telegram link failed", error);
    return null;
  }
}

export function useMe() {
  return useQuery<User>({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const authData = await login(payload);
      await tryLinkTelegram();
      return authData;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const authData = await register(payload);
      await tryLinkTelegram();
      return authData;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refresh,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}