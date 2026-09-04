import { DateTime } from 'luxon'

const decodeBase64Url = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')

  const remainder = base64.length % 4
  const padded = remainder ? base64 + '='.repeat(4 - remainder) : base64

  const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

export const decodeJwt = <T = Record<string, unknown>>(token: string): T => {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Failed to decode JWT: expected 3 parts separated by dots')
  }

  const decodedPayload = decodeBase64Url(parts[1]!)

  return JSON.parse(decodedPayload)
}

export const isTokenExpired = (token: string, skewSeconds = 0): boolean => {
  if (!token) {
    return true
  }

  const exp = decodeJwt<{ exp: number }>(token).exp!

  return DateTime.fromSeconds(exp) <= DateTime.now().plus({ seconds: skewSeconds })
}
