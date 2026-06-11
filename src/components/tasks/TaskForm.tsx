import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, Check, Sparkles, FileText, Type } from 'lucide-react'
import type { Task, TaskCreate, TaskUpdate, Priority } from '../../types'

interface Props {
  initialValues?: Partial<Task>
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const PRIORITIES: Array<{ value: Priority; label: string; hint: string; dot: string; bg: string; text: string }> = [
  { value: 'low', label: 'Низкий', hint: 'Мягкий темп, можно без спешки', dot: '#22c55e', bg: '#edf8f0', text: '#1f7a45' },
  { value: 'medium', label: 'Средний', hint: 'Стандартный рабочий приоритет', dot: '#f4b000', bg: '#fdf5df', text: '#9a6700' },
  { value: 'high', label: 'Высокий', hint: 'Критично, лучше сделать сегодня', dot: '#ef4444', bg: '#fcebea', text: '#b43a2f' },
]

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Создать задачу' }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? today)
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium')
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentPriority = useMemo(
    () => PRIORITIES.find((item) => item.value === priority) ?? PRIORITIES[1],
    [priority]
  )

  const validate = () => {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Введите название задачи'
    if (!dueDate) next.dueDate = 'Выберите дату'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate,
        priority,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 px-1">
        <div className="rounded-[24px] border border-[#ece7df] bg-[#fffdfa] p-4 shadow-[0_8px_20px_rgba(46,43,39,0.04)]">
          <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a59f98]">
            <Sparkles className="h-3.5 w-3.5" />
            Task details
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]">
                <Type className="h-3.5 w-3.5 text-[#9c958e]" />
                Название
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: подготовить презентацию"
                autoFocus
                className="h-12 w-full rounded-[18px] border border-[#dcd5cd] bg-white px-4 text-[15px] text-[#2f2b28] outline-none transition-all placeholder:text-[#b8b1a9] focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              {errors.title && <p className="mt-1.5 px-1 text-[12px] text-[#b42318]">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]">
                <FileText className="h-3.5 w-3.5 text-[#9c958e]" />
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Добавь контекст, детали или небольшое примечание"
                rows={4}
                className="w-full rounded-[18px] border border-[#dcd5cd] bg-white px-4 py-3 text-[14px] leading-[1.45] text-[#2f2b28] outline-none transition-all placeholder:text-[#b8b1a9] resize-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#ece7df] bg-[#fffdfa] p-4 shadow-[0_8px_20px_rgba(46,43,39,0.04)]">
            <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]">
              <CalendarDays className="h-3.5 w-3.5 text-[#9c958e]" />
              Срок
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-12 w-full rounded-[18px] border border-[#dcd5cd] bg-white px-4 text-[14px] text-[#2f2b28] outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {errors.dueDate && <p className="mt-1.5 px-1 text-[12px] text-[#b42318]">{errors.dueDate}</p>}
          </div>

          <div className="rounded-[24px] border border-[#ece7df] bg-[#fffdfa] p-4 shadow-[0_8px_20px_rgba(46,43,39,0.04)]">
            <label className="mb-2 block text-[13px] font-medium text-[#5a5550]">
              Приоритет
            </label>
            <button
              type="button"
              onClick={() => setPriorityOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-[18px] border border-[#dcd5cd] bg-white px-4 text-center transition-all hover:border-[#cfc7bf] focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: currentPriority.dot }} />
              <span className="text-[14px] font-semibold text-[#2f2b28]">{currentPriority.label}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#8d8781]" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-1 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-full px-5 text-[14px] font-medium text-[#5a5550] transition-all hover:bg-[#efebe6]"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-primary px-5 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(1,105,111,0.22)] transition-all hover:bg-[#0d5d61] active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Сохранение...' : submitLabel}
          </button>
        </div>
      </form>

      {priorityOpen && (
        <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            onClick={() => setPriorityOpen(false)}
            className="absolute inset-0 bg-[rgba(46,43,39,0.34)] backdrop-blur-xs"
            aria-label="Закрыть выбор приоритета"
          />

          <div className="relative z-71 w-full sm:max-w-md rounded-t-[30px] sm:rounded-[30px] border border-[#ece7df] bg-[#f6f4f0] px-4 pb-5 pt-3 shadow-[0_-10px_40px_rgba(46,43,39,0.18)] animate-[priorityDrawer_.26s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#d2cdc6] sm:hidden" />

            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#aaa39b]">Task setup</p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#2f2b28]">Выбор приоритета</h3>
              </div>
              <button
                type="button"
                onClick={() => setPriorityOpen(false)}
                className="text-[13px] font-medium text-muted transition-colors hover:text-[#2f2b28]"
              >
                Закрыть
              </button>
            </div>

            <div className="space-y-2">
              {PRIORITIES.map((item) => {
                const active = item.value === priority
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setPriority(item.value)
                      setPriorityOpen(false)
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-[22px] border border-[#e7e1da] bg-white px-4 py-4 text-left shadow-[0_8px_18px_rgba(46,43,39,0.04)] transition-all hover:border-[#d8d1c9] active:scale-[0.99]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: item.bg }}>
                        <span className="h-3 w-3 rounded-full" style={{ background: item.dot }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-[#2f2b28]">{item.label}</span>
                        <span className="block text-[12px] leading-[1.4]" style={{ color: item.text }}>{item.hint}</span>
                      </span>
                    </span>

                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all"
                      style={{
                        borderColor: active ? '#01696f' : '#d8d3cc',
                        background: active ? '#01696f' : '#fff',
                        boxShadow: active ? '0 0 0 6px rgba(1,105,111,0.10)' : 'none',
                      }}
                    >
                      {active && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <style>{`
            @keyframes priorityDrawer {
              from { transform: translateY(28px) scale(0.985); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
