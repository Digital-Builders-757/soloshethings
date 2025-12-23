/**
 * Input Component
 *
 * Form input field with label, error states, and helper text
 *
 * Types: text, email, password, number, url, tel, search
 * States: default, error, success, disabled
 *
 * Features:
 * - Automatic label association
 * - Error message display
 * - Helper text support
 * - Required field indicator
 * - Icon support (future)
 */

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'error' | 'success'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = 'default',
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID if not provided (for label association)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    // Determine variant based on error prop
    const effectiveVariant = error ? 'error' : variant

    const baseStyles =
      'w-full px-4 py-3 rounded-xl border transition-all duration-normal ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 bg-white/80 backdrop-blur-sm'

    const variants = {
      default:
        'hairline-border border-neutral-300/60 focus:border-brand-blue1/60 focus:ring-brand-blue1/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(var(--brand-blue-1)/0.1)]',
      error:
        'border-red-400/60 focus:border-red-500 focus:ring-red-500/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
      success:
        'border-green-400/60 focus:border-green-500 focus:ring-green-500/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-900 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseStyles, variants[effectiveVariant], className)}
          required={required}
          disabled={disabled}
          aria-invalid={effectiveVariant === 'error'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
