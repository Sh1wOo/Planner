import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

type ToastType = 'success' | 'error'
interface Toast { id: number; type: ToastType; message: string }

interface ToastCtx {
  success: (msg: string) => void
  error: (msg: string) => void
}

const Ctx = createContext<ToastCtx>({ success: () => {}, error: () => {} })

export function useToast() { return useContext(Ctx) }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  let nextId = 0

  const add = useCallback((type: ToastType, message: string) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <Ctx.Provider value={{ success: (m) => add('success', m), error: (m) => add('error', m) }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto',
              'border text-sm font-medium min-w-[280px] max-w-sm',
              'animate-in slide-in-from-right-4 fade-in duration-300',
              t.type === 'success'
                ? 'bg-white border-emerald-200 text-emerald-800'
                : 'bg-white border-red-200 text-red-800'
            )}
          >
            {t.type === 'success'
              ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="p-0.5 hover:opacity-60 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
