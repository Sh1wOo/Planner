import { useMemo, useState } from 'react'
import { Pencil, Trash2, CalendarDays, Check } from 'lucide-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useToast } from '../ui/Toast'
import type { Task, TaskUpdate } from '../../types'

const priorityMap: Record<Task['priority'], { label: string; tone: string; soft: string; dot: string }> = {
  low: { label: 'Низкий', tone: '#8ee05b', soft: '#293424', dot: '#8ee05b' },
  medium: { label: 'Средний', tone: '#f0c85f', soft: '#3a3220', dot: '#f0c85f' },
  high: { label: 'Высокий', tone: '#ff7b72', soft: '#382424', dot: '#ff7b72' },
}

export function TaskCard({ task }: { task: Task }) {
  const [editOpen, setEditOpen] = useState(false)
  const update = useUpdateTask()
  const remove = useDeleteTask()
  const toast = useToast()

  const priority = priorityMap[task.priority] ?? priorityMap.medium

  const formattedDate = useMemo(() => {
    if (!task.due_date) return 'Без даты'
    try {
      return format(new Date(`${task.due_date}T12:00:00`), 'd MMMM', { locale: ru })
    } catch {
      return task.due_date
    }
  }, [task.due_date])

  const handleToggle = async () => {
    await update.mutateAsync({ id: task.id, data: { completed: !task.completed } })
    toast.success(task.completed ? 'Задача снова активна' : 'Задача завершена')
  }

  const handleUpdate = async (data: TaskUpdate) => {
    await update.mutateAsync({ id: task.id, data })
    toast.success('Изменения сохранены')
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!confirm('Удалить задачу?')) return
    await remove.mutateAsync(task.id)
    toast.success('Задача удалена')
  }

  return (
    <>
      <article className={clsx(
        'w-full overflow-hidden rounded-[24px] border border-white/8 text-black shadow-[0_14px_34px_rgba(0,0,0,0.18)]',
        task.completed && 'opacity-90'
      )}>
        <div className="w-full p-3">
          <div className="flex w-full items-center gap-3 rounded-[20px] border border-white/6 bg-white/[0.05] px-4 py-4">
            <button
              type="button"
              onClick={handleToggle}
              className={clsx(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                task.completed
                  ? 'border-[#8ee05b] bg-[#8ee05b] text-[#0f140f] shadow-[0_0_0_4px_rgba(142,224,91,0.16)]'
                  : ' bg-transparent text-transparent hover:border-white/40'
              )}
              aria-label={task.completed ? 'Сделать невыполненной' : 'Отметить выполненной'}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </button>

            <div className="min-w-0 flex-1">
              <h3 className={clsx(
                'break-words text-[17px] font-medium leading-[1.3] tracking-[-0.03em] text-white',
                task.completed && 'text-white/45 line-through'
              )}>
                {task.title}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/75">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  <span>{formattedDate}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium" style={{ background: priority.soft, color: priority.tone }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: priority.dot }} />
                  <span>{priority.label}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/65 transition-all hover:bg-white/[0.11] hover:text-white active:scale-90"
                aria-label="Редактировать"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/65 transition-all hover:bg-[#402525] hover:text-[#ff8d87] active:scale-90"
                aria-label="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

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