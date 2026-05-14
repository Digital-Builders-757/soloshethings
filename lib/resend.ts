import 'server-only'

import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey)
  }

  return resendClient
}

export function getResendFromEmail(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!fromEmail) {
    throw new Error('RESEND_FROM_EMAIL is not set')
  }

  return fromEmail
}
