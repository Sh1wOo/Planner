import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, className, children, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#28251d]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#28251d]',
            'transition-all duration-150 cursor-pointer appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-[#01696f]/30 focus:border-[#01696f]',
            error ? 'border-[#a12c7b]' : 'border-[#d4d1ca] hover:border-[#7a7974]',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[#a12c7b]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
