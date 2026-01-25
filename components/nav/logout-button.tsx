/**
 * Logout Button Component
 * 
 * Client component for logout action
 */

'use client';

import { logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const result = await logout();
      // If logout returns an error (doesn't redirect), handle it
      if (result?.error) {
        console.error('Logout error:', result.error);
        setIsLoading(false);
        // Still redirect to home on error
        router.push('/');
        router.refresh();
      }
      // If no error, redirect() was called server-side, so just refresh client
      router.refresh();
    } catch {
      // redirect() throws, so this is expected - just refresh
      router.push('/');
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-neutral-100 text-neutral-900 px-5 py-2 rounded-full font-semibold hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
