import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const image = z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string(),
})
const link = z.object({ label: z.string(), to: z.string() })
// Nuxt Content maps integer schemas to TEXT; use number for numeric SQL sorting.
const sortOrder = z.number().nonnegative().default(0)
export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        eyebrow: z.string(),
        headline: z.array(z.string()),
        intro: z.string(),
        hero: image,
        imageLabel: z.string(),
        primary: link,
        secondary: link,
        strip: z.array(z.string()),
        about: z.object({ title: z.string(), text: z.string(), image, link }),
        concert: z.object({
          eyebrow: z.string(),
          title: z.string(),
          text: z.string(),
          image,
          link,
        }),
        join: z.object({ title: z.string(), text: z.string(), link }),
      }),
    }),
    information: defineCollection({
      type: 'page',
      source: { include: 'information/*.md', prefix: '/' },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        eyebrow: z.string(),
        image,
        action: link.optional(),
        layout: z
          .enum([
            'story',
            'join',
            'booking',
            'support',
            'media',
            'agenda',
            'faq',
          ])
          .default('story'),
      }),
    }),
    events: defineCollection({
      type: 'page',
      source: { include: 'events/*.md', prefix: '/agenda' },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        endDate: z.string().optional(),
        time: z.string(),
        location: z.string(),
        city: z.string(),
        access: z.enum(['public', 'private']),
        ticketStatus: z.string(),
        ticketUrl: z.string().optional(),
        image,
      }),
    }),
    photos: defineCollection({
      type: 'data',
      source: 'photos/*.yml',
      schema: z.object({
        title: z.string().min(1),
        order: sortOrder,
        image,
        category: z
          .string()
          .min(1)
          .describe('Key from Photo Categories, e.g. concerten'),
        credit: z.string().optional(),
      }),
    }),
    photo_categories: defineCollection({
      type: 'data',
      source: 'photo-categories/*.yml',
      schema: z.object({
        title: z.string().min(1),
        key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        order: sortOrder,
      }),
    }),
    videos: defineCollection({
      type: 'data',
      source: 'videos/*.yml',
      schema: z.object({
        title: z.string().min(1),
        order: sortOrder,
        youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
        image,
      }),
    }),
    faq: defineCollection({
      type: 'data',
      source: 'faq/*.yml',
      schema: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        order: sortOrder,
        showOnBooking: z.boolean().default(false),
      }),
    }),
    site: defineCollection({
      type: 'data',
      source: 'settings/site.yml',
      schema: z.object({
        name: z.string(),
        tagline: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneLink: z.string(),
        contactName: z.string(),
        nav: z.array(link),
        socials: z.array(link),
        footerTitle: z.string(),
        footerText: z.string(),
        rehearsal: z.object({
          day: z.string(),
          time: z.string(),
          venue: z.string(),
          address: z.string(),
          cost: z.string(),
          trial: z.string(),
          waitingList: z.string(),
        }),
        support: z.object({
          iban: z.string(),
          account: z.string(),
          minimum: z.string(),
          clubCode: z.string(),
          lotteryPhone: z.string(),
          sponsorUrl: z.string(),
        }),
      }),
    }),
  },
})
