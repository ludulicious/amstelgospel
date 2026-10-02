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
      source: '1.home/1.home.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        visibility: z.object({
          concert: z.boolean().default(true),
          hero: z.boolean().default(true),
          strip: z.boolean().default(true),
          about: z.boolean().default(true),
          agenda: z.boolean().default(true),
          join: z.boolean().default(true),
        }),
        eyebrow: z.string(),
        headline: z.array(z.string()),
        intro: z.string(),
        hero: image,
        imageLabel: z.string(),
        primary: link,
        secondary: link,
        strip: z.array(z.string()),
        about: z.object({ title: z.string(), text: z.string(), image, link }),
        join: z.object({ title: z.string(), text: z.string(), link }),
      }),
    }),
    menu: defineCollection({
      type: 'page',
      source: '1.home/2.menu.md',
      schema: z.object({
        title: z.string(),
        action: link.extend({
          icon: z.string().min(1),
          visible: z.boolean().default(true),
          placements: z
            .array(z.enum(['desktop', 'mobile', 'footer']))
            .default(['desktop', 'mobile']),
          external: z.boolean().default(false),
        }),
        items: z.array(
          link.extend({
            icon: z.string().min(1),
            visible: z.boolean().default(true),
            placements: z
              .array(z.enum(['desktop', 'mobile', 'footer']))
              .default(['desktop', 'mobile']),
            external: z.boolean().default(false),
          }),
        ),
      }),
    }),
    home_concert: defineCollection({
      type: 'page',
      source: '1.home/3.concert.md',
      schema: z.object({
        title: z.string().min(1),
        description: z.string(),
        eyebrow: z.string(),
        image,
        imageLabel: z.string(),
        link,
      }),
    }),
    information: defineCollection({
      type: 'page',
      source: {
        include: '2.information/*.md',
        prefix: '/',
      },
      schema: z.object({
        title: z.string(),
        tagline: z.string().optional(),
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
      source: { include: '3.events/*.md', prefix: '/agenda' },
      schema: z.object({
        title: z.string(),
        tagline: z.string().optional(),
        description: z.string(),
        schedule: z
          .array(
            z.object({
              date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
              time: z.string().trim().min(1),
            }),
          )
          .min(1)
          .default([{ date: '', time: '' }]),
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
      source: { include: '4.photos/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1),
        visible: z.boolean().default(true),
        order: sortOrder,
        image,
        categories: z.array(z.string().trim().min(1)).default([]),
        credit: z.string().optional(),
      }),
    }),
    videos: defineCollection({
      type: 'data',
      source: { include: '5.videos/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1),
        order: sortOrder,
        visible: z.boolean().default(true),
        categories: z.array(z.string().trim().min(1)).default([]),
        youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
        image,
      }),
    }),
    faq: defineCollection({
      type: 'data',
      source: { include: '6.faq/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        order: sortOrder,
        showOnBooking: z.boolean().default(false),
      }),
    }),
    site: defineCollection({
      type: 'data',
      source: '7.settings/site.yml',
      schema: z.object({
        name: z.string(),
        tagline: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneLink: z.string(),
        contactName: z.string(),
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
