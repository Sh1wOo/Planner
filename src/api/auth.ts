import { api } from './client'
import type { User } from '../types'

export interface TelegramLinkPayload {
  telegram_id: number | string
  username?: string
  first_name?: string
  last_name?: string
  init_data?: string
}

export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post<User>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<User>('/auth/login', data),

  logout: () => api.post<void>('/auth/logout'),

  refresh: () => api.post<User>('/auth/refresh'),

  me: () => api.get<User>('/auth/me'),

  linkTelegram: (data: TelegramLinkPayload) =>
    api.post<User>('/auth/telegram', data),
}
