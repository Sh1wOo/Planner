import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#28251d]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#28251d]',
            'placeholder:text-[#bab9b4] transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#01696f]/30 focus:border-[#01696f]',
            error
              ? 'border-[#a12c7b] focus:ring-[#a12c7b]/20'
              : 'border-[#d4d1ca] hover:border-[#7a7974]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#a12c7b]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7a7974]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
