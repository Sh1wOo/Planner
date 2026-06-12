import { api } from "./client";

export interface User {
  id: number;
  email: string;
  username: string;
  telegram_id?: number | null;
  telegram_username?: string | null;
  telegram_first_name?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  return await api.post("auth/login", payload);
}

export async function register(payload: RegisterPayload) {
  return await api.post("auth/register", payload);
}

export async function logout() {
  return await api.post("auth/logout", {});
}

export async function refresh() {
  return await api.post("auth/refresh", {});
}

export async function linkTelegram(initData: string) {
  return await api.post("auth/telegram/link", {
    init_data: initData,
  });
}

export async function getMe(): Promise<User> {
  return (await api.get("auth/me")) as User;
}