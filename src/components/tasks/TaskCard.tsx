import { useState } from 'react'
import { Pencil, Trash2, Check, Calendar } from 'lucide-react'
import { clsx } from 'clsx'
import { PriorityBadge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useToast } from '../ui/Toast'
import type { Task, TaskUpdate } from '../../types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const priorityAccent: Record<string, string> = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

export function TaskCard({ task }: { task: Task }) {
  const [editOpen, setEditOpen] = useState(false)
  const [completing, setCompleting] = useState(false)
  const update = useUpdateTask()
  const del = useDeleteTask()
  const toast = useToast()

  const toggle = async () => {
    setCompleting(true)
    await update.mutateAsync({ id: task.id, data: { completed: !task.completed } })
    toast.success(task.completed ? 'Задача возобновлена' : 'Задача выполнена!')
    setTimeout(() => setCompleting(false), 400)
  }

  const handleUpdate = async (data: TaskUpdate) => {
    await update.mutateAsync({ id: task.id, data })
    toast.success('Задача обновлена')
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!confirm('Удалить задачу?')) return
    await del.mutateAsync(task.id)
    toast.success('Задача удалена')
  }

  const dateStr = (() => {
    try { return format(new Date(task.due_date + 'T12:00:00'), 'd MMM', { locale: ru }) }
    catch { return task.due_date }
  })()

  const accent = priorityAccent[task.priority] ?? '#94a3b8'

  return (
    <>
<div
  className={clsx(
    'group relative overflow-hidden',
    'rounded-3xl',
    'bg-white/80 backdrop-blur-xl',
    'border border-white/40',
    'shadow-[0_10px_40px_rgba(0,0,0,0.08)]',
    'p-4',
    'min-h-[96px]',
    'transition-all duration-300',
    'hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)]',
    task.completed && 'opacity-60'
  )}
>
  {/* Gradient Accent */}
  <div
    className="absolute left-0 top-0 h-full w-1"
    style={{
      background:
        task.priority === 'high'
          ? 'linear-gradient(180deg,#ef4444,#f97316)'
          : task.priority === 'medium'
          ? 'linear-gradient(180deg,#f59e0b,#facc15)'
          : 'linear-gradient(180deg,#22c55e,#10b981)',
    }}
  />

  <div className="flex gap-4">
    {/* Checkbox */}
    <button
      onClick={toggle}
      className={clsx(
        'w-7 h-7 mt-0.5 shrink-0',
        'rounded-xl border-2',
        'flex items-center justify-center',
        'transition-all duration-200',
        task.completed
          ? 'border-transparent scale-105'
          : 'border-slate-300 hover:border-slate-500'
      )}
      style={{
        background: task.completed ? accent : undefined,
      }}
    >
      {task.completed && (
        <Check
          className="w-4 h-4 text-white"
          strokeWidth={3}
        />
      )}
    </button>

    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={clsx(
              'font-semibold text-[15px] leading-6',
              'text-slate-900',
              task.completed &&
                'line-through text-slate-400'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${accent}15`,
            color: accent,
          }}
        >
          {task.priority === 'high'
            ? '🔥 Высокий'
            : task.priority === 'medium'
            ? '⚡ Средний'
            : '🌱 Низкий'}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditOpen(true)}
            className="
              w-10 h-10
              rounded-xl
              flex items-center justify-center
              text-slate-500
              hover:bg-indigo-50
              hover:text-indigo-600
              transition-all
            "
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="
              w-10 h-10
              rounded-xl
              flex items-center justify-center
              text-slate-500
              hover:bg-red-50
              hover:text-red-600
              transition-all
            "
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Редактировать задачу">
        <TaskForm
          initialValues={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditOpen(false)}
          submitLabel="Сохранить"
        />
      </Modal>
    </>
  )
}

/** Convert #rrggbb → "r, g, b" for CSS custom property */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}