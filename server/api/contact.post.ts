import { z } from 'zod'
import { contactSchema, contactEmail } from '../../shared/contact'

const attempts = new Map<string, { count: number; expires: number }>()

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()
  for (const [key, value] of attempts) {
    if (value.expires <= now) attempts.delete(key)
  }
  const attempt = attempts.get(ip) || {
    count: 0,
    expires: now + 15 * 60 * 1000,
  }
  if (attempt.count >= 5) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Please try again later',
    })
  }
  attempt.count++
  attempts.set(ip, attempt)

  const parsed = contactSchema.safeParse(await readBody(event))
  if (!parsed.success || parsed.data.honeypot.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }
  const data = parsed.data
  const expectedAction = data.purpose
  const config = useRuntimeConfig(event)
  const expectedHostnames = new Set(
    config.turnstileHostnames
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  )
  const recipients = {
    booking: [config.contactBookingTo, config.contactBookingCc],
    join: [config.contactJoinTo, config.contactJoinCc],
    donate: [config.contactDonateTo, config.contactDonateCc],
  }
  const [to, configuredCc] = recipients[data.purpose]
  const cc = configuredCc?.trim() || ''
  if (
    !config.resendApiKey ||
    !config.resendFromEmail ||
    !config.turnstileSecretKey ||
    expectedHostnames.size === 0 ||
    (process.env.NODE_ENV === 'production' &&
      [...expectedHostnames].some((hostname) =>
        ['localhost', '127.0.0.1', '::1'].includes(hostname),
      )) ||
    !z.email().safeParse(to).success ||
    (cc !== '' && !z.email().safeParse(cc).success)
  ) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Form is not configured',
    })
  }

  let verification: { success: boolean; action?: string; hostname?: string }
  try {
    verification = await $fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: config.turnstileSecretKey,
          response: data.turnstileToken,
        }).toString(),
        timeout: 10000,
        retry: 0,
      },
    )
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Verification unavailable',
    })
  }
  if (
    verification.success !== true ||
    verification.action !== expectedAction ||
    !verification.hostname ||
    !expectedHostnames.has(verification.hostname)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Verification failed' })
  }
  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: contactEmail(data, config.resendFromEmail, to!, cc!),
      timeout: 15000,
      retry: 0,
    })
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Email delivery failed',
    })
  }
  return { success: true }
})
