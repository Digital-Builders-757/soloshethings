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
export function generateUsername(email: string): string {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  const random = Math.floor(Math.random() * 10000)
  return `${base}${random}`
}

