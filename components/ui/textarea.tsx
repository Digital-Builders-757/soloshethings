/**
 * Textarea Component
 *
 * Multi-line text input with character count and auto-resize
 *
 * Features:
 * - Character count display
 * - Max length enforcement
 * - Error states
 * - Helper text
 * - Required field indicator
 */

import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef, useId } from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCharCount = true,
      required,
      disabled,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID if not provided
    const generatedId = useId()
    const textareaId = id || `textarea-${generatedId}`

    // Calculate character count
    const currentLength =
      typeof value === 'string' ? value.length : value?.toString().length || 0

    const baseStyles =
      'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100 resize-y'

    const variants = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-neutral-300 focus:border-brand-blue1 focus:ring-brand-blue1'

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-900 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(baseStyles, variants, className)}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
            {!error && helperText && (
              <p
                id={`${textareaId}-helper`}
                className="text-sm text-neutral-600"
              >
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p
              className={cn(
                'text-sm',
                currentLength > maxLength * 0.9
                  ? 'text-red-600'
                  : 'text-neutral-500'
              )}
            >
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
