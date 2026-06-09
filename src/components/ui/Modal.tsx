import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'max-w-[360px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[600px]',
}

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes slide-up {
          from { transform: translateY(100%) }
          to   { transform: translateY(0) }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px) }
          to   { opacity: 1; transform: scale(1) translateY(0) }
        }

        .modal-overlay {
          animation: fade-in 0.2s ease forwards;
        }
        .modal-panel-mobile {
          animation: slide-up 0.36s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
        .modal-panel-desktop {
          animation: pop-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-close-btn:hover .modal-close-icon {
          transform: rotate(90deg);
        }
        .modal-close-icon {
          transition: transform 0.2s ease;
        }
      `}</style>

      {/* Root layer */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">

        {/* Overlay */}
        <div
          className="modal-overlay absolute inset-0 bg-black/40"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel — mobile sheet */}
        <div
          className={clsx(
            'relative z-10 w-full',
            'modal-panel-mobile sm:modal-panel-desktop',
            'sm:hidden',
            'rounded-t-3xl',
            'bg-white',
            'shadow-[0_-8px_48px_rgba(0,0,0,0.14)]',
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <ModalInner title={title} onClose={onClose}>
            {children}
          </ModalInner>
        </div>

        {/* Panel — desktop card */}
        <div
          ref={dialogRef}
          className={clsx(
            'relative z-10 w-full',
            'hidden sm:block',
            'modal-panel-desktop',
            'rounded-2xl',
            'bg-white',
            'shadow-[0_24px_80px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)]',
            sizes[size],
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <ModalInner title={title} onClose={onClose}>
            {children}
          </ModalInner>
        </div>
      </div>
    </>
  )
}

function ModalInner({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <>
      {/* Drag pill — mobile only */}
      <div className="sm:hidden flex justify-center pt-3 pb-0">
        <div className="h-[5px] w-9 rounded-full bg-gray-200" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <h2
          id="modal-title"
          className="text-lg font-semibold leading-snug tracking-tight text-gray-900"
        >
          {title}
        </h2>

        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="modal-close-btn -mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <X className="modal-close-icon h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-6" />

      {/* Body */}
      <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
        {children}
      </div>
    </>
  )
}