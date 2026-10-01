import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const image = z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string(),
})
const link = z.object({ label: z.string(), to: z.string() })
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
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/*.md', prefix: '/' },
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
      source: 'media/photos.yml',
      schema: z.object({
        photos: z.array(
          z.object({
            image,
            caption: z.string(),
            category: z.enum(['Concerten', 'Samen', 'Achter de schermen']),
            credit: z.string().optional(),
          }),
        ),
      }),
    }),
    videos: defineCollection({
      type: 'data',
      source: 'media/videos.yml',
      schema: z.object({
        videos: z.array(
          z.object({ title: z.string(), youtubeId: z.string(), image }),
        ),
      }),
    }),
    faq: defineCollection({
      type: 'data',
      source: 'faq.yml',
      schema: z.object({
        items: z.array(z.object({ label: z.string(), content: z.string() })),
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
