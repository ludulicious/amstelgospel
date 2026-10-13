import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const image = z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string(),
})
const link = z.object({ label: z.string(), to: z.string() })
const studioBlocks = z
  .object({
    blocks: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z.enum(['markdown', 'fields']),
        component: z.string().optional(),
        slot: z.string().optional(),
        field: z.string().optional(),
      }),
    ),
  })
  .optional()
  .editor({ hidden: true })

// Nuxt Content maps integer schemas to TEXT; use number for numeric SQL sorting.
const sortOrder = z.number().nonnegative().default(0)
export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: '1.home/1.home.md',
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
        concert: z.object({
          title: z.string().min(1),
          description: z.string(),
          eyebrow: z.string(),
          image,
          link,
        }),
        studio: studioBlocks,
        hero: image.extend({
          eyebrow: z.string(),
          headline: z.array(z.string()),
          intro: z.string(),
          primary: link,
          secondary: link,
        }),
        motion: z.object({ play: z.string(), pause: z.string() }),
        agenda: z.object({
          title: z.string(),
          link,
          publicLabel: z.string(),
          privateLabel: z.string(),
          emptyText: z.string(),
        }),
        strip: z.object({ label: z.string(), items: z.array(z.string()) }),
        about: z.object({
          eyebrow: z.string(),
          title: z.string(),
          text: z.string(),
          image,
          link,
        }),
        join: z.object({
          title: z.string(),
          text: z.string(),
          link,
          words: z.array(z.string()),
        }),
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
        studio: studioBlocks,
        information: z
          .object({
            eyebrow: z.string(),
            title: z.string(),
            when: z.object({
              label: z.string(),
              day: z.string(),
              time: z.string(),
            }),
            where: z.object({
              label: z.string(),
              venue: z.string(),
              address: z.string(),
            }),
            membership: z.object({
              label: z.string(),
              cost: z.string(),
              trial: z.string(),
            }),
            notice: z.string(),
          })
          .optional(),
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
              date: z
                .string()
                .date()
                .describe('Event date in YYYY-MM-DD format'),
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
        image: image.optional(),
        video: z
          .object({
            src: z.string().editor({ input: 'media' }),
          })
          .optional(),
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
        thumbnail: image.optional(),
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
        category: z
          .enum(['Inhuren', 'Meezingen', 'Optredens', 'Algemeen'])
          .default('Algemeen'),
        visible: z.boolean().default(true),
      }),
    }),
    site: defineCollection({
      type: 'page',
      source: '7.settings/site.md',
      schema: z.object({
        name: z.string(),
        tagline: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneLink: z.string(),
        contactName: z.string(),
        footerTitle: z.string(),
        footerText: z.string(),
        copy: z.object({
          bookingEyebrow: z.string(),
          bookingTitle: z.string(),
          faqLink: z.string(),
          upcomingFilter: z.string(),
          pastFilter: z.string(),
          bookingFaqTitle: z.string(),
          allFaqLink: z.string(),
          joinFaqTitle: z.string(),
          faqAllLabel: z.string(),
          faqFilterLabel: z.string(),
          faqEmptyText: z.string(),
          eventBackLink: z.string(),
          eventPracticalTitle: z.string(),
          eventWhenLabel: z.string(),
          eventWhereLabel: z.string(),
          ticketLink: z.string(),
          questionLink: z.string(),
          eventPrivateLabel: z.string(),
          eventPublicLabel: z.string(),
          formTitle: z.string(),
          formIntro: z.string(),
          privacyLink: z.string(),
          formSubmit: z.string(),
          formSuccess: z.string(),
          formSendError: z.string(),
          formVerificationError: z.string(),
          draftTitle: z.string(),
          draftIntro: z.string(),
          draftSentenceEnd: z.string(),
          draftOpenLink: z.string(),
          clipboardError: z.string(),
          draftPreview: z.string(),
          nameLabel: z.string(),
          emailLabel: z.string(),
          phoneLabel: z.string(),
          subjectLabel: z.string(),
          messageLabel: z.string(),
          consentLabel: z.string(),
          nameError: z.string(),
          emailError: z.string(),
          subjectError: z.string(),
          messageError: z.string(),
          consentError: z.string(),
          bookingSubject: z.string(),
          joinSubject: z.string(),
          donationSubject: z.string(),
          otherSubject: z.string(),
          bookingMessageHint: z.string(),
          joinMessageHint: z.string(),
          copiedLabel: z.string(),
          copyLabel: z.string(),
          photosTitle: z.string(),
          photosFilterLabel: z.string(),
          previousPhotoLabel: z.string(),
          nextPhotoLabel: z.string(),
          photosAllLabel: z.string(),
          videosTitle: z.string(),
          videosSubtitle: z.string(),
          youtubeNotice: z.string(),
          videosFilterLabel: z.string(),
          videosAllLabel: z.string(),
          homeLinkLabel: z.string(),
          desktopNavLabel: z.string(),
          mobileNavLabel: z.string(),
          closeMenuLabel: z.string(),
          openMenuLabel: z.string(),
          footerEyebrow: z.string(),
          footerHomeLabel: z.string(),
          footerNavLabel: z.string(),
          pastEmptyText: z.string(),
          upcomingEmptyText: z.string(),
          privateEventLabel: z.string(),
          publicEventLabel: z.string(),
          photoCount: z.string(),
          enlargePhotoLabel: z.string(),
          playVideoLabel: z.string(),
          copyrightText: z.string(),
          emailTemplate: z.string(),
          phoneNotProvided: z.string(),
          questionSubject: z.string(),
        }),
      }),
    }),
  },
})
