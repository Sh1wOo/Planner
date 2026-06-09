import { clsx } from 'clsx'
import type { Priority } from '../../types'

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'Высокий', className: 'bg-red-50 text-red-700 border border-red-200' },
  medium: { label: 'Средний', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  low: { label: 'Низкий', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority]
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.className)}>
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full',
        priority === 'high' && 'bg-red-500',
        priority === 'medium' && 'bg-amber-500',
        priority === 'low' && 'bg-emerald-500',
      )} />
      {config.label}
    </span>
  )
}
