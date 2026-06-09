import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { Task, TaskCreate, TaskUpdate, Priority } from '../../types'

interface Props {
  initialValues?: Partial<Task>
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Создать' }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? today)
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Название обязательно'
    if (!dueDate) e.dueDate = 'Дата обязательна'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined, due_date: dueDate, priority })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название"
        placeholder="Что нужно сделать?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#28251d]">Описание</label>
        <textarea
          placeholder="Дополнительные детали..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[#d4d1ca] bg-white px-3 py-2.5 text-sm text-[#28251d]
            placeholder:text-[#bab9b4] resize-none focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
            focus:border-[#01696f] hover:border-[#7a7974] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Дата"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          error={errors.dueDate}
        />
        <Select
          label="Приоритет"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="low">🟢 Низкий</option>
          <option value="medium">🟡 Средний</option>
          <option value="high">🔴 Высокий</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
