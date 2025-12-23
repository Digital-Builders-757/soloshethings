/**
 * Button Component
 *
 * Foundational UI component with multiple variants, sizes, and states
 *
 * Variants:
 * - primary: Brand blue background, white text (default)
 * - secondary: Neutral background, dark text
 * - outline: Transparent with border
 * - ghost: Transparent, no border
 * - danger: Orange/red for destructive actions
 *
 * Sizes: sm, md (default), lg
 *
 * States: default, hover, focus, active, disabled, loading
 */

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-normal ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-brand-blue1 text-white hover:bg-brand-blue2 active:bg-brand-blue2 btn-glow active:scale-[0.98]',
      secondary:
        'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200/60 active:scale-[0.98]',
      outline:
        'border-2 border-brand-blue1/60 text-brand-blue1 hover:bg-brand-blue1/10 hover:border-brand-blue1 active:bg-brand-blue1/20 active:scale-[0.98]',
      ghost:
        'text-brand-blue1 hover:bg-brand-blue1/8 active:bg-brand-blue1/15 active:scale-[0.98]',
      danger:
        'bg-brand-orange text-white hover:bg-orange-600 active:bg-orange-700 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className={cn(
              'animate-spin',
              size === 'sm' && 'h-4 w-4',
              size === 'md' && 'h-5 w-5',
              size === 'lg' && 'h-6 w-6',
              children && (iconPosition === 'left' ? 'mr-2' : 'ml-2')
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(children && 'mr-2')}>{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(children && 'ml-2')}>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
