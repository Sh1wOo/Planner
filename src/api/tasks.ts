import { api } from './client'
import type { Task, TaskCreate, TaskUpdate } from '../types'

export const tasksApi = {
  getAll: (params?: { due_date?: string; priority?: string; completed?: boolean }) => {
    const search = new URLSearchParams()
    if (params?.due_date) search.set('due_date', params.due_date)
    if (params?.priority) search.set('priority', params.priority)
    if (params?.completed !== undefined) search.set('completed', String(params.completed))
    const qs = search.toString()
    return api.get<Task[]>(`/tasks/${qs ? '?' + qs : ''}`)
  },

  getToday: () => api.get<Task[]>('/tasks/day'),

  getOne: (id: number) => api.get<Task>(`/tasks/${id}`),

  create: (data: TaskCreate) => api.post<Task>('/tasks/', data),

  update: (id: number, data: TaskUpdate) => api.patch<Task>(`/tasks/${id}`, data),

  delete: (id: number) => api.delete(`/tasks/${id}`),
}
