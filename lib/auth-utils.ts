/**
 * Authentication Utility Functions
 * 
 * Pure utility functions for auth-related operations
 * These are NOT Server Actions (no 'use server' directive)
 */

/**
 * Generate a username from email
 *
 * Takes the part before @ and sanitizes it
 * Adds random numbers if needed to ensure uniqueness
 *
 * @param email - User's email address
 * @returns Generated username
 */
export const USERNAME_PATTERN = /^[a-z0-9_]+$/

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username)
}

export function generateUsername(email: string): string {
  const base =
    normalizeUsername(email.split('@')[0] ?? '')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20) || 'traveler'

  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `${base}_${random}`
}

