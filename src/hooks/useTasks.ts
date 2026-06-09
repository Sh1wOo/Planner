import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks'
import type { TaskCreate, TaskUpdate } from '../types'

export const TASKS_KEY = ['tasks']

export function useTasks(params?: { due_date?: string; priority?: string; completed?: boolean }) {
  return useQuery({
    queryKey: [...TASKS_KEY, params],
    queryFn: () => tasksApi.getAll(params),
  })
}

export function useTodayTasks() {
  return useQuery({
    queryKey: [...TASKS_KEY, 'today'],
    queryFn: tasksApi.getToday,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TaskCreate) => tasksApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) => tasksApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}
