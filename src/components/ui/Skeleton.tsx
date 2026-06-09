import { clsx } from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(
      'animate-pulse bg-gradient-to-r from-[#f3f0ec] via-[#e6e4df] to-[#f3f0ec]',
      'bg-[length:200%_100%] rounded-lg',
      className
    )} />
  )
}

export function TaskSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e2e0db] space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
