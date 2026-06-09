import { api } from './client'
import type { User } from '../types'

export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post<User>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<User>('/auth/login', data),

  logout: () => api.post<void>('/auth/logout'),

  refresh: () => api.post<User>('/auth/refresh'),

  me: () => api.get<User>('/auth/me'),
}
