/**
 * Badge Component
 *
 * Small status indicators and labels
 *
 * Variants:
 * - primary: Brand blue
 * - secondary: Neutral gray
 * - success: Green
 * - warning: Yellow
 * - danger: Red/Orange
 * - neutral: Gray
 *
 * Sizes: sm, md (default), lg
 *
 * Features:
 * - Removable with close button
 * - Custom icon support
 */

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center font-medium rounded-full whitespace-nowrap'

    const variants = {
      primary: 'bg-brand-blue1 text-white',
      secondary: 'bg-neutral-200 text-neutral-900',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-brand-yellow1 text-black',
      danger: 'bg-red-100 text-red-800',
      neutral: 'bg-neutral-100 text-neutral-700',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20"
            aria-label="Remove"
          >
            <svg
              className={cn(
                size === 'sm' && 'h-3 w-3',
                size === 'md' && 'h-4 w-4',
                size === 'lg' && 'h-5 w-5'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
