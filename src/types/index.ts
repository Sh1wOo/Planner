export interface User {
  id: number
  email: string
  username: string
}

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  due_date: string
  priority: Priority
  completed: boolean
  owner_id: number
}

export interface TaskCreate {
  title: string
  description?: string
  due_date: string
  priority: Priority
}

export interface TaskUpdate {
  title?: string
  description?: string
  due_date?: string
  priority?: Priority
  completed?: boolean
}

export interface ApiError {
  detail: string
}
