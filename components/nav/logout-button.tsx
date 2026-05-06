/**
 * Logout Button Component
 */

'use client'

import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LogoutButtonProps = {
  className?: string
  label?: string
  variant?: 'default' | 'primary'
}

export function LogoutButton({
  className,
  label = 'Sign out',
  variant = 'default',
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      const result = await logout()
      if ('error' in result) {
        console.error('Logout error:', result.error)
        router.push('/login')
        router.refresh()
        return
      }
      router.push('/login?signedOut=1')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        'rounded-full px-5 py-2 font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'min-h-11 bg-[#e34b16] text-white shadow-[0_10px_24px_rgba(227,75,22,0.35)] hover:bg-[#c74010]'
          : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        className
      )}
    >
      {isLoading ? 'Signing out...' : label}
    </button>
  )
}
