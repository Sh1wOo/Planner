import { forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-[#88726f] text-white hover:bg-[#6b5956] active:bg-[#0f3638] shadow-sm',
  secondary: 'bg-white text-[#28251d] border border-[#d4d1ca] hover:bg-[#f3f0ec] active:bg-[#edeae5]',
  ghost: 'text-[#28251d] hover:bg-[#f3f0ec] active:bg-[#edeae5]',
  danger: 'bg-[#a12c7b]/10 text-[#a12c7b] hover:bg-[#a12c7b]/20 border border-[#a12c7b]/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-[#6b5956] focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
