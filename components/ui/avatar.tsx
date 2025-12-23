/**
 * Avatar Component
 *
 * User profile picture with fallback to initials
 *
 * Sizes: xs, sm, md (default), lg, xl
 *
 * Features:
 * - Image with fallback to initials
 * - Placeholder for missing images
 * - Online status indicator (future)
 * - Accessible alt text
 */

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { HTMLAttributes, forwardRef, useState } from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | null
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = 'Avatar',
      fallback,
      size = 'md',
      status = null,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false)

    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    }

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    }

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-neutral-400',
      away: 'bg-yellow-500',
    }

    const showImage = src && !imageError
    const showFallback = !showImage && fallback

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'rounded-full overflow-hidden flex items-center justify-center',
            sizes[size],
            !showImage && 'bg-brand-blue1 text-white font-semibold'
          )}
        >
          {showImage ? (
            <Image
              src={src!}
              alt={alt}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : showFallback ? (
            <span>{fallback}</span>
          ) : (
            <svg
              className="h-full w-full text-neutral-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              statusSizes[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
