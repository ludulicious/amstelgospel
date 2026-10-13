import { z } from 'zod'

export const contactSchema = z.object({
  purpose: z.enum(['booking', 'join', 'donate']),
  name: z.string().trim().min(2).max(200),
  email: z.email().max(254),
  phone: z.string().trim().max(100),
  subject: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[^\r\n]+$/),
  message: z.string().trim().min(10).max(10000),
  consent: z.literal(true),
  honeypot: z.string().max(1000).default(''),
  turnstileToken: z.string().min(1).max(2048),
})

export const contactLabels = {
  booking: 'Boeking',
  join: 'Meezingen',
  donate: 'Donateur',
}

export function contactEmail(
  data: z.output<typeof contactSchema>,
  from: string,
  to: string,
  cc = '',
) {
  return {
    from,
    to: [to],
    ...(cc.trim() ? { cc: [cc.trim()] } : {}),
    reply_to: data.email,
    subject: `[${contactLabels[data.purpose]}] ${data.subject}`,
    text: [
      `Formulier: ${contactLabels[data.purpose]}`,
      `Naam: ${data.name}`,
      `E-mail: ${data.email}`,
      `Telefoon: ${data.phone || 'Niet opgegeven'}`,
      `Onderwerp: ${data.subject}`,
      'Toestemming om deze aanvraag te beantwoorden: ja',
      '',
      data.message,
    ].join('\n'),
  }
}
